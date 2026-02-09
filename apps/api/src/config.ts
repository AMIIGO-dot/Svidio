import dotenv from 'dotenv';
dotenv.config({ path: '../../.env' });

export const ENV = {
  PORT: parseInt(process.env.SVIDIO_API_PORT ?? '4000', 10),
  JWT_SECRET: process.env.SVIDIO_JWT_SECRET ?? 'dev-secret-change-me',
  MEETING_TTL_HOURS: parseInt(process.env.SVIDIO_MEETING_TTL_HOURS ?? '24', 10),
  WEB_ORIGIN: process.env.SVIDIO_WEB_ORIGIN ?? 'http://localhost:3000',
} as const;
