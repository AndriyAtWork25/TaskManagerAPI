// 🌌 Front End Task Manager with BASE_URL
const BASE_URL = 'http://localhost:3000';

const loginTab = document.getElementById('login-tab');
const registerTab = document.getElementById('register-tab');
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const errorMsg = document.getElementById('error-msg');
const taskSection = document.getElementById('task-section');
const taskForm = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');
const taskList = document.getElementById('task-list');
const logoutBtn = document.getElementById('logout-btn');

// 🔹 Token out of localStorage
let token = localStorage.getItem('taskToken') || null;

// 🔄 Changing tabs
loginTab.addEventListener('click', () => switchTab('login'));
registerTab.addEventListener('click', () => switchTab('register'));

function switchTab(type) {
  loginTab.classList.toggle('active', type === 'login');
  registerTab.classList.toggle('active', type === 'register');
  loginForm.classList.toggle('hidden', type !== 'login');
  registerForm.classList.toggle('hidden', type !== 'register');
  errorMsg.textContent = '';
}

function showError(message) {
  errorMsg.textContent = message;
  errorMsg.classList.add('shake');
  setTimeout(() => errorMsg.classList.remove('shake'), 500);
}

// 🔹 If token is there, show the app
if (token) {
  showApp();
}

// 🆕 Registration
registerForm.addEventListener('submit', async e => {
  e.preventDefault();
  const username = document.getElementById('register-username').value.trim();
  const email = document.getElementById('register-email').value.trim();
  const password = document.getElementById('register-password').value.trim();

  try {
    const res = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Registration error');

    // ⚡ Token now in data.data.token
    token = data.data.token;
    localStorage.setItem('taskToken', token);
    showApp();
  } catch (err) {
    showError(err.message);
  }
});

// 🔑 Login
loginForm.addEventListener('submit', async e => {
  e.preventDefault();
  const email = document.getElementById('login-email').value.trim();
  const password = document.getElementById('login-password').value.trim();

  try {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Login error');

    token = data.data.token;
    localStorage.setItem('taskToken', token);
    showApp();
  } catch (err) {
    showError(err.message);
  }
});

// 🔹 Show App
function showApp() {
  errorMsg.textContent = '';
  loginForm.classList.add('hidden');
  registerForm.classList.add('hidden');
  document.querySelector('.auth-tabs').classList.add('hidden');
  taskSection.classList.remove('hidden');
  fetchTasks();
}

// 🔹 Logout
logoutBtn.addEventListener('click', () => {
  token = null;
  localStorage.removeItem('taskToken');
  taskList.innerHTML = '';
  taskSection.classList.add('hidden');
  document.querySelector('.auth-tabs').classList.remove('hidden');
  loginForm.classList.remove('hidden');
  loginTab.classList.add('active');
  registerTab.classList.remove('active');
  errorMsg.textContent = '';
});

// ⬇ Get Tasks
async function fetchTasks() {
  if (!token) return;

  try {
    const res = await fetch(`${BASE_URL}/tasks`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Unaible to fetch tasks');
    renderTasks(data.data || []);
  } catch (err) {
    showError(err.message);
  }
}

// 🔧 Render Tasks
function renderTasks(tasks) {
  taskList.innerHTML = '';
  if (tasks.length === 0) {
    taskList.innerHTML = '<li class="no-task">No tasks</li>';
    return;
  }

  tasks.forEach(task => {
    const li = document.createElement('li');
    li.classList.add('task-item');

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = task.completed;
    checkbox.addEventListener('change', () => updateTask(task._id, checkbox.checked));

    const span = document.createElement('span');
    span.textContent = task.title;
    span.style.textDecoration = task.completed ? 'line-through' : 'none';

    const delBtn = document.createElement('button');
    delBtn.textContent = '✖';
    delBtn.className = 'del-btn';
    delBtn.addEventListener('click', () => deleteTask(task._id));

    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(delBtn);
    taskList.appendChild(li);
  });
}

// ➕ Add tasks
taskForm.addEventListener('submit', async e => {
  e.preventDefault();
  const title = taskInput.value.trim();
  if (!title) return;

  try {
    const res = await fetch(`${BASE_URL}/tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Unable to add task');

    taskInput.value = '';
    fetchTasks();
  } catch (err) {
    showError(err.message);
  }
});

// ❌ Delete task
async function deleteTask(id) {
  try {
    const res = await fetch(`${BASE_URL}/tasks/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Unable to delete task');
    fetchTasks();
  } catch (err) {
    showError(err.message);
  }
}

// 🔄 Get status task
async function updateTask(id, completed) {
  try {
    const res = await fetch(`${BASE_URL}/tasks/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ completed }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Unable to update task');
    fetchTasks();
  } catch (err) {
    showError(err.message);
  }
}

// 🔔 Easter Egg
document.addEventListener('keydown', e => {
  if (e.key === 'z' && e.ctrlKey) {
    document.body.classList.toggle('space-mode');
  }
});
