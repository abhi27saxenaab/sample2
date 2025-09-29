const { Sequelize, DataTypes } = require('sequelize');
const config = require('./config/config.json');

const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];

const sequelize = new Sequelize({
  dialect: dbConfig.dialect,
  storage: dbConfig.storage,
  logging: console.log,
});

async function runManualMigrations() {
  try {
    console.log('Running manual migrations...');
    
    // Create users table
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        firstName TEXT NOT NULL,
        lastName TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        age INTEGER,
        isActive BOOLEAN DEFAULT true,
        createdAt DATETIME NOT NULL,
        updatedAt DATETIME NOT NULL
      )
    `);
    
    // Create SequelizeMeta table for tracking migrations
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS SequelizeMeta (
        name VARCHAR(255) NOT NULL UNIQUE,
        PRIMARY KEY (name)
      )
    `);
    
    // Mark our manual migration as executed
    await sequelize.query(`
      INSERT OR IGNORE INTO SequelizeMeta (name) 
      VALUES ('20240101000000-create-user.js')
    `);

    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS users1 (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        firstName TEXT NOT NULL,
        lastName TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        age INTEGER,
        isActive BOOLEAN DEFAULT true,
        createdAt DATETIME NOT NULL,
        updatedAt DATETIME NOT NULL
      )
    `);

    await sequelize.query(`
      ALTER TABLE users1 ADD COLUMN category_id INTEGER ;
    `);

    
    console.log('Manual migration completed successfully!');
    
  } catch (error) {
    console.error('Manual migration failed:', error);
  } finally {
    await sequelize.close();
  }
}

runManualMigrations();