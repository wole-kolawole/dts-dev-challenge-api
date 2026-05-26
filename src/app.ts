import cors from 'cors';
import express from 'express';
import tasksRouter from './routes/tasks';
import { errorHandler } from './middleware/errorHandler';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (_req, res) => {
  res.json({ message: 'DTS Task Manager API' });
});

app.use('/api/tasks', tasksRouter);

app.use(errorHandler);

export default app;
