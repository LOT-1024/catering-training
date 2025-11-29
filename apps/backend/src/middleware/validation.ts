import { Request, Response, NextFunction } from 'express';

export const validateMaterial = (req: Request, res: Response, next: NextFunction) => {
  const { name, sku, price, minStock, unit, category } = req.body;
  
  // For POST requests, validate all required fields
  if (req.method === 'POST') {
    if (!name || !sku || price === undefined || minStock === undefined || !unit || !category) {
      return res.status(400).json({
        success: false,
        error: 'Name, SKU, price, minStock, unit, and category are required'
      });
    }
  }
  
  // Validate data types and constraints for provided fields
  if (price !== undefined && (typeof price !== 'number' || price < 0)) {
    return res.status(400).json({
      success: false,
      error: 'Price must be a non-negative number'
    });
  }
  
  if (minStock !== undefined && (typeof minStock !== 'number' || minStock < 0)) {
    return res.status(400).json({
      success: false,
      error: 'Min stock must be a non-negative number'
    });
  }
  
  if (req.body.stock !== undefined && (typeof req.body.stock !== 'number' || req.body.stock < 0)) {
    return res.status(400).json({
      success: false,
      error: 'Stock must be a non-negative number'
    });
  }
  
  next();
};