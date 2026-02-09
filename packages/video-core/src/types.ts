import type {
  VideoProvider,
  VideoRoom,
  VideoToken,
  Participant,
  ConnectionState,
  RoomEvent,
} from '@svidio/types';

export type RoomEventHandler = (event: RoomEvent) => void;

export interface VideoClient {
  connect(token: string): Promise<void>;
  disconnect(): Promise<void>;
  getConnectionState(): ConnectionState;
  getParticipants(): Participant[];
  getLocalParticipant(): Participant | null;
  enableCamera(enabled: boolean): Promise<void>;
  enableMicrophone(enabled: boolean): Promise<void>;
  onEvent(handler: RoomEventHandler): () => void;
}

export type { VideoProvider, VideoRoom, VideoToken };
