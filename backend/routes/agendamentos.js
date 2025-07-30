const express = require('express');
const router = express.Router();
const db = require('../db');

// Listar agendamentos
router.get('/', (req, res) => {
  db.query('SELECT * FROM agendamentos', (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});

// Buscar agendamento por id
router.get('/:id', (req, res) => {
  db.query('SELECT * FROM agendamentos WHERE id = ?', [req.params.id], (err, results) => {
    if (err) return res.status(500).json({ error: err });
    if (results.length === 0) return res.status(404).json({ error: 'Agendamento não encontrado' });
    res.json(results[0]);
  });
});

// Criar agendamento
router.post('/', (req, res) => {
  const { paciente_id, vacina_id, dose, data_hora, local_id, status, notificacao_enviada } = req.body;
  db.query(
    'INSERT INTO agendamentos (paciente_id, vacina_id, dose, data_hora, local_id, status, notificacao_enviada) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [paciente_id, vacina_id, dose, data_hora, local_id, status, notificacao_enviada || 0],
    (err, result) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ id: result.insertId, ...req.body });
    }
  );
});

// Atualizar agendamento
router.put('/:id', (req, res) => {
  const { paciente_id, vacina_id, dose, data_hora, local_id, status, notificacao_enviada } = req.body;
  db.query(
    'UPDATE agendamentos SET paciente_id=?, vacina_id=?, dose=?, data_hora=?, local_id=?, status=?, notificacao_enviada=? WHERE id=?',
    [paciente_id, vacina_id, dose, data_hora, local_id, status, notificacao_enviada, req.params.id],
    (err) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ id: req.params.id, ...req.body });
    }
  );
});

// Deletar agendamento
router.delete('/:id', (req, res) => {
  db.query('DELETE FROM agendamentos WHERE id = ?', [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ deleted: true });
  });
});

module.exports = router;