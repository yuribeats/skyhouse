'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import { useStore } from '@/hooks/useStore';

function useIsMobile() {
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    const check = () => setMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);
  return mobile;
}

const controlBtnStyle: React.CSSProperties = {
  background: 'none',
  border: '1px solid rgba(255,255,255,0.15)',
  color: '#fff',
  padding: '8px 16px',
  fontSize: '10px',
  fontWeight: 'bold',
  fontFamily: 'inherit',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
};

export default function PlaylistPlayer() {
  const playlistTokens = useStore((s) => s.playlistTokens);
  const playlistIndex = useStore((s) => s.playlistIndex);
  const closePlaylist = useStore((s) => s.closePlaylist);
  const nextTrack = useStore((s) => s.nextTrack);
  const prevTrack = useStore((s) => s.prevTrack);

  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(true);
  const isMobile = useIsMobile();

  const current = playlistTokens[playlistIndex];
  const isAudio = current?.media.mediaType === 'audio';
  const mediaSrc = isAudio
    ? current?.media.audio
    : (current?.media.video || current?.media.image);

  const handleEnded = useCallback(() => {
    nextTrack();
  }, [nextTrack]);

  useEffect(() => {
    setPlaying(true);
  }, [playlistIndex]);

  useEffect(() => {
    const el = isAudio ? audioRef.current : videoRef.current;
    if (!el) return;
    if (playing) {
      el.play().catch(() => {});
    } else {
      el.pause();
    }
  }, [playing, isAudio, mediaSrc]);

  if (!current) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 300,
      background: 'rgba(10, 10, 15, 0.97)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'inherit',
      color: '#fff',
    }}>
      <button
        onClick={closePlaylist}
        style={{
          position: 'absolute',
          top: isMobile ? '10px' : '20px',
          right: isMobile ? '10px' : '20px',
          background: 'none',
          border: '1px solid rgba(255,255,255,0.15)',
          color: '#666',
          padding: '6px 12px',
          fontSize: '10px',
          fontWeight: 'bold',
          fontFamily: 'inherit',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          zIndex: 10,
        }}
      >
        CLOSE
      </button>

      <div style={{
        width: isMobile ? '90vw' : '60vw',
        maxWidth: '800px',
        aspectRatio: isAudio ? undefined : '16/9',
        position: 'relative',
        background: '#000',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        {isAudio ? (
          <>
            {current.media.image && (
              <img
                src={current.media.image}
                alt={current.name}
                style={{ width: '100%', maxHeight: '50vh', objectFit: 'contain' }}
              />
            )}
            <audio
              ref={audioRef}
              key={mediaSrc}
              src={mediaSrc}
              autoPlay
              onEnded={handleEnded}
              style={{ position: 'absolute', bottom: 0, width: '100%' }}
              controls
            />
          </>
        ) : (
          <video
            ref={videoRef}
            key={mediaSrc}
            src={mediaSrc}
            autoPlay
            playsInline
            onEnded={handleEnded}
            controls
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
          />
        )}
      </div>

      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: isMobile ? '12px' : '16px',
        marginTop: '16px',
      }}>
        <button onClick={prevTrack} style={controlBtnStyle}>PREV</button>
        <button onClick={() => setPlaying(!playing)} style={controlBtnStyle}>
          {playing ? 'PAUSE' : 'PLAY'}
        </button>
        <button onClick={nextTrack} style={controlBtnStyle}>NEXT</button>
      </div>

      <div style={{ marginTop: '12px', textAlign: 'center', maxWidth: '80vw' }}>
        <div style={{
          fontSize: '11px',
          fontWeight: 'bold',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}>
          {current.name}
        </div>
        <div style={{
          fontSize: '9px',
          color: '#555',
          fontWeight: 'bold',
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          marginTop: '4px',
        }}>
          {playlistIndex + 1} / {playlistTokens.length}
          {isAudio ? ' \u00B7 AUDIO' : ' \u00B7 VIDEO'}
        </div>
      </div>
    </div>
  );
}
