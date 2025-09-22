import React from 'react';
import { motion } from 'framer-motion';
import { Quiz as QuizData } from '../../lib/gemini';
import { cn } from '../../lib/utils';
import { Check, X, ArrowRight } from 'lucide-react';

interface QuizResultsProps {
  quizData: QuizData;
  userAnswers: string[];
  onProceed: () => void;
}

const QuizResults: React.FC<QuizResultsProps> = ({ quizData, userAnswers, onProceed }) => {
  const correctAnswers = quizData.questions.reduce((count, q, i) => {
    return q.answer === userAnswers[i] ? count + 1 : count;
  }, 0);
  const totalQuestions = quizData.questions.length;
  const score = Math.round((correctAnswers / totalQuestions) * 100);
  const passed = score >= 50;

  return (
    <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-white text-center"
    >
      <h2 className="text-3xl font-bold">Quiz Complete!</h2>
      <div className={cn(
          "mt-6 text-6xl font-extrabold",
          passed ? "text-green-400" : "text-red-400"
      )}>
        {score}%
      </div>
      <p className="text-xl font-semibold mt-2">
        You got {correctAnswers} out of {totalQuestions} correct.
      </p>
      <div className={cn(
          "mt-4 text-2xl font-bold py-2 px-6 inline-block rounded-full",
           passed ? "bg-green-500/20 text-green-300" : "bg-red-500/20 text-red-300"
      )}>
        {passed ? "You Passed!" : "Needs Improvement"}
      </div>
      
      <div className="my-8 h-px bg-neutral-700"></div>

      <div className="text-left max-h-80 overflow-y-auto pr-4 space-y-6">
        <h3 className="text-xl font-bold mb-4">Answer Review</h3>
        {quizData.questions.map((q, i) => {
            const userAnswer = userAnswers[i];
            const isCorrect = q.answer === userAnswer;
            return (
                 <div key={i} className={cn("p-4 rounded-lg border", isCorrect ? "border-green-600/50 bg-green-900/20" : "border-red-600/50 bg-red-900/20")}>
                    <p className="font-semibold mb-3">{i+1}. {q.question}</p>
                    <div className="space-y-2 text-sm">
                        {q.options.map((option, optIndex) => {
                             const isUserChoice = userAnswer === option;
                             const isCorrectAnswer = q.answer === option;
                             return (
                                <div key={optIndex} className={cn(
                                    "flex items-center gap-3 p-2 rounded-md",
                                    isCorrectAnswer && "bg-green-500/30",
                                    isUserChoice && !isCorrectAnswer && "bg-red-500/30"
                                )}>
                                    {isCorrectAnswer ? <Check size={16} className="text-green-300 flex-shrink-0"/> : isUserChoice ? <X size={16} className="text-red-300 flex-shrink-0"/> : <div className="w-4 h-4 flex-shrink-0"/>}
                                    <span className={cn(isCorrectAnswer ? "text-white" : "text-neutral-300")}>{option}</span>
                                </div>
                             )
                        })}
                    </div>
                 </div>
            )
        })}
      </div>
       <button 
        onClick={onProceed}
        className="w-full mt-8 bg-blue-600 text-white font-semibold py-4 rounded-lg flex items-center justify-center gap-3 hover:bg-blue-700 transition-colors text-lg"
      >
        <span>{passed ? "Unlock Next Step" : "Review and Continue"}</span>
        <ArrowRight size={20} />
      </button>
    </motion.div>
  );
};

export default QuizResults;