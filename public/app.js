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

// Переключення табів
loginTab.addEventListener('click', () => {
  loginTab.classList.add('active');
  registerTab.classList.remove('active');
  loginForm.classList.remove('hidden');
  registerForm.classList.add('hidden');
  errorMsg.textContent = '';
});

registerTab.addEventListener('click', () => {
  registerTab.classList.add('active');
  loginTab.classList.remove('active');
  registerForm.classList.remove('hidden');
  loginForm.classList.add('hidden');
  errorMsg.textContent = '';
});

// Функція для показу помилки
function showError(message) {
  errorMsg.textContent = message;
}

// Реєстрація користувача
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

    if (!res.ok) {
      const errData = await res.json();
      throw new Error(errData.message || 'Помилка реєстрації');
    }

    const data = await res.json();
    token = data.token;
    showApp();
  } catch (err) {
    showError(err.message);
  }
});


// Логін користувача
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

    if (!res.ok) {
      const errData = await res.json();
      throw new Error(errData.message || 'Помилка входу');
    }

    const data = await res.json();
    token = data.token;
    showApp();
  } catch (err) {
    showError(err.message);
  }
});


// Показуємо інтерфейс задач
function showApp() {
  errorMsg.textContent = '';
  loginForm.classList.add('hidden');
  registerForm.classList.add('hidden');
  document.querySelector('.auth-tabs').classList.add('hidden');
  taskSection.classList.remove('hidden');
  fetchTasks();
}

// Вийти
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

// Отримання задач
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

// Відмалювати список задач
function renderTasks(tasks) {
  taskList.innerHTML = '';
  if (tasks.length === 0) {
    taskList.innerHTML = '<li>Задач немає</li>';
    return;
  }

  tasks.forEach(task => {
    const li = document.createElement('li');
    li.textContent = task.title;

    const delBtn = document.createElement('button');
    delBtn.textContent = 'Видалити';
    delBtn.addEventListener('click', () => deleteTask(task._id));

    li.appendChild(delBtn);
    taskList.appendChild(li);
  });
}

// Додати задачу
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

    const newTask = await res.json();
    taskInput.value = '';
    fetchTasks();
  } catch (err) {
    showError(err.message);
  }
});

// Видалити задачу
async function deleteTask(id) {
  try {
    const res = await fetch(`/tasks/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) throw new Error('Не вдалося видалити задачу');

    fetchTasks();
  } catch (err) {
    showError(err.message);
  }
}
