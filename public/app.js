// 🌌 Розширений та анімований футуристичний фронтенд для Task Manager

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

let token = null;

// 🔄 Переключення табів з анімацією
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

// 🆕 Реєстрація користувача
registerForm.addEventListener('submit', async e => {
  e.preventDefault();
  const username = document.getElementById('register-username').value.trim();
  const email = document.getElementById('register-email').value.trim();
  const password = document.getElementById('register-password').value.trim();
  try {
    const res = await fetch('/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password }),
    });
    if (!res.ok) throw new Error((await res.json()).message || 'Помилка реєстрації');
    token = (await res.json()).token;
    showApp();
  } catch (err) {
    showError(err.message);
  }
});

// 🔑 Логін користувача
loginForm.addEventListener('submit', async e => {
  e.preventDefault();
  const email = document.getElementById('login-email').value.trim();
  const password = document.getElementById('login-password').value.trim();
  try {
    const res = await fetch('/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) throw new Error((await res.json()).message || 'Помилка входу');
    token = (await res.json()).token;
    showApp();
  } catch (err) {
    showError(err.message);
  }
});

function showApp() {
  errorMsg.textContent = '';
  loginForm.classList.add('hidden');
  registerForm.classList.add('hidden');
  document.querySelector('.auth-tabs').classList.add('hidden');
  taskSection.classList.remove('hidden');
  fetchTasks();
}

logoutBtn.addEventListener('click', () => {
  token = null;
  taskList.innerHTML = '';
  taskSection.classList.add('hidden');
  document.querySelector('.auth-tabs').classList.remove('hidden');
  loginForm.classList.remove('hidden');
  loginTab.classList.add('active');
  registerTab.classList.remove('active');
  errorMsg.textContent = '';
});

// ⬇️ Отримання задач
async function fetchTasks() {
  try {
    const res = await fetch('/tasks', {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('Не вдалося завантажити задачі');
    const tasks = await res.json();
    renderTasks(tasks);
  } catch (err) {
    showError(err.message);
  }
}

function renderTasks(tasks) {
  taskList.innerHTML = '';
  if (tasks.length === 0) {
    taskList.innerHTML = '<li class="no-task">Задач немає</li>';
    return;
  }
  tasks.forEach(task => {
    const li = document.createElement('li');
    li.innerHTML = `<span>${task.title}</span>`;

    const delBtn = document.createElement('button');
    delBtn.textContent = '✖';
    delBtn.className = 'del-btn';
    delBtn.addEventListener('click', () => deleteTask(task._id));

    li.appendChild(delBtn);
    li.classList.add('task-item');
    taskList.appendChild(li);
  });
}

// ➕ Додавання задачі
taskForm.addEventListener('submit', async e => {
  e.preventDefault();
  const title = taskInput.value.trim();
  if (!title) return;
  try {
    const res = await fetch('/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title }),
    });
    if (!res.ok) throw new Error('Не вдалося додати задачу');
    taskInput.value = '';
    fetchTasks();
  } catch (err) {
    showError(err.message);
  }
});

// ❌ Видалення задачі
async function deleteTask(id) {
  try {
    const res = await fetch(`/tasks/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('Не вдалося видалити задачу');
    fetchTasks();
  } catch (err) {
    showError(err.message);
  }
}

// 🔔 Easter Egg (космічна тема)
document.addEventListener('keydown', e => {
  if (e.key === 'z' && e.ctrlKey) {
    document.body.classList.toggle('space-mode');
  }
});
