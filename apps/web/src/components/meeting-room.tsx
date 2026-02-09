'use client';

import { useVideoRoom } from '@/hooks/use-video-room';
import { VideoTile } from './video-tile';
import { MeetingControls } from './meeting-controls';

interface MeetingRoomProps {
  token: string;
  onLeft: () => void;
}

export function MeetingRoom({ token, onLeft }: MeetingRoomProps) {
  const {
    connectionState,
    participants,
    cameraEnabled,
    micEnabled,
    localStream,
    toggleCamera,
    toggleMic,
    leave,
  } = useVideoRoom(token);

  const handleLeave = async () => {
    await leave();
    onLeft();
  };

  if (connectionState === 'connecting') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-400 text-lg">Ansluter...</p>
      </div>
    );
  }

  if (connectionState === 'disconnected') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-400 text-lg">Frånkopplad</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen">
      <div className="flex-1 p-4 md:p-8 overflow-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-5xl mx-auto">
          {participants.filter(Boolean).map((p) => (
            <VideoTile
              key={p.id}
              stream={p.isLocal ? localStream : null}
              displayName={p.displayName}
              isLocal={p.isLocal}
              videoEnabled={p.isLocal ? cameraEnabled : true}
            />
          ))}
        </div>
      </div>

      <div className="border-t border-[#333333] bg-[#1F1F1F]">
        <MeetingControls
          cameraEnabled={cameraEnabled}
          micEnabled={micEnabled}
          onToggleCamera={toggleCamera}
          onToggleMic={toggleMic}
          onLeave={handleLeave}
        />
      </div>
    </div>
  );
}
