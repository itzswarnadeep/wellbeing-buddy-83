import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Shield, 
  Heart, 
  MessageCircle, 
  Calendar,
  BookOpen,
  Headphones,
  ArrowRight
} from 'lucide-react';
import { useStore } from '@/stores/useStore';
import { useNavigate } from 'react-router-dom';
import heroImage from '@/assets/hero-mental-health.jpg';

const LandingPage = () => {
  const { t, i18n } = useTranslation(['common', 'problems']);
  const { setLanguage } = useStore();
  const navigate = useNavigate();
  const [selectedLanguage, setSelectedLanguage] = useState('en');

  const handleLanguageChange = (lang: string) => {
    setSelectedLanguage(lang);
    setLanguage(lang);
    i18n.changeLanguage(lang);
  };

  const handleStartScreening = () => {
    navigate('/onboarding');
  };

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'hi', name: 'हिंदी', flag: '🇮🇳' },
    { code: 'ks', name: 'کٲشُر', flag: '🏔️' }
  ];

  return (
    <div className="min-h-screen bg-gradient-soothing relative overflow-hidden">
      {/* Ambient Background Elements */}
      <div className="absolute inset-0 bg-gradient-ambient opacity-30" />
      
      {/* Header */}
      <header className="relative z-10 p-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-playfair font-semibold text-foreground">
              {t('app.name')}
            </h1>
          </motion.div>

          {/* Language Selector */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex gap-2"
          >
            {languages.map((lang) => (
              <Button
                key={lang.code}
                variant={selectedLanguage === lang.code ? "default" : "ghost"}
                size="sm"
                onClick={() => handleLanguageChange(lang.code)}
                className="text-sm font-medium"
              >
                <span className="mr-1">{lang.flag}</span>
                {lang.name}
              </Button>
            ))}
          </motion.div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 px-6 py-12">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
              {t('app.tagline')}
            </Badge>
            
            <h2 className="text-4xl md:text-6xl font-playfair font-bold text-foreground mb-6 leading-tight">
              Your Mental Health
              <span className="text-transparent bg-clip-text bg-gradient-primary block mt-2">
                Journey Starts Here
              </span>
            </h2>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              {t('app.description')}. Anonymous, safe, and always available when you need support.
            </p>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-8"
          >
            <Button
              size="lg"
              onClick={() => navigate('/simple-onboarding')}
              className="btn-ambient px-8 py-4 text-lg font-medium"
            >
              Quick Setup
              <ArrowRight className="ml-3 w-6 h-6" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate('/onboarding')}
              className="px-8 py-4 text-lg font-medium glass-card"
            >
              Full Assessment
            </Button>
          </motion.div>

          {/* Hero Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="mb-16"
          >
            <Card className="glass-card p-2 overflow-hidden">
              <img
                src={heroImage}
                alt="Students in a supportive, calming environment representing mental health wellness"
                className="w-full h-[400px] object-cover rounded-xl"
              />
            </Card>
          </motion.div>
        </div>

        {/* Emergency Notice */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          <Card className="glass-card p-6 border-warning/30 bg-warning/5">
            <div className="flex items-center gap-3 mb-3">
              <Shield className="w-5 h-5 text-warning" />
              <h4 className="font-semibold text-foreground">
                Crisis Support Available 24/7
              </h4>
            </div>
            <p className="text-muted-foreground">
              {t('consent.emergency_notice')} <strong>{t('consent.emergency_helpline')}</strong>
            </p>
          </Card>
        </motion.div>
      </main>
    </div>
  );
};

export default LandingPage;