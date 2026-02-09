'use client';

import { useState } from 'react';
import { Button } from '@svidio/ui';
import { Input } from '@svidio/ui';
import type { ValidateMeetingResponse } from '@svidio/types';
import { joinMeeting } from '@/lib/api';

interface JoinFormProps {
  meetingId: string;
  meetingInfo: ValidateMeetingResponse;
  onJoined: (token: string) => void;
}

export function JoinForm({ meetingId, meetingInfo, onJoined }: JoinFormProps) {
  const [displayName, setDisplayName] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!displayName.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const result = await joinMeeting({
        meetingId,
        displayName: displayName.trim(),
        password: password || undefined,
      });
      onJoined(result.token);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Kunde inte gå med i mötet');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4">
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Gå med i möte</h1>
          {meetingInfo.name && (
            <p className="text-gray-400 text-lg">{meetingInfo.name}</p>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            label="Ditt namn"
            placeholder="Ange ditt namn"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            required
            autoFocus
          />

          {meetingInfo.requiresPassword && (
            <Input
              label="Lösenord"
              type="password"
              placeholder="Ange mötets lösenord"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          )}

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <Button type="submit" size="lg" className="w-full" disabled={loading}>
            {loading ? 'Ansluter...' : 'Gå med'}
          </Button>
        </form>
      </div>
    </div>
  );
}
