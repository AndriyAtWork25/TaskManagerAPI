// index.js
import express from 'express';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import path from 'path';
import { fileURLToPath } from 'url';

import { connectDB } from './src/db.js';
import authRouter from './src/routes/auth.js';
import tasksRouter from './src/routes/tasks.js'; 
import { errorHandler } from './src/middleware/errorHandler.js';

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

// connect to MongoDB
connectDB();

// Middleware
app.use(express.json());

// public folder
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, 'public')));

// Swagger
const swaggerDocument = YAML.load('./swagger.yaml');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Routes
app.use('/auth', authRouter);
app.use('/tasks', tasksRouter);

// Error handling middleware (should be last in the chain)
app.use(errorHandler);

// Start server
app.listen(port, () => {
  console.log(`✅ Server is running on http://localhost:${port}`);
  console.log(`📚 Swagger docs: http://localhost:${port}/api-docs`);
});
