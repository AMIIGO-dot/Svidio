import { Router } from 'express';
import type { Request, Response } from 'express';
import type {
  CreateMeetingRequest,
  CreateMeetingResponse,
  JoinMeetingRequest,
  JoinMeetingResponse,
  ValidateMeetingResponse,
  ApiResponse,
} from '@svidio/types';
import { MEETING_DEFAULTS } from '@svidio/types';
import {
  createMeeting,
  getMeeting,
  verifyPassword,
  isMeetingExpired,
  createJoinToken,
} from '../services/index.js';
import { ENV } from '../config.js';

export const meetingRouter = Router();

meetingRouter.post('/', (req: Request, res: Response) => {
  const body = req.body as CreateMeetingRequest;

  if (body.password && body.password.length < MEETING_DEFAULTS.PASSWORD_MIN_LENGTH) {
    const response: ApiResponse<never> = {
      error: { code: 'INVALID_PASSWORD', message: `Password must be at least ${MEETING_DEFAULTS.PASSWORD_MIN_LENGTH} characters` },
    };
    res.status(400).json(response);
    return;
  }

  if (body.name && body.name.length > MEETING_DEFAULTS.NAME_MAX_LENGTH) {
    const response: ApiResponse<never> = {
      error: { code: 'INVALID_NAME', message: `Meeting name must be at most ${MEETING_DEFAULTS.NAME_MAX_LENGTH} characters` },
    };
    res.status(400).json(response);
    return;
  }

  const meeting = createMeeting(body.password, body.name);
  const meetingUrl = `${ENV.WEB_ORIGIN}/meeting/${meeting.id}`;

  const response: ApiResponse<CreateMeetingResponse> = {
    data: {
      meetingId: meeting.id,
      meetingUrl,
      name: meeting.name,
      expiresAt: meeting.expiresAt,
    },
  };

  res.status(201).json(response);
});

meetingRouter.get('/:id/validate', (req: Request, res: Response) => {
  const meeting = getMeeting(req.params.id);

  if (!meeting) {
    const response: ApiResponse<ValidateMeetingResponse> = {
      data: { exists: false, requiresPassword: false, name: null, expired: false },
    };
    res.json(response);
    return;
  }

  const response: ApiResponse<ValidateMeetingResponse> = {
    data: {
      exists: true,
      requiresPassword: !!meeting.passwordHash,
      name: meeting.name,
      expired: isMeetingExpired(meeting),
    },
  };
  res.json(response);
});

meetingRouter.post('/:id/join', (req: Request, res: Response) => {
  const body = req.body as JoinMeetingRequest;
  const meeting = getMeeting(req.params.id);

  if (!meeting) {
    const response: ApiResponse<never> = {
      error: { code: 'NOT_FOUND', message: 'Meeting not found' },
    };
    res.status(404).json(response);
    return;
  }

  if (isMeetingExpired(meeting)) {
    const response: ApiResponse<never> = {
      error: { code: 'EXPIRED', message: 'Meeting has expired' },
    };
    res.status(410).json(response);
    return;
  }

  if (meeting.passwordHash && !verifyPassword(meeting, body.password ?? '')) {
    const response: ApiResponse<never> = {
      error: { code: 'INVALID_PASSWORD', message: 'Incorrect password' },
    };
    res.status(403).json(response);
    return;
  }

  const { token, expiresAt } = createJoinToken(meeting.id, body.displayName);

  const response: ApiResponse<JoinMeetingResponse> = {
    data: {
      token,
      meetingId: meeting.id,
      expiresAt,
    },
  };
  res.json(response);
});
