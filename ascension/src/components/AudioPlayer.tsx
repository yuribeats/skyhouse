"use client";

import { useEffect, useRef, useState } from "react";

function fmt(s: number) {
  if (!isFinite(s) || isNaN(s)) return "0:00";
  const m = Math.floor(s / 60);
  const r = Math.floor(s % 60);
  return `${m}:${r.toString().padStart(2, "0")}`;
}

export default function AudioPlayer({ src }: { src: string }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [muted, setMuted] = useState(false);

  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    a.volume = muted ? 0 : volume;
  }, [volume, muted]);

  const toggle = () => {
    const a = audioRef.current;
    if (!a) return;
    if (a.paused) a.play();
    else a.pause();
  };

  const seek = (e: React.MouseEvent<HTMLDivElement>) => {
    const a = audioRef.current;
    if (!a || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = (e.clientX - rect.left) / rect.width;
    a.currentTime = pct * duration;
  };

  const pct = duration ? (current / duration) * 100 : 0;

  return (
    <div className="flex w-full items-center gap-3 border border-neptune-blue bg-black px-3 py-2 text-white">
      <audio
        ref={audioRef}
        src={src}
        preload="metadata"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onTimeUpdate={(e) => setCurrent((e.target as HTMLAudioElement).currentTime)}
        onLoadedMetadata={(e) => setDuration((e.target as HTMLAudioElement).duration)}
        onEnded={() => setPlaying(false)}
      />

      <button
        onClick={toggle}
        aria-label={playing ? "Pause" : "Play"}
        className="flex h-6 w-6 shrink-0 items-center justify-center text-white"
      >
        {playing ? (
          <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
            <rect x="2" y="1" width="3.5" height="12" />
            <rect x="8.5" y="1" width="3.5" height="12" />
          </svg>
        ) : (
          <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
            <polygon points="2,1 12,7 2,13" />
          </svg>
        )}
      </button>

      <span className="shrink-0 font-body text-[11px] tabular-nums tracking-wider text-white">
        {fmt(current)} / {fmt(duration)}
      </span>

      <div
        className="relative h-[3px] flex-1 cursor-pointer bg-white/20"
        onClick={seek}
      >
        <div className="absolute left-0 top-0 h-full bg-white" style={{ width: `${pct}%` }} />
      </div>

      <button
        onClick={() => setMuted(!muted)}
        aria-label={muted ? "Unmute" : "Mute"}
        className="flex h-6 w-6 shrink-0 items-center justify-center text-white"
      >
        {muted ? (
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <polygon points="2,5 5,5 9,2 9,14 5,11 2,11" />
            <line x1="11" y1="5" x2="15" y2="11" stroke="currentColor" strokeWidth="1.5" />
            <line x1="15" y1="5" x2="11" y2="11" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        ) : (
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <polygon points="2,5 5,5 9,2 9,14 5,11 2,11" />
            <path d="M11,5 Q13,8 11,11" stroke="currentColor" strokeWidth="1" fill="none" />
          </svg>
        )}
      </button>

      <input
        type="range"
        min={0}
        max={1}
        step={0.05}
        value={muted ? 0 : volume}
        onChange={(e) => { setVolume(parseFloat(e.target.value)); setMuted(false); }}
        aria-label="Volume"
        className="hidden h-[3px] w-16 shrink-0 accent-white sm:block"
      />
    </div>
  );
}
