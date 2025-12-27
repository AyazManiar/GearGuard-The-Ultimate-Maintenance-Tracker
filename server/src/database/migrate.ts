import { query } from './pool';

const createTablesSQL = `
-- Drop existing tables (cascade to remove dependencies)
DROP TABLE IF EXISTS maintenance_requests CASCADE;
DROP TABLE IF EXISTS equipment CASCADE;
DROP TABLE IF EXISTS maintenance_teams CASCADE;
DROP TABLE IF EXISTS team_members CASCADE;
DROP TABLE IF EXISTS employees CASCADE;
DROP TABLE IF EXISTS departments CASCADE;

-- Create Departments table
CREATE TABLE departments (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Employees table
CREATE TABLE employees (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  avatar VARCHAR(500),
  department_id VARCHAR(50) REFERENCES departments(id) ON DELETE SET NULL,
  role VARCHAR(50) NOT NULL CHECK (role IN ('admin', 'manager', 'technician', 'user')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Maintenance Teams table
CREATE TABLE maintenance_teams (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Team Members junction table (many-to-many relationship)
CREATE TABLE team_members (
  team_id VARCHAR(50) REFERENCES maintenance_teams(id) ON DELETE CASCADE,
  employee_id VARCHAR(50) REFERENCES employees(id) ON DELETE CASCADE,
  PRIMARY KEY (team_id, employee_id)
);

-- Create Equipment table
CREATE TABLE equipment (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  serial_number VARCHAR(255) UNIQUE NOT NULL,
  category VARCHAR(50) NOT NULL CHECK (category IN ('machine', 'vehicle', 'computer', 'other')),
  department_id VARCHAR(50) REFERENCES departments(id) ON DELETE SET NULL,
  assigned_employee_id VARCHAR(50) REFERENCES employees(id) ON DELETE SET NULL,
  maintenance_team_id VARCHAR(50) REFERENCES maintenance_teams(id) ON DELETE SET NULL,
  default_technician_id VARCHAR(50) REFERENCES employees(id) ON DELETE SET NULL,
  location VARCHAR(500) NOT NULL,
  purchase_date DATE NOT NULL,
  warranty_expiry_date DATE,
  notes TEXT,
  is_active BOOLEAN DEFAULT true,
  image_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Maintenance Requests table
CREATE TABLE maintenance_requests (
  id VARCHAR(50) PRIMARY KEY,
  subject VARCHAR(255) NOT NULL,
  description TEXT,
  type VARCHAR(50) NOT NULL CHECK (type IN ('corrective', 'preventive')),
  status VARCHAR(50) NOT NULL CHECK (status IN ('new', 'in_progress', 'repaired', 'scrap')),
  equipment_id VARCHAR(50) REFERENCES equipment(id) ON DELETE CASCADE,
  maintenance_team_id VARCHAR(50) REFERENCES maintenance_teams(id) ON DELETE SET NULL,
  assigned_technician_id VARCHAR(50) REFERENCES employees(id) ON DELETE SET NULL,
  requested_by_id VARCHAR(50) REFERENCES employees(id) ON DELETE SET NULL,
  scheduled_date TIMESTAMP,
  completed_date TIMESTAMP,
  duration_hours DECIMAL(5,2),
  priority VARCHAR(50) NOT NULL CHECK (priority IN ('low', 'medium', 'high', 'critical')),
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX idx_equipment_department ON equipment(department_id);
CREATE INDEX idx_equipment_team ON equipment(maintenance_team_id);
CREATE INDEX idx_equipment_active ON equipment(is_active);
CREATE INDEX idx_employees_department ON employees(department_id);
CREATE INDEX idx_requests_equipment ON maintenance_requests(equipment_id);
CREATE INDEX idx_requests_status ON maintenance_requests(status);
CREATE INDEX idx_requests_team ON maintenance_requests(maintenance_team_id);
CREATE INDEX idx_requests_technician ON maintenance_requests(assigned_technician_id);
CREATE INDEX idx_team_members_team ON team_members(team_id);
CREATE INDEX idx_team_members_employee ON team_members(employee_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to automatically update updated_at
CREATE TRIGGER update_departments_updated_at BEFORE UPDATE ON departments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_employees_updated_at BEFORE UPDATE ON employees
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_teams_updated_at BEFORE UPDATE ON maintenance_teams
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_equipment_updated_at BEFORE UPDATE ON equipment
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_requests_updated_at BEFORE UPDATE ON maintenance_requests
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
`;

export async function runMigrations() {
  console.log('Running database migrations...');
  try {
    await query(createTablesSQL);
    console.log('✅ Database migrations completed successfully!');
  } catch (error) {
    console.error('❌ Error running migrations:', error);
    throw error;
  }
}

// Run migrations if executed directly
if (require.main === module) {
  runMigrations()
    .then(() => {
      console.log('Migration script completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Migration script failed:', error);
      process.exit(1);
    });
}
