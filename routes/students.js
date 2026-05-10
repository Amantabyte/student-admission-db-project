const express = require('express');
const db = require('../db/connection');

const router = express.Router();

function requireFields(body, fields) {
  const missing = fields.filter((field) => !body[field]);
  return missing.length ? `Missing required field(s): ${missing.join(', ')}` : null;
}

router.post('/', async (req, res, next) => {
  try {
    const error = requireFields(req.body, ['admission_number', 'name', 'email']);
    if (error) return res.status(400).json({ error });

    const { admission_number, name, email, phone, date_of_birth } = req.body;
    const result = await db.query(
      `INSERT INTO students (admission_number, name, email, phone, date_of_birth)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [admission_number, name, email, phone || null, date_of_birth || null]
    );

    return res.status(201).json(result.rows[0]);
  } catch (err) {
    return next(err);
  }
});

router.get('/', async (req, res, next) => {
  try {
    const { admission_number } = req.query;

    if (admission_number) {
      const result = await db.query(
        'SELECT * FROM students WHERE admission_number = $1 ORDER BY created_at DESC',
        [admission_number]
      );
      return res.json(result.rows);
    }

    const result = await db.query('SELECT * FROM students ORDER BY created_at DESC');
    return res.json(result.rows);
  } catch (err) {
    return next(err);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const result = await db.query('SELECT * FROM students WHERE id = $1', [req.params.id]);
    if (!result.rows.length) return res.status(404).json({ error: 'Student not found' });
    return res.json(result.rows[0]);
  } catch (err) {
    return next(err);
  }
});

router.patch('/:id', async (req, res, next) => {
  try {
    const allowed = ['admission_number', 'name', 'email', 'phone', 'date_of_birth'];
    const hasUpdate = allowed.some((field) => Object.prototype.hasOwnProperty.call(req.body, field));

    if (!hasUpdate) {
      return res.status(400).json({ error: `Provide at least one field: ${allowed.join(', ')}` });
    }

    const { admission_number, name, email, phone, date_of_birth } = req.body;

    const result = await db.query(
      `UPDATE students
       SET admission_number = COALESCE($1, admission_number),
           name = COALESCE($2, name),
           email = COALESCE($3, email),
           phone = COALESCE($4, phone),
           date_of_birth = COALESCE($5, date_of_birth)
       WHERE id = $6
       RETURNING *`,
      [admission_number, name, email, phone, date_of_birth, req.params.id]
    );

    if (!result.rows.length) return res.status(404).json({ error: 'Student not found' });
    return res.json(result.rows[0]);
  } catch (err) {
    return next(err);
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    const error = requireFields(req.body, ['admission_number', 'name', 'email']);
    if (error) return res.status(400).json({ error });

    const { admission_number, name, email, phone, date_of_birth } = req.body;
    const result = await db.query(
      `UPDATE students
       SET admission_number = $1, name = $2, email = $3, phone = $4, date_of_birth = $5
       WHERE id = $6
       RETURNING *`,
      [admission_number, name, email, phone || null, date_of_birth || null, req.params.id]
    );

    if (!result.rows.length) return res.status(404).json({ error: 'Student not found' });
    return res.json(result.rows[0]);
  } catch (err) {
    return next(err);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const result = await db.query('DELETE FROM students WHERE id = $1 RETURNING *', [req.params.id]);
    if (!result.rows.length) return res.status(404).json({ error: 'Student not found' });
    return res.json({ message: 'Student deleted', student: result.rows[0] });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
