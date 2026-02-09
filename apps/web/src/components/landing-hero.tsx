'use client';

import { useState } from 'react';
import { Button } from '@svidio/ui';
import { Input } from '@svidio/ui';
import { useCreateMeeting } from '@/hooks/use-create-meeting';

export function LandingHero() {
  const [showOptions, setShowOptions] = useState(false);
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const { loading, error, meetingUrl, copied, create, copyLink, reset } =
    useCreateMeeting();

  if (meetingUrl) {
    return (
      <div className="flex flex-col items-center gap-8 animate-in fade-in duration-300">
        <h2 className="text-2xl font-semibold text-center">Mötet är skapat</h2>
        <div className="bg-[#2A2A2A] border border-[#3A3A3A] rounded-xl px-6 py-4 w-full max-w-lg text-center">
          <p className="text-gray-400 text-sm mb-2">Möteslänk</p>
          <p className="text-white font-mono text-sm break-all">{meetingUrl}</p>
        </div>
        <div className="flex gap-4">
          <Button onClick={copyLink} size="lg">
            {copied ? 'Kopierad!' : 'Kopiera länk'}
          </Button>
          <Button
            variant="secondary"
            size="lg"
            onClick={() => {
              window.location.href = meetingUrl;
            }}
          >
            Gå med nu
          </Button>
        </div>
        <button
          onClick={reset}
          className="text-gray-500 hover:text-gray-300 text-sm transition-colors"
        >
          Skapa ett nytt möte
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-10">
      <div className="text-center space-y-4">
        <h1 className="text-5xl font-bold tracking-tight md:text-6xl">
          Svidio
        </h1>
        <p className="text-gray-400 text-lg max-w-md mx-auto">
          Enkla videomöten. Ingen registrering. Inga krångel.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
        <Button
          size="lg"
          className="flex-1"
          disabled={loading}
          onClick={() => create({ password, name, instant: true })}
        >
          {loading ? 'Skapar...' : 'Direktmöte'}
        </Button>
        <Button
          variant="secondary"
          size="lg"
          className="flex-1"
          disabled={loading}
          onClick={() => create({ password, name, instant: false })}
        >
          Skapa möteslänk
        </Button>
      </div>

      <button
        onClick={() => setShowOptions(!showOptions)}
        className="text-gray-500 hover:text-gray-300 text-sm transition-colors"
      >
        {showOptions ? 'Dölj alternativ' : 'Fler alternativ'}
      </button>

      {showOptions && (
        <div className="flex flex-col gap-4 w-full max-w-md animate-in slide-in-from-top-2 duration-200">
          <Input
            label="Mötesnamn (valfritt)"
            placeholder="T.ex. Projektmöte"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={100}
          />
          <Input
            label="Lösenord (valfritt)"
            type="password"
            placeholder="Skydda mötet med lösenord"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
      )}

      {error && (
        <p className="text-red-400 text-sm">{error}</p>
      )}
    </div>
  );
}
