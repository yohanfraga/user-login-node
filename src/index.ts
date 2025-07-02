import express, { Express, Request, Response, RequestHandler } from 'express';
import swaggerUi from 'swagger-ui-express';
import dotenv from 'dotenv';
import userRoutes from './modules/users/user.routes';
import authRoutes from './modules/auth/auth.routes';
import roleRoutes from './modules/roles/role.routes';
import { notificationMiddleware } from './middlewares/notificationMiddleware';
import { ENV, isDevelopment } from './config/environment';
import { serverSideErrorMiddleware } from './middlewares/serverSideErroMiddleware';
import { swaggerSpec } from './config/swagger';

dotenv.config();

const app: Express = express();

// Middleware to parse JSON bodies
app.use(express.json());

if (!isDevelopment) {
  app.use(serverSideErrorMiddleware as RequestHandler);
}

app.use(notificationMiddleware as RequestHandler);

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/roles', roleRoutes);

// Healthcheck route
app.get('/healthcheck', (req: Request, res: Response) => {
  res.sendStatus(200);
});

app.listen(ENV.PORT, () => {
  console.log(`[server]: Server is running at http://localhost:${ENV.PORT}`);
  console.log(`[server]: API Documentation available at http://localhost:${ENV.PORT}/api-docs`);
  console.log(`[server]: Running in ${isDevelopment ? 'development' : 'production'} mode`);
}); 