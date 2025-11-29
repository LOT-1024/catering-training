import { Request, Response } from 'express';
import { query, getClient } from '../config/database';
import { CartItem, Transaction, Menu } from '../types';

export const getProducts = async (req: Request, res: Response) => {
  try {
    const { category, search } = req.query;
    
    let whereConditions: string[] = [];
    let queryParams: any[] = [];
    let paramCount = 0;

    if (category && category !== 'All') {
      paramCount++;
      whereConditions.push(`m.category = $${paramCount}`);
      queryParams.push(category);
    }
    
    if (search) {
      paramCount++;
      whereConditions.push(`(m.name ILIKE $${paramCount} OR m.description ILIKE $${paramCount})`);
      queryParams.push(`%${search}%`);
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';

    const result = await query(
      `SELECT 
         m.*,
         COALESCE(
           json_agg(
             json_build_object(
               'materialId', mi.material_id,
               'amount', mi.amount,
               'unit', mi.unit
             )
           ) FILTER (WHERE mi.material_id IS NOT NULL),
           '[]'
         ) as ingredients
       FROM menus m
       LEFT JOIN menu_ingredients mi ON m.id = mi.menu_id
       ${whereClause}
       GROUP BY m.id
       ORDER BY m.name`,
      queryParams
    );

    const products = result.rows.map(row => ({
      id: row.id.toString(),
      name: row.name,
      price: parseFloat(row.price),
      category: row.category,
      description: row.description || '',
      available: row.available,
      ingredients: row.ingredients || []
    }));

    res.json({
      success: true,
      data: products,
      count: products.length
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch products'
    });
  }
};

export const createTransaction = async (req: Request, res: Response) => {
  const client = await getClient();
  
  try {
    const { items, paymentMethod } = req.body;
    
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Items are required and cannot be empty'
      });
    }
    
    if (!['cash', 'card', 'digital'].includes(paymentMethod)) {
      return res.status(400).json({
        success: false,
        error: 'Valid payment method is required (cash, card, or digital)'
      });
    }

    await client.query('BEGIN');

    // Calculate totals
    const subtotal = items.reduce((sum: number, item: CartItem) => 
      sum + (item.price * item.quantity), 0
    );
    const tax = subtotal * 0.08; // 8% tax
    const total = subtotal + tax;

    // Create transaction
    const transactionResult = await client.query(
      `INSERT INTO transactions (subtotal, tax, total, payment_method) 
       VALUES ($1, $2, $3, $4) 
       RETURNING *`,
      [subtotal, tax, total, paymentMethod]
    );

    const transactionId = transactionResult.rows[0].id;

    // Insert transaction items and update inventory
    for (const item of items) {
      // Insert transaction item
      await client.query(
        `INSERT INTO transaction_items (transaction_id, product_name, price, quantity) 
         VALUES ($1, $2, $3, $4)`,
        [transactionId, item.name, item.price, item.quantity]
      );

      // Get menu ingredients to update inventory
      const ingredientsResult = await client.query(
        `SELECT material_id, amount 
         FROM menu_ingredients 
         WHERE menu_id = $1`,
        [item.id]
      );

      // Update raw material stock
      for (const ingredient of ingredientsResult.rows) {
        const materialUsage = ingredient.amount * item.quantity;
        await client.query(
          `UPDATE raw_materials 
           SET stock = GREATEST(0, stock - $1) 
           WHERE id = $2`,
          [materialUsage, ingredient.material_id]
        );
      }
    }

    // Get complete transaction with items
    const completeTransactionResult = await client.query(
      `SELECT 
         t.*,
         COALESCE(
           json_agg(
             json_build_object(
               'id', ti.id,
               'name', ti.product_name,
               'price', ti.price,
               'quantity', ti.quantity
             )
           ) FILTER (WHERE ti.id IS NOT NULL),
           '[]'
         ) as items
       FROM transactions t
       LEFT JOIN transaction_items ti ON t.id = ti.transaction_id
       WHERE t.id = $1
       GROUP BY t.id`,
      [transactionId]
    );

    await client.query('COMMIT');

    const row = completeTransactionResult.rows[0];
    const transaction: Transaction = {
      id: row.id,
      items: row.items.map((item: any) => ({
        id: item.id.toString(),
        name: item.name,
        price: parseFloat(item.price),
        quantity: item.quantity
      })),
      subtotal: parseFloat(row.subtotal),
      tax: parseFloat(row.tax),
      total: parseFloat(row.total),
      paymentMethod: row.payment_method,
      timestamp: row.timestamp,
      status: row.status
    };

    res.status(201).json({
      success: true,
      data: transaction,
      message: 'Transaction completed successfully'
    });
  } catch (error: any) {
    await client.query('ROLLBACK');
    console.error('Error creating transaction:', error);
    
    if (error.code === '23503') { // Foreign key violation
      return res.status(400).json({
        success: false,
        error: 'One or more menu items are invalid'
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Failed to create transaction'
    });
  } finally {
    client.release();
  }
};

export const getTransactions = async (req: Request, res: Response) => {
  try {
    const { limit = '50', offset = '0', startDate, endDate } = req.query;
    
    const limitNum = parseInt(limit as string);
    const offsetNum = parseInt(offset as string);
    
    let whereConditions: string[] = [];
    let queryParams: any[] = [];
    let paramCount = 0;

    if (startDate) {
      paramCount++;
      whereConditions.push(`t.timestamp >= $${paramCount}`);
      queryParams.push(new Date(startDate as string));
    }
    
    if (endDate) {
      paramCount++;
      whereConditions.push(`t.timestamp <= $${paramCount}`);
      queryParams.push(new Date(endDate as string));
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';

    // Get total count
    const countResult = await query(
      `SELECT COUNT(*) FROM transactions t ${whereClause}`,
      queryParams
    );
    const totalCount = parseInt(countResult.rows[0].count);

    // Get paginated transactions
    paramCount++;
    const transactionsQuery = `
      SELECT 
        t.*,
        COALESCE(
          json_agg(
            json_build_object(
              'id', ti.id,
              'name', ti.product_name,
              'price', ti.price,
              'quantity', ti.quantity
            )
          ) FILTER (WHERE ti.id IS NOT NULL),
          '[]'
        ) as items
      FROM transactions t
      LEFT JOIN transaction_items ti ON t.id = ti.transaction_id
      ${whereClause}
      GROUP BY t.id
      ORDER BY t.timestamp DESC
      LIMIT $${paramCount} OFFSET $${paramCount + 1}
    `;

    const result = await query(transactionsQuery, [...queryParams, limitNum, offsetNum]);

    const transactions: Transaction[] = result.rows.map(row => ({
      id: row.id,
      items: row.items.map((item: any) => ({
        id: item.id.toString(),
        name: item.name,
        price: parseFloat(item.price),
        quantity: item.quantity
      })),
      subtotal: parseFloat(row.subtotal),
      tax: parseFloat(row.tax),
      total: parseFloat(row.total),
      paymentMethod: row.payment_method,
      timestamp: row.timestamp,
      status: row.status
    }));

    res.json({
      success: true,
      data: transactions,
      pagination: {
        total: totalCount,
        limit: limitNum,
        offset: offsetNum,
        hasMore: offsetNum + limitNum < totalCount
      }
    });
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch transactions'
    });
  }
};

export const getTransactionById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const result = await query(
      `SELECT 
         t.*,
         COALESCE(
           json_agg(
             json_build_object(
               'id', ti.id,
               'name', ti.product_name,
               'price', ti.price,
               'quantity', ti.quantity
             )
           ) FILTER (WHERE ti.id IS NOT NULL),
           '[]'
         ) as items
       FROM transactions t
       LEFT JOIN transaction_items ti ON t.id = ti.transaction_id
       WHERE t.id = $1
       GROUP BY t.id`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Transaction not found'
      });
    }

    const row = result.rows[0];
    const transaction: Transaction = {
      id: row.id,
      items: row.items.map((item: any) => ({
        id: item.id.toString(),
        name: item.name,
        price: parseFloat(item.price),
        quantity: item.quantity
      })),
      subtotal: parseFloat(row.subtotal),
      tax: parseFloat(row.tax),
      total: parseFloat(row.total),
      paymentMethod: row.payment_method,
      timestamp: row.timestamp,
      status: row.status
    };

    res.json({
      success: true,
      data: transaction
    });
  } catch (error) {
    console.error('Error fetching transaction:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch transaction'
    });
  }
};