import db from './sqlite';

const createTablesSQL = `
-- Create Departments table
CREATE TABLE IF NOT EXISTS departments (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- Create Employees table
CREATE TABLE IF NOT EXISTS employees (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  avatar TEXT,
  department_id TEXT REFERENCES departments(id) ON DELETE SET NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'manager', 'technician', 'user')),
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- Create Maintenance Teams table
CREATE TABLE IF NOT EXISTS maintenance_teams (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- Create Team Members junction table
CREATE TABLE IF NOT EXISTS team_members (
  team_id TEXT REFERENCES maintenance_teams(id) ON DELETE CASCADE,
  employee_id TEXT REFERENCES employees(id) ON DELETE CASCADE,
  PRIMARY KEY (team_id, employee_id)
);

-- Create Equipment table
CREATE TABLE IF NOT EXISTS equipment (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  serial_number TEXT UNIQUE NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('machine', 'vehicle', 'computer', 'other')),
  department_id TEXT REFERENCES departments(id) ON DELETE SET NULL,
  assigned_employee_id TEXT REFERENCES employees(id) ON DELETE SET NULL,
  maintenance_team_id TEXT REFERENCES maintenance_teams(id) ON DELETE SET NULL,
  default_technician_id TEXT REFERENCES employees(id) ON DELETE SET NULL,
  location TEXT NOT NULL,
  purchase_date TEXT NOT NULL,
  warranty_expiry_date TEXT,
  notes TEXT,
  is_active INTEGER DEFAULT 1,
  image_url TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- Create Maintenance Requests table
CREATE TABLE IF NOT EXISTS maintenance_requests (
  id TEXT PRIMARY KEY,
  subject TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL CHECK (type IN ('corrective', 'preventive')),
  status TEXT NOT NULL CHECK (status IN ('new', 'in_progress', 'repaired', 'scrap')),
  equipment_id TEXT REFERENCES equipment(id) ON DELETE CASCADE,
  maintenance_team_id TEXT REFERENCES maintenance_teams(id) ON DELETE SET NULL,
  assigned_technician_id TEXT REFERENCES employees(id) ON DELETE SET NULL,
  requested_by_id TEXT REFERENCES employees(id) ON DELETE SET NULL,
  scheduled_date TEXT,
  completed_date TEXT,
  duration_hours REAL,
  priority TEXT NOT NULL CHECK (priority IN ('low', 'medium', 'high', 'critical')),
  notes TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_equipment_department ON equipment(department_id);
CREATE INDEX IF NOT EXISTS idx_equipment_team ON equipment(maintenance_team_id);
CREATE INDEX IF NOT EXISTS idx_equipment_active ON equipment(is_active);
CREATE INDEX IF NOT EXISTS idx_employees_department ON employees(department_id);
CREATE INDEX IF NOT EXISTS idx_requests_equipment ON maintenance_requests(equipment_id);
CREATE INDEX IF NOT EXISTS idx_requests_status ON maintenance_requests(status);
CREATE INDEX IF NOT EXISTS idx_requests_team ON maintenance_requests(maintenance_team_id);
CREATE INDEX IF NOT EXISTS idx_team_members_team ON team_members(team_id);
CREATE INDEX IF NOT EXISTS idx_team_members_employee ON team_members(employee_id);
`;

export function runMigrations() {
  console.log('Running database migrations...');
  try {
    db.exec(createTablesSQL);
    console.log('✅ Database migrations completed successfully!');
  } catch (error) {
    console.error('❌ Error running migrations:', error);
    throw error;
  }
}

if (require.main === module) {
  runMigrations();
  console.log('Migration script completed');
  process.exit(0);
}
