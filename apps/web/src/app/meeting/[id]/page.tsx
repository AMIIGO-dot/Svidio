'use client';

import { useState, useEffect, use } from 'react';
import { validateMeeting } from '@/lib/api';
import { JoinForm } from '@/components/join-form';
import { MeetingRoom } from '@/components/meeting-room';
import { Button } from '@svidio/ui';
import type { ValidateMeetingResponse } from '@svidio/types';

interface MeetingPageProps {
  params: Promise<{ id: string }>;
}

export default function MeetingPage({ params }: MeetingPageProps) {
  const { id } = use(params);
  const [meetingInfo, setMeetingInfo] = useState<ValidateMeetingResponse | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    validateMeeting(id)
      .then(setMeetingInfo)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-400 text-lg">Laddar...</p>
      </div>
    );
  }

  if (!meetingInfo?.exists) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-6">
        <h1 className="text-2xl font-semibold">Mötet hittades inte</h1>
        <p className="text-gray-400">Kontrollera länken och försök igen.</p>
        <Button onClick={() => (window.location.href = '/')}>
          Tillbaka
        </Button>
      </div>
    );
  }

  if (meetingInfo.expired) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-6">
        <h1 className="text-2xl font-semibold">Mötet har löpt ut</h1>
        <p className="text-gray-400">Det här mötet är inte längre aktivt.</p>
        <Button onClick={() => (window.location.href = '/')}>
          Skapa nytt möte
        </Button>
      </div>
    );
  }

  if (token) {
    return (
      <MeetingRoom
        token={token}
        onLeft={() => (window.location.href = '/')}
      />
    );
  }

  return (
    <JoinForm
      meetingId={id}
      meetingInfo={meetingInfo}
      onJoined={setToken}
    />
  );
}
