import type {
  ApiResponse,
  CreateMeetingRequest,
  CreateMeetingResponse,
  JoinMeetingRequest,
  JoinMeetingResponse,
  ValidateMeetingResponse,
} from '@svidio/types';
import { API } from './constants';

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });

  const body = (await res.json()) as ApiResponse<T>;

  if (body.error) {
    throw new Error(body.error.message);
  }

  return body.data as T;
}

export function createMeeting(data: CreateMeetingRequest): Promise<CreateMeetingResponse> {
  return request<CreateMeetingResponse>(API.MEETINGS, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function validateMeeting(id: string): Promise<ValidateMeetingResponse> {
  return request<ValidateMeetingResponse>(API.meetingValidate(id));
}

export function joinMeeting(data: JoinMeetingRequest): Promise<JoinMeetingResponse> {
  return request<JoinMeetingResponse>(API.meetingJoin(data.meetingId), {
    method: 'POST',
    body: JSON.stringify(data),
  });
}
