import { query, getClient } from './pool';
import { runMigrations } from './migrate';

const seedData = async () => {
  console.log('Starting database seeding...');

  try {
    // Run migrations first
    await runMigrations();

    const client = await getClient();

    try {
      await client.query('BEGIN');

      // Insert Departments
      console.log('Seeding departments...');
      await client.query(`
        INSERT INTO departments (id, name, description, created_at, updated_at) VALUES
        ('dept-1', 'Production', 'Manufacturing and production floor', '2024-01-01', '2024-01-01'),
        ('dept-2', 'IT', 'Information Technology department', '2024-01-01', '2024-01-01'),
        ('dept-3', 'Logistics', 'Warehouse and transportation', '2024-01-01', '2024-01-01'),
        ('dept-4', 'Administration', 'Office and administrative operations', '2024-01-01', '2024-01-01')
      `);

      // Insert Employees
      console.log('Seeding employees...');
      await client.query(`
        INSERT INTO employees (id, name, email, department_id, role, created_at, updated_at) VALUES
        ('emp-1', 'John Smith', 'john.smith@gearguard.com', 'dept-1', 'manager', '2024-01-01', '2024-01-01'),
        ('emp-2', 'Sarah Johnson', 'sarah.johnson@gearguard.com', 'dept-1', 'technician', '2024-01-01', '2024-01-01'),
        ('emp-3', 'Mike Chen', 'mike.chen@gearguard.com', 'dept-2', 'technician', '2024-01-01', '2024-01-01'),
        ('emp-4', 'Emily Davis', 'emily.davis@gearguard.com', 'dept-2', 'admin', '2024-01-01', '2024-01-01'),
        ('emp-5', 'Robert Wilson', 'robert.wilson@gearguard.com', 'dept-3', 'technician', '2024-01-01', '2024-01-01'),
        ('emp-6', 'Lisa Anderson', 'lisa.anderson@gearguard.com', 'dept-1', 'technician', '2024-01-01', '2024-01-01')
      `);

      // Insert Maintenance Teams
      console.log('Seeding maintenance teams...');
      await client.query(`
        INSERT INTO maintenance_teams (id, name, description, created_at, updated_at) VALUES
        ('team-1', 'Mechanics', 'Handles all mechanical equipment repairs', '2024-01-01', '2024-01-01'),
        ('team-2', 'IT Support', 'Computer and network maintenance', '2024-01-01', '2024-01-01'),
        ('team-3', 'Electricians', 'Electrical systems and wiring', '2024-01-01', '2024-01-01')
      `);

      // Insert Team Members (junction table)
      console.log('Assigning team members...');
      await client.query(`
        INSERT INTO team_members (team_id, employee_id) VALUES
        ('team-1', 'emp-2'),
        ('team-1', 'emp-5'),
        ('team-2', 'emp-3'),
        ('team-2', 'emp-4'),
        ('team-3', 'emp-6')
      `);

      // Insert Equipment
      console.log('Seeding equipment...');
      await client.query(`
        INSERT INTO equipment (id, name, serial_number, category, department_id, assigned_employee_id, maintenance_team_id, default_technician_id, location, purchase_date, warranty_expiry_date, is_active, created_at, updated_at) VALUES
        ('equip-1', 'CNC Machine Alpha', 'CNC-2024-001', 'machine', 'dept-1', NULL, 'team-1', 'emp-2', 'Production Floor - Bay 1', '2023-06-15', '2026-06-15', true, '2023-06-15', '2024-01-01'),
        ('equip-2', 'Forklift FL-200', 'FL-2022-045', 'vehicle', 'dept-3', NULL, 'team-1', 'emp-5', 'Warehouse A', '2022-03-10', '2025-03-10', true, '2022-03-10', '2024-01-01'),
        ('equip-3', 'Dell Workstation WS-15', 'DELL-WS-2024-015', 'computer', 'dept-2', 'emp-4', 'team-2', 'emp-3', 'IT Office - Desk 15', '2024-01-20', '2027-01-20', true, '2024-01-20', '2024-01-20'),
        ('equip-4', 'Printer HP LaserJet Pro', 'HP-LJ-2023-008', 'computer', 'dept-4', NULL, 'team-2', 'emp-3', 'Admin Office - Floor 2', '2023-09-01', '2025-09-01', true, '2023-09-01', '2024-01-01'),
        ('equip-5', 'Industrial Robot Arm R-500', 'IRA-2024-500', 'machine', 'dept-1', NULL, 'team-3', 'emp-6', 'Production Floor - Assembly Line 2', '2024-02-01', '2029-02-01', true, '2024-02-01', '2024-02-01')
      `);

      // Insert Maintenance Requests
      console.log('Seeding maintenance requests...');
      await client.query(`
        INSERT INTO maintenance_requests (id, subject, description, type, status, equipment_id, maintenance_team_id, assigned_technician_id, requested_by_id, scheduled_date, completed_date, duration_hours, priority, created_at, updated_at) VALUES
        ('req-1', 'Oil Leak Detected', 'Oil leak found under the CNC machine during morning inspection', 'corrective', 'new', 'equip-1', 'team-1', NULL, 'emp-1', NULL, NULL, NULL, 'high', '2024-12-26', '2024-12-26'),
        ('req-2', 'Quarterly Maintenance', 'Scheduled quarterly maintenance check', 'preventive', 'in_progress', 'equip-2', 'team-1', 'emp-5', 'emp-1', '2024-12-28', NULL, NULL, 'medium', '2024-12-20', '2024-12-26'),
        ('req-3', 'Network Connection Issues', 'Workstation experiencing intermittent network drops', 'corrective', 'repaired', 'equip-3', 'team-2', 'emp-3', 'emp-4', NULL, '2024-12-25', 2.5, 'medium', '2024-12-24', '2024-12-25'),
        ('req-4', 'Paper Jam - Recurring', 'Printer keeps jamming, needs thorough inspection', 'corrective', 'new', 'equip-4', 'team-2', NULL, 'emp-4', NULL, NULL, NULL, 'low', '2024-12-27', '2024-12-27'),
        ('req-5', 'Calibration Check', 'Monthly calibration verification for precision components', 'preventive', 'new', 'equip-5', 'team-3', NULL, 'emp-1', '2024-12-30', NULL, NULL, 'medium', '2024-12-20', '2024-12-20')
      `);

      await client.query('COMMIT');
      console.log('✅ Database seeding completed successfully!');
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
};

// Run seed if executed directly
if (require.main === module) {
  seedData()
    .then(() => {
      console.log('Seed script completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Seed script failed:', error);
      process.exit(1);
    });
}

export default seedData;
