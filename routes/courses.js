const express = require('express');
const db = require('../db/connection');

const router = express.Router();

function requireFields(body, fields) {
  const missing = fields.filter((field) => !body[field]);
  return missing.length ? `Missing required field(s): ${missing.join(', ')}` : null;
}

router.post('/', async (req, res, next) => {
  try {
    const error = requireFields(req.body, ['name', 'code', 'duration_months']);
    if (error) return res.status(400).json({ error });

    const { name, code, duration_months } = req.body;
    const result = await db.query(
      `INSERT INTO courses (name, code, duration_months)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [name, code, duration_months]
    );

    return res.status(201).json(result.rows[0]);
  } catch (err) {
    return next(err);
  }
});

router.get('/', async (req, res, next) => {
  try {
    const result = await db.query('SELECT * FROM courses ORDER BY code');
    return res.json(result.rows);
  } catch (err) {
    return next(err);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const result = await db.query('SELECT * FROM courses WHERE id = $1', [req.params.id]);
    if (!result.rows.length) return res.status(404).json({ error: 'Course not found' });
    return res.json(result.rows[0]);
  } catch (err) {
    return next(err);
  }
});

router.patch('/:id', async (req, res, next) => {
  try {
    const allowed = ['name', 'code', 'duration_months'];
    const hasUpdate = allowed.some((field) => Object.prototype.hasOwnProperty.call(req.body, field));

    if (!hasUpdate) {
      return res.status(400).json({ error: `Provide at least one field: ${allowed.join(', ')}` });
    }

    const { name, code, duration_months } = req.body;

    const result = await db.query(
      `UPDATE courses
       SET name = COALESCE($1, name),
           code = COALESCE($2, code),
           duration_months = COALESCE($3, duration_months)
       WHERE id = $4
       RETURNING *`,
      [name, code, duration_months, req.params.id]
    );

    if (!result.rows.length) return res.status(404).json({ error: 'Course not found' });
    return res.json(result.rows[0]);
  } catch (err) {
    return next(err);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const result = await db.query('DELETE FROM courses WHERE id = $1 RETURNING *', [req.params.id]);
    if (!result.rows.length) return res.status(404).json({ error: 'Course not found' });
    return res.json({ message: 'Course deleted', course: result.rows[0] });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
