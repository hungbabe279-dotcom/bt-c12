const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();

const DATA_DIR = path.join(__dirname, 'data');
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
const DB_PATH = path.join(DATA_DIR, 'app.db');

const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) return console.error('DB open error:', err);
  console.log('Opened SQLite DB at', DB_PATH);
});

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Serve specific pages to ensure correct files are returned for these routes
app.get('/emailList', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/thankyou', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'thankyou.html'));
});

app.get('/sqlGateway', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'sqlGateway.html'));
});

app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

// Simple API to subscribe
app.post('/api/subscribe', (req, res) => {
  const { email, firstName, lastName } = req.body;
  if (!email) return res.status(400).json({ error: 'Email required' });
  const stmt = db.prepare('INSERT INTO emails (email, first_name, last_name, created_at) VALUES (?, ?, ?, datetime())');
  stmt.run(email, firstName || '', lastName || '', function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true, id: this.lastID, email, firstName, lastName });
  });
  stmt.finalize();
});

// Admin: list subscribed emails (JSON)
app.get('/api/emails', (req, res) => {
  db.all('SELECT id, email, first_name as firstName, last_name as lastName, created_at as createdAt FROM emails ORDER BY id DESC', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true, rows });
  });
});

// Execute SQL (read-only: only allow SELECT)
app.post('/api/execute-sql', (req, res) => {
  const { sql } = req.body;
  if (!sql) return res.status(400).json({ error: 'SQL required' });
  // allow only SELECT statements
  if (!/^\s*select\b/i.test(sql)) {
    return res.status(400).json({ error: 'Only SELECT queries are allowed in this demo.' });
  }
  db.all(sql, [], (err, rows) => {
    if (err) return res.status(400).json({ error: err.message });
    res.json({ success: true, rows });
  });
});

// fallback
app.get('/', (req, res) => {
  res.redirect('/emailList');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server started on http://localhost:${PORT}`));
