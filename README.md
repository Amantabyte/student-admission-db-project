# Student Admission DB Project

![Node.js](https://img.shields.io/badge/Node.js-learning_project-339933)
![Express](https://img.shields.io/badge/Express-REST_API-111111)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-database-336791)
![SQL](https://img.shields.io/badge/SQL-DML_and_schema-0f766e)
![Learning Project](https://img.shields.io/badge/Purpose-beginner_friendly-d97706)

A complete beginner-friendly full-stack learning project that demonstrates how frontend, backend, REST APIs, and PostgreSQL work together.

Repository: <https://github.com/Amantabyte/student-admission-db-project>

## Features

- Student CRUD: create, read, update, delete students.
- Course CRUD: create, read, update, delete courses.
- Application creation and status update.
- Document URL storage for student files.
- PostgreSQL relational schema.
- UUID primary keys with `gen_random_uuid()`.
- Foreign keys and referential integrity.
- Constraints: `PRIMARY KEY`, `FOREIGN KEY`, `NOT NULL`, `UNIQUE`, `CHECK`, `DEFAULT`.
- Migrations with up scripts and down scripts.
- Parameterized SQL queries using `$1`, `$2`, `$3`.
- Educational learning page with diagrams and interactive demos.

## Tech Stack

- Node.js
- Express.js
- PostgreSQL
- `pg` package for database access
- Plain HTML, CSS, and JavaScript
- SQL migration files
- `.env` environment variables

## Project Structure

```text
student-admission-db-project/
  README.md
  package.json
  package-lock.json
  .gitignore
  .env.example
  server.js
  db/
    connection.js
    schema.sql
    seed.sql
    migrations/
      001_create_students_up.sql
      001_create_students_down.sql
      002_create_courses_up.sql
      002_create_courses_down.sql
      003_create_applications_up.sql
      003_create_applications_down.sql
      004_create_documents_up.sql
      004_create_documents_down.sql
  routes/
    students.js
    courses.js
    applications.js
    documents.js
  public/
    index.html
    app.js
    styles.css
    docs.html
    learning/
      index.html
      styles.css
      app.js
      assets/
  scripts/
    run-sql.js
```

## Database Concepts Covered

- Relational schema design
- ERD and table relationships
- Primary keys
- Foreign keys
- Referential integrity
- UUID as a 128-bit identifier
- Distributed system ID generation
- CRUD operations
- DML: `INSERT`, `SELECT`, `UPDATE`, `DELETE`
- REST API to SQL mapping
- SQL injection prevention
- PostgreSQL document/image storage approach
- Migrations
- Up scripts and down scripts

## REST API to SQL Mapping

| CRUD | REST Method | SQL Command | Project Example |
|---|---|---|---|
| Create | `POST` | `INSERT` | `POST /api/students` |
| Read | `GET` | `SELECT` | `GET /api/students` |
| Update | `PATCH` / `PUT` | `UPDATE` | `PATCH /api/students/:id` |
| Delete | `DELETE` | `DELETE` | `DELETE /api/students/:id` |

## Setup Instructions

## Prerequisites: What You Need Before Running the Project

The standalone learning guide does not require setup. The real runnable project requires Git, Node.js, npm, PostgreSQL, the `psql` command-line tool, VS Code, and a browser.

Check your tools:

```bash
git --version
node -v
npm -v
psql --version
createdb --version
```

Git clones the project from GitHub. Node.js runs the backend JavaScript server. npm installs project packages. PostgreSQL stores the data. `psql` runs SQL files from the terminal. VS Code is recommended for reading and editing files. A browser opens the frontend and learning guide.

If a command says `command not found`, install that tool or add it to your PATH.

### Fedora / Linux Installation

```bash
sudo dnf install git
sudo dnf install nodejs npm
sudo dnf install postgresql postgresql-server postgresql-contrib
sudo postgresql-setup --initdb
sudo systemctl start postgresql
sudo systemctl enable postgresql
psql --version
sudo -u postgres psql
ALTER USER postgres WITH PASSWORD 'your_new_password';
\q
```

### Ubuntu / Debian Installation

```bash
sudo apt update
sudo apt install git nodejs npm postgresql postgresql-contrib
sudo systemctl start postgresql
sudo -u postgres psql
ALTER USER postgres WITH PASSWORD 'your_new_password';
\q
```

### Windows Installation

- Install Git from the official Git website.
- Install Node.js LTS from the official Node.js website.
- Install PostgreSQL from the official PostgreSQL installer.
- During PostgreSQL installation, remember the password for user `postgres`.
- Use pgAdmin or SQL Shell `psql` for database checks.
- Use Git Bash or the VS Code terminal for project commands.

### 1. Clone the Repository

```bash
git clone https://github.com/Amantabyte/student-admission-db-project.git
cd student-admission-db-project
```

Explanation: downloads the project files from GitHub and enters the project folder.

### 2. Install Dependencies

```bash
npm install
```

Explanation: installs all Node.js dependencies listed in `package.json`, including Express, `pg`, dotenv, CORS, and Nodemon.

### 3. Create PostgreSQL Database

```bash
createdb student_admission_db
```

Explanation: creates a PostgreSQL database where project data will be stored.

If `createdb` is not available, use:

```bash
psql -U postgres
CREATE DATABASE student_admission_db;
\q
```

## Environment Variables

Create your local `.env` file:

```bash
cp .env.example .env
```

Explanation: copies the example environment file into a real local config file.

Example `.env`:

```env
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=student_admission_db
DB_USER=postgres
DB_PASSWORD=your_password_here
```

Optional alternative:

```env
DATABASE_URL=postgres://postgres:your_password_here@localhost:5432/student_admission_db
```

Do not commit `.env`. Commit `.env.example`.

## PostgreSQL Password Guide

Your real PostgreSQL password is the password set for your PostgreSQL user, usually `postgres`.

Try:

```bash
psql -U postgres
```

It will ask for a password. If login works, use that password in `.env`.

If `psql: command not found` appears, PostgreSQL CLI is not installed or not available in PATH. On Fedora:

```bash
sudo dnf install postgresql postgresql-server postgresql-contrib
psql --version
```

If the password is forgotten:

```bash
sudo -u postgres psql
ALTER USER postgres WITH PASSWORD 'new_password_here';
\q
```

Example `.env`:

```env
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=student_admission_db
DB_USER=postgres
DB_PASSWORD=your_real_postgres_password
```

Optional:

```env
DATABASE_URL=postgres://postgres:your_real_postgres_password@localhost:5432/student_admission_db
```

Never commit `.env`; it contains local secrets. Commit `.env.example` so other people know which variables they need.

## Database Setup

Run the full schema:

```bash
npm run migrate:up
```

Explanation: runs `db/schema.sql` through `scripts/run-sql.js` and creates all tables.

Manual alternative:

```bash
psql -d student_admission_db -f db/schema.sql
```

Optional seed data:

```bash
npm run seed
```

Explanation: inserts sample students, courses, one application, and one document row.

Manual seed alternative:

```bash
psql -d student_admission_db -f db/seed.sql
```

Manual migration files:

```bash
psql -d student_admission_db -f db/migrations/001_create_students_up.sql
psql -d student_admission_db -f db/migrations/002_create_courses_up.sql
psql -d student_admission_db -f db/migrations/003_create_applications_up.sql
psql -d student_admission_db -f db/migrations/004_create_documents_up.sql
```

Rollback order:

```bash
psql -d student_admission_db -f db/migrations/004_create_documents_down.sql
psql -d student_admission_db -f db/migrations/003_create_applications_down.sql
psql -d student_admission_db -f db/migrations/002_create_courses_down.sql
psql -d student_admission_db -f db/migrations/001_create_students_down.sql
```

## Running the Project

Start normally:

```bash
npm start
```

Explanation: starts the Express server using `node server.js`.

Start in development mode:

```bash
npm run dev
```

Explanation: starts the server with Nodemon, which restarts automatically when files change.

Open:

- App: <http://localhost:3000>
- Learning page: <http://localhost:3000/learning/index.html>
- Quick docs: <http://localhost:3000/docs.html>
- Health check: <http://localhost:3000/api/health>

## Learning Page

The full educational website is here:

```text
public/learning/index.html
```

When the server is running, open:

```text
http://localhost:3000/learning/index.html
```

It includes:

- GitHub repository link
- setup guide
- project learning path
- architecture diagrams
- ERD diagram
- UUID and distributed systems explanation
- REST to SQL mapping
- SQL injection examples
- migration explanation
- interactive mini demos
- practice questions

## API Routes

### Students

- `POST /api/students`
- `GET /api/students`
- `GET /api/students?admission_number=A1001`
- `GET /api/students/:id`
- `PATCH /api/students/:id`
- `PUT /api/students/:id`
- `DELETE /api/students/:id`

### Courses

- `POST /api/courses`
- `GET /api/courses`
- `GET /api/courses/:id`
- `PATCH /api/courses/:id`
- `DELETE /api/courses/:id`

### Applications

- `POST /api/applications`
- `GET /api/applications`
- `GET /api/applications/:id`
- `PATCH /api/applications/:id/status`
- `DELETE /api/applications/:id`

### Documents

- `POST /api/documents`
- `GET /api/documents`
- `GET /api/documents/student/:studentId`
- `DELETE /api/documents/:id`

## API Examples

Create a student:

```bash
curl -X POST http://localhost:3000/api/students \
  -H "Content-Type: application/json" \
  -d '{
    "admission_number": "A1003",
    "name": "Neha Verma",
    "email": "neha.verma@example.com",
    "phone": "9876543212",
    "date_of_birth": "2004-08-15"
  }'
```

Search by admission number:

```bash
curl "http://localhost:3000/api/students?admission_number=A1001"
```

Update application status:

```bash
curl -X PATCH http://localhost:3000/api/applications/APPLICATION_UUID/status \
  -H "Content-Type: application/json" \
  -d '{ "status": "accepted" }'
```

## Screenshots / Diagrams Note

The learning page uses SVG diagrams stored in:

```text
public/learning/assets/
```

SVG files stay sharp at any screen size and can be edited directly as code.

## Common Mistakes

### `psql` command not found

Fix: PostgreSQL may not be installed, or its `bin` folder is not in your PATH.

### Database connection failed

Fix: check `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `DB_HOST`, and `DB_PORT` in `.env`.

### `relation "students" does not exist`

Fix: run the schema or migrations before starting the app.

```bash
npm run migrate:up
```

### Port 3000 already in use

Fix: stop the process using port 3000, or change `PORT` in `.env`.

```env
PORT=3001
```

### Duplicate student or course errors

Fix: `admission_number`, `email`, and course `code` are unique. Use a new value.

## GitHub Upload Commands

If this folder is not already a Git repository:

```bash
git init
git add .
git commit -m "Initial commit: student admission database learning project"
git branch -M main
git remote add origin https://github.com/Amantabyte/student-admission-db-project.git
git push -u origin main
```

If the wrong remote already exists:

```bash
git remote -v
git remote remove origin
git remote add origin https://github.com/Amantabyte/student-admission-db-project.git
```

If a commit already exists:

```bash
git status
git add .
git commit -m "Update project documentation and learning pack"
git push
```

Important:

- Do not commit `.env`.
- Commit `.env.example`.
- Do not commit `node_modules`.
- Keep `.gitignore` in the repository.
- Keep `README.md` accurate because GitHub displays it first.

## How to Test Before Sharing

Test both the real runnable project and the standalone learning ZIP folder.

### A. Test the Real Project

1. Check dependencies install:

```bash
npm install
```

2. Check `.env` exists and contains `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, and `DB_PASSWORD`.

3. Check PostgreSQL is running.

4. Check database list:

```bash
psql -l
```

5. Create database if missing:

```bash
createdb student_admission_db
```

6. Run schema:

```bash
psql -d student_admission_db -f db/schema.sql
```

7. Optional seed:

```bash
psql -d student_admission_db -f db/seed.sql
```

8. Start server:

```bash
npm run dev
```

9. Open and test pages:

- <http://localhost:3000>
- <http://localhost:3000/docs.html>
- <http://localhost:3000/learning/index.html>

10. Test main CRUD manually:

- Create a student.
- Search student by admission number.
- Update student phone/email.
- Delete student.
- Create a course.
- Create an application.
- Update application status.

11. Test API using curl:

```bash
curl -X POST http://localhost:3000/api/students \
  -H "Content-Type: application/json" \
  -d "{\"admission_number\":\"A1001\",\"name\":\"Aman Sharma\",\"email\":\"aman@example.com\",\"phone\":\"9876543210\"}"

curl http://localhost:3000/api/students

curl "http://localhost:3000/api/students?admission_number=A1001"
```

### B. Test the Standalone Learning Pack

1. Open:

```text
student-admission-learning-pack/index.html
```

2. Confirm CSS loads, images load, GitHub buttons work, navigation works, interactive demos work, setup commands are readable, and no asset paths are broken.

3. Temporarily move the folder outside the project and open `index.html` again. This confirms it is truly standalone.

## Standalone Learning ZIP

Folder to zip and send:

```text
student-admission-learning-pack/
```

File the receiver opens:

```text
student-admission-learning-pack/index.html
```

The receiver does not need Node.js or PostgreSQL to read the guide. They need setup only if they want to run the real project.

Zip command:

```bash
zip -r student-admission-learning-pack.zip student-admission-learning-pack/
```

## Future Improvements

- Add automated API tests.
- Add a real migration tracker table.
- Add authentication and roles.
- Add file upload support with object storage.
- Add pagination and filtering.
- Add frontend validation messages.
- Add Docker Compose for PostgreSQL and Node.js.
