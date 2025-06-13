// src/routes/auth.js
import express from 'express';
import { register, login } from '../services/userService.js';

const router = express.Router();

router.post('/register', async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Username, email and password are required' });
    }

    const token = await register(username, email, password);
    res.status(201).json({ token });
  } catch (err) {
    console.error('Register error:', err.message);
    next(err);
  }
});

router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const token = await login(email, password);
    res.json({ token });
  } catch (err) {
    console.error('Login error:', err.message);
    next(err);
  }
});

export default router;
