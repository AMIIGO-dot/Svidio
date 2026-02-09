'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import type { ConnectionState, Participant } from '@svidio/types';
import { MockVideoClient } from '@svidio/video-core';
import type { VideoClient } from '@svidio/video-core';

export function useVideoRoom(token: string | null) {
  const clientRef = useRef<MockVideoClient | null>(null);
  const [connectionState, setConnectionState] = useState<ConnectionState>('disconnected');
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [cameraEnabled, setCameraEnabled] = useState(true);
  const [micEnabled, setMicEnabled] = useState(true);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);

  useEffect(() => {
    if (!token) return;

    const client = new MockVideoClient();
    clientRef.current = client;

    const unsubscribe = client.onEvent(() => {
      setConnectionState(client.getConnectionState());
      setParticipants(client.getParticipants());
      setLocalStream(client.getLocalStream());
    });

    client.connect(token).then(() => {
      setConnectionState(client.getConnectionState());
      setParticipants(client.getParticipants());
      setLocalStream(client.getLocalStream());
    });

    return () => {
      unsubscribe();
      client.disconnect();
    };
  }, [token]);

  const toggleCamera = useCallback(async () => {
    if (!clientRef.current) return;
    const next = !cameraEnabled;
    await clientRef.current.enableCamera(next);
    setCameraEnabled(next);
  }, [cameraEnabled]);

  const toggleMic = useCallback(async () => {
    if (!clientRef.current) return;
    const next = !micEnabled;
    await clientRef.current.enableMicrophone(next);
    setMicEnabled(next);
  }, [micEnabled]);

  const leave = useCallback(async () => {
    if (!clientRef.current) return;
    await clientRef.current.disconnect();
    setConnectionState('disconnected');
    setParticipants([]);
    setLocalStream(null);
  }, []);

  return {
    connectionState,
    participants,
    cameraEnabled,
    micEnabled,
    localStream,
    toggleCamera,
    toggleMic,
    leave,
  };
}
