import { Request, Response } from 'express';
import { getClient, query } from '../config/database';
import { RawMaterial, UpdateRawMaterialRequest, Stats } from '../types';

export const getMaterials = async (req: Request, res: Response) => {
  try {
    const { category, search, status, page = '1', limit = '10' } = req.query;
    
    let whereConditions: string[] = [];
    let queryParams: any[] = [];
    let paramCount = 0;

    if (category && category !== 'All') {
      paramCount++;
      whereConditions.push(`category = $${paramCount}`);
      queryParams.push(category);
    }
    
    if (status && status !== 'All') {
      paramCount++;
      whereConditions.push(`status = $${paramCount}`);
      queryParams.push(status);
    }
    
    if (search) {
      paramCount++;
      whereConditions.push(`(name ILIKE $${paramCount} OR sku ILIKE $${paramCount} OR supplier ILIKE $${paramCount})`);
      queryParams.push(`%${search}%`);
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';

    // Get total count for pagination
    const countQuery = `SELECT COUNT(*) FROM raw_materials ${whereClause}`;
    const countResult = await query(countQuery, queryParams);
    const totalCount = parseInt(countResult.rows[0].count);

    // Pagination
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const offset = (pageNum - 1) * limitNum;
    
    paramCount++;
    const paginatedQuery = `
      SELECT * FROM raw_materials 
      ${whereClause}
      ORDER BY id 
      LIMIT $${paramCount} 
      OFFSET $${paramCount + 1}
    `;
    
    const result = await query(paginatedQuery, [...queryParams, limitNum, offset]);
    
    const materials: RawMaterial[] = result.rows.map(row => ({
      id: row.id,
      name: row.name,
      sku: row.sku,
      stock: parseFloat(row.stock),
      minStock: parseFloat(row.min_stock),
      price: parseFloat(row.price),
      unit: row.unit,
      category: row.category,
      status: row.status,
      supplier: row.supplier,
      lastRestocked: row.last_restocked
    }));

    res.json({
      success: true,
      data: materials,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total: totalCount,
        pages: Math.ceil(totalCount / limitNum)
      }
    });
  } catch (error) {
    console.error('Error fetching materials:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch materials'
    });
  }
};

export const getMaterialById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await query('SELECT * FROM raw_materials WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Material not found'
      });
    }
    
    const row = result.rows[0];
    const material: RawMaterial = {
      id: row.id,
      name: row.name,
      sku: row.sku,
      stock: parseFloat(row.stock),
      minStock: parseFloat(row.min_stock),
      price: parseFloat(row.price),
      unit: row.unit,
      category: row.category,
      status: row.status,
      supplier: row.supplier,
      lastRestocked: row.last_restocked
    };

    res.json({
      success: true,
      data: material
    });
  } catch (error) {
    console.error('Error fetching material:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch material'
    });
  }
};

export const createMaterial = async (req: Request, res: Response) => {
  try {
    const { name, sku, price, minStock, unit, category, supplier } = req.body;
    
    const result = await query(
      `INSERT INTO raw_materials (name, sku, price, min_stock, unit, category, supplier) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) 
       RETURNING *`,
      [name, sku, price, minStock, unit, category, supplier]
    );

    const row = result.rows[0];
    const newMaterial: RawMaterial = {
      id: row.id,
      name: row.name,
      sku: row.sku,
      stock: parseFloat(row.stock),
      minStock: parseFloat(row.min_stock),
      price: parseFloat(row.price),
      unit: row.unit,
      category: row.category,
      status: row.status,
      supplier: row.supplier,
      lastRestocked: row.last_restocked
    };

    res.status(201).json({
      success: true,
      data: newMaterial,
      message: 'Material created successfully'
    });
  } catch (error: any) {
    console.error('Error creating material:', error);
    
    if (error.code === '23505') { // Unique violation
      return res.status(400).json({
        success: false,
        error: 'SKU already exists'
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Failed to create material'
    });
  }
};

export const updateMaterialStock = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { stock, operation = 'set' } = req.body;
    
    let updateQuery: string;
    let queryParams: any[];

    if (operation === 'add') {
      updateQuery = 'UPDATE raw_materials SET stock = stock + $1, last_restocked = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *';
      queryParams = [stock, id];
    } else if (operation === 'subtract') {
      updateQuery = 'UPDATE raw_materials SET stock = GREATEST(0, stock - $1) WHERE id = $2 RETURNING *';
      queryParams = [stock, id];
    } else {
      updateQuery = 'UPDATE raw_materials SET stock = $1, last_restocked = CASE WHEN $1 > stock THEN CURRENT_TIMESTAMP ELSE last_restocked END WHERE id = $2 RETURNING *';
      queryParams = [stock, id];
    }

    const result = await query(updateQuery, queryParams);
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Material not found'
      });
    }

    const row = result.rows[0];
    const updatedMaterial: RawMaterial = {
      id: row.id,
      name: row.name,
      sku: row.sku,
      stock: parseFloat(row.stock),
      minStock: parseFloat(row.min_stock),
      price: parseFloat(row.price),
      unit: row.unit,
      category: row.category,
      status: row.status,
      supplier: row.supplier,
      lastRestocked: row.last_restocked
    };

    res.json({
      success: true,
      data: updatedMaterial,
      message: 'Stock updated successfully'
    });
  } catch (error) {
    console.error('Error updating stock:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update stock'
    });
  }
};

export const updateMaterial = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updates: UpdateRawMaterialRequest = req.body;
    
    const fields: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    Object.entries(updates).forEach(([key, value]) => {
      if (value !== undefined) {
        // Convert camelCase to snake_case for database
        const dbKey = key.replace(/([A-Z])/g, '_$1').toLowerCase();
        fields.push(`${dbKey} = $${paramCount}`);
        values.push(value);
        paramCount++;
      }
    });

    if (fields.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'No fields to update'
      });
    }

    values.push(id);
    
    const queryText = `
      UPDATE raw_materials 
      SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP 
      WHERE id = $${paramCount} 
      RETURNING *
    `;

    const result = await query(queryText, values);
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Material not found'
      });
    }

    const row = result.rows[0];
    const updatedMaterial: RawMaterial = {
      id: row.id,
      name: row.name,
      sku: row.sku,
      stock: parseFloat(row.stock),
      minStock: parseFloat(row.min_stock),
      price: parseFloat(row.price),
      unit: row.unit,
      category: row.category,
      status: row.status,
      supplier: row.supplier,
      lastRestocked: row.last_restocked
    };

    res.json({
      success: true,
      data: updatedMaterial,
      message: 'Material updated successfully'
    });
  } catch (error: any) {
    console.error('Error updating material:', error);
    
    if (error.code === '23505') {
      return res.status(400).json({
        success: false,
        error: 'SKU already exists'
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Failed to update material'
    });
  }
};

export const deleteMaterial = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    // Check if material is used in any menu
    const menuCheck = await query(
      'SELECT 1 FROM menu_ingredients WHERE material_id = $1 LIMIT 1',
      [id]
    );
    
    if (menuCheck.rows.length > 0) {
      return res.status(400).json({
        success: false,
        error: 'Cannot delete material that is used in menu items'
      });
    }
    
    const result = await query('DELETE FROM raw_materials WHERE id = $1 RETURNING id', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Material not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Material deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting material:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete material'
    });
  }
};

export const getStats = async (req: Request, res: Response) => {
  try {
    const result = await query('SELECT * FROM material_stats');
    const stats = result.rows[0];
    
    const formattedStats: Stats = {
      totalItems: parseInt(stats.total_items),
      lowStock: parseInt(stats.low_stock),
      criticalStock: parseInt(stats.critical_stock),
      totalValue: parseFloat(stats.total_value)
    };
    
    res.json({
      success: true,
      data: formattedStats
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch stats'
    });
  }
};

export const getCategories = async (req: Request, res: Response) => {
  try {
    const result = await query('SELECT category FROM material_categories ORDER BY category');
    const categories = result.rows.map(row => row.category);
    
    res.json({
      success: true,
      data: categories
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch categories'
    });
  }
};

export const restockMaterials = async (req: Request, res: Response) => {
  try {
    const { materials } = req.body;
    
    if (!Array.isArray(materials)) {
      return res.status(400).json({
        success: false,
        error: 'Materials array is required'
      });
    }
    
    const client = await getClient();
    
    try {
      await client.query('BEGIN');
      
      const results = [];
      
      for (const item of materials) {
        const updateResult = await client.query(
          'UPDATE raw_materials SET stock = stock + $1, last_restocked = CURRENT_TIMESTAMP WHERE id = $2 RETURNING id, name, stock, status',
          [item.quantity, item.id]
        );
        
        if (updateResult.rows.length > 0) {
          const row = updateResult.rows[0];
          results.push({
            id: row.id,
            name: row.name,
            newStock: parseFloat(row.stock),
            status: row.status
          });
        }
      }
      
      await client.query('COMMIT');
      
      res.json({
        success: true,
        data: results,
        message: 'Materials restocked successfully'
      });
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error restocking materials:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to restock materials'
    });
  }
};