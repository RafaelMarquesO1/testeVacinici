const express = require('express');
const router = express.Router();
const db = require('../db');

// Listar notícias
router.get('/', (req, res) => {
  db.query('SELECT * FROM noticias', (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});

// Buscar notícia por id
router.get('/:id', (req, res) => {
  db.query('SELECT * FROM noticias WHERE id = ?', [req.params.id], (err, results) => {
    if (err) return res.status(500).json({ error: err });
    if (results.length === 0) return res.status(404).json({ error: 'Notícia não encontrada' });
    res.json(results[0]);
  });
});

// Criar notícia
router.post('/', (req, res) => {
  const { titulo, conteudo, ativo } = req.body;
  db.query(
    'INSERT INTO noticias (titulo, conteudo, ativo) VALUES (?, ?, ?)',
    [titulo, conteudo, ativo || 1],
    (err, result) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ id: result.insertId, ...req.body });
    }
  );
});

// Atualizar notícia
router.put('/:id', (req, res) => {
  const { titulo, conteudo, ativo } = req.body;
  db.query(
    'UPDATE noticias SET titulo=?, conteudo=?, ativo=? WHERE id=?',
    [titulo, conteudo, ativo, req.params.id],
    (err) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ id: req.params.id, ...req.body });
    }
  );
});

// Deletar notícia
router.delete('/:id', (req, res) => {
  db.query('DELETE FROM noticias WHERE id = ?', [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ deleted: true });
  });
});

module.exports = router;