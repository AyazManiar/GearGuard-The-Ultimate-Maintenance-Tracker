// ============================================
// GearGuard - Type Definitions
// Database-ready data models with relationships
// ============================================

// Enums for type safety
export type RequestStatus = 'new' | 'in_progress' | 'repaired' | 'scrap';
export type RequestType = 'corrective' | 'preventive';
export type EquipmentCategory = 'machine' | 'vehicle' | 'computer' | 'other';

// Base interface for all entities
export interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

// Department entity
export interface Department extends BaseEntity {
  name: string;
  description?: string;
}

// Employee/User entity
export interface Employee extends BaseEntity {
  name: string;
  email: string;
  avatar?: string;
  departmentId: string;
  role: 'admin' | 'manager' | 'technician' | 'user';
}

// Maintenance Team entity
export interface MaintenanceTeam extends BaseEntity {
  name: string;
  description?: string;
  memberIds: string[]; // Array of Employee IDs
}

// Equipment entity - central to the system
export interface Equipment extends BaseEntity {
  name: string;
  serialNumber: string;
  category: EquipmentCategory;
  departmentId: string;
  assignedEmployeeId?: string; // Optional - who owns/uses this equipment
  maintenanceTeamId: string; // Required - who maintains this
  defaultTechnicianId?: string; // Default technician for this equipment
  location: string;
  purchaseDate: Date;
  warrantyExpiryDate?: Date;
  notes?: string;
  isActive: boolean; // False if scrapped
  imageUrl?: string;
}

// Maintenance Request entity - transactional
export interface MaintenanceRequest extends BaseEntity {
  subject: string;
  description?: string;
  type: RequestType;
  status: RequestStatus;
  equipmentId: string;
  maintenanceTeamId: string; // Auto-filled from equipment
  assignedTechnicianId?: string;
  requestedById: string; // Who created the request
  scheduledDate?: Date; // Required for preventive maintenance
  completedDate?: Date;
  durationHours?: number; // Hours spent on repair
  priority: 'low' | 'medium' | 'high' | 'critical';
  notes?: string;
}

// Computed/joined types for UI display
export interface EquipmentWithRelations extends Equipment {
  department?: Department;
  assignedEmployee?: Employee;
  maintenanceTeam?: MaintenanceTeam;
  defaultTechnician?: Employee;
  openRequestCount?: number;
}

export interface MaintenanceRequestWithRelations extends MaintenanceRequest {
  equipment?: Equipment;
  maintenanceTeam?: MaintenanceTeam;
  assignedTechnician?: Employee;
  requestedBy?: Employee;
  isOverdue?: boolean;
}

export interface MaintenanceTeamWithRelations extends MaintenanceTeam {
  members?: Employee[];
  equipmentCount?: number;
  openRequestCount?: number;
}

// Form data types (without auto-generated fields)
export interface EquipmentFormData {
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

export interface MaintenanceRequestFormData {
  subject: string;
  description?: string;
  type: RequestType;
  equipmentId: string;
  scheduledDate?: Date;
  priority: 'low' | 'medium' | 'high' | 'critical';
  notes?: string;
}

export interface MaintenanceTeamFormData {
  name: string;
  description?: string;
  memberIds: string[];
}

// Dashboard statistics
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

// Kanban column type
export interface KanbanColumn {
  id: RequestStatus;
  title: string;
  requests: MaintenanceRequestWithRelations[];
}
