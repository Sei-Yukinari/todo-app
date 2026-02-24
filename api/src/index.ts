import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import express, { Request, Response } from 'express';
import authRoutes from './presentation/routes/auth';

const app = express();
app.use(express.json());

app.get('/health', (_req: Request, res: Response) => {
  res.json({ data: 'ok' });
});

app.use('/api/auth', authRoutes);

// Global error handler to ensure we log unexpected errors and keep connection behavior consistent
app.use((err: any, _req: Request, res: Response, _next: any) => {
  console.error('[GLOBAL_ERROR_HANDLER]', err && err.stack ? err.stack : err);
  try {
    res.status(err?.status || 500).json({ error: { message: err?.message || 'Internal Server Error' } });
  } catch (e) {
    // In case response streaming failed, just log and end
    console.error('[GLOBAL_ERROR_HANDLER|RESP_FAIL]', e);
    try { res.end(); } catch {};
  }
});

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3001;
const server = app.listen(PORT, '0.0.0.0', () => {
  // eslint-disable-next-line no-console
  console.log(`API listening on http://0.0.0.0:${PORT}`);
});

// Log incoming connections and client errors to diagnose connection resets
server.on('connection', (socket: any) => {
  console.log('[SERVER] connection from', socket.remoteAddress);
});
server.on('clientError', (err: any, socket: any) => {
  console.error('[SERVER] clientError', err && err.message);
  try {
    socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
  } catch (e) {
    console.error('[SERVER] clientError ending socket', e);
  }
});

process.on('uncaughtException', (err) => {
  console.error('[UNCAUGHT_EXCEPTION]', err && err.stack ? err.stack : err);
});
process.on('unhandledRejection', (reason) => {
  console.error('[UNHANDLED_REJECTION]', reason);
});

