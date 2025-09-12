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

  const renderInstitutionStep = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <div className="text-center mb-8">
        <Shield className="w-12 h-12 text-primary mx-auto mb-4" />
        <h2 className="text-2xl font-semibold mb-2">
          Select your institution
        </h2>
        <p className="text-muted-foreground text-sm">
          Only your institution is shared with counsellors; your identity stays private.
        </p>
      </div>

      <Card className="glass-card p-6">
        <Label htmlFor="institution-search" className="font-medium mb-3 block">
          Search for your institution
        </Label>
        <input
          id="institution-search"
          type="text"
          placeholder="Start typing your institution name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-3 border border-border rounded-lg bg-background/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
        />
        
        <div className="mt-4 space-y-2 max-h-60 overflow-y-auto">
          <AnimatePresence>
            {filteredInstitutions.map((inst, index) => (
              <motion.button
                key={inst}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => setInstitution(inst)}
                className={`w-full text-left p-3 rounded-lg transition-all ${
                  institution === inst 
                    ? 'bg-primary/10 border-primary/30 text-primary' 
                    : 'bg-card hover:bg-card/80 border border-border'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">{inst}</span>
                  {institution === inst && <CheckCircle className="w-5 h-5" />}
                </div>
              </motion.button>
            ))}
          </AnimatePresence>
        </div>
      </Card>
    </motion.div>
  );

  const renderRoleStep = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <div className="text-center mb-8">
        <CheckCircle className="w-12 h-12 text-success mx-auto mb-4" />
        <h2 className="text-2xl font-semibold mb-2">
          I am a
        </h2>
        <p className="text-muted-foreground text-sm">
          This helps us connect you with the right resources.
        </p>
      </div>

      <Card className="glass-card p-6">
        <RadioGroup value={role} onValueChange={setRole}>
          <div className="space-y-4">
            {ROLES.map((roleOption, index) => (
              <motion.div
                key={roleOption.value}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`flex items-center space-x-3 p-4 rounded-lg border transition-all cursor-pointer ${
                  role === roleOption.value 
                    ? 'bg-primary/10 border-primary/30' 
                    : 'bg-card hover:bg-card/80 border-border'
                }`}
              >
                <RadioGroupItem 
                  value={roleOption.value} 
                  id={roleOption.value}
                  className="text-primary"
                />
                <Label 
                  htmlFor={roleOption.value} 
                  className="flex-1 font-medium cursor-pointer"
                >
                  {roleOption.label}
                </Label>
              </motion.div>
            ))}
          </div>
        </RadioGroup>
      </Card>
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
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-center mt-8"
          >
            <Button
              onClick={handleNext}
              disabled={!canProceed()}
              className="flex items-center gap-2 px-8 py-3"
            >
              {currentStep === totalSteps - 1 ? 'Get Started' : 'Continue'}
              <ArrowRight className="w-4 h-4" />
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default SimpleOnboarding;