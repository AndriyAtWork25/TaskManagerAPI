// index.js
import express from 'express';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import path from 'path';
import { fileURLToPath } from 'url';

import { connectDB } from './src/db.js';
import authRouter from './src/routes/auth.js';
import { errorHandler } from './src/middleware/errorHandler.js';

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

// Підключення до MongoDB
connectDB();

// Middleware
app.use(express.json());

// Публічна папка
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, 'public')));

// Swagger
const swaggerDocument = YAML.load('./swagger.yaml');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Маршрути
app.use('/auth', authRouter);

// Обробка помилок
app.use(errorHandler);

app.listen(port, () => {
  console.log(`✅ Server is running on http://localhost:${port}`);
  console.log(`📚 Swagger docs: http://localhost:${port}/api-docs`);
});
