const express = require('express');
const db = require('../db/connection');

const router = express.Router();

router.post('/', async (req, res, next) => {
  try {
    const { student_id, file_name, file_url } = req.body;
    if (!student_id || !file_name || !file_url) {
      return res.status(400).json({ error: 'Missing required field(s): student_id, file_name, file_url' });
    }

    const result = await db.query(
      `INSERT INTO documents (student_id, file_name, file_url)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [student_id, file_name, file_url]
    );

    return res.status(201).json(result.rows[0]);
  } catch (err) {
    return next(err);
  }
});

router.get('/', async (req, res, next) => {
  try {
    const result = await db.query(
      `SELECT d.*, s.admission_number, s.name AS student_name
       FROM documents d
       JOIN students s ON s.id = d.student_id
       ORDER BY d.uploaded_at DESC`
    );
    return res.json(result.rows);
  } catch (err) {
    return next(err);
  }
});

router.get('/student/:studentId', async (req, res, next) => {
  try {
    const result = await db.query(
      'SELECT * FROM documents WHERE student_id = $1 ORDER BY uploaded_at DESC',
      [req.params.studentId]
    );
    return res.json(result.rows);
  } catch (err) {
    return next(err);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const result = await db.query('DELETE FROM documents WHERE id = $1 RETURNING *', [req.params.id]);
    if (!result.rows.length) return res.status(404).json({ error: 'Document not found' });
    return res.json({ message: 'Document deleted', document: result.rows[0] });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
