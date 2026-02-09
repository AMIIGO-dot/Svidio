export const API_ROUTES = {
  MEETINGS: '/api/meetings',
  MEETING_BY_ID: '/api/meetings/:id',
  MEETING_JOIN: '/api/meetings/:id/join',
  MEETING_VALIDATE: '/api/meetings/:id/validate',
} as const;

export const MEETING_DEFAULTS = {
  TTL_HOURS: 24,
  ID_LENGTH: 8,
  PASSWORD_MIN_LENGTH: 4,
  PASSWORD_MAX_LENGTH: 64,
  NAME_MAX_LENGTH: 100,
} as const;

export const TOKEN_DEFAULTS = {
  EXPIRY_MINUTES: 60,
} as const;
