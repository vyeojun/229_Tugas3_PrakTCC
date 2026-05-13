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
    console.log(err);
  } else {
    console.log('MySQL Connected');
  }
});

app.get('/notes', (req, res) => {
  db.query('SELECT * FROM notes', (err, result) => {
    if (err) throw err;
    res.json(result);
  });
});

app.post('/notes', (req, res) => {
  const { title, content } = req.body;

  db.query(
    'INSERT INTO notes(title, content) VALUES (?, ?)',
    [title, content],
    (err, result) => {
      if (err) throw err;
      res.json(result);
    }
  );
});

app.put('/notes/:id', (req, res) => {
  const { title, content } = req.body;

  db.query(
    'UPDATE notes SET title=?, content=? WHERE id=?',
    [title, content, req.params.id],
    (err, result) => {
      if (err) throw err;
      res.json(result);
    }
  );
});

app.delete('/notes/:id', (req, res) => {
  db.query(
    'DELETE FROM notes WHERE id=?',
    [req.params.id],
    (err, result) => {
      if (err) throw err;
      res.json(result);
    }
  );
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});