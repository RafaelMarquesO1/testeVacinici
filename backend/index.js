const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { executeQuery } = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

// Rotas CRUD (exemplo para usuários)
app.get('/api/usuarios', async (req, res) => {
  try {
    const results = await executeQuery('SELECT * FROM usuarios');
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/usuarios/:id', async (req, res) => {
  try {
    const results = await executeQuery('SELECT * FROM usuarios WHERE id = @param1', [req.params.id]);
    if (results.length === 0) return res.status(404).json({ error: 'Usuário não encontrado' });
    res.json(results[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/usuarios', async (req, res) => {
  try {
    const { nome_completo, email, telefone, cpf, data_nascimento, genero, tipo_usuario, cargo, foto_perfil } = req.body;
    const result = await executeQuery(
      'INSERT INTO usuarios (nome_completo, email, telefone, cpf, data_nascimento, genero, tipo_usuario, cargo, foto_perfil) OUTPUT INSERTED.id VALUES (@param1, @param2, @param3, @param4, @param5, @param6, @param7, @param8, @param9)',
      [nome_completo, email, telefone, cpf, data_nascimento, genero, tipo_usuario, cargo, foto_perfil]
    );
    res.json({ id: result[0].id, ...req.body });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/usuarios/:id', async (req, res) => {
  try {
    const { nome_completo, email, telefone, cpf, data_nascimento, genero, tipo_usuario, cargo, foto_perfil } = req.body;
    await executeQuery(
      'UPDATE usuarios SET nome_completo=@param1, email=@param2, telefone=@param3, cpf=@param4, data_nascimento=@param5, genero=@param6, tipo_usuario=@param7, cargo=@param8, foto_perfil=@param9 WHERE id=@param10',
      [nome_completo, email, telefone, cpf, data_nascimento, genero, tipo_usuario, cargo, foto_perfil, req.params.id]
    );
    res.json({ id: req.params.id, ...req.body });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/usuarios/:id', async (req, res) => {
  try {
    await executeQuery('DELETE FROM usuarios WHERE id = @param1', [req.params.id]);
    res.json({ deleted: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Endpoint de login
app.post('/api/login', async (req, res) => {
  try {
    const { email, senha } = req.body;
    if (!email || !senha) {
      return res.status(400).json({ success: false, message: 'Email e senha são obrigatórios.' });
    }
    
    const results = await executeQuery(
      'SELECT u.*, c.senha_hash FROM usuarios u JOIN credenciais c ON u.id = c.usuario_id WHERE u.email = @param1',
      [email]
    );
    
    if (results.length === 0) {
      return res.status(401).json({ success: false, message: 'Credenciais inválidas.' });
    }
    
    const user = results[0];
    // Simulação: senha em texto puro (ajuste para hash em produção)
    if (senha !== user.senha_hash) {
      return res.status(401).json({ success: false, message: 'Credenciais inválidas.' });
    }
    
    if (user.cargo !== 'Administrador') {
      return res.status(403).json({ success: false, message: 'Acesso restrito apenas para administradores.' });
    }
    
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
  } catch (err) {
    res.status(500).json({ success: false, message: 'Erro no servidor.' });
  }
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