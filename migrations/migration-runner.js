const db = require('../config/database');
const fs = require('fs');
const path = require('path');


const migrationsDir = path.join(__dirname);
// Create migrations table if it doesn't exist
db.run(`
  CREATE TABLE IF NOT EXISTS migrations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL,
    executed_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`, () => {
  runMigrations();
});

async function runMigrations() {
  // Get already executed migrations
  db.all('SELECT name FROM migrations', [], (err, rows) => {
    if (err) {
      console.error('Error fetching migrations:', err);
      return;
    }

    const executedMigrations = new Set(rows.map(row => row.name));
    
    // Read migration files
    fs.readdir(migrationsDir, (err, files) => {
      if (err) {
        console.error('Error reading migrations directory:', err);
        return;
      }

      const migrationFiles = files
        .filter(file => file.endsWith('.js') && file !== 'migration-runner.js')
        .sort();

      let completed = 0;
      
      migrationFiles.forEach(file => {
        if (!executedMigrations.has(file)) {
          console.log(`Running migration: ${file}`);
          const migration = require(path.join(migrationsDir, file));
          migration.up(db, (err) => {
            if (err) {
              console.error(`Migration ${file} failed:`, err);
            } else {
              // Record migration
              db.run('INSERT INTO migrations (name) VALUES (?)', [file], (err) => {
                if (err) {
                  console.error(`Error recording migration ${file}:`, err);
                } else {
                  console.log(`Migration ${file} completed successfully`);
                }
                completed++;
                checkCompletion();
              });
            }
          });
        } else {
          console.log(`Migration ${file} already executed`);
          completed++;
          checkCompletion();
        }
      });

      function checkCompletion() {
        if (completed === migrationFiles.length) {
          console.log('All migrations completed');
          db.close();
        }
      }
    });
  });
}