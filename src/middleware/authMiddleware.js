import jwt from 'jsonwebtoken';

export function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    console.warn('⛔️ Відсутній Authorization Header');
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // ⬅️ отримаємо { id, username }
    console.log('🔐 Authenticated user:', req.user);
    next();
  } catch (err) {
    console.error('❌ Invalid token:', err);
    return res.status(401).json({ message: 'Invalid token' });
  }
}


