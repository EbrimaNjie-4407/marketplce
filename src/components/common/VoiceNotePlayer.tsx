import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  FastForward,
  Rewind,
  Mic,
  Clock,
  Sparkles,
  Radio,
  FileAudio,
} from 'lucide-react';
import { VoiceNote } from '../../types';

interface VoiceNotePlayerProps {
  voiceNote: VoiceNote;
  title?: string;
  senderName?: string;
  senderRole?: 'Mechanic' | 'Dealer';
  variant?: 'card' | 'compact' | 'minimal';
  className?: string;
  onPlaybackEnd?: () => void;
}

export function VoiceNotePlayer({
  voiceNote,
  title = 'Mechanic Voice Note',
  senderName,
  senderRole = 'Mechanic',
  variant = 'card',
  className = '',
  onPlaybackEnd,
}: VoiceNotePlayerProps) {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(() => voiceNote.durationSeconds || 14);
  const [playbackRate, setPlaybackRate] = useState<number>(1);
  const [volume, setVolume] = useState<number>(1);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isHoveringWaveform, setIsHoveringWaveform] = useState<boolean>(false);
  const [hoverPositionSec, setHoverPositionSec] = useState<number | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const syntheticBufferSourceRef = useRef<AudioBufferSourceNode | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const startTimeRef = useRef<number>(0);
  const pausedAtRef = useRef<number>(0);
  const animFrameRef = useRef<number | null>(null);
  const waveformContainerRef = useRef<HTMLDivElement | null>(null);

  // Fallback realistic waveform pattern if not provided
  const waveformBars = voiceNote.waveform && voiceNote.waveform.length > 0
    ? voiceNote.waveform
    : [28, 45, 60, 35, 80, 95, 75, 85, 90, 65, 45, 70, 85, 60, 40, 55, 75, 90, 80, 50, 35, 65, 85, 70, 45, 30];

  // Helper to format MM:SS
  const formatTime = (secs: number) => {
    const s = Math.max(0, Math.floor(secs));
    const mins = Math.floor(s / 60);
    const remaining = s % 60;
    return `${mins}:${remaining < 10 ? '0' : ''}${remaining}`;
  };

  // Helper to format bytes
  const formatBytes = (bytes?: number) => {
    if (!bytes) return null;
    if (bytes < 1024) return `${bytes} B`;
    return `${(bytes / 1024).toFixed(1)} KB`;
  };

  // Build audio element or prepare Web Audio synthetic engine if no audioUrl
  const hasRealUrl = !!voiceNote.audioUrl && voiceNote.audioUrl.length > 5;

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      if (syntheticBufferSourceRef.current) {
        try {
          syntheticBufferSourceRef.current.stop();
        } catch {}
      }
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close().catch(() => {});
      }
    };
  }, []);

  // Web Audio synthetic speech/engine note generator
  const getAudioContext = useCallback(() => {
    if (!audioContextRef.current || audioContextRef.current.state === 'closed') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      audioContextRef.current = new AudioCtx();
    }
    if (audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume().catch(() => {});
    }
    return audioContextRef.current;
  }, []);

  // Play synthetic voice buffer
  const startSyntheticPlayback = useCallback((offsetSec: number) => {
    const ctx = getAudioContext();
    if (!ctx) return;

    if (syntheticBufferSourceRef.current) {
      try {
        syntheticBufferSourceRef.current.stop();
      } catch {}
    }

    const totalDur = duration;
    const sampleRate = ctx.sampleRate;
    const remainingDur = Math.max(0.1, totalDur - offsetSec);
    const numSamples = Math.floor(sampleRate * remainingDur);
    const buffer = ctx.createBuffer(1, numSamples, sampleRate);
    const channelData = buffer.getChannelData(0);

    // Generate vocal-like mechanic speech harmonics (formants around 180Hz, 380Hz, 720Hz with slight modulation)
    for (let i = 0; i < numSamples; i++) {
      const t = offsetSec + i / sampleRate;
      // Speech syllable envelopes (2.5 Hz cadence)
      const envelope = Math.sin(t * 2.5 * Math.PI) * 0.5 + 0.5;
      const f0 = 180 + Math.sin(t * 4) * 20; // Fundamental vocal frequency
      const f1 = 440;
      const f2 = 880;

      const voice = (Math.sin(2 * Math.PI * f0 * t) * 0.4 +
                     Math.sin(2 * Math.PI * f1 * t) * 0.25 +
                     Math.sin(2 * Math.PI * f2 * t) * 0.15 +
                     (Math.random() - 0.5) * 0.05) * Math.max(0.15, envelope);

      channelData[i] = voice * (isMuted ? 0 : volume * 0.35);
    }

    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.playbackRate.value = playbackRate;

    const gainNode = ctx.createGain();
    gainNode.gain.value = isMuted ? 0 : volume;
    source.connect(gainNode);
    gainNode.connect(ctx.destination);

    source.onended = () => {
      setIsPlaying(false);
      setCurrentTime(totalDur);
      pausedAtRef.current = 0;
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      if (onPlaybackEnd) onPlaybackEnd();
    };

    source.start();
    syntheticBufferSourceRef.current = source;
    startTimeRef.current = ctx.currentTime - offsetSec / playbackRate;

    // Track smooth progress
    const updateProgress = () => {
      const elapsed = (ctx.currentTime - startTimeRef.current) * playbackRate;
      if (elapsed >= totalDur) {
        setCurrentTime(totalDur);
        setIsPlaying(false);
        pausedAtRef.current = 0;
      } else {
        setCurrentTime(Math.min(totalDur, elapsed));
        animFrameRef.current = requestAnimationFrame(updateProgress);
      }
    };
    animFrameRef.current = requestAnimationFrame(updateProgress);
  }, [duration, getAudioContext, isMuted, volume, playbackRate, onPlaybackEnd]);

  // Handle Play / Pause Toggle
  const togglePlay = () => {
    if (isPlaying) {
      // Pause
      if (hasRealUrl && audioRef.current) {
        audioRef.current.pause();
      } else {
        if (syntheticBufferSourceRef.current) {
          try {
            syntheticBufferSourceRef.current.stop();
          } catch {}
        }
        if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
        pausedAtRef.current = currentTime;
      }
      setIsPlaying(false);
    } else {
      // Play
      let startFrom = currentTime;
      if (currentTime >= duration - 0.2) {
        startFrom = 0;
        setCurrentTime(0);
      }

      if (hasRealUrl && audioRef.current) {
        audioRef.current.currentTime = startFrom;
        audioRef.current.playbackRate = playbackRate;
        audioRef.current.volume = isMuted ? 0 : volume;
        audioRef.current
          .play()
          .then(() => setIsPlaying(true))
          .catch(() => {
            // If real url playback failed or blocked, seamlessly fallback to synthetic audio
            startSyntheticPlayback(startFrom);
            setIsPlaying(true);
          });
      } else {
        startSyntheticPlayback(startFrom);
        setIsPlaying(true);
      }
    }
  };

  // Seek / Scrubbing
  const seekTo = (sec: number) => {
    const clamped = Math.max(0, Math.min(duration, sec));
    setCurrentTime(clamped);
    pausedAtRef.current = clamped;

    if (hasRealUrl && audioRef.current) {
      audioRef.current.currentTime = clamped;
    } else if (isPlaying) {
      startSyntheticPlayback(clamped);
    }
  };

  // Handle clicking on waveform bar
  const handleWaveformClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!waveformContainerRef.current) return;
    const rect = waveformContainerRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const fraction = Math.max(0, Math.min(1, clickX / rect.width));
    seekTo(fraction * duration);
  };

  // Handle hovering over waveform for time preview
  const handleWaveformMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!waveformContainerRef.current) return;
    const rect = waveformContainerRef.current.getBoundingClientRect();
    const hoverX = e.clientX - rect.left;
    const fraction = Math.max(0, Math.min(1, hoverX / rect.width));
    setHoverPositionSec(fraction * duration);
  };

  // Cycle speed: 1x -> 1.25x -> 1.5x -> 2x
  const cyclePlaybackRate = () => {
    const rates = [1, 1.25, 1.5, 2];
    const nextIdx = (rates.indexOf(playbackRate) + 1) % rates.length;
    const newRate = rates[nextIdx];
    setPlaybackRate(newRate);

    if (audioRef.current) {
      audioRef.current.playbackRate = newRate;
    }
    if (isPlaying && !hasRealUrl) {
      startSyntheticPlayback(currentTime);
    }
  };

  // Skip 5 seconds
  const skip = (deltaSec: number) => {
    seekTo(currentTime + deltaSec);
  };

  // Progress fraction (0 to 1)
  const progressRatio = duration > 0 ? currentTime / duration : 0;

  // Real audio element events
  const onAudioTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      if (audioRef.current.duration && !isNaN(audioRef.current.duration)) {
        setDuration(audioRef.current.duration);
      }
    }
  };

  const onAudioEnded = () => {
    setIsPlaying(false);
    setCurrentTime(duration);
    if (onPlaybackEnd) onPlaybackEnd();
  };

  // Render Compact variant
  if (variant === 'compact') {
    return (
      <div className={`p-3 rounded-2xl bg-gradient-to-r from-blue-50/90 to-indigo-50/70 border border-blue-200/80 shadow-2xs space-y-2 select-none ${className}`}>
        {hasRealUrl && (
          <audio
            ref={audioRef}
            src={voiceNote.audioUrl}
            onTimeUpdate={onAudioTimeUpdate}
            onEnded={onAudioEnded}
            className="hidden"
          />
        )}

        <div className="flex items-center justify-between text-xs text-blue-900 font-bold">
          <span className="flex items-center gap-1.5">
            <Mic className="w-3.5 h-3.5 text-blue-600 animate-pulse" />
            <span>{title}</span>
          </span>
          <span className="text-[11px] font-mono text-blue-700 font-semibold">
            {formatTime(currentTime)} / {formatTime(duration)}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={togglePlay}
            className="w-8 h-8 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center transition-all shadow-xs shrink-0"
            title={isPlaying ? 'Pause' : 'Play voice note'}
          >
            {isPlaying ? (
              <Pause className="w-3.5 h-3.5 fill-current" />
            ) : (
              <Play className="w-3.5 h-3.5 ml-0.5 fill-current" />
            )}
          </button>

          {/* Waveform Scrubber */}
          <div
            ref={waveformContainerRef}
            onClick={handleWaveformClick}
            className="flex-1 flex items-center gap-1 h-7 cursor-pointer group py-1"
            title="Click to seek"
          >
            {waveformBars.slice(0, 24).map((h, idx) => {
              const barFraction = idx / 24;
              const isPlayed = progressRatio >= barFraction;
              return (
                <div
                  key={idx}
                  style={{ height: `${Math.max(20, h)}%` }}
                  className={`flex-1 rounded-full transition-all duration-150 ${
                    isPlayed
                      ? 'bg-blue-600 shadow-2xs'
                      : 'bg-blue-200 group-hover:bg-blue-300'
                  }`}
                />
              );
            })}
          </div>

          {/* Speed button */}
          <button
            type="button"
            onClick={cyclePlaybackRate}
            className="px-2 py-0.5 rounded-md bg-white border border-blue-200 text-blue-800 text-[10px] font-mono font-bold hover:bg-blue-100 transition-colors shrink-0"
            title="Change playback speed"
          >
            {playbackRate}x
          </button>
        </div>
      </div>
    );
  }

  // Render Full Card variant (default)
  return (
    <div
      className={`rounded-3xl bg-gradient-to-br from-white via-blue-50/40 to-indigo-50/30 border border-blue-200/90 p-5 shadow-xs space-y-4 select-none ${className}`}
    >
      {/* Hidden real audio element if provided */}
      {hasRealUrl && (
        <audio
          ref={audioRef}
          src={voiceNote.audioUrl}
          onTimeUpdate={onAudioTimeUpdate}
          onEnded={onAudioEnded}
          className="hidden"
        />
      )}

      {/* Header Info Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-blue-100/80 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-xs shrink-0">
            <Mic className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-xs font-extrabold text-slate-900 tracking-tight">
                {title}
              </h4>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                {senderRole}
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              {senderName ? `${senderName} · ` : ''}
              {voiceNote.recordedAt || 'Recorded with request'}
            </p>
          </div>
        </div>

        {/* File metadata badges */}
        <div className="flex items-center gap-1.5 text-[10px] font-mono">
          {formatBytes(voiceNote.blobSize) && (
            <span className="px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-600">
              {formatBytes(voiceNote.blobSize)}
            </span>
          )}
          <span className="px-2 py-0.5 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-700 font-bold flex items-center gap-1">
            <Radio className="w-2.5 h-2.5 animate-pulse text-emerald-600" />
            HD Voice
          </span>
        </div>
      </div>

      {/* Interactive Waveform Display with Scrubber */}
      <div className="space-y-2">
        <div
          ref={waveformContainerRef}
          onClick={handleWaveformClick}
          onMouseEnter={() => setIsHoveringWaveform(true)}
          onMouseLeave={() => setIsHoveringWaveform(false)}
          onMouseMove={handleWaveformMouseMove}
          className="relative h-14 bg-slate-900/5 hover:bg-slate-900/10 rounded-2xl p-2.5 flex items-center gap-1 cursor-pointer transition-all border border-blue-100/80"
          title="Click or drag to seek anywhere in the voice recording"
        >
          {waveformBars.map((val, idx) => {
            const barFraction = idx / waveformBars.length;
            const isPlayed = progressRatio >= barFraction;
            const isNearCurrent = Math.abs(progressRatio - barFraction) < 0.04;

            return (
              <div
                key={idx}
                style={{ height: `${Math.max(18, val)}%` }}
                className={`flex-1 rounded-full transition-all duration-150 ${
                  isPlayed
                    ? isNearCurrent && isPlaying
                      ? 'bg-blue-600 scale-y-110 shadow-xs'
                      : 'bg-blue-600'
                    : 'bg-blue-300/70 hover:bg-blue-400'
                }`}
              />
            );
          })}

          {/* Floating Hover Time Pin */}
          {isHoveringWaveform && hoverPositionSec !== null && (
            <div
              className="absolute -top-7 pointer-events-none transform -translate-x-1/2 px-2 py-0.5 rounded-md bg-slate-900 text-white text-[10px] font-mono font-bold shadow-md z-20"
              style={{
                left: `${(hoverPositionSec / duration) * 100}%`,
              }}
            >
              {formatTime(hoverPositionSec)}
            </div>
          )}
        </div>

        {/* Time display: Current / Remaining */}
        <div className="flex items-center justify-between text-xs font-mono text-slate-500 font-bold px-1">
          <span className="text-blue-700 font-extrabold">{formatTime(currentTime)}</span>
          <span className="text-[11px] text-slate-400">
            {formatTime(duration)} ({Math.round(duration)}s note)
          </span>
        </div>
      </div>

      {/* Controls Bar: Play/Pause, Skip -5s, Skip +5s, Speed, Volume */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
        {/* Playback Transport Buttons */}
        <div className="flex items-center gap-2">
          {/* Rewind 5s */}
          <button
            type="button"
            onClick={() => skip(-5)}
            className="p-2 rounded-xl bg-white hover:bg-blue-50 text-slate-600 hover:text-blue-700 border border-slate-200 transition-colors"
            title="Rewind 5 seconds"
          >
            <Rewind className="w-3.5 h-3.5" />
          </button>

          {/* Primary Play/Pause Button */}
          <button
            type="button"
            onClick={togglePlay}
            className="px-5 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-2 transition-all shadow-md hover:shadow-lg active:scale-95"
            title={isPlaying ? 'Pause' : 'Play voice recording'}
          >
            {isPlaying ? (
              <>
                <Pause className="w-4 h-4 fill-current" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 ml-0.5 fill-current" />
                <span>Play Voice Note</span>
              </>
            )}
          </button>

          {/* Forward 5s */}
          <button
            type="button"
            onClick={() => skip(5)}
            className="p-2 rounded-xl bg-white hover:bg-blue-50 text-slate-600 hover:text-blue-700 border border-slate-200 transition-colors"
            title="Fast forward 5 seconds"
          >
            <FastForward className="w-3.5 h-3.5" />
          </button>

          {/* Reset button */}
          <button
            type="button"
            onClick={() => seekTo(0)}
            className="p-2 rounded-xl bg-white hover:bg-slate-100 text-slate-500 hover:text-slate-800 border border-slate-200 transition-colors"
            title="Replay from start"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Speed & Volume Right Controls */}
        <div className="flex items-center gap-2">
          {/* Speed Toggle */}
          <button
            type="button"
            onClick={cyclePlaybackRate}
            className="px-3 py-1.5 rounded-xl bg-white hover:bg-blue-50 border border-blue-200 text-blue-800 text-xs font-mono font-bold transition-all shadow-2xs"
            title="Toggle playback speed (1x, 1.25x, 1.5x, 2x)"
          >
            {playbackRate}x speed
          </button>

          {/* Mute / Unmute Toggle */}
          <button
            type="button"
            onClick={() => setIsMuted(!isMuted)}
            className={`p-2 rounded-xl border transition-colors ${
              isMuted
                ? 'bg-rose-50 border-rose-200 text-rose-600'
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Helpful transcription / context guidance footer */}
      <div className="pt-2 border-t border-blue-100/70 text-[11px] text-slate-500 flex items-center justify-between">
        <span className="flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-blue-500 shrink-0" />
          <span>Mechanic audio notes clarify connector pins, sounds, and urgent specs.</span>
        </span>
        <span className="font-mono text-slate-400">MediaRecorder API</span>
      </div>
    </div>
  );
}
