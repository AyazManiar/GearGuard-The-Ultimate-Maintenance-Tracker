import { Request, Response } from 'express';
import { query, execute } from '../database/db';
import { asyncHandler, AppError } from '../middleware/errorHandler';
import { EquipmentWithRelations } from '../types';

// Helper to get equipment with relations
async function getEquipmentWithRelations(equipmentId: string): Promise<EquipmentWithRelations | null> {
  const result = await query(`
    SELECT 
      e.*,
      d.id as dept_id, d.name as dept_name,
      ae.id as assigned_emp_id, ae.name as assigned_emp_name,
      mt.id as team_id, mt.name as team_name,
      dt.id as default_tech_id, dt.name as default_tech_name
    FROM equipment e
    LEFT JOIN departments d ON e.department_id = d.id
    LEFT JOIN employees ae ON e.assigned_employee_id = ae.id
    LEFT JOIN maintenance_teams mt ON e.maintenance_team_id = mt.id
    LEFT JOIN employees dt ON e.default_technician_id = dt.id
    WHERE e.id = ?
  `, [equipmentId]);
  
  if (result.rows.length === 0) {
    return null;
  }
  
  const row = result.rows[0];
  
  // Get open request count
  const requestCount = await query(
    `SELECT COUNT(*) as count FROM maintenance_requests 
     WHERE equipment_id = ? AND status NOT IN ('repaired', 'scrap')`,
    [equipmentId]
  );
  
  return {
    id: row.id,
    name: row.name,
    serial_number: row.serial_number,
    category: row.category,
    department_id: row.department_id,
    assigned_employee_id: row.assigned_employee_id,
    maintenance_team_id: row.maintenance_team_id,
    default_technician_id: row.default_technician_id,
    location: row.location,
    purchase_date: row.purchase_date,
    warranty_expiry_date: row.warranty_expiry_date,
    notes: row.notes,
    is_active: row.is_active,
    image_url: row.image_url,
    created_at: row.created_at,
    updated_at: row.updated_at,
    department: row.dept_id ? {
      id: row.dept_id,
      name: row.dept_name
    } : undefined,
    assignedEmployee: row.assigned_emp_id ? {
      id: row.assigned_emp_id,
      name: row.assigned_emp_name
    } : undefined,
    maintenanceTeam: row.team_id ? {
      id: row.team_id,
      name: row.team_name
    } : undefined,
    defaultTechnician: row.default_tech_id ? {
      id: row.default_tech_id,
      name: row.default_tech_name
    } : undefined,
    openRequestCount: parseInt(requestCount.rows[0].count)
  } as any;
}

export const getAllEquipment = asyncHandler(async (req: Request, res: Response) => {
  const { isActive } = req.query;
  
  let queryText = `
    SELECT 
      e.*,
      d.name as dept_name,
      mt.name as team_name,
      dt.name as default_tech_name
    FROM equipment e
    LEFT JOIN departments d ON e.department_id = d.id
    LEFT JOIN maintenance_teams mt ON e.maintenance_team_id = mt.id
    LEFT JOIN employees dt ON e.default_technician_id = dt.id
  `;
  
  const params: any[] = [];
  
  if (isActive !== undefined) {
    queryText += ' WHERE e.is_active = ?';
    params.push(isActive === 'true');
  }
  
  queryText += ' ORDER BY e.name';
  
  const result = await query(queryText, params.length > 0 ? params : undefined);
  
  const equipmentWithCounts = await Promise.all(
    result.rows.map(async (row) => {
      const requestCount = await query(
        `SELECT COUNT(*) as count FROM maintenance_requests 
         WHERE equipment_id = ? AND status NOT IN ('repaired', 'scrap')`,
        [row.id]
      );
      
      return {
        ...row,
        openRequestCount: parseInt(requestCount.rows[0].count)
      };
    })
  );
  
  res.status(200).json({
    status: 'success',
    data: equipmentWithCounts
  });
});

export const getEquipmentById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  
  const equipment = await getEquipmentWithRelations(id);
  
  if (!equipment) {
    throw new AppError('Equipment not found', 404);
  }
  
  res.status(200).json({
    status: 'success',
    data: equipment
  });
});

export const createEquipment = asyncHandler(async (req: Request, res: Response) => {
  const {
    name,
    serialNumber,
    category,
    departmentId,
    assignedEmployeeId,
    maintenanceTeamId,
    defaultTechnicianId,
    location,
    purchaseDate,
    warrantyExpiryDate,
    notes
  } = req.body;
  
  if (!name || !serialNumber || !category || !departmentId || !maintenanceTeamId || !location || !purchaseDate) {
    throw new AppError('Required fields are missing', 400);
  }
  
  const id = `equip-${Date.now()}`;
  
  execute(
    `INSERT INTO equipment 
    (id, name, serial_number, category, department_id, assigned_employee_id, 
     maintenance_team_id, default_technician_id, location, purchase_date, 
     warranty_expiry_date, notes, is_active)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)`,
    [id, name, serialNumber, category, departmentId, assignedEmployeeId || null,
     maintenanceTeamId, defaultTechnicianId || null, location, purchaseDate,
     warrantyExpiryDate || null, notes || null]
  );
  
  const newEquipment = getEquipmentWithRelations(id);
  
  res.status(201).json({
    status: 'success',
    data: newEquipment
  });
});

export const updateEquipment = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const updates = req.body;
  
  const fields: string[] = [];
  const values: any[] = [];
  let paramCount = 1;
  
  const fieldMap: { [key: string]: string } = {
    name: 'name',
    serialNumber: 'serial_number',
    category: 'category',
    departmentId: 'department_id',
    assignedEmployeeId: 'assigned_employee_id',
    maintenanceTeamId: 'maintenance_team_id',
    defaultTechnicianId: 'default_technician_id',
    location: 'location',
    purchaseDate: 'purchase_date',
    warrantyExpiryDate: 'warranty_expiry_date',
    notes: 'notes',
    isActive: 'is_active',
    imageUrl: 'image_url'
  };
  
  Object.keys(updates).forEach(key => {
    if (fieldMap[key]) {
      fields.push(`${fieldMap[key]} = ?`);
      values.push(updates[key]);
    }
  });
  
  if (fields.length === 0) {
    throw new AppError('No valid fields to update', 400);
  }
  
  values.push(id);
  
  const result = await query(
    `UPDATE equipment SET ${fields.join(', ')} WHERE id = ? RETURNING *`,
    values
  );
  
  if (result.rows.length === 0) {
    throw new AppError('Equipment not found', 404);
  }
  
  const updatedEquipment = await getEquipmentWithRelations(id);
  
  res.status(200).json({
    status: 'success',
    data: updatedEquipment
  });
});

export const deleteEquipment = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  
  const result = await query('DELETE FROM equipment WHERE id = ? RETURNING *', [id]);
  
  if (result.rows.length === 0) {
    throw new AppError('Equipment not found', 404);
  }
  
  res.status(200).json({
    status: 'success',
    message: 'Equipment deleted successfully'
  });
});
