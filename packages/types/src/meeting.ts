export interface Meeting {
  id: string;
  createdAt: string;
  passwordHash: string | null;
  expiresAt: string | null;
  name: string | null;
}

export interface CreateMeetingRequest {
  password?: string;
  name?: string;
}

export interface CreateMeetingResponse {
  meetingId: string;
  meetingUrl: string;
  name: string | null;
  expiresAt: string | null;
}

export interface JoinMeetingRequest {
  meetingId: string;
  password?: string;
  displayName: string;
}

export interface JoinMeetingResponse {
  token: string;
  meetingId: string;
  expiresAt: string;
}

export interface ValidateMeetingResponse {
  exists: boolean;
  requiresPassword: boolean;
  name: string | null;
  expired: boolean;
}
