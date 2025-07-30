const express = require('express');
const router = express.Router();
const db = require('../db');

// Listar logs
router.get('/', (req, res) => {
  db.query('SELECT * FROM logs', (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});

// Buscar log por id
router.get('/:id', (req, res) => {
  db.query('SELECT * FROM logs WHERE id = ?', [req.params.id], (err, results) => {
    if (err) return res.status(500).json({ error: err });
    if (results.length === 0) return res.status(404).json({ error: 'Log não encontrado' });
    res.json(results[0]);
  });
});

// Criar log
router.post('/', (req, res) => {
  const { usuario_id, acao, detalhes } = req.body;
  db.query(
    'INSERT INTO logs (usuario_id, acao, detalhes) VALUES (?, ?, ?)',
    [usuario_id, acao, detalhes],
    (err, result) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ id: result.insertId, ...req.body });
    }
  );
});

// Atualizar log
router.put('/:id', (req, res) => {
  const { usuario_id, acao, detalhes } = req.body;
  db.query(
    'UPDATE logs SET usuario_id=?, acao=?, detalhes=? WHERE id=?',
    [usuario_id, acao, detalhes, req.params.id],
    (err) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ id: req.params.id, ...req.body });
    }
  );
});

// Deletar log
router.delete('/:id', (req, res) => {
  db.query('DELETE FROM logs WHERE id = ?', [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ deleted: true });
  });
});

module.exports = router;