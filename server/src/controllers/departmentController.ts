import { Request, Response } from 'express';
import { query } from '../database/db';
import { Department } from '../types';
import { asyncHandler, AppError } from '../middleware/errorHandler';

export const getAllDepartments = asyncHandler(async (req: Request, res: Response) => {
  const result = await query('SELECT * FROM departments ORDER BY name');
  
  res.status(200).json({
    status: 'success',
    data: result.rows
  });
});

export const getDepartmentById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  
  const result = await query('SELECT * FROM departments WHERE id = ?', [id]);
  
  if (result.rows.length === 0) {
    throw new AppError('Department not found', 404);
  }
  
  res.status(200).json({
    status: 'success',
    data: result.rows[0]
  });
});
