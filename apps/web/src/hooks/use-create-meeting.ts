'use client';

import { useState, useCallback } from 'react';
import { createMeeting } from '@/lib/api';
import { COPY_FEEDBACK_MS } from '@/lib/constants';

export function useCreateMeeting() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [meetingUrl, setMeetingUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const create = useCallback(
    async (opts: { password?: string; name?: string; instant?: boolean }) => {
      setLoading(true);
      setError(null);
      setMeetingUrl(null);

      try {
        const result = await createMeeting({
          password: opts.password || undefined,
          name: opts.name || undefined,
        });

        if (opts.instant) {
          window.location.href = result.meetingUrl;
          return;
        }

        setMeetingUrl(result.meetingUrl);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Something went wrong');
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const copyLink = useCallback(async () => {
    if (!meetingUrl) return;
    await navigator.clipboard.writeText(meetingUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), COPY_FEEDBACK_MS);
  }, [meetingUrl]);

  const reset = useCallback(() => {
    setMeetingUrl(null);
    setError(null);
    setCopied(false);
  }, []);

  return { loading, error, meetingUrl, copied, create, copyLink, reset };
}
