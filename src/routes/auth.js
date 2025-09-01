// src/routes/auth.js
import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';

const router = express.Router();

/**
 * Registrate new user
 * POST /auth/register
 * body: { username, email, password }
 */
router.post('/register', async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return next(new ApiError(400, 'Username, email and password are required'));
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(new ApiError(400, 'User already exists'));
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({ username, email, password: hashedPassword });

    // Generate token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(201).json(
      new ApiResponse(true, 'User registered successfully', {
        token,
        user: { id: user._id, username: user.username, email: user.email }
      })
    );
  } catch (err) {
    next(err);
  }
});

/**
 * Login user
 * POST /auth/login
 * body: { email, password }
 */
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new ApiError(400, 'Email and password are required'));
    }

    const user = await User.findOne({ email });
    if (!user) {
      return next(new ApiError(401, 'Invalid credentials'));
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return next(new ApiError(401, 'Invalid credentials'));
    }

    // Generate token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json(
      new ApiResponse(true, 'Login successful', {
        token,
        user: { id: user._id, username: user.username, email: user.email }
      })
    );
  } catch (err) {
    next(err);
  }
});

export default router;
