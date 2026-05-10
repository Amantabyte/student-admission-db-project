INSERT INTO students (admission_number, name, email, phone, date_of_birth)
VALUES
  ('A1001', 'Anita Sharma', 'anita.sharma@example.com', '9876543210', '2004-05-12'),
  ('A1002', 'Rahul Mehta', 'rahul.mehta@example.com', '9876543211', '2003-11-23')
ON CONFLICT (admission_number) DO NOTHING;

INSERT INTO courses (name, code, duration_months)
VALUES
  ('Bachelor of Computer Applications', 'BCA', 36),
  ('Bachelor of Business Administration', 'BBA', 36),
  ('Diploma in Data Analytics', 'DDA', 12)
ON CONFLICT (code) DO NOTHING;

INSERT INTO applications (student_id, course_id, status)
SELECT s.id, c.id, 'pending'
FROM students s
JOIN courses c ON c.code = 'BCA'
WHERE s.admission_number = 'A1001'
ON CONFLICT (student_id, course_id) DO NOTHING;

INSERT INTO documents (student_id, file_name, file_url)
SELECT s.id, 'marksheet.pdf', 'https://example.com/documents/marksheet.pdf'
FROM students s
WHERE s.admission_number = 'A1001'
  AND NOT EXISTS (
    SELECT 1
    FROM documents d
    WHERE d.student_id = s.id
      AND d.file_name = 'marksheet.pdf'
  );
