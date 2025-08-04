const express = require('express');
const router = express.Router();
const { executeQuery } = require('../db');

// GET - Listar todos os usuários
router.get('/', async (req, res) => {
  try {
    const results = await executeQuery('SELECT * FROM usuarios ORDER BY nome_completo');
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET - Buscar usuário por ID
router.get('/:id', async (req, res) => {
  try {
    const results = await executeQuery('SELECT * FROM usuarios WHERE id = @param1', [req.params.id]);
    if (results.length === 0) return res.status(404).json({ error: 'Usuário não encontrado' });
    res.json(results[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST - Criar novo usuário
router.post('/', async (req, res) => {
  try {
    console.log('Dados recebidos:', req.body);
    const { nome_completo, email, telefone, cpf, data_nascimento, genero, tipo_usuario, cargo } = req.body;
    
    const result = await executeQuery(
      'INSERT INTO usuarios (nome_completo, email, telefone, cpf, data_nascimento, genero, tipo_usuario, cargo) OUTPUT INSERTED.id VALUES (@param1, @param2, @param3, @param4, @param5, @param6, @param7, @param8)',
      [nome_completo, email, telefone, cpf, data_nascimento, genero, tipo_usuario, cargo]
    );
    
    console.log('Resultado da inserção:', result);
    res.status(201).json({ id: result[0].id, message: 'Usuário criado com sucesso' });
  } catch (err) {
    console.error('Erro ao criar usuário:', err);
    res.status(500).json({ error: err.message });
  }
});

// PUT - Atualizar usuário
router.put('/:id', async (req, res) => {
  try {
    const { nome_completo, email, telefone, cpf, data_nascimento, genero, tipo_usuario, cargo } = req.body;
    await executeQuery(
      'UPDATE usuarios SET nome_completo=@param1, email=@param2, telefone=@param3, cpf=@param4, data_nascimento=@param5, genero=@param6, tipo_usuario=@param7, cargo=@param8 WHERE id=@param9',
      [nome_completo, email, telefone, cpf, data_nascimento, genero, tipo_usuario, cargo, req.params.id]
    );
    res.json({ message: 'Usuário atualizado com sucesso' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE - Excluir usuário
router.delete('/:id', async (req, res) => {
  try {
    await executeQuery('DELETE FROM usuarios WHERE id = @param1', [req.params.id]);
    res.json({ message: 'Usuário excluído com sucesso' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;