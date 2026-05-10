const output = document.querySelector('#output');

function formToObject(form) {
  return Object.fromEntries(
    [...new FormData(form).entries()].filter(([, value]) => value !== '')
  );
}

function show(data) {
  output.textContent = JSON.stringify(data, null, 2);
}

async function api(path, options = {}) {
  const response = await fetch(path, {
    headers: { 'Content-Type': 'application/json' },
    ...options
  });

  const data = await response.json();
  if (!response.ok) {
    throw data;
  }
  return data;
}

async function handleSubmit(formId, path, method) {
  const form = document.querySelector(formId);
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    try {
      const data = await api(path(form), {
        method,
        body: JSON.stringify(formToObject(form))
      });
      show(data);
      form.reset();
    } catch (err) {
      show(err);
    }
  });
}

handleSubmit('#studentForm', () => '/api/students', 'POST');
handleSubmit('#courseForm', () => '/api/courses', 'POST');
handleSubmit('#applicationForm', () => '/api/applications', 'POST');
handleSubmit('#documentForm', () => '/api/documents', 'POST');

document.querySelector('#updateStudentForm').addEventListener('submit', async (event) => {
  event.preventDefault();
  const body = formToObject(event.target);
  const { id, ...updates } = body;

  try {
    show(await api(`/api/students/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates)
    }));
    event.target.reset();
  } catch (err) {
    show(err);
  }
});

document.querySelector('#deleteStudentForm').addEventListener('submit', async (event) => {
  event.preventDefault();
  const { id } = formToObject(event.target);

  try {
    show(await api(`/api/students/${id}`, { method: 'DELETE' }));
    event.target.reset();
  } catch (err) {
    show(err);
  }
});

document.querySelector('#searchStudentBtn').addEventListener('click', async () => {
  const value = document.querySelector('#searchAdmissionNumber').value.trim();
  if (!value) return show({ error: 'Enter an admission number' });

  try {
    show(await api(`/api/students?admission_number=${encodeURIComponent(value)}`));
  } catch (err) {
    show(err);
  }
});

document.querySelector('#listStudentsBtn').addEventListener('click', async () => {
  try {
    show(await api('/api/students'));
  } catch (err) {
    show(err);
  }
});

document.querySelector('#listApplicationsBtn').addEventListener('click', async () => {
  try {
    show(await api('/api/applications'));
  } catch (err) {
    show(err);
  }
});

document.querySelector('#listDocumentsBtn').addEventListener('click', async () => {
  try {
    show(await api('/api/documents'));
  } catch (err) {
    show(err);
  }
});
