// src/routes/tasks.js
import express from 'express';
import Task from '../models/Task.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';

const router = express.Router();

// Отримати всі задачі користувача
router.get('/', authMiddleware, async (req, res, next) => {
  try {
    const tasks = await Task.find({ user: req.user.id });
    res.json(new ApiResponse(true, 'Tasks fetched successfully', tasks));
  } catch (err) {
    next(err);
  }
});

// Додати нову задачу
router.post('/', authMiddleware, async (req, res, next) => {
  try {
    const { title } = req.body;
    if (!title || title.trim().length < 3) {
      return next(new ApiError(400, 'Task title must be at least 3 characters'));
    }

    const newTask = await Task.create({
      title: title.trim(),
      user: req.user.id,
    });

    res.status(201).json(new ApiResponse(true, 'Task created', newTask));
  } catch (err) {
    next(err);
  }
});

// Оновити статус задачі
router.patch('/:id', authMiddleware, async (req, res, next) => {
  try {
    const { completed } = req.body;
    if (typeof completed !== 'boolean') {
      return next(new ApiError(400, 'Completed must be boolean'));
    }

    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { completed },
      { new: true }
    );

    if (!task) return next(new ApiError(404, 'Task not found'));

    res.json(new ApiResponse(true, 'Task updated', task));
  } catch (err) {
    next(err);
  }
});

// Видалити задачу
router.delete('/:id', authMiddleware, async (req, res, next) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!task) return next(new ApiError(404, 'Task not found'));

    res.json(new ApiResponse(true, 'Task deleted'));
  } catch (err) {
    next(err);
  }
});

export default router;
