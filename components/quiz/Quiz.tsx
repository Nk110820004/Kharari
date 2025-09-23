import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Quiz as QuizData } from '../../lib/gemini';
import { cn } from '../../lib/utils';
import { ArrowLeft, ArrowRight } from 'lucide-react';

interface QuizProps {
  quizData: QuizData;
  onSubmit: (answers: string[]) => void;
}

const Quiz: React.FC<QuizProps> = ({ quizData, onSubmit }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<string[]>(new Array(quizData.questions.length).fill(null));
  const [timeLeft, setTimeLeft] = useState(25);
  // FIX: Use `number` for the timer ref type, as `setInterval` in browsers returns a number.
  const timerRef = useRef<number | null>(null);

  const handleNext = () => {
    if (currentQuestionIndex < quizData.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Before submitting, clear the timer to prevent it from firing again
      if (timerRef.current) clearInterval(timerRef.current);
      onSubmit(answers);
    }
  };
  
  useEffect(() => {
    // Clear any existing timer
    if (timerRef.current) {
        clearInterval(timerRef.current);
    }
    // Reset timer for the new question
    setTimeLeft(25);

    // Start a new timer
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          handleNext(); // Auto-advance when time is up
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Cleanup timer on component unmount or when question changes
    return () => {
      if(timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [currentQuestionIndex]);


  const handleAnswerSelect = (option: string) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = option;
    setAnswers(newAnswers);
  };
  
  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };
  
  const formatTime = (seconds: number) => {
    return seconds.toString().padStart(2, '0');
  }

  const currentQuestion = quizData.questions[currentQuestionIndex];

  return (
    <div className="text-white">
      <div className="flex justify-between items-center mb-6">
         <p className="text-sm text-neutral-400">Question {currentQuestionIndex + 1} of {quizData.questions.length}</p>
         <div className="flex items-center gap-2">
            <div className="relative h-2 w-24 bg-neutral-700 rounded-full overflow-hidden">
                <motion.div 
                    key={currentQuestionIndex}
                    initial={{ width: '100%' }}
                    animate={{ width: '0%' }}
                    transition={{ duration: 25, ease: 'linear' }}
                    className="absolute h-full bg-red-500"
                />
            </div>
            <p className="text-lg font-mono font-semibold text-red-400 w-8 text-center">{formatTime(timeLeft)}</p>
         </div>
      </div>
      
      <motion.div
        key={currentQuestionIndex}
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -50 }}
        transition={{ type: 'spring', stiffness: 200, damping: 25 }}
      >
        <h2 className="text-xl md:text-2xl font-semibold mb-8 leading-relaxed">{currentQuestion.question}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {currentQuestion.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswerSelect(option)}
              className={cn(
                "p-4 border border-neutral-700 rounded-lg text-left transition-all duration-200",
                "hover:bg-neutral-700 hover:border-blue-500",
                answers[currentQuestionIndex] === option && "bg-blue-600 border-blue-500 ring-2 ring-blue-400"
              )}
            >
              <span className="font-semibold">{String.fromCharCode(65 + index)}. </span>{option}
            </button>
          ))}
        </div>
      </motion.div>
      
      <div className="mt-10 flex justify-between items-center">
        <button 
          onClick={handlePrev} 
          disabled={currentQuestionIndex === 0}
          className="flex items-center gap-2 px-6 py-3 bg-neutral-800 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-neutral-700 transition-colors"
        >
          <ArrowLeft size={16}/>
          Prev
        </button>
        {currentQuestionIndex === quizData.questions.length - 1 ? (
          <button 
            onClick={() => onSubmit(answers)}
            className="px-6 py-3 bg-green-600 rounded-lg font-semibold hover:bg-green-700 transition-colors"
          >
            Submit Quiz
          </button>
        ) : (
          <button 
            onClick={handleNext}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Next
            <ArrowRight size={16}/>
          </button>
        )}
      </div>
    </div>
  );
};

export default Quiz;