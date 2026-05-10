const methodMap = {
  POST: {
    sql: 'INSERT',
    example: 'POST /api/students creates a row in students.'
  },
  GET: {
    sql: 'SELECT',
    example: 'GET /api/students reads rows from students.'
  },
  PATCH: {
    sql: 'UPDATE',
    example: 'PATCH /api/students/:id updates selected columns.'
  },
  PUT: {
    sql: 'UPDATE',
    example: 'PUT /api/students/:id replaces the student fields.'
  },
  DELETE: {
    sql: 'DELETE',
    example: 'DELETE /api/students/:id removes a row.'
  }
};

const layerText = {
  frontend: 'Frontend code in public/index.html and public/app.js collects input, sends fetch() requests, and displays JSON. It does not know SQL.',
  backend: 'Backend code in server.js and routes/*.js validates requests, chooses the SQL query, and sends values as parameters.',
  database: 'PostgreSQL stores rows in students, courses, applications, and documents while enforcing keys and constraints.'
};

const flows = {
  createStudent: [
    'Frontend sends POST /api/students with JSON body.',
    'routes/students.js validates admission_number, name, and email.',
    'Backend runs INSERT INTO students (...) VALUES ($1, $2, $3, $4, $5) RETURNING *.',
    'PostgreSQL creates a UUID, checks UNIQUE and NOT NULL rules, and stores the row.',
    'Express returns the created student as JSON.'
  ],
  searchStudent: [
    'Frontend sends GET /api/students?admission_number=A1001.',
    'routes/students.js reads req.query.admission_number.',
    'Backend runs SELECT * FROM students WHERE admission_number = $1.',
    'PostgreSQL returns matching rows.',
    'Frontend displays the JSON array.'
  ],
  updateStatus: [
    'Frontend sends PATCH /api/applications/:id/status with { "status": "accepted" }.',
    'routes/applications.js validates status is pending, accepted, or rejected.',
    'Backend runs UPDATE applications SET status = $1 WHERE id = $2 RETURNING *.',
    'PostgreSQL checks the status constraint and updates the row.',
    'Frontend displays the updated application.'
  ]
};

const questions = [
  ['What does the frontend do?', 'It collects user input and calls backend APIs. Example: public/app.js sends POST /api/students.'],
  ['Why should the frontend not connect to PostgreSQL?', 'Browser code is public. Database credentials and raw SQL access must stay on the backend.'],
  ['What does server.js do?', 'It starts Express, serves static files, mounts API routes, and handles errors.'],
  ['What does db/connection.js do?', 'It creates a pg Pool using DATABASE_URL or DB_HOST-style variables and exposes db.query(sql, params).'],
  ['What is a relational schema?', 'The table, column, key, relationship, and constraint design of a relational database.'],
  ['Why does students exist?', 'It stores each student’s identity and contact information.'],
  ['Why does courses exist?', 'It stores available courses that students can apply to.'],
  ['Why does applications exist?', 'It connects a student to a course and stores status such as pending or accepted.'],
  ['Why does documents exist?', 'It stores document metadata and URLs for students.'],
  ['What is a primary key?', 'A rule that uniquely identifies each row. Example: students.id.'],
  ['What is a UUID?', 'A 128-bit identifier such as 4770fa87-a115-44e7-be44-f7cf5e2f1d49.'],
  ['Why use UUID instead of SERIAL?', 'UUIDs are harder to guess and can be generated independently by distributed systems.'],
  ['When is SERIAL acceptable?', 'For simpler internal systems where sequential IDs are fine.'],
  ['What is a foreign key?', 'A column that references another table’s primary key. Example: applications.student_id references students.id.'],
  ['What does referential integrity mean?', 'Relationships must point to real rows. Fake student IDs are blocked.'],
  ['What does NOT NULL block?', 'Missing required values, such as a student without a name.'],
  ['What does UNIQUE block?', 'Duplicate values, such as two students with the same email.'],
  ['What does CHECK block?', 'Values that fail a rule, such as duration_months <= 0.'],
  ['What does DEFAULT do?', 'Fills a value automatically, such as gen_random_uuid() or CURRENT_TIMESTAMP.'],
  ['What does CRUD mean?', 'Create, Read, Update, Delete.'],
  ['How does POST map to SQL?', 'POST maps to INSERT. Example: POST /api/students inserts a student.'],
  ['How does GET map to SQL?', 'GET maps to SELECT. Example: GET /api/students selects students.'],
  ['How does PATCH map to SQL?', 'PATCH maps to UPDATE. Example: PATCH /api/students/:id updates contact fields.'],
  ['How does DELETE map to SQL?', 'DELETE maps to DELETE. Example: DELETE /api/students/:id deletes a student.'],
  ['What is DML?', 'Data Manipulation Language: INSERT, SELECT, UPDATE, DELETE.'],
  ['What is SQL injection?', 'An attack where user input is executed as SQL code.'],
  ['How does this project prevent SQL injection?', 'It uses parameterized queries with placeholders like $1 and value arrays.'],
  ['Can constraints replace parameterized queries?', 'No. Constraints validate data, but parameterized queries protect SQL execution.'],
  ['Can PostgreSQL store images?', 'Yes, using BYTEA, but this project stores file URLs instead.'],
  ['What is a migration?', 'A repeatable schema change file. Up applies a change; down reverses it.']
];

function updateMethodResult() {
  const select = document.querySelector('#methodSelect');
  const result = document.querySelector('#methodResult');
  const selected = methodMap[select.value];
  result.textContent = `${select.value} maps to SQL ${selected.sql}. ${selected.example}`;
}

function updateFlow() {
  const select = document.querySelector('#flowSelect');
  const output = document.querySelector('#flowOutput');
  output.innerHTML = flows[select.value].map((step) => `<li>${step}</li>`).join('');
}

function renderQuestions() {
  const container = document.querySelector('#practiceQuestions');
  container.innerHTML = questions.map(([question, answer], index) => `
    <details>
      <summary>${index + 1}. ${question}</summary>
      <p>${answer}</p>
    </details>
  `).join('');
}

document.querySelector('#methodSelect').addEventListener('change', updateMethodResult);
document.querySelector('#flowSelect').addEventListener('change', updateFlow);

document.querySelector('#showStudentSql').addEventListener('click', () => {
  document.querySelector('#studentSqlOutput').innerHTML = `<code>INSERT INTO students (admission_number, name, email, phone, date_of_birth)
VALUES ($1, $2, $3, $4, $5)
RETURNING *;</code>`;
});

document.querySelectorAll('[data-layer]').forEach((button) => {
  button.addEventListener('click', () => {
    document.querySelector('#layerOutput').textContent = layerText[button.dataset.layer];
  });
});

updateMethodResult();
updateFlow();
renderQuestions();
