import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { Volume2, VolumeX, Play, Pause } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AudioContextType {
  isPlaying: boolean;
  volume: number;
  currentTrack: string | null;
  play: (track: string) => void;
  pause: () => void;
  stop: () => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  isMuted: boolean;
}

const AudioContext = createContext<AudioContextType | null>(null);

interface AudioManagerProps {
  children: React.ReactNode;
}

// Audio tracks for different moods and interfaces
const AUDIO_TRACKS = {
  ambient: '/audio/ambient-forest.mp3', // Placeholder - would need actual files
  rain: '/audio/gentle-rain.mp3',
  ocean: '/audio/ocean-waves.mp3',
  meditation: '/audio/meditation-bells.mp3',
  focus: '/audio/focus-white-noise.mp3',
} as const;

export const AudioManagerProvider: React.FC<AudioManagerProps> = ({ children }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolumeState] = useState(0.3);
  const [isMuted, setIsMuted] = useState(true); // Start muted by default on mobile
  const [currentTrack, setCurrentTrack] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Check if on mobile device - start muted
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    setIsMuted(isMobile);
    
    // Load preferences from localStorage
    const savedVolume = localStorage.getItem('audio-volume');
    const savedMute = localStorage.getItem('audio-muted');
    
    if (savedVolume) setVolumeState(parseFloat(savedVolume));
    if (savedMute) setIsMuted(JSON.parse(savedMute));
  }, []);

  const play = (track: string) => {
    if (audioRef.current) {
      audioRef.current.pause();
    }

    // For demo purposes, create a simple Web Audio context tone instead of loading files
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      // Create a subtle, calming tone
      oscillator.frequency.setValueAtTime(220, audioContext.currentTime); // A note
      gainNode.gain.setValueAtTime(isMuted ? 0 : volume * 0.1, audioContext.currentTime);
      
      oscillator.start();
      
      // Mock audio element for consistency
      const mockAudio = {
        pause: () => oscillator.stop(),
        currentTime: 0,
        volume: isMuted ? 0 : volume
      };
      
      audioRef.current = mockAudio as HTMLAudioElement;
      setCurrentTrack(track);
      setIsPlaying(true);
      
    } catch (error) {
      console.warn('Audio context not available:', error);
      // Graceful fallback - just update UI state
      setCurrentTrack(track);
      setIsPlaying(true);
    }
  };

  const pause = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const stop = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
      setCurrentTrack(null);
    }
  };

  const setVolume = (newVolume: number) => {
    setVolumeState(newVolume);
    localStorage.setItem('audio-volume', newVolume.toString());
    
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : newVolume;
    }
  };

  const toggleMute = () => {
    const newMuteState = !isMuted;
    setIsMuted(newMuteState);
    localStorage.setItem('audio-muted', JSON.stringify(newMuteState));
    
    if (audioRef.current) {
      audioRef.current.volume = newMuteState ? 0 : volume;
    }
  };

  const contextValue: AudioContextType = {
    isPlaying,
    volume,
    currentTrack,
    play,
    pause,
    stop,
    setVolume,
    toggleMute,
    isMuted,
  };

  return (
    <AudioContext.Provider value={contextValue}>
      {children}
      <AudioControls />
    </AudioContext.Provider>
  );
};

const AudioControls: React.FC = () => {
  const audio = useAudio();

  return (
    <div className="audio-controls">
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={audio.toggleMute}
          className="p-2 hover:bg-primary/10 transition-colors"
          aria-label={audio.isMuted ? 'Unmute audio' : 'Mute audio'}
        >
          {audio.isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </Button>

        {!audio.isMuted && (
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={audio.volume}
            onChange={(e) => audio.setVolume(parseFloat(e.target.value))}
            className="w-16 h-1 bg-muted rounded-lg appearance-none cursor-pointer slider-thumb"
            aria-label="Volume control"
          />
        )}
      </div>
    </div>
  );
};

export const useAudio = (): AudioContextType => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudio must be used within an AudioManagerProvider');
  }
  return context;
};