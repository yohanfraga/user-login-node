import express, { Express, Request, Response, RequestHandler } from 'express';
import dotenv from 'dotenv';
import userRoutes from './modules/users/user.routes';
import { notificationMiddleware } from './middlewares/notificationMiddleware';
import { ENV, isDevelopment } from './config/environment';
import { serverSideErrorMiddleware } from './middlewares/serverSideErroMiddleware';

dotenv.config();

const app: Express = express();

// Middleware to parse JSON bodies
app.use(express.json());

if (!isDevelopment) {
  app.use(serverSideErrorMiddleware as RequestHandler);
}

app.use(notificationMiddleware as RequestHandler);

// Routes
app.use('/api/users', userRoutes);

// Healthcheck route
app.get('/healthcheck', (req: Request, res: Response) => {
  res.sendStatus(200);
});

app.listen(ENV.PORT, () => {
  console.log(`[server]: Server is running at http://localhost:${ENV.PORT}`);
  console.log(`[server]: Running in ${isDevelopment ? 'development' : 'production'} mode`);
}); 