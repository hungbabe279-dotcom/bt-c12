const path = require('path');
const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();

const DATA_DIR = path.join(__dirname, '..', 'data');
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
const DB_PATH = path.join(DATA_DIR, 'app.db');

const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) return console.error('DB open error:', err);
  console.log('Opened SQLite DB at', DB_PATH);
});

const stmts = [
  `CREATE TABLE IF NOT EXISTS emails (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL,
    first_name TEXT,
    last_name TEXT,
    created_at TEXT
  );`,
  `CREATE TABLE IF NOT EXISTS "user" (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    email TEXT,
    created_at TEXT
  );`
];

db.serialize(() => {
  stmts.forEach(s => db.run(s));

  // seed some sample users
  db.run('DELETE FROM "user"');
  const insert = db.prepare('INSERT INTO "user" (name, email, created_at) VALUES (?, ?, datetime())');
  insert.run('alice', 'alice@example.com');
  insert.run('bob', 'bob@example.com');
  insert.run('carol', 'carol@example.com');
  insert.finalize();

  console.log('DB initialized and sample users inserted.');
});

db.close();
