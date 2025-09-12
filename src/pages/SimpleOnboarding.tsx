import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ArrowRight, Shield, CheckCircle } from 'lucide-react';
import { useStore } from '@/stores/useStore';

// Mock institutions data
const INSTITUTIONS = [
  "University of Kashmir",
  "National Institute of Technology Srinagar", 
  "Government Medical College Srinagar",
  "Jammu University",
  "IIT Delhi",
  "Delhi University",
  "Jawaharlal Nehru University"
];

const ROLES = [
  { value: "student", label: "Student" },
  { value: "counsellor", label: "Counsellor" },
  { value: "staff", label: "Staff" }
];

const SimpleOnboarding = () => {
  const { t } = useTranslation(['common', 'ui']);
  const navigate = useNavigate();
  const { setStudent, completeOnboarding } = useStore();
  
  const [currentStep, setCurrentStep] = useState(0);
  const [institution, setInstitution] = useState('');
  const [role, setRole] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const totalSteps = 2;
  const progress = ((currentStep + 1) / totalSteps) * 100;

  const filteredInstitutions = INSTITUTIONS.filter(inst => 
    inst.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleNext = () => {
    if (currentStep === 0 && institution) {
      setCurrentStep(1);
    } else if (currentStep === 1 && role) {
      handleComplete();
    }
  };

  const handleComplete = () => {
    // Create anonymous profile
    const anonId = `anon_${Math.random().toString(36).substr(2, 9)}`;
    
    setStudent({
      token: anonId,
      institutionCode: institution,
      ephemeralHandle: anonId,
      language: 'en',
      role: role as 'student' | 'counsellor' | 'staff',
      consentFlags: {
        dataProcessing: true,
        anonymousChat: true,
        counselorContact: false
      },
      createdAt: new Date()
    });

    completeOnboarding();
    
    // Navigate based on role
    if (role === 'student') {
      navigate('/dashboard');
    } else if (role === 'counsellor') {
      navigate('/counsellor-dashboard');
    } else {
      navigate('/dashboard');
    }
  };

  const canProceed = () => {
    if (currentStep === 0) return institution.length > 0;
    if (currentStep === 1) return role.length > 0;
    return false;
  };

  const playSelectionSound = () => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
      
      oscillator.start();
      oscillator.stop(audioContext.currentTime + 0.3);
    } catch (e) {
      console.log('Audio not available');
    }
  };

  const renderInstitutionStep = () => (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="space-y-6"
    >
      <motion.div 
        className="text-center mb-8"
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <motion.div
          animate={{ rotateY: [0, 360] }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center"
        >
          <Shield className="w-8 h-8 text-white" />
        </motion.div>
        <motion.h2 
          className="text-3xl font-bold mb-3 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          Select your institution
        </motion.h2>
        <motion.p 
          className="text-muted-foreground text-sm max-w-md mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          Only your institution is shared with counsellors; your identity stays completely private.
        </motion.p>
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <Card className="glass-card p-8 backdrop-blur-lg border-2 border-white/20 shadow-2xl">
          <Label htmlFor="institution-search" className="font-semibold mb-4 block text-lg">
            🏫 Search for your institution
          </Label>
          <motion.input
            id="institution-search"
            type="text"
            placeholder="Start typing your institution name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-4 border-2 border-border rounded-2xl bg-background/80 focus:outline-none focus:ring-4 focus:ring-primary/30 focus:border-primary transition-all duration-300 text-lg"
            whileFocus={{ scale: 1.02 }}
          />
          
          <div className="mt-6 space-y-3 max-h-80 overflow-y-auto custom-scrollbar">
            <AnimatePresence>
              {filteredInstitutions.map((inst, index) => (
                <motion.button
                  key={inst}
                  initial={{ opacity: 0, x: -20, scale: 0.95 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: 20, scale: 0.95 }}
                  transition={{ 
                    delay: index * 0.08,
                    type: "spring",
                    stiffness: 200,
                    damping: 20
                  }}
                  whileHover={{ 
                    scale: 1.02,
                    y: -2,
                    transition: { duration: 0.2 }
                  }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setInstitution(inst);
                    playSelectionSound();
                  }}
                  className={`w-full text-left p-5 rounded-2xl transition-all duration-300 transform group ${
                    institution === inst 
                      ? 'bg-gradient-to-r from-primary/20 to-accent/20 border-2 border-primary/50 text-primary shadow-lg' 
                      : 'bg-card/60 hover:bg-card/80 border-2 border-transparent hover:border-primary/20 hover:shadow-md'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-lg group-hover:text-primary transition-colors">
                      {inst}
                    </span>
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: institution === inst ? 1 : 0 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <CheckCircle className="w-6 h-6 text-primary" />
                    </motion.div>
                  </div>
                </motion.button>
              ))}
            </AnimatePresence>
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );

  const renderRoleStep = () => (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="space-y-6"
    >
      <motion.div 
        className="text-center mb-8"
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <motion.div
          animate={{ 
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0]
          }}
          transition={{ 
            duration: 2, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-r from-success to-accent flex items-center justify-center"
        >
          <CheckCircle className="w-8 h-8 text-white" />
        </motion.div>
        <motion.h2 
          className="text-3xl font-bold mb-3 bg-gradient-to-r from-success to-accent bg-clip-text text-transparent"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          I am a
        </motion.h2>
        <motion.p 
          className="text-muted-foreground text-sm max-w-md mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          This helps us connect you with the right resources and support network.
        </motion.p>
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <Card className="glass-card p-8 backdrop-blur-lg border-2 border-white/20 shadow-2xl">
          <div className="space-y-4">
            {ROLES.map((roleOption, index) => (
              <motion.div
                key={roleOption.value}
                initial={{ opacity: 0, x: -30, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                transition={{ 
                  delay: index * 0.15,
                  type: "spring",
                  stiffness: 200,
                  damping: 20
                }}
                whileHover={{ 
                  scale: 1.03,
                  y: -3,
                  transition: { duration: 0.2 }
                }}
                whileTap={{ scale: 0.97 }}
                onClick={() => {
                  setRole(roleOption.value);
                  playSelectionSound();
                }}
                className={`flex items-center space-x-4 p-6 rounded-2xl border-2 transition-all cursor-pointer group transform ${
                  role === roleOption.value 
                    ? 'bg-gradient-to-r from-primary/20 to-accent/20 border-primary/50 shadow-lg' 
                    : 'bg-card/60 hover:bg-card/80 border-transparent hover:border-primary/20 hover:shadow-md'
                }`}
              >
                <motion.div
                  animate={{ 
                    scale: role === roleOption.value ? [1, 1.2, 1] : 1,
                    rotate: role === roleOption.value ? [0, 360] : 0
                  }}
                  transition={{ duration: 0.5 }}
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    role === roleOption.value
                      ? 'border-primary bg-primary'
                      : 'border-muted group-hover:border-primary'
                  }`}
                >
                  {role === roleOption.value && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-3 h-3 bg-white rounded-full"
                    />
                  )}
                </motion.div>
                <Label 
                  className="flex-1 font-semibold text-xl cursor-pointer group-hover:text-primary transition-colors"
                >
                  {roleOption.label === 'Student' && '🎓 '}
                  {roleOption.label === 'Counsellor' && '👨‍⚕️ '}
                  {roleOption.label === 'Staff' && '👥 '}
                  {roleOption.label}
                </Label>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: role === roleOption.value ? 1 : 0 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <CheckCircle className="w-6 h-6 text-primary" />
                </motion.div>
              </motion.div>
            ))}
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-soothing relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-ambient opacity-20" />
      
      {/* Header */}
      <div className="relative z-10 p-6">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Student Support
            </h1>
            <p className="text-muted-foreground">
              We're here to help — quick setup so you can connect with your campus counsellors anonymously.
            </p>
          </div>
          
          <Progress value={progress} className="mb-8 h-2" />
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 px-6 pb-12">
        <div className="max-w-2xl mx-auto">
          <AnimatePresence mode="wait">
            {currentStep === 0 && renderInstitutionStep()}
            {currentStep === 1 && renderRoleStep()}
          </AnimatePresence>

          {/* Navigation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="flex justify-center mt-12"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                onClick={handleNext}
                disabled={!canProceed()}
                className="flex items-center gap-3 px-12 py-4 text-lg font-semibold rounded-2xl bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {currentStep === totalSteps - 1 ? '🚀 Get Started' : '✨ Continue'}
                <motion.div
                  animate={{ x: canProceed() ? [0, 5, 0] : 0 }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                >
                  <ArrowRight className="w-5 h-5" />
                </motion.div>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default SimpleOnboarding;