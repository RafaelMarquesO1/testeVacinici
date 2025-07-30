const express = require('express');
const cors = require('cors');
require('dotenv').config();
const db = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

// Rotas CRUD (exemplo para usuários)
app.get('/api/usuarios', (req, res) => {
  db.query('SELECT * FROM usuarios', (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});

app.get('/api/usuarios/:id', (req, res) => {
  db.query('SELECT * FROM usuarios WHERE id = ?', [req.params.id], (err, results) => {
    if (err) return res.status(500).json({ error: err });
    if (results.length === 0) return res.status(404).json({ error: 'Usuário não encontrado' });
    res.json(results[0]);
  });
});

app.post('/api/usuarios', (req, res) => {
  const { nome_completo, email, telefone, cpf, data_nascimento, genero, tipo_usuario, cargo, foto_perfil } = req.body;
  db.query(
    'INSERT INTO usuarios (nome_completo, email, telefone, cpf, data_nascimento, genero, tipo_usuario, cargo, foto_perfil) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [nome_completo, email, telefone, cpf, data_nascimento, genero, tipo_usuario, cargo, foto_perfil],
    (err, result) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ id: result.insertId, ...req.body });
    }
  );
});

app.put('/api/usuarios/:id', (req, res) => {
  const { nome_completo, email, telefone, cpf, data_nascimento, genero, tipo_usuario, cargo, foto_perfil } = req.body;
  db.query(
    'UPDATE usuarios SET nome_completo=?, email=?, telefone=?, cpf=?, data_nascimento=?, genero=?, tipo_usuario=?, cargo=?, foto_perfil=? WHERE id=?',
    [nome_completo, email, telefone, cpf, data_nascimento, genero, tipo_usuario, cargo, foto_perfil, req.params.id],
    (err) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ id: req.params.id, ...req.body });
    }
  );
});

app.delete('/api/usuarios/:id', (req, res) => {
  db.query('DELETE FROM usuarios WHERE id = ?', [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ deleted: true });
  });
});

// Endpoint de login
app.post('/api/login', (req, res) => {
  const { email, senha } = req.body;
  if (!email || !senha) {
    return res.status(400).json({ success: false, message: 'Email e senha são obrigatórios.' });
  }
  db.query('SELECT u.*, c.senha_hash FROM usuarios u JOIN credenciais c ON u.id = c.usuario_id WHERE u.email = ?', [email], (err, results) => {
    if (err) return res.status(500).json({ success: false, message: 'Erro no servidor.' });
    if (results.length === 0) return res.status(401).json({ success: false, message: 'Credenciais inválidas.' });
    const user = results[0];
    // Simulação: senha em texto puro (ajuste para hash em produção)
    if (senha !== user.senha_hash) return res.status(401).json({ success: false, message: 'Credenciais inválidas.' });
    if (user.cargo !== 'Administrador') return res.status(403).json({ success: false, message: 'Acesso restrito apenas para administradores.' });
    // Geração de token simples (substitua por JWT em produção)
    const token = 'token-' + Math.random().toString(36).substring(2);
    res.json({
      success: true,
      user: {
        id: user.id,
        nome: user.nome_completo,
        email: user.email,
        tipo: user.tipo_usuario,
        cargo: user.cargo,
        foto: user.foto_perfil
      },
      token
    });
  });
});

app.use('/api/vacinas', require('./routes/vacinas'));
app.use('/api/locais', require('./routes/locais'));
app.use('/api/agendamentos', require('./routes/agendamentos'));
app.use('/api/feedback', require('./routes/feedback'));
app.use('/api/noticias', require('./routes/noticias'));
app.use('/api/logs', require('./routes/logs'));
app.use('/api/historico', require('./routes/historico'));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});