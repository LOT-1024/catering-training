import { Request, Response, NextFunction } from 'express';

// Simple API key authentication (for demonstration)
export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  // Skip authentication in development or if no API key is set
  if (process.env.NODE_ENV === 'development' && !process.env.API_KEY) {
    return next();
  }
  
  const apiKey = req.headers['x-api-key'];
  
  if (!apiKey) {
    return res.status(401).json({
      success: false,
      error: 'Unauthorized: API key required'
    });
  }
  
  if (apiKey !== process.env.API_KEY) {
    return res.status(401).json({
      success: false,
      error: 'Unauthorized: Invalid API key'
    });
  }
  
  next();
};