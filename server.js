const express = require('express');
const cors = require('cors');
require('dotenv').config();

const studentRoutes = require('./routes/students');
const courseRoutes = require('./routes/courses');
const applicationRoutes = require('./routes/applications');
const documentRoutes = require('./routes/documents');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'student-admission-db-project' });
});

app.use('/api/students', studentRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/documents', documentRoutes);

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.use((err, req, res, next) => {
  console.error(err);

  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({ error: 'Invalid JSON request body' });
  }

  if (err.code === '23505') {
    return res.status(409).json({ error: 'Unique constraint violation', detail: err.detail });
  }

  if (err.code === '23503') {
    return res.status(400).json({ error: 'Foreign key constraint violation', detail: err.detail });
  }

  if (err.code === '23514') {
    return res.status(400).json({ error: 'Check constraint violation', detail: err.detail });
  }

  if (err.code === '22P02') {
    return res.status(400).json({ error: 'Invalid input syntax', detail: err.message });
  }

  return res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
