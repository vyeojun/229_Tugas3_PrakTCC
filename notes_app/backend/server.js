require('dotenv').config();

const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

db.connect((err) => {
  if (err) {
    console.error('MySQL connection error:', err);
    process.exit(1);
  } else {
    console.log('MySQL Connected');
  }
});

// GET semua catatan
app.get('/notes', (req, res) => {
  db.query('SELECT * FROM notes ORDER BY id DESC', (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(result);
  });
});

// POST tambah catatan
app.post('/notes', (req, res) => {
  const { title, content } = req.body;
  if (!title || !content) {
    return res.status(400).json({ error: 'Title dan content wajib diisi' });
  }
  db.query(
    'INSERT INTO notes(title, content) VALUES (?, ?)',
    [title, content],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ id: result.insertId, title, content });
    }
  );
});

// PUT edit catatan
app.put('/notes/:id', (req, res) => {
  const { title, content } = req.body;
  if (!title || !content) {
    return res.status(400).json({ error: 'Title dan content wajib diisi' });
  }
  db.query(
    'UPDATE notes SET title=?, content=? WHERE id=?',
    [title, content, req.params.id],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Catatan tidak ditemukan' });
      }
      res.json({ id: req.params.id, title, content });
    }
  );
});

// DELETE hapus catatan
app.delete('/notes/:id', (req, res) => {
  db.query(
    'DELETE FROM notes WHERE id=?',
    [req.params.id],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Catatan tidak ditemukan' });
      }
      res.json({ message: 'Catatan berhasil dihapus' });
    }
  );
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});