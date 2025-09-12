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
  Shield
} from 'lucide-react';
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
      title: 'Start Anonymous Chat',
      description: 'Connect instantly with available counsellors',
      icon: MessageCircle,
      color: 'primary',
      action: () => navigate('/chat')
    },
    {
      title: 'Book Appointment', 
      description: 'Schedule a session with your preferred counsellor',
      icon: Calendar,
      color: 'accent',
      action: () => navigate('/booking')
    },
    {
      title: 'Resource Library',
      description: 'Self-help articles, videos, and workshops',
      icon: BookOpen,
      color: 'success',
      action: () => navigate('/resources')
    },
    {
      title: 'Emergency Support',
      description: '24/7 crisis helpline and immediate assistance',
      icon: AlertCircle,
      color: 'destructive',
      action: () => navigate('/emergency')
    }
  ];

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

  return (
    <div className="min-h-screen bg-gradient-soothing relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-ambient opacity-20" />
      
      {/* Header */}
      <div className="relative z-10 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Welcome back, {student?.ephemeralHandle}
              </h1>
              <p className="text-muted-foreground">
                Connected to {student?.institutionCode} • Anonymous & Secure
              </p>
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
        <div className="max-w-6xl mx-auto space-y-8">
          
          {/* Quick Actions - Magic Bento Layout */}
          <section>
            <h2 className="text-2xl font-semibold mb-6">Quick Actions</h2>
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
                      onClick={action.action}
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

          {/* Available Counsellors */}
          <section>
            <h2 className="text-2xl font-semibold mb-6">Available Counsellors</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {COUNSELLORS.map((counsellor, index) => (
                <motion.div
                  key={counsellor.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.15 }}
                >
                  <Card className="glass-card p-6 hover:shadow-lg transition-all duration-200">
                    <div className="space-y-4">
                      {/* Header */}
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-lg">{counsellor.name}</h3>
                          <p className="text-sm text-muted-foreground">{counsellor.designation}</p>
                          <p className="text-xs text-muted-foreground">{counsellor.department}</p>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          <span className="text-sm font-medium">{counsellor.rating}</span>
                        </div>
                      </div>

                      {/* Specializations */}
                      <div className="flex flex-wrap gap-2">
                        {counsellor.specializations.map((spec) => (
                          <Badge key={spec} variant="secondary" className="text-xs">
                            {spec}
                          </Badge>
                        ))}
                      </div>

                      {/* Contact Methods */}
                      <div className="flex gap-2">
                        {counsellor.contactMethods.map((method) => {
                          const IconComponent = getContactIcon(method);
                          return (
                            <div 
                              key={method}
                              className="flex items-center gap-1 px-2 py-1 bg-muted/20 rounded text-xs"
                            >
                              <IconComponent className="w-3 h-3" />
                              <span className="capitalize">{method}</span>
                            </div>
                          );
                        })}
                      </div>

                      {/* Available Slots */}
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Clock className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm font-medium">Next Available</span>
                        </div>
                        <div className="space-y-1">
                          {counsellor.availableSlots.slice(0, 2).map((slot) => (
                            <div key={slot} className="text-sm text-success">
                              {slot}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2 pt-4">
                        <Button 
                          size="sm" 
                          className="flex-1"
                          onClick={() => navigate(`/chat?counsellor=${counsellor.id}`)}
                        >
                          <MessageCircle className="w-4 h-4 mr-2" />
                          Chat Now
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="flex-1"
                          onClick={() => navigate(`/booking?counsellor=${counsellor.id}`)}
                        >
                          <Calendar className="w-4 h-4 mr-2" />
                          Book
                        </Button>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;