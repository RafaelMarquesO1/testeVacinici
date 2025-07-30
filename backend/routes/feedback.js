const express = require('express');
const router = express.Router();
const db = require('../db');

// Listar feedbacks
router.get('/', (req, res) => {
  db.query('SELECT * FROM feedback', (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});

// Buscar feedback por id
router.get('/:id', (req, res) => {
  db.query('SELECT * FROM feedback WHERE id = ?', [req.params.id], (err, results) => {
    if (err) return res.status(500).json({ error: err });
    if (results.length === 0) return res.status(404).json({ error: 'Feedback não encontrado' });
    res.json(results[0]);
  });
});

// Criar feedback
router.post('/', (req, res) => {
  const { usuario_id, mensagem, tipo } = req.body;
  db.query(
    'INSERT INTO feedback (usuario_id, mensagem, tipo) VALUES (?, ?, ?)',
    [usuario_id, mensagem, tipo],
    (err, result) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ id: result.insertId, ...req.body });
    }
  );
});

// Atualizar feedback
router.put('/:id', (req, res) => {
  const { mensagem, tipo } = req.body;
  db.query(
    'UPDATE feedback SET mensagem=?, tipo=? WHERE id=?',
    [mensagem, tipo, req.params.id],
    (err) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ id: req.params.id, ...req.body });
    }
  );
});

// Deletar feedback
router.delete('/:id', (req, res) => {
  db.query('DELETE FROM feedback WHERE id = ?', [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ deleted: true });
  });
});

module.exports = router;