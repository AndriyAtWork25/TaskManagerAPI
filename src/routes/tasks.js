import express from 'express';
import Task from '../models/Task.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authMiddleware);

// GET /tasks - задачі поточного користувача
router.get('/', async (req, res) => {
  const tasks = await Task.find({ user: req.user.id });
  res.json(tasks);
});

// POST /tasks - створення задачі
router.post('/', async (req, res) => {
  const { title } = req.body;
  const task = await Task.create({
    title,
    user: req.user.id,
  });
  res.status(201).json(task);
});

// PATCH /tasks/:id - зміна completed
router.patch('/:id', async (req, res) => {
  const task = await Task.findOne({ _id: req.params.id, user: req.user.id });
  if (!task) return res.status(404).json({ message: 'Not found' });

  task.completed = !task.completed;
  await task.save();
  res.json(task);
});

// DELETE /tasks/:id
router.delete('/:id', async (req, res) => {
  const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user.id });
  if (!task) return res.status(404).json({ message: 'Not found' });

  res.status(204).send();
});

export default router;
