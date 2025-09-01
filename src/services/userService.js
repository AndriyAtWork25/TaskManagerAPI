// src/services/userService.js
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user.js';

export const register = async (username, email, password) => {
  // checking if user exists
  const existingUser = await User.findOne({
    $or: [{ username }, { email }]
  });
  if (existingUser) {
    throw new Error('User with this username or email already exists');
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({ username, email, password: hashedPassword });
  await newUser.save();

  return generateToken(newUser._id);
};

export const login = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error('Invalid email or password');
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error('Invalid email or password');
  }

  return generateToken(user._id);
};

const generateToken = (userId) => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined in environment variables');
  }
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '1d' });
};
