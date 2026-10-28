import express from 'express';
import { StatusCodes } from 'http-status-codes';
import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

import connectDB from './config/dbConfig.js';
import { PORT } from './config/serverConfig.js';
import apiRouter from './routes/apiRoutes.js';
// FIX 1: Import the missing publicationsRouter
import publicationsRouter from './routes/publications.js'; 

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Swagger configuration options
const swaggerOptions = {
  // FIX 2: Use modern 'definition' object with required 'openapi' property
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Publication API',
      description: 'CRUD API for managing publications',
      version: '1.0.0',
    },
    servers: [
      {
        url: `http://localhost:${PORT || 3000}`,
        description: 'Development Server',
      },
    ],
  },
  apis: ['./routes/*.js'], // Path to the API routes folder
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Routes
app.use('/publications', publicationsRouter);
app.use('/api', apiRouter);

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Check system health
 *     responses:
 *       200:
 *         description: Server is online and responding.
 */
app.get('/health', (req, res) => {
  return res.status(StatusCodes.OK).json({
    message: 'pong',
  });
});

app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Swagger UI available at http://localhost:${PORT}/api-docs`);
  await connectDB();
});
