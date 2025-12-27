// Type definitions matching the frontend types
export type RequestStatus = 'new' | 'in_progress' | 'repaired' | 'scrap';
export type RequestType = 'corrective' | 'preventive';
export type EquipmentCategory = 'machine' | 'vehicle' | 'computer' | 'other';
export type EmployeeRole = 'admin' | 'manager' | 'technician' | 'user';
export type Priority = 'low' | 'medium' | 'high' | 'critical';

// Database models (snake_case for DB compatibility)
export interface Department {
  id: string;
  name: string;
  description?: string;
  created_at: Date;
  updated_at: Date;
}

export interface Employee {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  department_id: string;
  role: EmployeeRole;
  created_at: Date;
  updated_at: Date;
}

export interface MaintenanceTeam {
  id: string;
  name: string;
  description?: string;
  created_at: Date;
  updated_at: Date;
}

export interface TeamMember {
  team_id: string;
  employee_id: string;
}

export interface Equipment {
  id: string;
  name: string;
  serial_number: string;
  category: EquipmentCategory;
  department_id: string;
  assigned_employee_id?: string;
  maintenance_team_id: string;
  default_technician_id?: string;
  location: string;
  purchase_date: Date;
  warranty_expiry_date?: Date;
  notes?: string;
  is_active: boolean;
  image_url?: string;
  created_at: Date;
  updated_at: Date;
}

export interface MaintenanceRequest {
  id: string;
  subject: string;
  description?: string;
  type: RequestType;
  status: RequestStatus;
  equipment_id: string;
  maintenance_team_id: string;
  assigned_technician_id?: string;
  requested_by_id: string;
  scheduled_date?: Date;
  completed_date?: Date;
  duration_hours?: number;
  priority: Priority;
  notes?: string;
  created_at: Date;
  updated_at: Date;
}

// API response types with relations (camelCase for frontend)
export interface EquipmentWithRelations extends Equipment {
  department?: Department;
  assignedEmployee?: Employee;
  maintenanceTeam?: MaintenanceTeamWithMembers;
  defaultTechnician?: Employee;
  openRequestCount?: number;
}

export interface MaintenanceRequestWithRelations extends MaintenanceRequest {
  equipment?: Equipment;
  maintenanceTeam?: MaintenanceTeamWithMembers;
  assignedTechnician?: Employee;
  requestedBy?: Employee;
  isOverdue?: boolean;
}

export interface MaintenanceTeamWithMembers extends MaintenanceTeam {
  members?: Employee[];
  memberIds?: string[];
  equipmentCount?: number;
  openRequestCount?: number;
}

// Form/input types
export interface CreateEquipmentInput {
  name: string;
  serialNumber: string;
  category: EquipmentCategory;
  departmentId: string;
  assignedEmployeeId?: string;
  maintenanceTeamId: string;
  defaultTechnicianId?: string;
  location: string;
  purchaseDate: Date;
  warrantyExpiryDate?: Date;
  notes?: string;
}

export interface UpdateEquipmentInput extends Partial<CreateEquipmentInput> {
  isActive?: boolean;
}

export interface CreateRequestInput {
  subject: string;
  description?: string;
  type: RequestType;
  equipmentId: string;
  scheduledDate?: Date;
  priority: Priority;
  notes?: string;
}

export interface UpdateRequestInput extends Partial<CreateRequestInput> {
  status?: RequestStatus;
  assignedTechnicianId?: string;
  completedDate?: Date;
  durationHours?: number;
}

export interface CreateTeamInput {
  name: string;
  description?: string;
  memberIds: string[];
}

export interface UpdateTeamInput extends Partial<CreateTeamInput> {}

// Dashboard stats
export interface DashboardStats {
  totalEquipment: number;
  activeEquipment: number;
  totalRequests: number;
  openRequests: number;
  inProgressRequests: number;
  completedRequests: number;
  overdueRequests: number;
  totalTeams: number;
  avgRepairTime: number;
}
