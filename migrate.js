const { Sequelize } = require('sequelize');
const Umzug = require('umzug');
const path = require('path');
const config = require('./config/config.json');

const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];

const sequelize = new Sequelize({
  dialect: dbConfig.dialect,
  storage: dbConfig.storage,
  logging: dbConfig.logging || console.log,
});

const umzug = new Umzug({
  migrations: {
    path: path.join(__dirname, './migrations'),
    params: [
      sequelize.getQueryInterface(),
      Sequelize
    ],
  },
  storage: 'sequelize',
  storageOptions: {
    sequelize: sequelize,
  },
  logging: console.log,
});

async function runMigrations() {
  try {
    console.log('Starting migrations...');
    
    // Check current migration status
    const executed = await umzug.executed();
    console.log('Executed migrations:', executed.map(m => m.file));
    
    const pending = await umzug.pending();
    console.log('Pending migrations:', pending.map(m => m.file));
    
    // Run pending migrations
    await umzug.up();
    
    console.log('All migrations completed successfully!');
    
    // Show final status
    const finalExecuted = await umzug.executed();
    console.log('Final executed migrations:', finalExecuted.map(m => m.file));
    
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  } finally {
    await sequelize.close();
  }
}

runMigrations();