import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface ScreeningResponse {
  questionId: string;
  answer: number | string;
}

export interface ScreeningResult {
  id: string;
  tool: 'PHQ9' | 'GAD7' | 'CUSTOM';
  responses: ScreeningResponse[];
  score: number;
  severity: 'minimal' | 'mild' | 'moderate' | 'moderately_severe' | 'severe';
  problemTags: string[];
  timestamp: Date;
}

export interface Student {
  token: string;
  institutionCode: string;
  ephemeralHandle: string;
  language: string;
  role?: 'student' | 'counsellor' | 'staff';
  consentFlags: {
    dataProcessing: boolean;
    anonymousChat: boolean;
    counselorContact: boolean;
  };
  createdAt: Date;
}

export interface ChatSession {
  id: string;
  institutionCode: string;
  problemId: string;
  ephemeralName: string;
  joinedAt: Date;
}

interface AppState {
  // Student data
  student: Student | null;
  currentLanguage: string;
  
  // Screening & assessment
  screeningResults: ScreeningResult[];
  currentProblemId: string | null;
  
  // Chat & social
  currentChatSession: ChatSession | null;
  
  // UI state
  onboardingCompleted: boolean;
  
  // Actions
  setStudent: (student: Student) => void;
  setLanguage: (language: string) => void;
  addScreeningResult: (result: ScreeningResult) => void;
  setCurrentProblem: (problemId: string) => void;
  joinChatSession: (session: ChatSession) => void;
  leaveChatSession: () => void;
  completeOnboarding: () => void;
  clearUserData: () => void;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial state
      student: null,
      currentLanguage: 'en',
      screeningResults: [],
      currentProblemId: null,
      currentChatSession: null,
      onboardingCompleted: false,

      // Actions
      setStudent: (student) => set({ student }),
      
      setLanguage: (language) => set({ currentLanguage: language }),
      
      addScreeningResult: (result) =>
        set((state) => ({
          screeningResults: [...state.screeningResults, result],
        })),
      
      setCurrentProblem: (problemId) => set({ currentProblemId: problemId }),
      
      joinChatSession: (session) => set({ currentChatSession: session }),
      
      leaveChatSession: () => set({ currentChatSession: null }),
      
      completeOnboarding: () => set({ onboardingCompleted: true }),
      
      clearUserData: () =>
        set({
          student: null,
          screeningResults: [],
          currentProblemId: null,
          currentChatSession: null,
          onboardingCompleted: false,
        }),
    }),
    {
      name: 'student-safespace-storage',
      partialize: (state) => ({
        currentLanguage: state.currentLanguage,
        onboardingCompleted: state.onboardingCompleted,
        // Don't persist sensitive data like student info or chat sessions
      }),
    }
  )
);

// Screening calculation utilities
export const calculatePHQ9Score = (responses: ScreeningResponse[]): { score: number; severity: string } => {
  const score = responses.reduce((total, response) => total + (Number(response.answer) || 0), 0);
  
  let severity: string;
  if (score >= 20) severity = 'severe';
  else if (score >= 15) severity = 'moderately_severe';
  else if (score >= 10) severity = 'moderate';
  else if (score >= 5) severity = 'mild';
  else severity = 'minimal';
  
  return { score, severity };
};

export const calculateGAD7Score = (responses: ScreeningResponse[]): { score: number; severity: string } => {
  const score = responses.reduce((total, response) => total + (Number(response.answer) || 0), 0);
  
  let severity: string;
  if (score >= 15) severity = 'severe';
  else if (score >= 10) severity = 'moderate';
  else if (score >= 5) severity = 'mild';
  else severity = 'minimal';
  
  return { score, severity };
};

// Triage mapping rules as defined in the specification
export const mapToProblemInterface = (
  phq9Score: number,
  gad7Score: number,
  keywords: string[],
  customResponses: { [key: string]: any } = {}
): string => {
  const keywordString = keywords.join(' ').toLowerCase();
  
  // High anxiety + job/career keywords
  if (gad7Score >= 10 && /job|placement|interview|career|internship/.test(keywordString)) {
    return 'placement_career_anxiety';
  }
  
  // High depression + relationship keywords
  if (phq9Score >= 10 && /breakup|relationship|dating|partner|love/.test(keywordString)) {
    return 'relationship_issues';
  }
  
  // Sleep issues frequency
  if (customResponses.sleep_issue_frequency >= 3) {
    return 'sleep_burnout';
  }
  
  // Academic stress keywords
  if (/exam|study|grade|academic|assignment|test/.test(keywordString)) {
    return 'academic_stress';
  }
  
  // Family/personal keywords
  if (/family|home|parents|personal|conflict/.test(keywordString)) {
    return 'family_personal_issues';
  }
  
  // Social isolation keywords
  if (/lonely|isolation|friends|social|alone/.test(keywordString)) {
    return 'social_isolation';
  }
  
  // Default fallback
  return 'other_mixed';
};