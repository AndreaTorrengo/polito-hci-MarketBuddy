import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';

// Path to the database file
const dbPath = path.resolve(__dirname, 'marketbuddy.db');

// Open the database
const db = open({
    filename: dbPath,
    driver: sqlite3.Database
});

// Export the database instance
export default db;