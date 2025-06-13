import fs from 'fs';

const TASKS_FILE = './tasks.json';

// Зчитати всі задачі з файлу
export function loadTasks() {
  try {
    const data = fs.readFileSync(TASKS_FILE, 'utf8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

// Записати задачі у файл
export function saveTasks(tasks) {
  fs.writeFileSync(TASKS_FILE, JSON.stringify(tasks, null, 2));
}

// Знайти задачу за id
export function findTaskById(id) {
  const tasks = loadTasks();
  return tasks.find(t => t.id === id);
}

// Оновити задачу по id
export function updateTask(id, updates) {
  const tasks = loadTasks();
  const taskIndex = tasks.findIndex(t => t.id === id);
  if (taskIndex === -1) return null;

  tasks[taskIndex] = { ...tasks[taskIndex], ...updates };
  saveTasks(tasks);

  return tasks[taskIndex];
}

// Видалити задачу по id
export function deleteTask(id) {
  const tasks = loadTasks();
  const index = tasks.findIndex(t => t.id === id);
  if (index === -1) return false;

  tasks.splice(index, 1);
  saveTasks(tasks);

  return true;
}
