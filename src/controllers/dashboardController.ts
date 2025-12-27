import { Request, Response } from 'express';
import { query } from '../database/db';
import { asyncHandler } from '../middleware/errorHandler';
import { DashboardStats } from '../types';

export const getDashboardStats = asyncHandler(async (req: Request, res: Response) => {
  // Get total and active equipment
  const equipmentStats = await query(`
    SELECT 
      COUNT(*) as total,
      COUNT(*) FILTER (WHERE is_active = true) as active
    FROM equipment
  `);
  
  // Get request stats by status
  const requestStats = await query(`
    SELECT 
      COUNT(*) as total,
      COUNT(*) FILTER (WHERE status = 'new') as open,
      COUNT(*) FILTER (WHERE status = 'in_progress') as in_progress,
      COUNT(*) FILTER (WHERE status = 'repaired') as completed
    FROM maintenance_requests
  `);
  
  // Get overdue requests (preventive maintenance with scheduled_date in past and not completed)
  const overdueStats = await query(`
    SELECT COUNT(*) as overdue
    FROM maintenance_requests
    WHERE scheduled_date < CURRENT_TIMESTAMP
    AND status NOT IN ('repaired', 'scrap')
  `);
  
  // Get total teams
  const teamStats = await query('SELECT COUNT(*) as total FROM maintenance_teams');
  
  // Get average repair time (only for completed requests with duration)
  const avgRepairTime = await query(`
    SELECT AVG(duration_hours) as avg_hours
    FROM maintenance_requests
    WHERE status = 'repaired'
    AND duration_hours IS NOT NULL
  `);
  
  const stats: DashboardStats = {
    totalEquipment: parseInt(equipmentStats.rows[0].total),
    activeEquipment: parseInt(equipmentStats.rows[0].active),
    totalRequests: parseInt(requestStats.rows[0].total),
    openRequests: parseInt(requestStats.rows[0].open),
    inProgressRequests: parseInt(requestStats.rows[0].in_progress),
    completedRequests: parseInt(requestStats.rows[0].completed),
    overdueRequests: parseInt(overdueStats.rows[0].overdue),
    totalTeams: parseInt(teamStats.rows[0].total),
    avgRepairTime: parseFloat(avgRepairTime.rows[0].avg_hours) || 0
  };
  
  res.status(200).json({
    status: 'success',
    data: stats
  });
});
