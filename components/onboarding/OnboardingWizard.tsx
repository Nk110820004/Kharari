import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, Loader, User, Phone } from 'lucide-react';
import { generateTopicSuggestions } from '../../lib/gemini';
import { cn } from '../../lib/utils';
import { languages } from '../../data/languages';
import CountryCodeSelector from '../auth/CountryCodeSelector';

const debounce = <F extends (...args: any[]) => any>(func: F, delay: number) => {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  return (...args: Parameters<F>): void => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
};

interface OnboardingWizardProps {
  onClose: () => void;
  onComplete: (username: string, phone: string, language: string, topic: string) => void;
}

const OnboardingWizard: React.FC<OnboardingWizardProps> = ({ onClose, onComplete }) => {
  const [step, setStep] = useState(1);
  const [username, setUsername] = useState('');
  const [phone, setPhone] = useState('');
  const [language, setLanguage] = useState('');
  const [topic, setTopic] = useState('');
  const [error, setError] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);

  const fetchSuggestions = useCallback(async (query: string) => {
    if (query.length < 3) {
      setSuggestions([]);
      return;
    }
    setIsLoadingSuggestions(true);
    try {
      const result = await generateTopicSuggestions(query);
      setSuggestions(result.suggestions);
    } catch (e) {
      console.error("Failed to fetch suggestions:", e);
      setSuggestions([]);
    } finally {
      setIsLoadingSuggestions(false);
    }
  }, []);

  const debouncedFetchSuggestions = useCallback(debounce(fetchSuggestions, 300), [fetchSuggestions]);

  useEffect(() => {
    if (step === 3) {
      debouncedFetchSuggestions(topic);
    }
  }, [topic, step, debouncedFetchSuggestions]);

  const handleNextStep = () => setStep(prev => prev + 1);

  const handleUserInfoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim().length < 3) {
        setError("Please enter a valid username.");
        return;
    }
     if (phone.trim().length < 5) {
        setError("Please enter a valid phone number.");
        return;
    }
    setError('');
    handleNextStep();
  }

  const handleLanguageSelect = (lang: string) => {
    setLanguage(lang);
    handleNextStep();
  };

  const handleTopicSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (topic.trim().length < 3) {
      setError('Please enter a topic with at least 3 characters.');
      return;
    }
    setError('');
    onComplete(username, phone, language, topic);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setTopic(suggestion);
    setSuggestions([]);
    onComplete(username, phone, language, suggestion);
  };

  const renderStep = () => {
    switch(step) {
      case 1:
        return (
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-2">Complete Your Profile</h2>
            <p className="text-neutral-400 mb-8">Just a few more details to get you started.</p>
            <form onSubmit={handleUserInfoSubmit} className="space-y-4 text-left">
               <div className="relative">
                  <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400"/>
                  <input type="text" value={username} onChange={e => setUsername(e.target.value)} placeholder="Username" className="w-full bg-neutral-800 border border-neutral-600 text-white rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500" required/>
                </div>
                <div className="flex gap-2">
                  <CountryCodeSelector />
                  <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="Phone number" className="flex-grow w-full bg-neutral-800 border border-neutral-600 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500" required/>
                </div>
                 {error && <p className="text-red-400 text-sm text-center">{error}</p>}
                <button type="submit" className="w-full mt-4 bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
                    Next <ArrowRight size={16}/>
                </button>
            </form>
          </div>
        );
      case 2:
        return (
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-2">Choose Your Language</h2>
            <p className="text-neutral-400 mb-8">Select the language you'd like to experience Khalari in.</p>
            <div className="max-h-80 overflow-y-auto pr-2 grid grid-cols-2 gap-3 text-left">
              {languages.map(lang => (
                <button 
                  key={lang}
                  onClick={() => handleLanguageSelect(lang)}
                  className="w-full p-3 bg-neutral-800 border border-neutral-700 rounded-lg text-neutral-200 hover:bg-blue-600/50 hover:border-blue-500 transition-colors"
                >
                  {lang}
                </button>
              ))}
            </div>
          </div>
        );
      case 3:
        return (
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-2">What do you want to learn?</h2>
            <p className="text-neutral-400 mb-8">Tell us a topic, and we'll generate a personalized learning path for you.</p>
            <form onSubmit={handleTopicSubmit} className="flex flex-col gap-4 relative">
              <div className="relative">
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g., 'Quantum Physics'"
                  className="w-full bg-neutral-800 border border-neutral-600 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  autoFocus
                  autoComplete="off"
                />
                {isLoadingSuggestions && <Loader size={18} className="absolute right-3 top-1/2 -translate-y-1/2 animate-spin text-neutral-400" />}
              </div>
              {suggestions.length > 0 && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute top-full left-0 right-0 mt-2 bg-neutral-800 border border-neutral-700 rounded-lg z-10 overflow-hidden"
                >
                  <ul className="py-2">
                    {suggestions.map((s, i) => (
                      <li key={i}>
                        <button
                          type="button"
                          onClick={() => handleSuggestionClick(s)}
                          className="w-full text-left px-4 py-2 text-neutral-200 hover:bg-blue-600/50 transition-colors"
                        >
                          {s}
                        </button>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}
              {error && <p className="text-red-400 text-sm">{error}</p>}
              <button
                type="submit"
                className={cn(
                  "w-full bg-blue-600 text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors disabled:bg-neutral-700 disabled:cursor-not-allowed",
                  suggestions.length > 0 && "mt-4"
                )}
                disabled={!topic.trim()}
              >
                <span>Generate Roadmap</span>
                <ArrowRight size={20} />
              </button>
            </form>
          </div>
        );
      default: return null;
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center"
        onClick={onClose}
      >
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 50, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="bg-neutral-900 border border-neutral-700 rounded-lg p-8 w-full max-w-lg m-4 relative"
          onClick={(e) => e.stopPropagation()}
        >
          <button onClick={onClose} className="absolute top-4 right-4 text-neutral-400 hover:text-white transition-colors">
            <X size={20} />
          </button>
          
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              {renderStep()}
            </motion.div>
          </AnimatePresence>

        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default OnboardingWizard;