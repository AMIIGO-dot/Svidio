import express from 'express';
import cors from 'cors';
import { ENV } from './config.js';
import { meetingRouter } from './routes/index.js';

const app = express();

app.use(cors({ origin: ENV.WEB_ORIGIN }));
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/meetings', meetingRouter);

app.listen(ENV.PORT, () => {
  console.log(`[svidio-api] Running on port ${ENV.PORT}`);
});
