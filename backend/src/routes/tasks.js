const express = require('express');
const pool = require('../db');

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const { status } = req.query;
    const result = status
      ? await pool.query('SELECT * FROM tasks WHERE status = $1 ORDER BY id DESC', [status])
      : await pool.query('SELECT * FROM tasks ORDER BY id DESC');
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const result = await pool.query('SELECT * FROM tasks WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Tarefa nao encontrada' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const { titulo, descricao, responsavel, prazo, status } = req.body;
    if (!titulo) {
      return res.status(400).json({ error: 'O campo titulo e obrigatorio' });
    }
    const result = await pool.query(
      `INSERT INTO tasks (titulo, descricao, responsavel, prazo, status)
       VALUES ($1, $2, $3, $4, COALESCE($5, 'pendente'))
       RETURNING *`,
      [titulo, descricao, responsavel, prazo, status]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    next(err);
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    const { titulo, descricao, responsavel, prazo, status } = req.body;
    const result = await pool.query(
      `UPDATE tasks
       SET titulo = COALESCE($1, titulo),
           descricao = COALESCE($2, descricao),
           responsavel = COALESCE($3, responsavel),
           prazo = COALESCE($4, prazo),
           status = COALESCE($5, status),
           atualizado_em = NOW()
       WHERE id = $6
       RETURNING *`,
      [titulo, descricao, responsavel, prazo, status, req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Tarefa nao encontrada' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const result = await pool.query('DELETE FROM tasks WHERE id = $1 RETURNING id', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Tarefa nao encontrada' });
    }
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

module.exports = router;
