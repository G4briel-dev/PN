// server.js — Node + Express + sqlite3 + bcrypt + jsonwebtoken
const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');const cors = require('cors');


const app = express();
const PORT = process.env.PORT || 4000;
const JWT_SECRET = process.env.JWT_SECRET || 'trocar_para_uma_chave_secreta_em_producao';

app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(bodyParser.json());


const dbFile = path.join(__dirname, 'db.sqlite');
const db = new sqlite3.Database(dbFile);

db.run(`CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE,
  password_hash TEXT
)`);

app.post('/api/signup', async (req, res) => {
  try {
    const { email, password } = req.body; // vem do front-end
    if (!email || !password) return res.status(400).json({ error: 'Email e senha são obrigatórios' });

    const password_hash = await bcrypt.hash(password, 10);

    db.run('INSERT INTO users (email, password_hash) VALUES (?, ?)', [email, password_hash], function (err) {
      if (err) {
        if (err.code === 'SQLITE_CONSTRAINT') return res.status(409).json({ error: 'Usuário já existe' });
        return res.status(500).json({ error: 'Erro ao criar usuário' });
      }
      const token = jwt.sign({ id: this.lastID, email }, JWT_SECRET, { expiresIn: '1h' });
      res.json({ token });
    });
  } catch (e) {
    res.status(500).json({ error: 'Erro interno' });
  }
});

app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email e senha são obrigatórios' });

  db.get('SELECT id, email, password_hash FROM users WHERE email = ?', [email], async (err, row) => {
    if (err) return res.status(500).json({ error: 'Erro no banco' });
    if (!row) return res.status(401).json({ error: 'Email ou senha incorretos' });

    const match = await bcrypt.compare(password, row.password_hash);
    if (!match) return res.status(401).json({ error: 'Credenciais inválidas' });

    const token = jwt.sign({ id: row.id, email: row.email }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  });
});

function authenticateToken(req, res, next) {
  const auth = req.headers['authorization'];
  const token = auth && auth.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Token não fornecido' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Token inválido' });
    req.user = user; 
    next();
  });
}

app.get('/api/profile', authenticateToken, (req, res) => {
  res.json({ message: 'Aqui está o seu perfil', user: req.user });
});

app.listen(PORT, () => console.log(`Server rodando na porta ${PORT}`));
