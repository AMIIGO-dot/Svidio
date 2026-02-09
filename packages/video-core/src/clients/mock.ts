import type {
  Participant,
  ConnectionState,
  RoomEvent,
  VideoTrack,
} from '@svidio/types';
import type { VideoClient, RoomEventHandler } from '../types';

export class MockVideoClient implements VideoClient {
  private state: ConnectionState = 'disconnected';
  private handlers: Set<RoomEventHandler> = new Set();
  private participants: Map<string, Participant> = new Map();
  private localParticipant: Participant | null = null;
  private localStream: MediaStream | null = null;

  async connect(token: string): Promise<void> {
    this.setState('connecting');

    const participantId = `local-${Date.now()}`;
    this.localParticipant = {
      id: participantId,
      displayName: 'You',
      tracks: [],
      isLocal: true,
    };

    try {
      this.localStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      const tracks: VideoTrack[] = this.localStream.getTracks().map((t) => ({
        id: t.id,
        kind: t.kind as 'audio' | 'video',
        enabled: t.enabled,
      }));

      this.localParticipant.tracks = tracks;
    } catch {
      // Allow joining without media
    }

    this.participants.set(participantId, this.localParticipant);
    this.setState('connected');

    this.emit({
      type: 'participant-joined',
      participant: this.localParticipant,
    });

    this.simulateRemoteParticipant(token);
  }

  async disconnect(): Promise<void> {
    if (this.localStream) {
      this.localStream.getTracks().forEach((t) => t.stop());
      this.localStream = null;
    }
    this.participants.clear();
    this.localParticipant = null;
    this.setState('disconnected');
  }

  getConnectionState(): ConnectionState {
    return this.state;
  }

  getParticipants(): Participant[] {
    return Array.from(this.participants.values()).filter(Boolean);
  }

  getLocalParticipant(): Participant | null {
    return this.localParticipant;
  }

  async enableCamera(enabled: boolean): Promise<void> {
    if (!this.localStream) return;
    this.localStream.getVideoTracks().forEach((t) => {
      t.enabled = enabled;
    });
    this.updateLocalTracks();
  }

  async enableMicrophone(enabled: boolean): Promise<void> {
    if (!this.localStream) return;
    this.localStream.getAudioTracks().forEach((t) => {
      t.enabled = enabled;
    });
    this.updateLocalTracks();
  }

  getLocalStream(): MediaStream | null {
    return this.localStream;
  }

  onEvent(handler: RoomEventHandler): () => void {
    this.handlers.add(handler);
    return () => this.handlers.delete(handler);
  }

  private setState(state: ConnectionState): void {
    this.state = state;
    this.emit({ type: 'connection-state-changed' });
  }

  private emit(event: RoomEvent): void {
    this.handlers.forEach((h) => h(event));
  }

  private updateLocalTracks(): void {
    if (!this.localParticipant || !this.localStream) return;
    this.localParticipant.tracks = this.localStream.getTracks().map((t) => ({
      id: t.id,
      kind: t.kind as 'audio' | 'video',
      enabled: t.enabled,
    }));
  }

  private simulateRemoteParticipant(_token: string): void {
    // In mock mode, no real remote participants are simulated.
    // This placeholder exists for future SFU integration.
  }
}
