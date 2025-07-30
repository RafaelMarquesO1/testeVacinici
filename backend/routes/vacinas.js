const express = require('express');
const router = express.Router();
const db = require('../db');

// Listar vacinas
router.get('/', (req, res) => {
  db.query('SELECT * FROM vacinas', (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});

// Buscar vacina por id
router.get('/:id', (req, res) => {
  db.query('SELECT * FROM vacinas WHERE id = ?', [req.params.id], (err, results) => {
    if (err) return res.status(500).json({ error: err });
    if (results.length === 0) return res.status(404).json({ error: 'Vacina não encontrada' });
    res.json(results[0]);
  });
});

// Criar vacina
router.post('/', (req, res) => {
  const { nome, fabricante, descricao, doses_recomendadas, intervalo_doses, idade_minima, idade_maxima, categoria, imagem_url } = req.body;
  db.query(
    'INSERT INTO vacinas (nome, fabricante, descricao, doses_recomendadas, intervalo_doses, idade_minima, idade_maxima, categoria, imagem_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [nome, fabricante, descricao, doses_recomendadas, intervalo_doses, idade_minima, idade_maxima, categoria, imagem_url],
    (err, result) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ id: result.insertId, ...req.body });
    }
  );
});

// Atualizar vacina
router.put('/:id', (req, res) => {
  const { nome, fabricante, descricao, doses_recomendadas, intervalo_doses, idade_minima, idade_maxima, categoria, imagem_url } = req.body;
  db.query(
    'UPDATE vacinas SET nome=?, fabricante=?, descricao=?, doses_recomendadas=?, intervalo_doses=?, idade_minima=?, idade_maxima=?, categoria=?, imagem_url=? WHERE id=?',
    [nome, fabricante, descricao, doses_recomendadas, intervalo_doses, idade_minima, idade_maxima, categoria, imagem_url, req.params.id],
    (err) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ id: req.params.id, ...req.body });
    }
  );
});

// Deletar vacina
router.delete('/:id', (req, res) => {
  db.query('DELETE FROM vacinas WHERE id = ?', [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ deleted: true });
  });
});

module.exports = router;