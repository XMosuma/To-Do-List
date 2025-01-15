import { open } from 'sqlite';
import sqlite3 from 'sqlite3';

// Open a SQLite database connection
export const initializeDatabase = async () => {
  const db = await open({
    filename: 'todos.db',
    driver: sqlite3.Database,
  });

  // Create the todos table if it doesn't exist
  await db.exec(`
    CREATE TABLE IF NOT EXISTS todos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      completed BOOLEAN DEFAULT 0
    )
  `);

  return db;
};
