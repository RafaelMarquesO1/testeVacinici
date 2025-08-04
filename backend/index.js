const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { executeQuery } = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

// Endpoint de login
app.post('/api/login', async (req, res) => {
  try {
    const { email, senha } = req.body;
    if (!email || !senha) {
      return res.status(400).json({ success: false, message: 'Email e senha são obrigatórios.' });
    }
    
    const results = await executeQuery(
      'SELECT * FROM usuarios WHERE email = @param1 AND cargo = @param2',
      [email, 'Administrador']
    );
    
    if (results.length === 0) {
      return res.status(401).json({ success: false, message: 'Credenciais inválidas.' });
    }
    
    const user = results[0];
    if (senha !== 'admin123') {
      return res.status(401).json({ success: false, message: 'Credenciais inválidas.' });
    }
    
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

app.use('/api/usuarios', require('./routes/usuarios'));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});