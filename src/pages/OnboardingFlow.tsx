import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Shield, 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle, 
  AlertTriangle,
  Heart,
  Users
} from 'lucide-react';
import { useStore, calculatePHQ9Score, calculateGAD7Score, mapToProblemInterface } from '@/stores/useStore';

// PHQ-9 Questions
const PHQ9_QUESTIONS = [
  "Little interest or pleasure in doing things",
  "Feeling down, depressed, or hopeless", 
  "Trouble falling or staying asleep, or sleeping too much",
  "Feeling tired or having little energy",
  "Poor appetite or overeating",
  "Feeling bad about yourself or that you are a failure or have let yourself or your family down",
  "Trouble concentrating on things, such as reading the newspaper or watching television",
  "Moving or speaking so slowly that other people could have noticed, or the opposite being so fidgety or restless that you have been moving around a lot more than usual",
  "Thoughts that you would be better off dead, or of hurting yourself"
];

// GAD-7 Questions
const GAD7_QUESTIONS = [
  "Feeling nervous, anxious, or on edge",
  "Not being able to stop or control worrying",
  "Worrying too much about different things",
  "Trouble relaxing",
  "Being so restless that it is hard to sit still",
  "Becoming easily annoyed or irritable",
  "Feeling afraid, as if something awful might happen"
];

const ANSWER_OPTIONS = [
  { value: 0, label: "Not at all" },
  { value: 1, label: "Several days" },
  { value: 2, label: "More than half the days" },
  { value: 3, label: "Nearly every day" }
];

interface ConsentStep {
  id: string;
  title: string;
  description: string;
  required: boolean;
}

const CONSENT_STEPS: ConsentStep[] = [
  {
    id: 'data_processing',
    title: 'Anonymous Data Processing',
    description: 'We process your responses anonymously to provide personalized mental health support. No personally identifiable information is stored.',
    required: true
  },
  {
    id: 'anonymous_chat',
    title: 'Anonymous Chat Sessions', 
    description: 'Chat sessions are encrypted and anonymous. You will be assigned a temporary handle that changes each session.',
    required: true
  },
  {
    id: 'counselor_contact',
    title: 'Optional Counselor Contact',
    description: 'You may choose to connect with counselors. Identity reveal is always optional and requires separate consent.',
    required: false
  }
];

const OnboardingFlow = () => {
  const { t } = useTranslation(['common', 'problems']);
  const navigate = useNavigate();
  const { setStudent, addScreeningResult, setCurrentProblem, completeOnboarding } = useStore();
  
  const [currentStep, setCurrentStep] = useState(0);
  const [consent, setConsent] = useState<Record<string, boolean>>({});
  const [phq9Responses, setPHQ9Responses] = useState<Record<number, number>>({});
  const [gad7Responses, setGAD7Responses] = useState<Record<number, number>>({});
  const [additionalInfo, setAdditionalInfo] = useState({
    sleepIssueFrequency: 0,
    keywords: '',
    primaryConcern: ''
  });
  const [results, setResults] = useState<any>(null);

  const totalSteps = 6; // Consent + PHQ9 + GAD7 + Additional + Results + Complete
  const progress = ((currentStep + 1) / totalSteps) * 100;

  // Check if all required consent is given
  const hasRequiredConsent = CONSENT_STEPS
    .filter(step => step.required)
    .every(step => consent[step.id]);

  const handleConsentChange = (id: string, checked: boolean) => {
    setConsent(prev => ({ ...prev, [id]: checked }));
  };

  const handlePHQ9Response = (questionIndex: number, value: number) => {
    setPHQ9Responses(prev => ({ ...prev, [questionIndex]: value }));
  };

  const handleGAD7Response = (questionIndex: number, value: number) => {
    setGAD7Responses(prev => ({ ...prev, [questionIndex]: value }));
  };

  const calculateResults = () => {
    const phq9Result = calculatePHQ9Score(
      Object.entries(phq9Responses).map(([index, answer]) => ({
        questionId: `phq9_${index}`,
        answer: answer
      }))
    );

    const gad7Result = calculateGAD7Score(
      Object.entries(gad7Responses).map(([index, answer]) => ({
        questionId: `gad7_${index}`,
        answer: answer
      }))
    );

    const keywords = additionalInfo.keywords.toLowerCase().split(' ').filter(k => k.length > 2);
    const problemId = mapToProblemInterface(
      phq9Result.score,
      gad7Result.score, 
      keywords,
      { sleep_issue_frequency: additionalInfo.sleepIssueFrequency }
    );

    const result = {
      phq9: phq9Result,
      gad7: gad7Result,
      problemId,
      priority: (phq9Result.score >= 15 || gad7Result.score >= 15) ? 'high' : 
                (phq9Result.score >= 10 || gad7Result.score >= 10) ? 'medium' : 'low'
    };

    setResults(result);
    return result;
  };

  const handleNext = () => {
    if (currentStep === 4) {
      // Calculate results before showing them
      calculateResults();
    }
    if (currentStep < totalSteps - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleComplete = () => {
    if (results) {
      // Create anonymous student profile
      const studentToken = `student_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const ephemeralHandle = `Guest-${Math.random().toString(36).substr(2, 4).toUpperCase()}`;
      
      setStudent({
        token: studentToken,
        institutionCode: 'default', // Would be dynamic in real app
        ephemeralHandle,
        language: 'en',
        consentFlags: {
          dataProcessing: consent.data_processing || false,
          anonymousChat: consent.anonymous_chat || false,
          counselorContact: consent.counselor_contact || false
        },
        createdAt: new Date()
      });

      // Save screening results
      addScreeningResult({
        id: `screening_${Date.now()}`,
        tool: 'PHQ9',
        responses: Object.entries(phq9Responses).map(([index, answer]) => ({
          questionId: `phq9_${index}`,
          answer
        })),
        score: results.phq9.score,
        severity: results.phq9.severity as any,
        problemTags: [results.problemId],
        timestamp: new Date()
      });

      addScreeningResult({
        id: `screening_${Date.now() + 1}`,
        tool: 'GAD7', 
        responses: Object.entries(gad7Responses).map(([index, answer]) => ({
          questionId: `gad7_${index}`,
          answer
        })),
        score: results.gad7.score,
        severity: results.gad7.severity as any,
        problemTags: [results.problemId],
        timestamp: new Date()
      });

      setCurrentProblem(results.problemId);
      completeOnboarding();
      
      // Navigate to the appropriate problem interface
      navigate(`/problems/${results.problemId}`);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    } else {
      navigate('/');
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0: return hasRequiredConsent;
      case 1: return Object.keys(phq9Responses).length === PHQ9_QUESTIONS.length;
      case 2: return Object.keys(gad7Responses).length === GAD7_QUESTIONS.length;
      case 3: return additionalInfo.keywords.trim().length > 0;
      default: return true;
    }
  };

  const renderConsentStep = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <div className="text-center mb-8">
        <Shield className="w-12 h-12 text-primary mx-auto mb-4" />
        <h2 className="text-2xl font-playfair font-semibold mb-2">
          {t('consent.title')}
        </h2>
        <p className="text-muted-foreground">
          {t('consent.description')}
        </p>
      </div>

      <div className="space-y-4">
        {CONSENT_STEPS.map((step) => (
          <Card key={step.id} className="glass-card p-4">
            <div className="flex items-start gap-3">
              <Checkbox
                id={step.id}
                checked={consent[step.id] || false}
                onCheckedChange={(checked) => handleConsentChange(step.id, checked as boolean)}
                className="mt-1"
              />
              <div className="flex-1">
                <Label htmlFor={step.id} className="font-medium text-foreground cursor-pointer">
                  {step.title}
                  {step.required && <span className="text-destructive ml-1">*</span>}
                </Label>
                <p className="text-sm text-muted-foreground mt-1">
                  {step.description}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Card className="glass-card p-4 border-warning/30 bg-warning/5">
        <div className="flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-warning" />
          <div>
            <p className="font-medium text-foreground">{t('consent.emergency_notice')}</p>
            <p className="text-sm text-muted-foreground">{t('consent.emergency_helpline')}</p>
          </div>
        </div>
      </Card>
    </motion.div>
  );

  const renderScreeningStep = (questions: string[], responses: Record<number, number>, onResponse: (index: number, value: number) => void, title: string) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <div className="text-center mb-8">
        <Heart className="w-12 h-12 text-primary mx-auto mb-4" />
        <h2 className="text-2xl font-playfair font-semibold mb-2">
          {title}
        </h2>
        <p className="text-muted-foreground">
          {title.includes('PHQ') ? t('screening.phq9_intro') : t('screening.gad7_intro')}
        </p>
      </div>

      <div className="space-y-6">
        {questions.map((question, index) => (
          <Card key={index} className="glass-card p-6">
            <div className="space-y-4">
              <p className="font-medium text-foreground">{question}</p>
              <RadioGroup
                value={responses[index]?.toString() || ''}
                onValueChange={(value) => onResponse(index, parseInt(value))}
              >
                {ANSWER_OPTIONS.map((option) => (
                  <div key={option.value} className="flex items-center space-x-2">
                    <RadioGroupItem value={option.value.toString()} id={`q${index}_${option.value}`} />
                    <Label htmlFor={`q${index}_${option.value}`} className="cursor-pointer">
                      {option.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          </Card>
        ))}
      </div>
    </motion.div>
  );

  const renderAdditionalInfoStep = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <div className="text-center mb-8">
        <Users className="w-12 h-12 text-primary mx-auto mb-4" />
        <h2 className="text-2xl font-playfair font-semibold mb-2">
          Additional Information
        </h2>
        <p className="text-muted-foreground">
          Help us understand your specific needs better
        </p>
      </div>

      <div className="space-y-6">
        <Card className="glass-card p-6">
          <Label className="font-medium text-foreground mb-3 block">
            How often do you experience sleep issues? (per week)
          </Label>
          <RadioGroup
            value={additionalInfo.sleepIssueFrequency.toString()}
            onValueChange={(value) => setAdditionalInfo(prev => ({ ...prev, sleepIssueFrequency: parseInt(value) }))}
          >
            {[
              { value: 0, label: "Never" },
              { value: 1, label: "1-2 times" },
              { value: 3, label: "3-4 times" },
              { value: 5, label: "5+ times" }
            ].map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <RadioGroupItem value={option.value.toString()} id={`sleep_${option.value}`} />
                <Label htmlFor={`sleep_${option.value}`} className="cursor-pointer">
                  {option.label}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </Card>

        <Card className="glass-card p-6">
          <Label htmlFor="keywords" className="font-medium text-foreground mb-3 block">
            Describe your main concerns (keywords help us match you with the right support)
          </Label>
          <Textarea
            id="keywords"
            placeholder="e.g., anxiety, relationships, career, family, sleep, academic stress..."
            value={additionalInfo.keywords}
            onChange={(e) => setAdditionalInfo(prev => ({ ...prev, keywords: e.target.value }))}
            className="min-h-[100px]"
          />
        </Card>
      </div>
    </motion.div>
  );

  const renderResults = () => {
    if (!results) return null;

    const getPriorityColor = (priority: string) => {
      switch (priority) {
        case 'high': return 'bg-destructive/10 text-destructive border-destructive/30';
        case 'medium': return 'bg-warning/10 text-warning border-warning/30';
        default: return 'bg-success/10 text-success border-success/30';
      }
    };

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="space-y-6"
      >
        <div className="text-center mb-8">
          <CheckCircle className="w-12 h-12 text-success mx-auto mb-4" />
          <h2 className="text-2xl font-playfair font-semibold mb-2">
            Your Assessment Complete
          </h2>
          <p className="text-muted-foreground">
            {t('screening.completion')}
          </p>
        </div>

        <Card className="glass-card p-6">
          <div className="text-center space-y-4">
            <Badge className={getPriorityColor(results.priority)}>
              Priority: {results.priority.toUpperCase()}
            </Badge>
            
            <h3 className="text-xl font-semibold">
              Recommended Support: {t(`problems:${results.problemId}.title`)}
            </h3>
            
            <p className="text-muted-foreground">
              {t(`problems:${results.problemId}.description`)}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
              <Card className="p-4">
                <h4 className="font-semibold mb-2">Depression Screening</h4>
                <p className="text-2xl font-bold text-primary">{results.phq9.score}/27</p>
                <p className="text-sm text-muted-foreground capitalize">{results.phq9.severity}</p>
              </Card>
              
              <Card className="p-4">
                <h4 className="font-semibold mb-2">Anxiety Screening</h4>
                <p className="text-2xl font-bold text-accent">{results.gad7.score}/21</p>
                <p className="text-sm text-muted-foreground capitalize">{results.gad7.severity}</p>
              </Card>
            </div>
          </div>
        </Card>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-soothing relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-ambient opacity-20" />
      
      {/* Header */}
      <div className="relative z-10 p-6">
        <div className="max-w-2xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <Button
              variant="ghost"
              onClick={handleBack}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
            
            <Badge variant="outline">
              {t('screening.progress', { current: currentStep + 1, total: totalSteps })}
            </Badge>
          </div>

          <Progress value={progress} className="mb-8 h-2" />
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 px-6 pb-12">
        <div className="max-w-2xl mx-auto">
          <AnimatePresence mode="wait">
            {currentStep === 0 && renderConsentStep()}
            {currentStep === 1 && renderScreeningStep(PHQ9_QUESTIONS, phq9Responses, handlePHQ9Response, "Depression Screening (PHQ-9)")}
            {currentStep === 2 && renderScreeningStep(GAD7_QUESTIONS, gad7Responses, handleGAD7Response, "Anxiety Screening (GAD-7)")}
            {currentStep === 3 && renderAdditionalInfoStep()}
            {currentStep === 4 && renderResults()}
          </AnimatePresence>

          {/* Navigation */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-between items-center mt-8"
          >
            <div />
            {currentStep < totalSteps - 1 ? (
              <Button
                onClick={handleNext}
                disabled={!canProceed()}
                className="flex items-center gap-2"
              >
                {t('actions.next')}
                <ArrowRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button
                onClick={handleComplete}
                className="btn-ambient flex items-center gap-2"
              >
                Enter SafeSpace
                <CheckCircle className="w-4 h-4" />
              </Button>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingFlow;