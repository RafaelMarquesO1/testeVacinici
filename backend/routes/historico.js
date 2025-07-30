const express = require('express');
const router = express.Router();
const db = require('../db');

// Listar histórico de vacinação (todos ou por paciente_id)
router.get('/', (req, res) => {
  const { paciente_id } = req.query;
  let sql = 'SELECT * FROM historico_vacinacao';
  let params = [];
  if (paciente_id) {
    sql += ' WHERE paciente_id = ?';
    params.push(paciente_id);
  }
  db.query(sql, params, (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});

// Buscar histórico por id
router.get('/:id', (req, res) => {
  db.query('SELECT * FROM historico_vacinacao WHERE id = ?', [req.params.id], (err, results) => {
    if (err) return res.status(500).json({ error: err });
    if (results.length === 0) return res.status(404).json({ error: 'Registro não encontrado' });
    res.json(results[0]);
  });
});

// Criar registro de vacinação
router.post('/', (req, res) => {
  const { paciente_id, funcionario_id, vacina_id, dose, data_aplicacao, lote, validade, local_id, comprovante_url, observacoes } = req.body;
  db.query(
    'INSERT INTO historico_vacinacao (paciente_id, funcionario_id, vacina_id, dose, data_aplicacao, lote, validade, local_id, comprovante_url, observacoes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [paciente_id, funcionario_id, vacina_id, dose, data_aplicacao, lote, validade, local_id, comprovante_url, observacoes],
    (err, result) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ id: result.insertId, ...req.body });
    }
  );
});

// Atualizar registro
router.put('/:id', (req, res) => {
  const { paciente_id, funcionario_id, vacina_id, dose, data_aplicacao, lote, validade, local_id, comprovante_url, observacoes } = req.body;
  db.query(
    'UPDATE historico_vacinacao SET paciente_id=?, funcionario_id=?, vacina_id=?, dose=?, data_aplicacao=?, lote=?, validade=?, local_id=?, comprovante_url=?, observacoes=? WHERE id=?',
    [paciente_id, funcionario_id, vacina_id, dose, data_aplicacao, lote, validade, local_id, comprovante_url, observacoes, req.params.id],
    (err) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ id: req.params.id, ...req.body });
    }
  );
});

// Deletar registro
router.delete('/:id', (req, res) => {
  db.query('DELETE FROM historico_vacinacao WHERE id = ?', [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ deleted: true });
  });
});

module.exports = router;