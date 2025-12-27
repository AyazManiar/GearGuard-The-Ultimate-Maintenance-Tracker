import { query } from './pool';

const resetDatabase = async () => {
  console.log('Resetting database...');
  
  try {
    // Drop all tables
    await query(`
      DROP TABLE IF EXISTS maintenance_requests CASCADE;
      DROP TABLE IF EXISTS equipment CASCADE;
      DROP TABLE IF EXISTS team_members CASCADE;
      DROP TABLE IF EXISTS maintenance_teams CASCADE;
      DROP TABLE IF EXISTS employees CASCADE;
      DROP TABLE IF EXISTS departments CASCADE;
      DROP FUNCTION IF EXISTS update_updated_at_column CASCADE;
    `);
    
    console.log('✅ Database reset completed successfully!');
  } catch (error) {
    console.error('❌ Error resetting database:', error);
    throw error;
  }
};

// Run reset if executed directly
if (require.main === module) {
  resetDatabase()
    .then(() => {
      console.log('Reset script completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Reset script failed:', error);
      process.exit(1);
    });
}

export default resetDatabase;
