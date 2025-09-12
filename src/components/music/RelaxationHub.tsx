import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX,
  SkipBack,
  SkipForward,
  Heart,
  Cloud,
  Waves,
  Wind,
  Zap,
  TreePine
} from 'lucide-react';

interface Track {
  id: string;
  title: string;
  category: string;
  duration: string;
  description: string;
  icon: any;
  color: string;
}

const tracks: Track[] = [
  {
    id: 'rain',
    title: 'Gentle Rain',
    category: 'Nature',
    duration: '30:00',
    description: 'Soft rainfall for deep relaxation',
    icon: Cloud,
    color: 'primary'
  },
  {
    id: 'ocean',
    title: 'Ocean Waves',
    category: 'Nature',
    duration: '45:00',
    description: 'Rhythmic waves by the shore',
    icon: Waves,
    color: 'accent'
  },
  {
    id: 'forest',
    title: 'Forest Ambience',
    category: 'Nature',
    duration: '60:00',
    description: 'Peaceful woodland sounds',
    icon: TreePine,
    color: 'success'
  },
  {
    id: 'wind',
    title: 'Mountain Breeze',
    category: 'Nature',
    duration: '40:00',
    description: 'Calming wind through trees',
    icon: Wind,
    color: 'warning'
  },
  {
    id: 'meditation',
    title: 'Deep Focus',
    category: 'Meditation',
    duration: '20:00',
    description: 'Binaural beats for concentration',
    icon: Zap,
    color: 'destructive'
  }
];

export const RelaxationHub = () => {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState([70]);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Mock audio playback simulation
  useEffect(() => {
    if (!currentTrack || !isPlaying) return;

    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + 1;
        if (newProgress >= 100) {
          setIsPlaying(false);
          return 0;
        }
        return newProgress;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [currentTrack, isPlaying]);

  const handlePlay = (track: Track) => {
    if (currentTrack?.id === track.id) {
      setIsPlaying(!isPlaying);
    } else {
      setCurrentTrack(track);
      setIsPlaying(true);
      setProgress(0);
    }
  };

  const getColorClass = (color: string) => {
    switch (color) {
      case 'primary': return 'bg-primary/10 text-primary border-primary/20';
      case 'accent': return 'bg-accent/10 text-accent border-accent/20';
      case 'success': return 'bg-success/10 text-success border-success/20';
      case 'warning': return 'bg-warning/10 text-warning border-warning/20';
      case 'destructive': return 'bg-destructive/10 text-destructive border-destructive/20';
      default: return 'bg-muted/10 text-muted-foreground border-muted/20';
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-full bg-accent/10">
          <Heart className="w-5 h-5 text-accent" />
        </div>
        <div>
          <h3 className="text-xl font-semibold text-foreground">Relaxation Hub</h3>
          <p className="text-muted-foreground">Soothing sounds for peace of mind</p>
        </div>
      </div>

      {/* Now Playing */}
      {currentTrack && (
        <Card className="glass-card p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className={`p-4 rounded-full ${getColorClass(currentTrack.color)}`}>
              <currentTrack.icon className="w-8 h-8" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-foreground">{currentTrack.title}</h4>
              <p className="text-sm text-muted-foreground">{currentTrack.description}</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-4">
            <div className="flex justify-between text-sm text-muted-foreground mb-2">
              <span>{formatTime(Math.floor(progress * 30 / 100))}</span>
              <span>{currentTrack.duration}</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm">
                <SkipBack className="w-4 h-4" />
              </Button>
              <Button 
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-12 h-12 rounded-full"
              >
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              </Button>
              <Button variant="ghost" size="sm">
                <SkipForward className="w-4 h-4" />
              </Button>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMuted(!isMuted)}
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </Button>
              <div className="w-24">
                <Slider
                  value={isMuted ? [0] : volume}
                  onValueChange={setVolume}
                  max={100}
                  step={1}
                  className="w-full"
                />
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Track Library */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tracks.map((track) => {
          const IconComponent = track.icon;
          const isCurrentlyPlaying = currentTrack?.id === track.id && isPlaying;
          
          return (
            <motion.div
              key={track.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card 
                className={`glass-card p-4 cursor-pointer hover:shadow-lg transition-all duration-200 border ${getColorClass(track.color)} ${
                  currentTrack?.id === track.id ? 'ring-2 ring-primary/30' : ''
                }`}
                onClick={() => handlePlay(track)}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className={`p-3 rounded-full ${getColorClass(track.color)} relative`}>
                    <IconComponent className="w-5 h-5" />
                    {isCurrentlyPlaying && (
                      <motion.div
                        className="absolute inset-0 rounded-full border-2 border-primary"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                      />
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-foreground">{track.title}</h4>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">
                        {track.category}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{track.duration}</span>
                    </div>
                  </div>
                </div>
                
                <p className="text-sm text-muted-foreground mb-3">{track.description}</p>
                
                <Button 
                  variant={currentTrack?.id === track.id ? "default" : "outline"}
                  size="sm" 
                  className="w-full flex items-center gap-2"
                >
                  {isCurrentlyPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                  {isCurrentlyPlaying ? 'Playing' : 'Play'}
                </Button>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Quick Presets */}
      <Card className="glass-card p-4">
        <h4 className="font-medium mb-3">Quick Mood Presets</h4>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm">😌 Relaxed</Button>
          <Button variant="outline" size="sm">🧘 Meditative</Button>
          <Button variant="outline" size="sm">💤 Sleepy</Button>
          <Button variant="outline" size="sm">🎯 Focused</Button>
          <Button variant="outline" size="sm">🌅 Energized</Button>
        </div>
      </Card>
    </div>
  );
};