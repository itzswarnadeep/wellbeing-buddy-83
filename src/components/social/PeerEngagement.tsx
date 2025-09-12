import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';
import { 
  Users, 
  MessageCircle, 
  Heart,
  Trophy,
  Star,
  Zap,
  Target,
  Gift,
  Flame,
  Award
} from 'lucide-react';

interface Challenge {
  id: string;
  title: string;
  description: string;
  participants: number;
  reward: number;
  difficulty: string;
  timeLeft: string;
  type: 'daily' | 'weekly' | 'community';
  color: string;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: any;
  unlocked: boolean;
  progress: number;
  maxProgress: number;
}

const challenges: Challenge[] = [
  {
    id: '1',
    title: 'Daily Mindfulness',
    description: 'Complete 3 mindful activities today',
    participants: 247,
    reward: 50,
    difficulty: 'Easy',
    timeLeft: '8h left',
    type: 'daily',
    color: 'success'
  },
  {
    id: '2',
    title: 'Gratitude Circle',
    description: 'Share 3 things you\'re grateful for',
    participants: 156,
    reward: 30,
    difficulty: 'Easy',
    timeLeft: '12h left',
    type: 'daily',
    color: 'warning'
  },
  {
    id: '3',
    title: 'Wellness Week',
    description: 'Complete daily wellness activities for 7 days',
    participants: 89,
    reward: 200,
    difficulty: 'Medium',
    timeLeft: '3 days left',
    type: 'weekly',
    color: 'primary'
  }
];

const achievements: Achievement[] = [
  {
    id: '1',
    title: 'First Steps',
    description: 'Complete your first mindfulness activity',
    icon: Star,
    unlocked: true,
    progress: 1,
    maxProgress: 1
  },
  {
    id: '2',
    title: 'Consistent Helper',
    description: 'Help 10 peers with encouragement',
    icon: Heart,
    unlocked: false,
    progress: 3,
    maxProgress: 10
  },
  {
    id: '3',
    title: 'Streak Master',
    description: 'Maintain a 30-day wellness streak',
    icon: Flame,
    unlocked: false,
    progress: 7,
    maxProgress: 30
  }
];

export const PeerEngagement = () => {
  const [activeTab, setActiveTab] = useState<'challenges' | 'achievements' | 'community'>('challenges');
  const [userPoints, setUserPoints] = useState(420);
  const [weeklyRank, setWeeklyRank] = useState(15);

  const getColorClass = (color: string) => {
    switch (color) {
      case 'primary': return 'bg-primary/10 text-primary border-primary/20';
      case 'success': return 'bg-success/10 text-success border-success/20';
      case 'warning': return 'bg-warning/10 text-warning border-warning/20';
      case 'accent': return 'bg-accent/10 text-accent border-accent/20';
      default: return 'bg-muted/10 text-muted-foreground border-muted/20';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy': return 'success';
      case 'medium': return 'warning';
      case 'hard': return 'destructive';
      default: return 'muted';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="glass-card p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-primary/10">
              <Trophy className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{userPoints}</p>
              <p className="text-sm text-muted-foreground">Total Points</p>
            </div>
          </div>
        </Card>

        <Card className="glass-card p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-accent/10">
              <Target className="w-5 h-5 text-accent" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">#{weeklyRank}</p>
              <p className="text-sm text-muted-foreground">Weekly Rank</p>
            </div>
          </div>
        </Card>

        <Card className="glass-card p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-success/10">
              <Flame className="w-5 h-5 text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">7</p>
              <p className="text-sm text-muted-foreground">Day Streak</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-2">
        {[
          { id: 'challenges', label: 'Challenges', icon: Target },
          { id: 'achievements', label: 'Achievements', icon: Award },
          { id: 'community', label: 'Community', icon: Users }
        ].map((tab) => {
          const IconComponent = tab.icon;
          return (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? "default" : "outline"}
              onClick={() => setActiveTab(tab.id as any)}
              className="flex items-center gap-2"
            >
              <IconComponent className="w-4 h-4" />
              {tab.label}
            </Button>
          );
        })}
      </div>

      {/* Challenges Tab */}
      {activeTab === 'challenges' && (
        <div className="space-y-4">
          {challenges.map((challenge) => (
            <motion.div
              key={challenge.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.02 }}
            >
              <Card className={`glass-card p-6 border ${getColorClass(challenge.color)}`}>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-semibold text-foreground">{challenge.title}</h4>
                      <Badge variant="outline" className={`text-${getDifficultyColor(challenge.difficulty)}`}>
                        {challenge.difficulty}
                      </Badge>
                      <Badge variant="secondary">
                        {challenge.type}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground mb-3">{challenge.description}</p>
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4 text-muted-foreground" />
                        <span>{challenge.participants} joined</span>
                      </div>
                      <div className="flex items-center gap-1 text-warning">
                        <Gift className="w-4 h-4" />
                        <span>{challenge.reward} points</span>
                      </div>
                      <span className="text-destructive">{challenge.timeLeft}</span>
                    </div>
                  </div>
                </div>
                <Button className="w-full">
                  Join Challenge
                </Button>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Achievements Tab */}
      {activeTab === 'achievements' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {achievements.map((achievement) => {
            const IconComponent = achievement.icon;
            const progressPercent = (achievement.progress / achievement.maxProgress) * 100;
            
            return (
              <motion.div
                key={achievement.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <Card className={`glass-card p-6 ${achievement.unlocked ? 'border-success/30 bg-success/5' : ''}`}>
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-full ${
                      achievement.unlocked ? 'bg-success/10 text-success' : 'bg-muted/10 text-muted-foreground'
                    }`}>
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-foreground">{achievement.title}</h4>
                        {achievement.unlocked && (
                          <Badge variant="outline" className="text-success border-success/30">
                            Unlocked
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{achievement.description}</p>
                      
                      {!achievement.unlocked && (
                        <div>
                          <div className="flex justify-between text-xs text-muted-foreground mb-1">
                            <span>Progress</span>
                            <span>{achievement.progress}/{achievement.maxProgress}</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2">
                            <div 
                              className="bg-primary h-2 rounded-full transition-all duration-300"
                              style={{ width: `${progressPercent}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Community Tab */}
      {activeTab === 'community' && (
        <div className="space-y-4">
          <Card className="glass-card p-6">
            <h4 className="font-semibold mb-4">Community Highlights</h4>
            <div className="space-y-4">
              {[
                { name: 'Alex M.', action: 'completed 30-day mindfulness streak', time: '2 hours ago', points: 500 },
                { name: 'Sarah K.', action: 'helped 5 peers today', time: '4 hours ago', points: 150 },
                { name: 'Jamie L.', action: 'shared gratitude post', time: '6 hours ago', points: 30 }
              ].map((activity, index) => (
                <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-muted/10">
                  <Avatar className="w-8 h-8">
                    <div className="w-full h-full bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center text-white text-sm font-medium">
                      {activity.name.split(' ').map(n => n[0]).join('')}
                    </div>
                  </Avatar>
                  <div className="flex-1">
                    <p className="text-sm">
                      <span className="font-medium">{activity.name}</span> {activity.action}
                    </p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                  <div className="flex items-center gap-1 text-warning">
                    <Zap className="w-3 h-3" />
                    <span className="text-xs">{activity.points}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="glass-card p-6">
            <h4 className="font-semibold mb-4">Encourage Others</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { name: 'Anonymous User', message: 'Struggling with focus today', mood: '😔' },
                { name: 'Anonymous User', message: 'Completed first meditation!', mood: '😊' }
              ].map((peer, index) => (
                <div key={index} className="p-4 rounded-lg bg-muted/10">
                  <div className="flex items-start gap-3 mb-3">
                    <span className="text-2xl">{peer.mood}</span>
                    <div>
                      <p className="font-medium text-sm">{peer.name}</p>
                      <p className="text-sm text-muted-foreground">{peer.message}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="flex items-center gap-1">
                      <Heart className="w-3 h-3" />
                      Support
                    </Button>
                    <Button size="sm" variant="outline" className="flex items-center gap-1">
                      <MessageCircle className="w-3 h-3" />
                      Encourage
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};