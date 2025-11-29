import { Request, Response } from 'express';
import { query, getClient } from '../config/database';
import { Menu, MenuIngredient } from '../types';

export const getMenus = async (req: Request, res: Response) => {
  try {
    const { category, available } = req.query;
    
    let whereConditions: string[] = [];
    let queryParams: any[] = [];
    let paramCount = 0;

    if (category && category !== 'All') {
      paramCount++;
      whereConditions.push(`m.category = $${paramCount}`);
      queryParams.push(category);
    }
    
    if (available !== undefined) {
      paramCount++;
      whereConditions.push(`m.available = $${paramCount}`);
      queryParams.push(available === 'true');
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
       ORDER BY m.id`,
      queryParams
    );

    const menus: Menu[] = result.rows.map(row => ({
      id: row.id,
      name: row.name,
      description: row.description || '',
      price: parseFloat(row.price),
      category: row.category,
      available: row.available,
      ingredients: row.ingredients || []
    }));

    res.json({
      success: true,
      data: menus,
      count: menus.length
    });
  } catch (error) {
    console.error('Error fetching menus:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch menus'
    });
  }
};

export const createMenu = async (req: Request, res: Response) => {
  const client = await getClient();
  
  try {
    const { name, description, price, category, ingredients } = req.body;
    
    if (!name || !price || !category || !ingredients || !Array.isArray(ingredients)) {
      return res.status(400).json({
        success: false,
        error: 'Name, price, category, and ingredients are required'
      });
    }

    await client.query('BEGIN');

    // Insert the menu
    const menuResult = await client.query(
      `INSERT INTO menus (name, description, price, category) 
       VALUES ($1, $2, $3, $4) 
       RETURNING *`,
      [name, description, price, category]
    );

    const menuId = menuResult.rows[0].id;

    // Insert ingredients
    for (const ingredient of ingredients) {
      await client.query(
        `INSERT INTO menu_ingredients (menu_id, material_id, amount, unit) 
         VALUES ($1, $2, $3, $4)`,
        [menuId, ingredient.materialId, ingredient.amount, ingredient.unit]
      );
    }

    // Get the complete menu with ingredients
    const completeMenuResult = await client.query(
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
       WHERE m.id = $1
       GROUP BY m.id`,
      [menuId]
    );

    await client.query('COMMIT');

    const row = completeMenuResult.rows[0];
    const newMenu: Menu = {
      id: row.id,
      name: row.name,
      description: row.description || '',
      price: parseFloat(row.price),
      category: row.category,
      available: row.available,
      ingredients: row.ingredients || []
    };

    res.status(201).json({
      success: true,
      data: newMenu,
      message: 'Menu created successfully'
    });
  } catch (error: any) {
    await client.query('ROLLBACK');
    console.error('Error creating menu:', error);
    
    if (error.code === '23505') { // Unique constraint violation
      return res.status(400).json({
        success: false,
        error: 'Menu with this name already exists'
      });
    }
    
    if (error.code === '23503') { // Foreign key violation
      return res.status(400).json({
        success: false,
        error: 'One or more material IDs are invalid'
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Failed to create menu'
    });
  } finally {
    client.release();
  }
};

export const updateMenu = async (req: Request, res: Response) => {
  const client = await getClient();
  
  try {
    const { id } = req.params;
    const { name, description, price, category, available, ingredients } = req.body;
    
    await client.query('BEGIN');

    // Check if menu exists
    const menuCheck = await client.query('SELECT id FROM menus WHERE id = $1', [id]);
    if (menuCheck.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({
        success: false,
        error: 'Menu not found'
      });
    }

    // Update menu basic info
    const updateFields: string[] = [];
    const updateValues: any[] = [];
    let paramCount = 1;

    if (name !== undefined) {
      updateFields.push(`name = $${paramCount}`);
      updateValues.push(name);
      paramCount++;
    }
    
    if (description !== undefined) {
      updateFields.push(`description = $${paramCount}`);
      updateValues.push(description);
      paramCount++;
    }
    
    if (price !== undefined) {
      updateFields.push(`price = $${paramCount}`);
      updateValues.push(price);
      paramCount++;
    }
    
    if (category !== undefined) {
      updateFields.push(`category = $${paramCount}`);
      updateValues.push(category);
      paramCount++;
    }
    
    if (available !== undefined) {
      updateFields.push(`available = $${paramCount}`);
      updateValues.push(available);
      paramCount++;
    }

    if (updateFields.length > 0) {
      updateValues.push(id);
      const updateQuery = `
        UPDATE menus 
        SET ${updateFields.join(', ')}, updated_at = CURRENT_TIMESTAMP 
        WHERE id = $${paramCount} 
        RETURNING *
      `;
      await client.query(updateQuery, updateValues);
    }

    // Update ingredients if provided
    if (ingredients && Array.isArray(ingredients)) {
      // Delete existing ingredients
      await client.query('DELETE FROM menu_ingredients WHERE menu_id = $1', [id]);
      
      // Insert new ingredients
      for (const ingredient of ingredients) {
        await client.query(
          `INSERT INTO menu_ingredients (menu_id, material_id, amount, unit) 
           VALUES ($1, $2, $3, $4)`,
          [id, ingredient.materialId, ingredient.amount, ingredient.unit]
        );
      }
    }

    // Get the updated menu with ingredients
    const completeMenuResult = await client.query(
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
       WHERE m.id = $1
       GROUP BY m.id`,
      [id]
    );

    await client.query('COMMIT');

    const row = completeMenuResult.rows[0];
    const updatedMenu: Menu = {
      id: row.id,
      name: row.name,
      description: row.description || '',
      price: parseFloat(row.price),
      category: row.category,
      available: row.available,
      ingredients: row.ingredients || []
    };

    res.json({
      success: true,
      data: updatedMenu,
      message: 'Menu updated successfully'
    });
  } catch (error: any) {
    await client.query('ROLLBACK');
    console.error('Error updating menu:', error);
    
    if (error.code === '23505') {
      return res.status(400).json({
        success: false,
        error: 'Menu with this name already exists'
      });
    }
    
    if (error.code === '23503') {
      return res.status(400).json({
        success: false,
        error: 'One or more material IDs are invalid'
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Failed to update menu'
    });
  } finally {
    client.release();
  }
};

export const deleteMenu = async (req: Request, res: Response) => {
  const client = await getClient();
  
  try {
    const { id } = req.params;
    
    await client.query('BEGIN');

    // Check if menu exists
    const menuCheck = await client.query('SELECT id FROM menus WHERE id = $1', [id]);
    if (menuCheck.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({
        success: false,
        error: 'Menu not found'
      });
    }

    // Delete menu ingredients first (cascade should handle this, but being explicit)
    await client.query('DELETE FROM menu_ingredients WHERE menu_id = $1', [id]);
    
    // Delete the menu
    const result = await client.query('DELETE FROM menus WHERE id = $1 RETURNING id', [id]);
    
    await client.query('COMMIT');

    res.json({
      success: true,
      message: 'Menu deleted successfully'
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error deleting menu:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete menu'
    });
  } finally {
    client.release();
  }
};