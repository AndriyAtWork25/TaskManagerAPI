const express = require('express');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');

const app = express();
const port = 3000;

app.use(bodyParser.json());

let tasks = [];

app.get('/', (_req, res) => {
  res.send('Task Manager API is running');
});

app.get('/tasks', (_req, res) => {
  res.json(tasks);
});

app.post('/tasks', (req, res) => {
  const { title } = req.body;

  if (!title || typeof title !== 'string') {
    return res.status(400).json({ error: 'Title is required and must be a string' });
  }

  const newTask = {
    id: uuidv4(),
    title,
    completed: false,
  };

  tasks.push(newTask);
  res.status(201).json(newTask);
});

app.patch('/tasks/:id', (req, res) => {
  const { id } = req.params;

  const task = tasks.find(t => t.id === id);

  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }

  task.completed = !task.completed;

  return res.json(task);
});

app.delete('/tasks/:id', (req, res) => {
  const { id } = req.params;

  const taskIndex = tasks.findIndex(t => t.id === id);

  if (taskIndex === -1) {
    return res.status(404).json({ error: 'Task not found' });
  }

  tasks.splice(taskIndex, 1);

  return res.status(204).send();
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
