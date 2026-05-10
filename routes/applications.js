const express = require('express');
const db = require('../db/connection');

const router = express.Router();
const VALID_STATUSES = ['pending', 'accepted', 'rejected'];

router.post('/', async (req, res, next) => {
  try {
    const { student_id, course_id, status = 'pending' } = req.body;
    if (!student_id || !course_id) {
      return res.status(400).json({ error: 'Missing required field(s): student_id, course_id' });
    }
    if (!VALID_STATUSES.includes(status)) {
      return res.status(400).json({ error: `status must be one of: ${VALID_STATUSES.join(', ')}` });
    }

    const result = await db.query(
      `INSERT INTO applications (student_id, course_id, status)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [student_id, course_id, status]
    );

    return res.status(201).json(result.rows[0]);
  } catch (err) {
    return next(err);
  }
});

router.get('/', async (req, res, next) => {
  try {
    const result = await db.query(
      `SELECT
        a.id,
        a.status,
        a.created_at,
        a.student_id,
        s.admission_number,
        s.name AS student_name,
        a.course_id,
        c.name AS course_name,
        c.code AS course_code
       FROM applications a
       JOIN students s ON s.id = a.student_id
       JOIN courses c ON c.id = a.course_id
       ORDER BY a.created_at DESC`
    );
    return res.json(result.rows);
  } catch (err) {
    return next(err);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const result = await db.query(
      `SELECT
        a.id,
        a.status,
        a.created_at,
        a.student_id,
        s.admission_number,
        s.name AS student_name,
        a.course_id,
        c.name AS course_name,
        c.code AS course_code
       FROM applications a
       JOIN students s ON s.id = a.student_id
       JOIN courses c ON c.id = a.course_id
       WHERE a.id = $1`,
      [req.params.id]
    );

    if (!result.rows.length) return res.status(404).json({ error: 'Application not found' });
    return res.json(result.rows[0]);
  } catch (err) {
    return next(err);
  }
});

router.patch('/:id/status', async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!VALID_STATUSES.includes(status)) {
      return res.status(400).json({ error: `status must be one of: ${VALID_STATUSES.join(', ')}` });
    }

    const result = await db.query(
      'UPDATE applications SET status = $1 WHERE id = $2 RETURNING *',
      [status, req.params.id]
    );

    if (!result.rows.length) return res.status(404).json({ error: 'Application not found' });
    return res.json(result.rows[0]);
  } catch (err) {
    return next(err);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const result = await db.query('DELETE FROM applications WHERE id = $1 RETURNING *', [req.params.id]);
    if (!result.rows.length) return res.status(404).json({ error: 'Application not found' });
    return res.json({ message: 'Application deleted', application: result.rows[0] });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
