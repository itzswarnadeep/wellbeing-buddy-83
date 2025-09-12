import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  MessageSquare, 
  Users, 
  Calendar,
  Brain,
  Heart,
  Shield,
  Phone,
  Video,
  Clock,
  TrendingUp,
  AlertTriangle,
  BookOpen
} from 'lucide-react';

const CounsellorLandingPage = () => {
  const { t } = useTranslation(['common']);
  const navigate = useNavigate();

  const features = [
    {
      title: 'Anonymous Student Connect',
      description: 'Receive anonymous requests from students who need support',
      icon: MessageSquare,
      color: 'primary',
      action: () => navigate('/counsellor/dashboard')
    },
    {
      title: 'Session Management',
      description: 'Schedule and manage your counseling sessions',
      icon: Calendar,
      color: 'accent',
      action: () => navigate('/counsellor/sessions')
    },
    {
      title: 'Crisis Intervention',
      description: 'Immediate alerts for urgent student assistance requests',
      icon: AlertTriangle,
      color: 'destructive',
      action: () => navigate('/counsellor/alerts')
    },
    {
      title: 'Resource Library',
      description: 'Access professional resources and student materials',
      icon: BookOpen,
      color: 'success',
      action: () => navigate('/counsellor/resources')
    }
  ];

  const stats = [
    { label: 'Active Students', value: '47', icon: Users, color: 'primary' },
    { label: 'Sessions Today', value: '8', icon: Calendar, color: 'accent' },
    { label: 'Pending Requests', value: '3', icon: MessageSquare, color: 'warning' },
    { label: 'Emergency Alerts', value: '1', icon: AlertTriangle, color: 'destructive' }
  ];

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

  return (
    <div className="min-h-screen bg-gradient-soothing relative overflow-hidden">
      {/* Live Wallpaper Background */}
      <div className="absolute inset-0 bg-gradient-ambient opacity-30" />
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-accent/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-success/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }} />
      </div>

      {/* Header */}
      <div className="relative z-10 p-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="p-3 rounded-full bg-primary/10">
                <Brain className="w-8 h-8 text-primary" />
              </div>
              <h1 className="text-4xl font-bold text-foreground">Counsellor Portal</h1>
            </div>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Support student mental health with our secure, anonymous platform
            </p>
          </motion.div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className={`glass-card p-6 hover:scale-105 transition-all duration-200 border ${getColorClass(stat.color)}`}>
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-full ${getColorClass(stat.color)}`}>
                        <IconComponent className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                        <p className="text-sm text-muted-foreground">{stat.label}</p>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          {/* Main Features */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.15 }}
                >
                  <Card 
                    className={`glass-card p-8 hover:scale-105 transition-all duration-200 cursor-pointer border ${getColorClass(feature.color)}`}
                    onClick={feature.action}
                  >
                    <div className="flex items-start gap-6">
                      <div className={`p-4 rounded-full ${getColorClass(feature.color)}`}>
                        <IconComponent className="w-8 h-8" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-foreground mb-2">{feature.title}</h3>
                        <p className="text-muted-foreground mb-4">{feature.description}</p>
                        <Button className="btn-ambient">
                          Access Now
                        </Button>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="text-center"
          >
            <Card className="glass-card p-8 max-w-4xl mx-auto">
              <h2 className="text-2xl font-semibold text-foreground mb-6">Quick Actions</h2>
              <div className="flex flex-wrap justify-center gap-4">
                <Button 
                  onClick={() => navigate('/counsellor/dashboard')}
                  className="flex items-center gap-2"
                >
                  <MessageSquare className="w-4 h-4" />
                  View Requests
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => navigate('/counsellor/sessions')}
                  className="flex items-center gap-2"
                >
                  <Calendar className="w-4 h-4" />
                  Today's Schedule
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => navigate('/counsellor/alerts')}
                  className="flex items-center gap-2"
                >
                  <AlertTriangle className="w-4 h-4" />
                  Crisis Alerts
                </Button>
              </div>
            </Card>
          </motion.div>

          {/* Privacy Notice */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-8 text-center"
          >
            <div className="flex items-center justify-center gap-2 text-muted-foreground">
              <Shield className="w-4 h-4" />
              <span className="text-sm">All student interactions are anonymous and secure</span>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default CounsellorLandingPage;