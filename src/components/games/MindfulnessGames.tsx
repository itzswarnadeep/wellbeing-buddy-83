import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Brain, 
  Heart, 
  Sparkles, 
  Trophy,
  Play,
  Pause,
  RotateCcw,
  Star
} from 'lucide-react';

interface Game {
  id: string;
  title: string;
  description: string;
  duration: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  points: number;
  color: string;
  icon: any;
}

const games: Game[] = [
  {
    id: 'breathing',
    title: 'Breathing Bubbles',
    description: 'Follow the expanding bubble to practice deep breathing',
    duration: '5 min',
    difficulty: 'Easy',
    points: 10,
    color: 'primary',
    icon: Heart
  },
  {
    id: 'focus',
    title: 'Focus Garden',
    description: 'Water virtual plants by maintaining focus',
    duration: '10 min',
    difficulty: 'Medium',
    points: 20,
    color: 'success',
    icon: Sparkles
  },
  {
    id: 'memory',
    title: 'Memory Palace',
    description: 'Build concentration through pattern memory games',
    duration: '8 min',
    difficulty: 'Hard',
    points: 30,
    color: 'accent',
    icon: Brain
  }
];

interface BreathingGameProps {
  onComplete: (points: number) => void;
  onClose: () => void;
}

const BreathingGame: React.FC<BreathingGameProps> = ({ onComplete, onClose }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [phase, setPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [timer, setTimer] = useState(0);
  const [cycles, setCycles] = useState(0);

  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setTimer(prev => {
        if (phase === 'inhale' && prev >= 4) {
          setPhase('hold');
          return 0;
        }
        if (phase === 'hold' && prev >= 2) {
          setPhase('exhale');
          return 0;
        }
        if (phase === 'exhale' && prev >= 4) {
          setPhase('inhale');
          setCycles(c => c + 1);
          return 0;
        }
        return prev + 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isPlaying, phase]);

  useEffect(() => {
    if (cycles >= 5) {
      setIsPlaying(false);
      onComplete(10);
    }
  }, [cycles, onComplete]);

  const getCircleScale = () => {
    switch (phase) {
      case 'inhale': return 1 + (timer * 0.3);
      case 'hold': return 2.2;
      case 'exhale': return 2.2 - (timer * 0.3);
      default: return 1;
    }
  };

  return (
    <Card className="glass-card p-8 text-center max-w-md mx-auto">
      <h3 className="text-2xl font-semibold mb-4">Breathing Exercise</h3>
      
      <div className="relative w-48 h-48 mx-auto mb-6">
        <motion.div
          className="w-full h-full rounded-full bg-gradient-to-r from-primary to-accent opacity-60"
          animate={{ scale: getCircleScale() }}
          transition={{ duration: 1, ease: "easeInOut" }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <p className="text-lg font-medium capitalize">{phase}</p>
            <p className="text-sm text-muted-foreground">{4 - timer}s</p>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <p className="text-sm text-muted-foreground mb-2">Cycles completed: {cycles}/5</p>
        <div className="w-full bg-muted rounded-full h-2">
          <div 
            className="bg-primary h-2 rounded-full transition-all duration-300"
            style={{ width: `${(cycles / 5) * 100}%` }}
          />
        </div>
      </div>

      <div className="flex gap-3 justify-center">
        <Button
          onClick={() => setIsPlaying(!isPlaying)}
          className="flex items-center gap-2"
        >
          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          {isPlaying ? 'Pause' : 'Start'}
        </Button>
        <Button variant="outline" onClick={onClose}>
          Close
        </Button>
      </div>
    </Card>
  );
};

export const MindfulnessGames = () => {
  const [selectedGame, setSelectedGame] = useState<string | null>(null);
  const [userPoints, setUserPoints] = useState(0);
  const [completedGames, setCompletedGames] = useState<Set<string>>(new Set());

  const handleGameComplete = (points: number) => {
    setUserPoints(prev => prev + points);
    if (selectedGame) {
      setCompletedGames(prev => new Set([...prev, selectedGame]));
    }
    setSelectedGame(null);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'success';
      case 'Medium': return 'warning';
      case 'Hard': return 'destructive';
      default: return 'muted';
    }
  };

  const getColorClass = (color: string) => {
    switch (color) {
      case 'primary': return 'bg-primary/10 text-primary border-primary/20';
      case 'accent': return 'bg-accent/10 text-accent border-accent/20';
      case 'success': return 'bg-success/10 text-success border-success/20';
      default: return 'bg-muted/10 text-muted-foreground border-muted/20';
    }
  };

  if (selectedGame === 'breathing') {
    return (
      <BreathingGame 
        onComplete={handleGameComplete}
        onClose={() => setSelectedGame(null)}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Points */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-semibold text-foreground">Mindfulness Games</h3>
          <p className="text-muted-foreground">Interactive exercises for mental wellness</p>
        </div>
        <div className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-warning" />
          <span className="font-semibold">{userPoints} points</span>
        </div>
      </div>

      {/* Games Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {games.map((game) => {
          const IconComponent = game.icon;
          const isCompleted = completedGames.has(game.id);
          
          return (
            <motion.div
              key={game.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card 
                className={`glass-card p-6 cursor-pointer hover:shadow-lg transition-all duration-200 border ${getColorClass(game.color)}`}
                onClick={() => setSelectedGame(game.id)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-full ${getColorClass(game.color)}`}>
                    <IconComponent className="w-6 h-6" />
                  </div>
                  {isCompleted && (
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-warning fill-current" />
                    </div>
                  )}
                </div>

                <h4 className="font-semibold text-foreground mb-2">{game.title}</h4>
                <p className="text-sm text-muted-foreground mb-4">{game.description}</p>
                
                <div className="flex items-center justify-between text-xs">
                  <div className="flex gap-2">
                    <Badge variant="outline" className={`text-${getDifficultyColor(game.difficulty)}`}>
                      {game.difficulty}
                    </Badge>
                    <Badge variant="secondary">
                      {game.duration}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-1 text-warning">
                    <Trophy className="w-3 h-3" />
                    <span>{game.points}pts</span>
                  </div>
                </div>

                <Button 
                  className="w-full mt-4" 
                  size="sm"
                  disabled={isCompleted}
                >
                  {isCompleted ? 'Completed' : 'Play Now'}
                </Button>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Progress Summary */}
      <Card className="glass-card p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-success/10">
              <Trophy className="w-5 h-5 text-success" />
            </div>
            <div>
              <p className="font-medium">Today's Progress</p>
              <p className="text-sm text-muted-foreground">
                {completedGames.size}/{games.length} games completed
              </p>
            </div>
          </div>
          <div className="w-24 h-2 bg-muted rounded-full">
            <div 
              className="bg-success h-2 rounded-full transition-all duration-300"
              style={{ width: `${(completedGames.size / games.length) * 100}%` }}
            />
          </div>
        </div>
      </Card>
    </div>
  );
};