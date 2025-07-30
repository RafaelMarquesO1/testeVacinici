const express = require('express');
const router = express.Router();
const db = require('../db');

// Listar locais
router.get('/', (req, res) => {
  db.query('SELECT * FROM locais_vacinacao', (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});

// Buscar local por id
router.get('/:id', (req, res) => {
  db.query('SELECT * FROM locais_vacinacao WHERE id = ?', [req.params.id], (err, results) => {
    if (err) return res.status(500).json({ error: err });
    if (results.length === 0) return res.status(404).json({ error: 'Local não encontrado' });
    res.json(results[0]);
  });
});

// Criar local
router.post('/', (req, res) => {
  const { nome, endereco, cidade, estado, cep, telefone, horario_funcionamento, latitude, longitude, tipo } = req.body;
  db.query(
    'INSERT INTO locais_vacinacao (nome, endereco, cidade, estado, cep, telefone, horario_funcionamento, latitude, longitude, tipo) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [nome, endereco, cidade, estado, cep, telefone, horario_funcionamento, latitude, longitude, tipo],
    (err, result) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ id: result.insertId, ...req.body });
    }
  );
});

// Atualizar local
router.put('/:id', (req, res) => {
  const { nome, endereco, cidade, estado, cep, telefone, horario_funcionamento, latitude, longitude, tipo } = req.body;
  db.query(
    'UPDATE locais_vacinacao SET nome=?, endereco=?, cidade=?, estado=?, cep=?, telefone=?, horario_funcionamento=?, latitude=?, longitude=?, tipo=? WHERE id=?',
    [nome, endereco, cidade, estado, cep, telefone, horario_funcionamento, latitude, longitude, tipo, req.params.id],
    (err) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ id: req.params.id, ...req.body });
    }
  );
});

// Deletar local
router.delete('/:id', (req, res) => {
  db.query('DELETE FROM locais_vacinacao WHERE id = ?', [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ deleted: true });
  });
});

module.exports = router;