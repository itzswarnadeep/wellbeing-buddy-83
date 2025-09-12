import { useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, MessageCircle, Calendar, Users, AlertTriangle, Phone, Video } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

// Mock data - In real app, this would come from backend
const MOCK_REQUESTS = [
  {
    id: '1',
    studentId: 'anon_student_001',
    institution: 'University of Kashmir',
    type: 'urgent',
    message: 'Need immediate support for anxiety',
    timestamp: new Date(Date.now() - 30 * 60 * 1000),
    status: 'pending'
  },
  {
    id: '2', 
    studentId: 'anon_student_002',
    institution: 'University of Kashmir',
    type: 'scheduled',
    message: 'Would like to schedule a session for academic stress',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    status: 'pending'
  },
  {
    id: '3',
    studentId: 'anon_student_003', 
    institution: 'University of Kashmir',
    type: 'chat',
    message: 'Feeling overwhelmed with coursework',
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
    status: 'active'
  }
];

const CounsellorDashboard = () => {
  const [requests, setRequests] = useState(MOCK_REQUESTS);
  const [activeTab, setActiveTab] = useState('all');

  const urgentRequests = requests.filter(r => r.type === 'urgent');
  const pendingRequests = requests.filter(r => r.status === 'pending');

  const handleAcceptRequest = (requestId: string) => {
    setRequests(prev => 
      prev.map(req => 
        req.id === requestId 
          ? { ...req, status: 'active' }
          : req
      )
    );
  };

  const formatTimeAgo = (timestamp: Date) => {
    const minutes = Math.floor((Date.now() - timestamp.getTime()) / (1000 * 60));
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    return `${hours}h ago`;
  };

  return (
    <div className="min-h-screen bg-gradient-soothing p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold mb-2">Counsellor Dashboard</h1>
          <p className="text-muted-foreground">Monitor and respond to student support requests</p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="glass-card p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-destructive/10 rounded-full flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-destructive" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{urgentRequests.length}</p>
                  <p className="text-sm text-muted-foreground">Urgent Requests</p>
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="glass-card p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-warning/10 rounded-full flex items-center justify-center">
                  <Bell className="w-6 h-6 text-warning" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{pendingRequests.length}</p>
                  <p className="text-sm text-muted-foreground">Pending</p>
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="glass-card p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <MessageCircle className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">2</p>
                  <p className="text-sm text-muted-foreground">Active Chats</p>
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="glass-card p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-success/10 rounded-full flex items-center justify-center">
                  <Users className="w-6 h-6 text-success" />
                </div>
                <div>
                  <p className="text-2xl font-bold">15</p>
                  <p className="text-sm text-muted-foreground">Helped Today</p>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Requests List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="glass-card p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold">Student Requests</h2>
              <div className="flex gap-2">
                <Button
                  variant={activeTab === 'all' ? 'default' : 'outline'}
                  onClick={() => setActiveTab('all')}
                  size="sm"
                >
                  All
                </Button>
                <Button
                  variant={activeTab === 'urgent' ? 'default' : 'outline'}
                  onClick={() => setActiveTab('urgent')}
                  size="sm"
                >
                  Urgent
                </Button>
                <Button
                  variant={activeTab === 'pending' ? 'default' : 'outline'}
                  onClick={() => setActiveTab('pending')}
                  size="sm"
                >
                  Pending
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              {requests
                .filter(req => {
                  if (activeTab === 'urgent') return req.type === 'urgent';
                  if (activeTab === 'pending') return req.status === 'pending';
                  return true;
                })
                .map((request, index) => (
                  <motion.div
                    key={request.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      request.type === 'urgent' 
                        ? 'border-destructive/30 bg-destructive/5' 
                        : 'border-border bg-card/50'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <Badge variant={request.type === 'urgent' ? 'destructive' : 'secondary'}>
                            {request.type === 'urgent' ? '🚨 Urgent' : 
                             request.type === 'scheduled' ? '📅 Scheduled' : '💬 Chat'}
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            {request.studentId} • {formatTimeAgo(request.timestamp)}
                          </span>
                        </div>
                        <p className="font-medium mb-1">{request.message}</p>
                        <p className="text-sm text-muted-foreground">{request.institution}</p>
                      </div>
                      
                      <div className="flex gap-2">
                        {request.status === 'pending' && (
                          <>
                            <Button
                              size="sm"
                              onClick={() => handleAcceptRequest(request.id)}
                              className="bg-primary hover:bg-primary/90"
                            >
                              Accept
                            </Button>
                            {request.type === 'urgent' && (
                              <Button size="sm" variant="outline" className="gap-2">
                                <Phone className="w-4 h-4" />
                                Call
                              </Button>
                            )}
                          </>
                        )}
                        
                        {request.status === 'active' && (
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" className="gap-2">
                              <MessageCircle className="w-4 h-4" />
                              Chat
                            </Button>
                            <Button size="sm" variant="outline" className="gap-2">
                              <Video className="w-4 h-4" />
                              Video
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
            </div>
          </Card>
        </motion.div>

        {/* Backend Required Notice */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-8 p-4 bg-warning/10 border border-warning/20 rounded-lg"
        >
          <div className="flex items-center gap-2 text-warning">
            <AlertTriangle className="w-5 h-5" />
            <span className="font-medium">Backend Integration Required</span>
          </div>
          <p className="text-sm mt-2 text-muted-foreground">
            To receive real student requests and enable communication features, connect this app to Supabase using the green button in the top right.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default CounsellorDashboard;