import db from './sqlite';
import { runMigrations } from './migrate-sqlite';

const seedData = () => {
  console.log('Starting database seeding...');

  try {
    // Run migrations first
    runMigrations();

    // Clear existing data
    db.exec('DELETE FROM maintenance_requests');
    db.exec('DELETE FROM equipment');
    db.exec('DELETE FROM team_members');
    db.exec('DELETE FROM maintenance_teams');
    db.exec('DELETE FROM employees');
    db.exec('DELETE FROM departments');

    // Insert Departments
    console.log('Seeding departments...');
    const insertDept = db.prepare('INSERT INTO departments (id, name, description, created_at, updated_at) VALUES (?, ?, ?, ?, ?)');
    insertDept.run('dept-1', 'Production', 'Manufacturing and production floor', '2024-01-01', '2024-01-01');
    insertDept.run('dept-2', 'IT', 'Information Technology department', '2024-01-01', '2024-01-01');
    insertDept.run('dept-3', 'Logistics', 'Warehouse and transportation', '2024-01-01', '2024-01-01');
    insertDept.run('dept-4', 'Administration', 'Office and administrative operations', '2024-01-01', '2024-01-01');

    // Insert Employees
    console.log('Seeding employees...');
    const insertEmp = db.prepare('INSERT INTO employees (id, name, email, department_id, role, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)');
    insertEmp.run('emp-1', 'John Smith', 'john.smith@gearguard.com', 'dept-1', 'manager', '2024-01-01', '2024-01-01');
    insertEmp.run('emp-2', 'Sarah Johnson', 'sarah.johnson@gearguard.com', 'dept-1', 'technician', '2024-01-01', '2024-01-01');
    insertEmp.run('emp-3', 'Mike Chen', 'mike.chen@gearguard.com', 'dept-2', 'technician', '2024-01-01', '2024-01-01');
    insertEmp.run('emp-4', 'Emily Davis', 'emily.davis@gearguard.com', 'dept-2', 'admin', '2024-01-01', '2024-01-01');
    insertEmp.run('emp-5', 'Robert Wilson', 'robert.wilson@gearguard.com', 'dept-3', 'technician', '2024-01-01', '2024-01-01');
    insertEmp.run('emp-6', 'Lisa Anderson', 'lisa.anderson@gearguard.com', 'dept-1', 'technician', '2024-01-01', '2024-01-01');

    // Insert Maintenance Teams
    console.log('Seeding maintenance teams...');
    const insertTeam = db.prepare('INSERT INTO maintenance_teams (id, name, description, created_at, updated_at) VALUES (?, ?, ?, ?, ?)');
    insertTeam.run('team-1', 'Mechanics', 'Handles all mechanical equipment repairs', '2024-01-01', '2024-01-01');
    insertTeam.run('team-2', 'IT Support', 'Computer and network maintenance', '2024-01-01', '2024-01-01');
    insertTeam.run('team-3', 'Electricians', 'Electrical systems and wiring', '2024-01-01', '2024-01-01');

    // Insert Team Members
    console.log('Assigning team members...');
    const insertMember = db.prepare('INSERT INTO team_members (team_id, employee_id) VALUES (?, ?)');
    insertMember.run('team-1', 'emp-2');
    insertMember.run('team-1', 'emp-5');
    insertMember.run('team-2', 'emp-3');
    insertMember.run('team-2', 'emp-4');
    insertMember.run('team-3', 'emp-6');

    // Insert Equipment
    console.log('Seeding equipment...');
    const insertEquip = db.prepare(`INSERT INTO equipment 
      (id, name, serial_number, category, department_id, assigned_employee_id, maintenance_team_id, default_technician_id, location, purchase_date, warranty_expiry_date, is_active, created_at, updated_at) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);
    
    insertEquip.run('equip-1', 'CNC Machine Alpha', 'CNC-2024-001', 'machine', 'dept-1', null, 'team-1', 'emp-2', 'Production Floor - Bay 1', '2023-06-15', '2026-06-15', 1, '2023-06-15', '2024-01-01');
    insertEquip.run('equip-2', 'Forklift FL-200', 'FL-2022-045', 'vehicle', 'dept-3', null, 'team-1', 'emp-5', 'Warehouse A', '2022-03-10', '2025-03-10', 1, '2022-03-10', '2024-01-01');
    insertEquip.run('equip-3', 'Dell Workstation WS-15', 'DELL-WS-2024-015', 'computer', 'dept-2', 'emp-4', 'team-2', 'emp-3', 'IT Office - Desk 15', '2024-01-20', '2027-01-20', 1, '2024-01-20', '2024-01-20');
    insertEquip.run('equip-4', 'Printer HP LaserJet Pro', 'HP-LJ-2023-008', 'computer', 'dept-4', null, 'team-2', 'emp-3', 'Admin Office - Floor 2', '2023-09-01', '2025-09-01', 1, '2023-09-01', '2024-01-01');
    insertEquip.run('equip-5', 'Industrial Robot Arm R-500', 'IRA-2024-500', 'machine', 'dept-1', null, 'team-3', 'emp-6', 'Production Floor - Assembly Line 2', '2024-02-01', '2029-02-01', 1, '2024-02-01', '2024-02-01');

    // Insert Maintenance Requests
    console.log('Seeding maintenance requests...');
    const insertReq = db.prepare(`INSERT INTO maintenance_requests 
      (id, subject, description, type, status, equipment_id, maintenance_team_id, assigned_technician_id, requested_by_id, scheduled_date, completed_date, duration_hours, priority, created_at, updated_at) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);
    
    insertReq.run('req-1', 'Oil Leak Detected', 'Oil leak found under the CNC machine during morning inspection', 'corrective', 'new', 'equip-1', 'team-1', null, 'emp-1', null, null, null, 'high', '2024-12-26', '2024-12-26');
    insertReq.run('req-2', 'Quarterly Maintenance', 'Scheduled quarterly maintenance check', 'preventive', 'in_progress', 'equip-2', 'team-1', 'emp-5', 'emp-1', '2024-12-28', null, null, 'medium', '2024-12-20', '2024-12-26');
    insertReq.run('req-3', 'Network Connection Issues', 'Workstation experiencing intermittent network drops', 'corrective', 'repaired', 'equip-3', 'team-2', 'emp-3', 'emp-4', null, '2024-12-25', 2.5, 'medium', '2024-12-24', '2024-12-25');
    insertReq.run('req-4', 'Paper Jam - Recurring', 'Printer keeps jamming, needs thorough inspection', 'corrective', 'new', 'equip-4', 'team-2', null, 'emp-4', null, null, null, 'low', '2024-12-27', '2024-12-27');
    insertReq.run('req-5', 'Calibration Check', 'Monthly calibration verification for precision components', 'preventive', 'new', 'equip-5', 'team-3', null, 'emp-1', '2024-12-30', null, null, 'medium', '2024-12-20', '2024-12-20');

    console.log('✅ Database seeding completed successfully!');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
};

if (require.main === module) {
  seedData();
  console.log('Seed script completed');
  process.exit(0);
}

export default seedData;
