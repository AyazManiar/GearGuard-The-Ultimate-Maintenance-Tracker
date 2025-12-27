import { Request, Response } from 'express';
import { query, execute } from '../database/db';
import { asyncHandler, AppError } from '../middleware/errorHandler';
import { MaintenanceRequestWithRelations } from '../types';

// Helper to check if a request is overdue
function isOverdue(status: string, scheduledDate: Date | null): boolean {
  if (status === 'repaired' || status === 'scrap' || !scheduledDate) {
    return false;
  }
  return new Date(scheduledDate) < new Date();
}

// Helper to get request with relations
async function getRequestWithRelations(requestId: string): Promise<MaintenanceRequestWithRelations | null> {
  const result = await query(`
    SELECT 
      r.*,
      e.id as equip_id, e.name as equip_name, e.serial_number as equip_serial,
      mt.id as team_id, mt.name as team_name,
      at.id as assigned_tech_id, at.name as assigned_tech_name,
      rb.id as requested_by_id, rb.name as requested_by_name
    FROM maintenance_requests r
    LEFT JOIN equipment e ON r.equipment_id = e.id
    LEFT JOIN maintenance_teams mt ON r.maintenance_team_id = mt.id
    LEFT JOIN employees at ON r.assigned_technician_id = at.id
    LEFT JOIN employees rb ON r.requested_by_id = rb.id
    WHERE r.id = ?
  `, [requestId]);
  
  if (result.rows.length === 0) {
    return null;
  }
  
  const row = result.rows[0];
  
  return {
    id: row.id,
    subject: row.subject,
    description: row.description,
    type: row.type,
    status: row.status,
    equipment_id: row.equipment_id,
    maintenance_team_id: row.maintenance_team_id,
    assigned_technician_id: row.assigned_technician_id,
    requested_by_id: row.requested_by_id,
    scheduled_date: row.scheduled_date,
    completed_date: row.completed_date,
    duration_hours: row.duration_hours,
    priority: row.priority,
    notes: row.notes,
    created_at: row.created_at,
    updated_at: row.updated_at,
    equipment: row.equip_id ? {
      id: row.equip_id,
      name: row.equip_name,
      serial_number: row.equip_serial
    } : undefined,
    maintenanceTeam: row.team_id ? {
      id: row.team_id,
      name: row.team_name
    } : undefined,
    assignedTechnician: row.assigned_tech_id ? {
      id: row.assigned_tech_id,
      name: row.assigned_tech_name
    } : undefined,
    requestedBy: row.requested_by_id ? {
      id: row.requested_by_id,
      name: row.requested_by_name
    } : undefined,
    isOverdue: isOverdue(row.status, row.scheduled_date)
  } as any;
}

export const getAllRequests = asyncHandler(async (req: Request, res: Response) => {
  const { status, equipmentId, teamId } = req.query;
  
  let queryText = `
    SELECT 
      r.*,
      e.name as equip_name,
      mt.name as team_name,
      at.name as assigned_tech_name,
      rb.name as requested_by_name
    FROM maintenance_requests r
    LEFT JOIN equipment e ON r.equipment_id = e.id
    LEFT JOIN maintenance_teams mt ON r.maintenance_team_id = mt.id
    LEFT JOIN employees at ON r.assigned_technician_id = at.id
    LEFT JOIN employees rb ON r.requested_by_id = rb.id
  `;
  
  const conditions: string[] = [];
  const params: any[] = [];
  let paramCount = 1;
  
  if (status) {
    conditions.push(`r.status = $${paramCount++}`);
    params.push(status);
  }
  
  if (equipmentId) {
    conditions.push(`r.equipment_id = $${paramCount++}`);
    params.push(equipmentId);
  }
  
  if (teamId) {
    conditions.push(`r.maintenance_team_id = $${paramCount++}`);
    params.push(teamId);
  }
  
  if (conditions.length > 0) {
    queryText += ' WHERE ' + conditions.join(' AND ');
  }
  
  queryText += ' ORDER BY r.created_at DESC';
  
  const result = await query(queryText, params.length > 0 ? params : undefined);
  
  const requestsWithOverdue = result.rows.map(row => ({
    ...row,
    isOverdue: isOverdue(row.status, row.scheduled_date)
  }));
  
  res.status(200).json({
    status: 'success',
    data: requestsWithOverdue
  });
});

export const getRequestById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  
  const request = await getRequestWithRelations(id);
  
  if (!request) {
    throw new AppError('Request not found', 404);
  }
  
  res.status(200).json({
    status: 'success',
    data: request
  });
});

export const createRequest = asyncHandler(async (req: Request, res: Response) => {
  const {
    subject,
    description,
    type,
    equipmentId,
    requestedById,
    scheduledDate,
    priority,
    notes
  } = req.body;
  
  if (!subject || !type || !equipmentId || !requestedById || !priority) {
    throw new AppError('Required fields are missing', 400);
  }
  
  // Get equipment to auto-fill maintenance team
  const equipmentResult = query(
    'SELECT maintenance_team_id FROM equipment WHERE id = ?',
    [equipmentId]
  );
  
  if (equipmentResult.rows.length === 0) {
    throw new AppError('Equipment not found', 404);
  }
  
  const maintenanceTeamId = equipmentResult.rows[0].maintenance_team_id;
  const id = `req-${Date.now()}`;
  
  execute(
    `INSERT INTO maintenance_requests 
    (id, subject, description, type, status, equipment_id, maintenance_team_id, 
     requested_by_id, scheduled_date, priority, notes)
    VALUES (?, ?, ?, ?, 'new', ?, ?, ?, ?, ?, ?)`,
    [id, subject, description || null, type, equipmentId, maintenanceTeamId,
     requestedById, scheduledDate || null, priority, notes || null]
  );
  
  const newRequest = getRequestWithRelations(id);
  
  res.status(201).json({
    status: 'success',
    data: newRequest
  });
});

export const updateRequest = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const updates = req.body;
  
  const fields: string[] = [];
  const values: any[] = [];
  let paramCount = 1;
  
  const fieldMap: { [key: string]: string } = {
    subject: 'subject',
    description: 'description',
    type: 'type',
    status: 'status',
    assignedTechnicianId: 'assigned_technician_id',
    scheduledDate: 'scheduled_date',
    completedDate: 'completed_date',
    durationHours: 'duration_hours',
    priority: 'priority',
    notes: 'notes'
  };
  
  Object.keys(updates).forEach(key => {
    if (fieldMap[key]) {
      fields.push(`${fieldMap[key]} = $${paramCount++}`);
      values.push(updates[key]);
    }
  });
  
  if (fields.length === 0) {
    throw new AppError('No valid fields to update', 400);
  }
  
  values.push(id);
  
  const result = await query(
    `UPDATE maintenance_requests SET ${fields.join(', ')} WHERE id = $${paramCount} RETURNING *`,
    values
  );
  
  if (result.rows.length === 0) {
    throw new AppError('Request not found', 404);
  }
  
  const updatedRequest = await getRequestWithRelations(id);
  
  res.status(200).json({
    status: 'success',
    data: updatedRequest
  });
});

export const updateRequestStatus = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status, durationHours } = req.body;
  
  if (!status) {
    throw new AppError('Status is required', 400);
  }
  
  const updates: string[] = ['status = ?'];
  const values: any[] = [status];
  
  // Auto-set completed date if status is repaired
  if (status === 'repaired') {
    updates.push(`completed_date = ?`);
    values.push(new Date());
    
    if (durationHours) {
      updates.push(`duration_hours = ?`);
      values.push(durationHours);
    }
  }
  
  values.push(id);
  
  const result = await query(
    `UPDATE maintenance_requests SET ${updates.join(', ')} WHERE id = ? RETURNING *`,
    values
  );
  
  if (result.rows.length === 0) {
    throw new AppError('Request not found', 404);
  }
  
  const updatedRequest = await getRequestWithRelations(id);
  
  res.status(200).json({
    status: 'success',
    data: updatedRequest
  });
});

export const deleteRequest = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  
  const result = await query('DELETE FROM maintenance_requests WHERE id = ? RETURNING *', [id]);
  
  if (result.rows.length === 0) {
    throw new AppError('Request not found', 404);
  }
  
  res.status(200).json({
    status: 'success',
    message: 'Request deleted successfully'
  });
});
