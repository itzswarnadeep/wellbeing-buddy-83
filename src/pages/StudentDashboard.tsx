import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  MessageCircle, 
  Calendar, 
  BookOpen, 
  AlertCircle,
  Users,
  Phone,
  Video,
  Clock,
  MapPin,
  Star,
  Shield,
  Heart,
  ArrowLeft,
  Home
} from 'lucide-react';
import { MindfulnessGames } from '@/components/games/MindfulnessGames';
import { RelaxationHub } from '@/components/music/RelaxationHub';
import { PeerEngagement } from '@/components/social/PeerEngagement';
import { useStore } from '@/stores/useStore';

// Mock counsellor data
const COUNSELLORS = [
  {
    id: 'c1',
    name: 'Dr. Sarah Johnson',
    designation: 'Clinical Psychologist',
    department: 'Student Wellness Center',
    specializations: ['Anxiety', 'Depression', 'Academic Stress'],
    rating: 4.8,
    availableSlots: ['Today 2:00 PM', 'Tomorrow 10:00 AM', 'Tomorrow 3:00 PM'],
    contactMethods: ['chat', 'video', 'in-person'],
    location: 'Wellness Center, Room 204'
  },
  {
    id: 'c2', 
    name: 'Prof. Michael Chen',
    designation: 'Counselling Psychologist',
    department: 'Mental Health Services',
    specializations: ['Career Anxiety', 'Relationship Issues', 'Life Transitions'],
    rating: 4.9,
    availableSlots: ['Today 4:00 PM', 'Tomorrow 1:00 PM'],
    contactMethods: ['chat', 'phone', 'video'],
    location: 'Health Center, 3rd Floor'
  },
  {
    id: 'c3',
    name: 'Dr. Priya Sharma',
    designation: 'Mental Health Counsellor',
    department: 'Student Support Services', 
    specializations: ['Family Issues', 'Cultural Adjustment', 'Sleep Issues'],
    rating: 4.7,
    availableSlots: ['Tomorrow 9:00 AM', 'Tomorrow 2:00 PM', 'Day after 11:00 AM'],
    contactMethods: ['chat', 'video', 'in-person'],
    location: 'Student Center, Room 105'
  }
];

const StudentDashboard = () => {
  const { t } = useTranslation(['common', 'ui']);
  const navigate = useNavigate();
  const { student } = useStore();
  const [selectedCounsellor, setSelectedCounsellor] = useState<string | null>(null);

  const quickActions = [
    {
      title: 'Mindful Games',
      description: 'Interactive wellness games and challenges',
      icon: Users,
      color: 'primary',
      section: 'games',
      cursorType: 'game'
    },
    {
      title: 'Relaxation Hub', 
      description: 'Soothing music and ambient sounds',
      icon: Heart,
      color: 'accent',
      section: 'music',
      cursorType: 'music'
    },
    {
      title: 'Peer Connect',
      description: 'Community challenges and peer support',
      icon: Star,
      color: 'success',
      section: 'social',
      cursorType: 'relaxation'
    },
    {
      title: 'Quick Chat',
      description: 'Anonymous support when you need it',
      icon: MessageCircle,
      color: 'warning',
      action: () => navigate('/chat'),
      cursorType: 'default'
    }
  ];

  const [activeSection, setActiveSection] = useState<'overview' | 'games' | 'music' | 'social'>('overview');

  const getContactIcon = (method: string) => {
    switch (method) {
      case 'chat': return MessageCircle;
      case 'phone': return Phone;
      case 'video': return Video;
      default: return MapPin;
    }
  };

  const getColorClass = (color: string) => {
    switch (color) {
      case 'primary': return 'bg-primary/10 text-primary border-primary/20';
      case 'accent': return 'bg-accent/10 text-accent border-accent/20';
      case 'success': return 'bg-success/10 text-success border-success/20';
      case 'destructive': return 'bg-destructive/10 text-destructive border-destructive/20';
      default: return 'bg-muted/10 text-muted-foreground border-muted/20';
    }
  };

  const handleSectionClick = (action: { section?: string; action?: () => void; cursorType: string }) => {
    if (action.section) {
      setActiveSection(action.section as any);
    } else if (action.action) {
      action.action();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-soothing relative overflow-hidden">
      {/* Live Wallpaper Background */}
      <div className="absolute inset-0 bg-gradient-ambient opacity-20" />
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-80 h-80 bg-primary/3 rounded-full blur-3xl animate-pulse float" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-accent/3 rounded-full blur-3xl animate-pulse float" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-success/3 rounded-full blur-3xl animate-pulse float" style={{ animationDelay: '4s' }} />
        <div className="absolute top-20 right-1/4 w-64 h-64 bg-warning/3 rounded-full blur-3xl animate-pulse float" style={{ animationDelay: '1s' }} />
      </div>
      
      {/* Header */}
      <div className="relative z-10 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-4">
              {activeSection !== 'overview' && (
                <Button
                  variant="ghost"
                  onClick={() => setActiveSection('overview')}
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </Button>
              )}
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">
                  {activeSection === 'overview' && `Welcome back, ${student?.ephemeralHandle}`}
                  {activeSection === 'games' && 'Mindful Games'}
                  {activeSection === 'music' && 'Relaxation Hub'}
                  {activeSection === 'social' && 'Peer Connect'}
                </h1>
                <p className="text-muted-foreground">
                  {activeSection === 'overview' && `Connected to ${student?.institutionCode} • Anonymous & Secure`}
                  {activeSection === 'games' && 'Interactive wellness activities for your mental health'}
                  {activeSection === 'music' && 'Soothing sounds and music for relaxation'}
                  {activeSection === 'social' && 'Connect with peers and join wellness challenges'}
                </p>
              </div>
            </div>
            <Badge variant="outline" className="px-4 py-2">
              <Shield className="w-4 h-4 mr-2" />
              Anonymous Mode
            </Badge>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 px-6 pb-12">
        <div className="max-w-6xl mx-auto">
          
          {/* Overview Section */}
          {activeSection === 'overview' && (
            <div className="space-y-8">
              {/* Quick Actions - Magic Bento Layout */}
              <section>
                <h2 className="text-2xl font-semibold mb-6">Wellness Dashboard</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {quickActions.map((action, index) => {
                    const IconComponent = action.icon;
                    return (
                      <motion.div
                        key={action.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Card 
                          className={`glass-card p-6 hover:scale-105 transition-all duration-200 cursor-pointer border ${getColorClass(action.color)}`}
                          onClick={() => handleSectionClick(action)}
                          data-cursor={action.cursorType}
                        >
                          <div className="flex flex-col items-center text-center space-y-4">
                            <div className={`p-4 rounded-full ${getColorClass(action.color)}`}>
                              <IconComponent className="w-8 h-8" />
                            </div>
                            <div>
                              <h3 className="font-semibold mb-2">{action.title}</h3>
                              <p className="text-sm text-muted-foreground">{action.description}</p>
                            </div>
                          </div>
                        </Card>
                      </motion.div>
                    );
                  })}
                </div>
              </section>

              {/* Mood Check-in */}
              <section>
                <Card className="glass-card p-6">
                  <h3 className="text-xl font-semibold mb-4">Quick Mood Check-in</h3>
                  <p className="text-muted-foreground mb-4">How are you feeling today?</p>
                  <div className="flex gap-3 justify-center">
                    {['😊', '😐', '😔', '😴', '😤'].map((emoji, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        className="w-16 h-16 text-2xl hover:scale-110 transition-all"
                      >
                        {emoji}
                      </Button>
                    ))}
                  </div>
                </Card>
              </section>

              {/* Quick Counsellor Access */}
              <section>
                <h2 className="text-2xl font-semibold mb-6">Available Support</h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {COUNSELLORS.slice(0, 2).map((counsellor, index) => (
                    <Card key={counsellor.id} className="glass-card p-6">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 rounded-full bg-primary/10">
                          <Users className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-semibold">{counsellor.name}</h4>
                          <p className="text-sm text-muted-foreground">{counsellor.designation}</p>
                        </div>
                      </div>
                      <Button className="w-full" onClick={() => navigate('/chat')}>
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Start Anonymous Chat
                      </Button>
                    </Card>
                  ))}
                </div>
              </section>
            </div>
          )}

          {/* Games Section */}
          {activeSection === 'games' && (
            <div data-cursor="game">
              <MindfulnessGames />
            </div>
          )}

          {/* Music Section */}
          {activeSection === 'music' && (
            <div data-cursor="music">
              <RelaxationHub />
            </div>
          )}

          {/* Social Section */}
          {activeSection === 'social' && (
            <div data-cursor="relaxation">
              <PeerEngagement />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;