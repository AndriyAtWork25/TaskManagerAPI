// src/routes/tasks.js
import express from 'express';
import Task from '../models/Task.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { ApiError } from '../utils/ApiError.js'; // наш клас помилок

const router = express.Router();

/**
 * Отримати всі задачі користувача
 * GET /tasks
 */
router.get('/', authMiddleware, async (req, res, next) => {
  try {
    const tasks = await Task.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      data: tasks,
      message: 'Tasks retrieved successfully',
    });
  } catch (err) {
    next(err);
  }
});

/**
 * Додати задачу
 * POST /tasks
 */
router.post('/', authMiddleware, async (req, res, next) => {
  try {
    const { title } = req.body;

    if (!title || title.trim().length < 3) {
      return next(new ApiError(400, 'Назва задачі має містити щонайменше 3 символи'));
    }

    const newTask = await Task.create({
      title: title.trim(),
      user: req.user.id,
      completed: false,
    });

    res.status(201).json({
      success: true,
      data: newTask,
      message: 'Task created successfully',
    });
  } catch (err) {
    next(err);
  }
});

/**
 * Оновити статус задачі (completed / not completed)
 * PATCH /tasks/:id/toggle
 */
router.patch('/:id/toggle', authMiddleware, async (req, res, next) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user.id });
    if (!task) {
      return next(new ApiError(404, 'Задача не знайдена'));
    }

    task.completed = !task.completed;
    await task.save();

    res.status(200).json({
      success: true,
      data: task,
      message: 'Task status updated successfully',
    });
  } catch (err) {
    next(err);
  }
});

/**
 * Видалити задачу
 * DELETE /tasks/:id
 */
router.delete('/:id', authMiddleware, async (req, res, next) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!task) {
      return next(new ApiError(404, 'Задача не знайдена'));
    }

    res.status(200).json({
      success: true,
      data: task,
      message: 'Task deleted successfully',
    });
  } catch (err) {
    next(err);
  }
});

export default router;
