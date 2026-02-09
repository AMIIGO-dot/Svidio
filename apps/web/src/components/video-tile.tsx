'use client';

import { useRef, useEffect } from 'react';

interface VideoTileProps {
  stream: MediaStream | null;
  displayName: string;
  isLocal?: boolean;
  videoEnabled?: boolean;
}

export function VideoTile({ stream, displayName, isLocal, videoEnabled = true }: VideoTileProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <div className="relative bg-[#2A2A2A] rounded-2xl overflow-hidden aspect-video w-full">
      {stream && videoEnabled ? (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted={isLocal}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <div className="w-20 h-20 rounded-full bg-[#3A3A3A] flex items-center justify-center">
            <span className="text-2xl font-semibold text-gray-400">
              {displayName.charAt(0).toUpperCase()}
            </span>
          </div>
        </div>
      )}
      <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm rounded-lg px-3 py-1">
        <span className="text-sm text-white">
          {isLocal ? `${displayName} (du)` : displayName}
        </span>
      </div>
    </div>
  );
}
