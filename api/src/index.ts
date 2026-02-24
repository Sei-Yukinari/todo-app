import express, { Request, Response } from 'express';
import authRoutes from './presentation/routes/auth';

const app = express();
app.use(express.json());

app.get('/health', (_req: Request, res: Response) => {
  res.json({ data: 'ok' });
});

app.use('/api/auth', authRoutes);

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3001;
app.listen(PORT, '0.0.0.0', () => {
  // eslint-disable-next-line no-console
  console.log(`API listening on http://0.0.0.0:${PORT}`);
});

