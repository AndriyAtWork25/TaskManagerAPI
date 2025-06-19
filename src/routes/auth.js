// src/routes/auth.js
import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';

const router = express.Router();

// Створення JWT токена
function createToken(user) {
  return jwt.sign(
    { id: user._id, username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );
}

// Реєстрація
router.post('/register', async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    // Валідація
    if (!username || username.trim().length < 2) {
      return res.status(400).json({ message: 'Імʼя користувача надто коротке' });
    }

    if (!email || !email.includes('@')) {
      return res.status(400).json({ message: 'Некоректна email адреса' });
    }

    if (!password || password.length < 6) {
      return res.status(400).json({ message: 'Пароль має бути щонайменше 6 символів' });
    }

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Email вже зареєстрований' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ username, email, password: hashedPassword });

    const token = createToken(user);
    res.json({ token });
  } catch (err) {
    next(err);
  }
});

// Логін
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Введіть email і пароль' });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Невірна пошта або пароль' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Невірна пошта або пароль' });

    const token = createToken(user);
    res.json({ token });
  } catch (err) {
    next(err);
  }
});

export default router;
