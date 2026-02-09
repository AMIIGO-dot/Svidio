import type { VideoProvider, VideoRoom, VideoToken } from '@svidio/types';

const mockRooms = new Map<string, VideoRoom>();

export class MockVideoProvider implements VideoProvider {
  async createRoom(meetingId: string): Promise<VideoRoom> {
    const room: VideoRoom = {
      id: meetingId,
      createdAt: new Date().toISOString(),
    };
    mockRooms.set(meetingId, room);
    return room;
  }

  async joinRoom(meetingId: string, participantId: string): Promise<VideoToken> {
    const room = mockRooms.get(meetingId);
    if (!room) {
      throw new Error(`Room ${meetingId} not found`);
    }
    return {
      token: `mock-token-${meetingId}-${participantId}-${Date.now()}`,
      expiresAt: new Date(Date.now() + 3600_000).toISOString(),
    };
  }

  async destroyRoom(meetingId: string): Promise<void> {
    mockRooms.delete(meetingId);
  }
}
