import express from 'express';
import Task from '../models/Task.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// Отримати задачі
router.get('/', authMiddleware, async (req, res, next) => {
  try {
    console.log('📥 GET /tasks → user:', req.user);
    const tasks = await Task.find({ user: req.user.id });
    res.json(tasks);
  } catch (err) {
    console.error('❌ Помилка при отриманні задач:', err);
    next(err);
  }
});

// Додати задачу
router.post('/', authMiddleware, async (req, res, next) => {
  try {
    const { title } = req.body;
    console.log('📥 POST /tasks → title:', title, 'user:', req.user);

    const newTask = await Task.create({
      title,
      user: req.user.id,
    });

    res.status(201).json(newTask);
  } catch (err) {
    console.error('❌ Помилка при створенні задачі:', err);
    next(err);
  }
});

// Видалити задачу
router.delete('/:id', authMiddleware, async (req, res, next) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!task) return res.status(404).json({ message: 'Задача не знайдена' });

    res.json({ message: 'Задача видалена' });
  } catch (err) {
    console.error('❌ Помилка при видаленні задачі:', err);
    next(err);
  }
});

export default router;
