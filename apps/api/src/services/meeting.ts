import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';
import { getDb } from '../db.js';
import { ENV } from '../config.js';
import type { Meeting } from '@svidio/types';

interface MeetingRow {
  id: string;
  name: string | null;
  password_hash: string | null;
  created_at: string;
  expires_at: string | null;
}

export function createMeeting(password?: string, name?: string): Meeting {
  const db = getDb();
  const id = uuidv4().slice(0, 8);
  const passwordHash = password ? bcrypt.hashSync(password, 10) : null;
  const expiresAt = new Date(
    Date.now() + ENV.MEETING_TTL_HOURS * 3600_000
  ).toISOString();

  db.prepare(
    `INSERT INTO meetings (id, name, password_hash, expires_at) VALUES (?, ?, ?, ?)`
  ).run(id, name ?? null, passwordHash, expiresAt);

  return {
    id,
    name: name ?? null,
    createdAt: new Date().toISOString(),
    passwordHash,
    expiresAt,
  };
}

export function getMeeting(id: string): Meeting | null {
  const db = getDb();
  const row = db
    .prepare(`SELECT * FROM meetings WHERE id = ?`)
    .get(id) as MeetingRow | undefined;

  if (!row) return null;

  return {
    id: row.id,
    name: row.name,
    createdAt: row.created_at,
    passwordHash: row.password_hash,
    expiresAt: row.expires_at,
  };
}

export function verifyPassword(meeting: Meeting, password: string): boolean {
  if (!meeting.passwordHash) return true;
  return bcrypt.compareSync(password, meeting.passwordHash);
}

export function isMeetingExpired(meeting: Meeting): boolean {
  if (!meeting.expiresAt) return false;
  return new Date(meeting.expiresAt) < new Date();
}
