import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  MessageCircle, 
  Calendar, 
  BookOpen, 
  Activity,
  ArrowLeft,
  Users,
  Headphones,
  Play,
  Pause
} from 'lucide-react';
import { useStore } from '@/stores/useStore';
import { useAudio } from '@/components/audio/AudioManager';

const ProblemInterface = () => {
  const { problemId } = useParams<{ problemId: string }>();
  const { t } = useTranslation(['common', 'problems']);
  const navigate = useNavigate();
  const { student } = useStore();
  const audio = useAudio();
  const [activeTab, setActiveTab] = useState('support');

  if (!problemId) {
    navigate('/');
    return null;
  }

  const problemData = {
    title: t(`problems:${problemId}.title`),
    description: t(`problems:${problemId}.description`),
    welcomeMessage: t(`problems:${problemId}.welcome_message`)
  };

  const getThemeClass = (id: string) => {
    const themes: Record<string, string> = {
      relationship_issues: 'theme-relationship',
      placement_career_anxiety: 'theme-career', 
      academic_stress: 'theme-academic',
      family_personal_issues: 'theme-family',
      sleep_burnout: 'theme-sleep',
      social_isolation: 'theme-social',
      other_mixed: 'theme-mixed'
    };
    return themes[id] || 'theme-mixed';
  };

  const handleJoinChat = () => {
    navigate('/chat');
  };

  const handleBookCounselor = () => {
    navigate('/booking');
  };

  const mockResources = [
    {
      title: 'Understanding Your Emotions',
      type: 'Video',
      duration: '12 min',
      description: 'Learn healthy ways to process difficult emotions'
    },
    {
      title: 'Breathing Techniques Guide',
      type: 'Audio',
      duration: '8 min', 
      description: 'Guided breathing exercises for immediate relief'
    },
    {
      title: 'Self-Care Checklist',
      type: 'PDF',
      duration: '5 min read',
      description: 'Daily practices for mental wellness'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-soothing relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-ambient opacity-20" />
      
      {/* Header */}
      <header className="relative z-10 p-6 border-b border-border/50 glass-card">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Button>
          
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="flex items-center gap-2">
              <Users className="w-3 h-3" />
              {student?.ephemeralHandle || 'Anonymous User'}
            </Badge>
            
            <Button
              variant="outline"
              size="sm"
              onClick={audio.isPlaying ? audio.pause : () => audio.play('ambient')}
              className="flex items-center gap-2"
            >
              {audio.isPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
              <Headphones className="w-3 h-3" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 px-6 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Problem Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`glass-card p-8 mb-8 ${getThemeClass(problemId)}`}
          >
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-3xl font-playfair font-semibold mb-4">
                {problemData.title}
              </h1>
              <p className="text-lg text-muted-foreground mb-6">
                {problemData.description}
              </p>
              <Card className="glass-card p-4 bg-card/50">
                <p className="text-foreground font-medium">
                  {problemData.welcomeMessage}
                </p>
              </Card>
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
          >
            <Card className="glass-card p-6 hover:shadow-ambient transition-all cursor-pointer" onClick={handleJoinChat}>
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-primary/10">
                  <MessageCircle className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Anonymous Chat</h3>
                  <p className="text-sm text-muted-foreground">Connect with peers facing similar challenges</p>
                </div>
              </div>
            </Card>

            <Card className="glass-card p-6 hover:shadow-ambient transition-all cursor-pointer" onClick={handleBookCounselor}>
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-accent/10">
                  <Calendar className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Book Counselor</h3>
                  <p className="text-sm text-muted-foreground">Professional support when you need it</p>
                </div>
              </div>
            </Card>

            <Card className="glass-card p-6 hover:shadow-ambient transition-all cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-success/10">
                  <Activity className="w-6 h-6 text-success" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Track Progress</h3>
                  <p className="text-sm text-muted-foreground">Monitor your wellness journey</p>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Tabbed Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3 glass-card">
                <TabsTrigger value="support">Support & Chat</TabsTrigger>
                <TabsTrigger value="resources">Resources</TabsTrigger>
                <TabsTrigger value="activities">Activities</TabsTrigger>
              </TabsList>

              <TabsContent value="support" className="mt-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card className="glass-card p-6">
                    <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                      <Users className="w-5 h-5" />
                      Anonymous Support Chat
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Join others who understand what you're going through. All conversations are anonymous and moderated for safety.
                    </p>
                    <Button className="w-full" onClick={handleJoinChat}>
                      Join Anonymous Chat
                    </Button>
                  </Card>

                  <Card className="glass-card p-6">
                    <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                      <Calendar className="w-5 h-5" />
                      Professional Support
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Connect with trained counselors. Your identity remains private by default, with optional reveal only when you choose.
                    </p>
                    <Button variant="outline" className="w-full" onClick={handleBookCounselor}>
                      Book Counselor Session
                    </Button>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="resources" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {mockResources.map((resource, index) => (
                    <Card key={index} className="glass-card p-6 hover:shadow-ambient transition-all">
                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded-lg bg-primary/10">
                          <BookOpen className="w-5 h-5 text-primary" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-foreground mb-1">{resource.title}</h4>
                          <Badge variant="outline" className="mb-2 text-xs">
                            {resource.type} • {resource.duration}
                          </Badge>
                          <p className="text-sm text-muted-foreground mb-3">
                            {resource.description}
                          </p>
                          <Button variant="ghost" size="sm" className="text-primary">
                            Access Resource
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="activities" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="glass-card p-6">
                    <h3 className="font-semibold text-foreground mb-4">Breathing Exercise</h3>
                    <div className="text-center py-8">
                      <motion.div
                        className="w-24 h-24 mx-auto rounded-full bg-gradient-primary opacity-60 breathing-circle mb-6"
                      />
                      <p className="text-muted-foreground mb-4">
                        Follow the circle's rhythm for guided breathing
                      </p>
                      <Button>Start Breathing Exercise</Button>
                    </div>
                  </Card>

                  <Card className="glass-card p-6">
                    <h3 className="font-semibold text-foreground mb-4">Mood Journal</h3>
                    <p className="text-muted-foreground mb-4">
                      Reflect on your thoughts and feelings in a private, secure space.
                    </p>
                    <div className="space-y-3">
                      <div className="text-sm">
                        <span className="font-medium">Today's Mood:</span> 
                        <div className="flex gap-2 mt-2">
                          {['😊', '😐', '😔', '😟', '😢'].map((emoji, i) => (
                            <Button key={i} variant="outline" size="sm" className="p-2 h-auto">
                              {emoji}
                            </Button>
                          ))}
                        </div>
                      </div>
                      <Button variant="outline" className="w-full">
                        Open Journal
                      </Button>
                    </div>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default ProblemInterface;