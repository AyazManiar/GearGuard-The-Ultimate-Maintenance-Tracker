import { Department, Employee, MaintenanceTeam, Equipment, MaintenanceRequest } from '@/types';

// Initial Departments
export const initialDepartments: Department[] = [
  {
    id: 'dept-1',
    name: 'Production',
    description: 'Manufacturing and production floor',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: 'dept-2',
    name: 'IT',
    description: 'Information Technology department',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: 'dept-3',
    name: 'Logistics',
    description: 'Warehouse and transportation',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: 'dept-4',
    name: 'Administration',
    description: 'Office and administrative operations',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  }
];

// Initial Employees
export const initialEmployees: Employee[] = [
  {
    id: 'emp-1',
    name: 'John Smith',
    email: 'john.smith@gearguard.com',
    departmentId: 'dept-1',
    role: 'manager',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: 'emp-2',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@gearguard.com',
    departmentId: 'dept-1',
    role: 'technician',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: 'emp-3',
    name: 'Mike Chen',
    email: 'mike.chen@gearguard.com',
    departmentId: 'dept-2',
    role: 'technician',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: 'emp-4',
    name: 'Emily Davis',
    email: 'emily.davis@gearguard.com',
    departmentId: 'dept-2',
    role: 'admin',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: 'emp-5',
    name: 'Robert Wilson',
    email: 'robert.wilson@gearguard.com',
    departmentId: 'dept-3',
    role: 'technician',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: 'emp-6',
    name: 'Lisa Anderson',
    email: 'lisa.anderson@gearguard.com',
    departmentId: 'dept-1',
    role: 'technician',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  }
];

// Initial Maintenance Teams
export const initialTeams: MaintenanceTeam[] = [
  {
    id: 'team-1',
    name: 'Mechanics',
    description: 'Handles all mechanical equipment repairs',
    memberIds: ['emp-2', 'emp-5'],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: 'team-2',
    name: 'IT Support',
    description: 'Computer and network maintenance',
    memberIds: ['emp-3', 'emp-4'],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: 'team-3',
    name: 'Electricians',
    description: 'Electrical systems and wiring',
    memberIds: ['emp-6'],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  }
];

// Initial Equipment
export const initialEquipment: Equipment[] = [
  {
    id: 'equip-1',
    name: 'CNC Machine Alpha',
    serialNumber: 'CNC-2024-001',
    category: 'machine',
    departmentId: 'dept-1',
    maintenanceTeamId: 'team-1',
    defaultTechnicianId: 'emp-2',
    location: 'Production Floor - Bay 1',
    purchaseDate: new Date('2023-06-15'),
    warrantyExpiryDate: new Date('2026-06-15'),
    isActive: true,
    createdAt: new Date('2023-06-15'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: 'equip-2',
    name: 'Forklift FL-200',
    serialNumber: 'FL-2022-045',
    category: 'vehicle',
    departmentId: 'dept-3',
    maintenanceTeamId: 'team-1',
    defaultTechnicianId: 'emp-5',
    location: 'Warehouse A',
    purchaseDate: new Date('2022-03-10'),
    warrantyExpiryDate: new Date('2025-03-10'),
    isActive: true,
    createdAt: new Date('2022-03-10'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: 'equip-3',
    name: 'Dell Workstation WS-15',
    serialNumber: 'DELL-WS-2024-015',
    category: 'computer',
    departmentId: 'dept-2',
    assignedEmployeeId: 'emp-4',
    maintenanceTeamId: 'team-2',
    defaultTechnicianId: 'emp-3',
    location: 'IT Office - Desk 15',
    purchaseDate: new Date('2024-01-20'),
    warrantyExpiryDate: new Date('2027-01-20'),
    isActive: true,
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-20')
  },
  {
    id: 'equip-4',
    name: 'Printer HP LaserJet Pro',
    serialNumber: 'HP-LJ-2023-008',
    category: 'computer',
    departmentId: 'dept-4',
    maintenanceTeamId: 'team-2',
    defaultTechnicianId: 'emp-3',
    location: 'Admin Office - Floor 2',
    purchaseDate: new Date('2023-09-01'),
    warrantyExpiryDate: new Date('2025-09-01'),
    isActive: true,
    createdAt: new Date('2023-09-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: 'equip-5',
    name: 'Industrial Robot Arm R-500',
    serialNumber: 'IRA-2024-500',
    category: 'machine',
    departmentId: 'dept-1',
    maintenanceTeamId: 'team-3',
    defaultTechnicianId: 'emp-6',
    location: 'Production Floor - Assembly Line 2',
    purchaseDate: new Date('2024-02-01'),
    warrantyExpiryDate: new Date('2029-02-01'),
    isActive: true,
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-01')
  }
];

// Initial Maintenance Requests
export const initialRequests: MaintenanceRequest[] = [
  {
    id: 'req-1',
    subject: 'Oil Leak Detected',
    description: 'Oil leak found under the CNC machine during morning inspection',
    type: 'corrective',
    status: 'new',
    equipmentId: 'equip-1',
    maintenanceTeamId: 'team-1',
    requestedById: 'emp-1',
    priority: 'high',
    createdAt: new Date('2024-12-26'),
    updatedAt: new Date('2024-12-26')
  },
  {
    id: 'req-2',
    subject: 'Quarterly Maintenance',
    description: 'Scheduled quarterly maintenance check',
    type: 'preventive',
    status: 'in_progress',
    equipmentId: 'equip-2',
    maintenanceTeamId: 'team-1',
    assignedTechnicianId: 'emp-5',
    requestedById: 'emp-1',
    scheduledDate: new Date('2024-12-28'),
    priority: 'medium',
    createdAt: new Date('2024-12-20'),
    updatedAt: new Date('2024-12-26')
  },
  {
    id: 'req-3',
    subject: 'Network Connection Issues',
    description: 'Workstation experiencing intermittent network drops',
    type: 'corrective',
    status: 'repaired',
    equipmentId: 'equip-3',
    maintenanceTeamId: 'team-2',
    assignedTechnicianId: 'emp-3',
    requestedById: 'emp-4',
    completedDate: new Date('2024-12-25'),
    durationHours: 2.5,
    priority: 'medium',
    createdAt: new Date('2024-12-24'),
    updatedAt: new Date('2024-12-25')
  },
  {
    id: 'req-4',
    subject: 'Paper Jam - Recurring',
    description: 'Printer keeps jamming, needs thorough inspection',
    type: 'corrective',
    status: 'new',
    equipmentId: 'equip-4',
    maintenanceTeamId: 'team-2',
    requestedById: 'emp-4',
    priority: 'low',
    createdAt: new Date('2024-12-27'),
    updatedAt: new Date('2024-12-27')
  },
  {
    id: 'req-5',
    subject: 'Calibration Check',
    description: 'Monthly calibration verification for precision components',
    type: 'preventive',
    status: 'new',
    equipmentId: 'equip-5',
    maintenanceTeamId: 'team-3',
    requestedById: 'emp-1',
    scheduledDate: new Date('2024-12-30'),
    priority: 'medium',
    createdAt: new Date('2024-12-20'),
    updatedAt: new Date('2024-12-20')
  }
];
