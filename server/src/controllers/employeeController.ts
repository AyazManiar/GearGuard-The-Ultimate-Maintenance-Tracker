import { Request, Response } from 'express';
import { query } from '../database/db';
import { asyncHandler, AppError } from '../middleware/errorHandler';

export const getAllEmployees = asyncHandler(async (req: Request, res: Response) => {
  const result = await query(`
    SELECT e.*, d.name as department_name
    FROM employees e
    LEFT JOIN departments d ON e.department_id = d.id
    ORDER BY e.name
  `);
  
  res.status(200).json({
    status: 'success',
    data: result.rows
  });
});

export const getEmployeeById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  
  const result = await query(`
    SELECT e.*, d.name as department_name
    FROM employees e
    LEFT JOIN departments d ON e.department_id = d.id
    WHERE e.id = ?
  `, [id]);
  
  if (result.rows.length === 0) {
    throw new AppError('Employee not found', 404);
  }
  
  res.status(200).json({
    status: 'success',
    data: result.rows[0]
  });
});
