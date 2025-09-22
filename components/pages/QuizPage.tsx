import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { RoadmapTile, Quiz as QuizData, generateQuiz } from '../../lib/gemini';
import Quiz from '../quiz/Quiz';
import QuizResults from '../quiz/QuizResults';
import { ArrowLeft, BrainCircuit } from 'lucide-react';

interface QuizPageProps {
  tile: RoadmapTile;
  onQuizComplete: (passed: boolean) => void;
  onBackToDetail: () => void;
  onLogTime: (timeSpent: number, tileCompleted: boolean) => void;
}

const LoadingSpinner = () => (
  <div className="flex flex-col items-center justify-center gap-4 text-center">
    <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
    <h2 className="text-2xl font-bold text-white mt-4">Generating Your Quiz...</h2>
    <p className="text-neutral-300 max-w-sm">Our AI is crafting questions tailored just for you. Please wait a moment.</p>
  </div>
);

const QuizPage: React.FC<QuizPageProps> = ({ tile, onQuizComplete, onBackToDetail, onLogTime }) => {
  const [quizData, setQuizData] = useState<QuizData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    const startTime = Date.now();
    return () => {
        const endTime = Date.now();
        const timeSpent = Math.round((endTime - startTime) / 1000);
        onLogTime(timeSpent, false); // Log time, completion is handled separately
    }
  }, [onLogTime]);

  useEffect(() => {
    const fetchQuiz = async () => {
      setIsLoading(true);
      setError('');
      try {
        const data = await generateQuiz(tile);
        setQuizData(data);
        setUserAnswers(new Array(data.questions.length).fill(''));
      } catch (e) {
        setError('Failed to generate the quiz. Please try again later.');
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchQuiz();
  }, [tile]);

  const handleSubmit = (answers: string[]) => {
    setUserAnswers(answers);
    setIsSubmitted(true);
  };
  
  const handleProceed = () => {
    if(!quizData) return;
    const correctAnswers = quizData.questions.reduce((count, q, i) => {
        return q.answer === userAnswers[i] ? count + 1 : count;
    }, 0);
    const score = correctAnswers / quizData.questions.length;
    onQuizComplete(score >= 0.5);
  };


  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
       <div className="w-full max-w-4xl mx-auto">
        <header className="mb-8 flex items-center justify-between">
           <button onClick={onBackToDetail} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-neutral-200 bg-neutral-800 border border-neutral-700 rounded-lg hover:bg-neutral-700 transition-colors">
            <ArrowLeft size={16} />
            <span>Back to Lesson</span>
          </button>
          <div className="text-right">
            <h1 className="text-2xl font-bold text-white">Quiz Time!</h1>
            <p className="text-blue-400">{tile.title}</p>
          </div>
        </header>

        <main className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 md:p-10 min-h-[60vh] flex flex-col justify-center">
            {isLoading && <LoadingSpinner />}
            {error && <div className="text-center text-red-400">{error}</div>}
            {!isLoading && !error && quizData && (
                !isSubmitted ? (
                    <Quiz quizData={quizData} onSubmit={handleSubmit} />
                ) : (
                    <QuizResults 
                        quizData={quizData} 
                        userAnswers={userAnswers} 
                        onProceed={handleProceed}
                    />
                )
            )}
        </main>
       </div>
    </div>
  );
};

export default QuizPage;