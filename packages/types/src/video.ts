export interface VideoProvider {
  createRoom(meetingId: string): Promise<VideoRoom>;
  joinRoom(meetingId: string, participantId: string): Promise<VideoToken>;
  destroyRoom(meetingId: string): Promise<void>;
}

export interface VideoRoom {
  id: string;
  createdAt: string;
}

export interface VideoToken {
  token: string;
  expiresAt: string;
}

export interface VideoTrack {
  id: string;
  kind: VideoTrackKind;
  enabled: boolean;
}

export type VideoTrackKind = 'audio' | 'video';

export interface Participant {
  id: string;
  displayName: string;
  tracks: VideoTrack[];
  isLocal: boolean;
}

export type ConnectionState = 'disconnected' | 'connecting' | 'connected' | 'reconnecting';

export interface RoomEvent {
  type: RoomEventType;
  participant?: Participant;
  track?: VideoTrack;
}

export type RoomEventType =
  | 'participant-joined'
  | 'participant-left'
  | 'track-published'
  | 'track-unpublished'
  | 'connection-state-changed';
