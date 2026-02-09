const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';

export const API = {
  BASE: API_BASE,
  MEETINGS: `${API_BASE}/api/meetings`,
  meetingValidate: (id: string) => `${API_BASE}/api/meetings/${id}/validate`,
  meetingJoin: (id: string) => `${API_BASE}/api/meetings/${id}/join`,
} as const;

export const COPY_FEEDBACK_MS = 2000;
