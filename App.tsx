import React, { useState, useEffect, useCallback } from 'react';
import ReactDOM from 'react-dom';
import LandingPage from './components/pages/LandingPage';
import RoadmapPage from './components/pages/RoadmapPage';
import LoginModal from './components/auth/LoginModal';
import OnboardingWizard from './components/onboarding/OnboardingWizard';
import { generateRoadmap, generateFurtherTopics, Roadmap, RoadmapTile } from './lib/gemini';
import TileDetailPage from './components/pages/TileDetailPage';
import QuizPage from './components/pages/QuizPage';
import ProfilePage from './components/pages/ProfilePage';
import CareerPage from './components/pages/CareerPage';
import VoiceOrb from './components/ai/VoiceOrb';
import { Sparkles } from 'lucide-react';
import { initialJobs, Job } from './data/jobs';
import CommunityPage from './components/pages/CommunityPage';
import { initialGroups, StudyGroup } from './data/groups';
import MemoryGame from './components/minigame/MemoryGame';

export type Page = 'landing' | 'roadmap' | 'tileDetail' | 'quiz' | 'profile' | 'career' | 'community';

export interface User {
  name: string;
  bio: string;
  language: string;
  accountCreated: Date;
  phone?: string;
  // Gamification
  diamonds: number;
  currentStreak: number;
  highestStreak: number;
  lastActivityDate: string | null; // YYYY-MM-DD
  miniGameAttempts: number;
}

export interface ActivityLog {
  date: string; // YYYY-MM-DD
  timeSpent: number; // in seconds
  completed: boolean; // Was a tile completed on this day?
}

const App: React.FC = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentPage, setCurrentPage] = useState<Page>('landing');
  
  const [currentTopic, setCurrentTopic] = useState('');
  const [roadmapData, setRoadmapData] = useState<Roadmap | null>(null);
  const [furtherTopics, setFurtherTopics] = useState<string[]>([]);
  const [isLoadingRoadmap, setIsLoadingRoadmap] = useState(false);
  const [roadmapError, setRoadmapError] = useState('');

  // Learning flow state
  const [selectedTileIndex, setSelectedTileIndex] = useState<number | null>(null);
  
  // User Profile and Activity State
  const [user, setUser] = useState<User | null>(null);
  const [activityLog, setActivityLog] = useState<ActivityLog[]>([]);
  const [completedTiles, setCompletedTiles] = useState<boolean[]>([]);
  
  // AI Assistant State
  const [showVoiceOrb, setShowVoiceOrb] = useState(false);
  
  // Career Hub State
  const [availableJobs, setAvailableJobs] = useState<Job[]>(initialJobs);
  const [appliedJobs, setAppliedJobs] = useState<Job[]>([]);

  // Community Hub State
  const [allGroups, setAllGroups] = useState<StudyGroup[]>(initialGroups);
  const [joinedGroupIds, setJoinedGroupIds] = useState<Set<string>>(new Set());
  
  // Gamification state
  const [showMiniGame, setShowMiniGame] = useState(false);

  // Portal root for modals
  const modalRoot = document.getElementById('modal-root');

  useEffect(() => {
    (async () => {
      const { supabase } = await import('./lib/supabaseClient');
      const { data: { session } } = await supabase.auth.getSession();
      if (session && !user) {
        setIsLoggedIn(true);
        setUser(prev => prev ?? {
          name: session.user.user_metadata?.full_name || session.user.email || 'User',
          bio: 'Lifelong learner exploring the world of code and design.',
          language: 'English',
          accountCreated: new Date(),
          diamonds: 0,
          currentStreak: 0,
          highestStreak: 0,
          lastActivityDate: null,
          miniGameAttempts: 0,
          phone: session.user.phone || undefined,
        });
      }
      supabase.auth.onAuthStateChange((_event, sess) => {
        if (sess) {
          setIsLoggedIn(true);
          setUser(prev => prev ?? {
            name: sess.user.user_metadata?.full_name || sess.user.email || 'User',
            bio: 'Lifelong learner exploring the world of code and design.',
            language: 'English',
            accountCreated: new Date(),
            diamonds: 0,
            currentStreak: 0,
            highestStreak: 0,
            lastActivityDate: null,
            miniGameAttempts: 0,
            phone: sess.user.phone || undefined,
          });
        }
      });
    })();
  }, []);

  useEffect(() => {
    if (roadmapData) {
      setCompletedTiles(new Array(roadmapData.tiles.length).fill(false));
      // Reset mini-game attempts for new roadmap
      if (user) {
        setUser(prevUser => prevUser ? { ...prevUser, miniGameAttempts: 0 } : null);
      }
    }
  }, [roadmapData]);

  const handleStartFreeClick = () => {
    setShowAuthModal(true);
  };

  const handleAuthSuccess = () => {
    setShowAuthModal(false);
    setShowOnboarding(true);
    setIsLoggedIn(true);
    setUser({
      name: 'New User',
      bio: 'Lifelong learner exploring the world of code and design.',
      language: 'English',
      accountCreated: new Date(),
      diamonds: 0,
      currentStreak: 0,
      highestStreak: 0,
      lastActivityDate: null,
      miniGameAttempts: 0,
    });
  };

  const handleOnboardingComplete = async (username: string, phone: string, language: string, topic: string) => {
    setShowOnboarding(false);
    if(user) {
      setUser({ ...user, name: username, phone, language });
    }
    setIsLoadingRoadmap(true);
    setRoadmapError('');
    setCurrentTopic(topic);
    setCurrentPage('roadmap');

    const map: Record<string, 'en'|'hi'|'ta'|'ml'> = { English: 'en', Hindi: 'hi', Tamil: 'ta', Malayalam: 'ml' } as const;
    const langCode = map[language] ?? 'en';

    try {
      const [data, furtherData] = await Promise.all([
        generateRoadmap(topic, langCode),
        generateFurtherTopics(topic)
      ]);
      setRoadmapData(data);
      setFurtherTopics(furtherData.suggestions);
      try {
        const { persistRoadmap } = await import('./lib/roadmapStorage');
        await persistRoadmap(topic, langCode, data);
      } catch (e) {
        console.warn('Roadmap persistence skipped:', e);
      }
    } catch (error) {
      console.error("Failed to generate roadmap:", error);
      setRoadmapError("Sorry, we couldn't generate a roadmap for that topic. Please try another.");
    } finally {
      setIsLoadingRoadmap(false);
    }
  };
  
  const logActivity = useCallback((timeSpent: number, tileCompleted: boolean) => {
    const todayStr = new Date().toISOString().split('T')[0];
    setActivityLog(prevLog => {
      const todayEntryIndex = prevLog.findIndex(entry => entry.date === todayStr);
      if (todayEntryIndex > -1) {
        const newLog = [...prevLog];
        newLog[todayEntryIndex].timeSpent += timeSpent;
        if(tileCompleted) {
          newLog[todayEntryIndex].completed = true;
        }
        return newLog;
      } else {
        return [...prevLog, { date: todayStr, timeSpent, completed: tileCompleted }];
      }
    });

    if (tileCompleted && user) {
        const today = new Date();
        const yesterday = new Date();
        yesterday.setDate(today.getDate() - 1);
        const todayStr = today.toISOString().split('T')[0];
        const yesterdayStr = yesterday.toISOString().split('T')[0];

        let newStreak = user.currentStreak;
        if (user.lastActivityDate === todayStr) {
            // Already completed a section today, no change
        } else if (user.lastActivityDate === yesterdayStr) {
            newStreak++; // Continued the streak
        } else {
            newStreak = 1; // Started a new streak
        }
        
        let newDiamonds = user.diamonds;
        if (newStreak > 0 && newStreak % 7 === 0) {
            newDiamonds += 20; // 7-day streak reward
        }
        
        setUser(prevUser => prevUser ? {
            ...prevUser,
            currentStreak: newStreak,
            highestStreak: Math.max(prevUser.highestStreak, newStreak),
            lastActivityDate: todayStr,
            diamonds: newDiamonds
        } : null);
    }
  }, [user]);

  const handleGoHome = () => {
    setCurrentPage('landing');
  }

  const handleGoToRoadmap = () => {
    if (roadmapData) {
      setCurrentPage('roadmap');
    } else {
      handleGoHome();
    }
  };
  
  const handleSelectTile = (index: number) => {
    setSelectedTileIndex(index);
    setCurrentPage('tileDetail');
  }

  const handleTakeQuiz = () => {
    setCurrentPage('quiz');
  }

  const handleQuizComplete = (passed: boolean) => {
    if (passed && selectedTileIndex !== null && user) {
      const newCompletedTiles = [...completedTiles];
      newCompletedTiles[selectedTileIndex] = true;
      setCompletedTiles(newCompletedTiles);
      logActivity(0, true);
      
      const allCompleted = newCompletedTiles.every(t => t);
      if (allCompleted) {
          setUser(prevUser => prevUser ? { ...prevUser, diamonds: prevUser.diamonds + 50 } : null);
      }
    }
    setCurrentPage('roadmap');
  }

  const handleViewProfile = () => {
    setCurrentPage('profile');
  }

  const handleNavigateToCareer = () => {
    setCurrentPage('career');
  }
  
  const handleNavigateToCommunity = () => {
    setCurrentPage('community');
  }

  const handleUpdateProfile = (updatedProfile: User) => {
    setUser(updatedProfile);
    setCurrentPage('roadmap');
  }

  const handleApplyJob = (jobId: string) => {
    const jobToMove = availableJobs.find(job => job.id === jobId);
    if (jobToMove) {
      setAvailableJobs(prev => prev.filter(job => job.id !== jobId));
      setAppliedJobs(prev => [jobToMove, ...prev]);
    }
  };
  
  const handleJoinGroup = (groupId: string) => {
    setJoinedGroupIds(prev => new Set(prev).add(groupId));
  };
  
  const handleCreateGroup = (groupData: Omit<StudyGroup, 'id' | 'members'>) => {
      const newGroup: StudyGroup = {
        ...groupData,
        id: `group-${Date.now()}`,
        members: 1,
      };
      setAllGroups(prev => [newGroup, ...prev]);
      handleJoinGroup(newGroup.id);
  };
  
  const handlePlayMiniGame = (tileIndex: number) => {
      setSelectedTileIndex(tileIndex);
      setShowMiniGame(true);
  };

  const handleMiniGameComplete = (won: boolean) => {
      setShowMiniGame(false);
      if (user) {
          if (user.miniGameAttempts >= 3) {
            setUser(prevUser => prevUser ? { ...prevUser, diamonds: prevUser.diamonds - 20 } : null);
          }
          setUser(prevUser => prevUser ? { ...prevUser, miniGameAttempts: prevUser.miniGameAttempts + 1 } : null);
      }
      if (won && selectedTileIndex !== null) {
          // Unlock the next tile by marking the current (skipped) one as complete
          const newCompletedTiles = [...completedTiles];
          newCompletedTiles[selectedTileIndex] = true;
          setCompletedTiles(newCompletedTiles);
      }
      setSelectedTileIndex(null);
  };
  
  const handleBuyDiamonds = (amount: number) => {
    if (user) {
        setUser(prevUser => prevUser ? { ...prevUser, diamonds: prevUser.diamonds + amount } : null);
    }
  };


  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'landing':
        return <LandingPage onGetStartedClick={handleStartFreeClick} onProfileClick={handleViewProfile} onCareerClick={handleNavigateToCareer} onCommunityClick={handleNavigateToCommunity} isLoggedIn={isLoggedIn} user={user} />;
      case 'roadmap':
        return (
          <RoadmapPage
            topic={currentTopic}
            roadmapData={roadmapData}
            furtherTopics={furtherTopics}
            isLoading={isLoadingRoadmap}
            error={roadmapError}
            onGoHome={handleGoHome}
            onSelectTile={handleSelectTile}
            completedTiles={completedTiles}
            onProfileClick={handleViewProfile}
            onCareerClick={handleNavigateToCareer}
            onCommunityClick={handleNavigateToCommunity}
            onPlayMiniGame={handlePlayMiniGame}
            miniGameAttempts={user?.miniGameAttempts ?? 0}
            userDiamonds={user?.diamonds ?? 0}
            user={user}
          />
        );
       case 'tileDetail':
        if (selectedTileIndex !== null && roadmapData) {
          return (
            <TileDetailPage 
              tile={roadmapData.tiles[selectedTileIndex]}
              tileNumber={selectedTileIndex + 1}
              onTakeQuiz={handleTakeQuiz}
              onBackToRoadmap={handleGoToRoadmap}
              onLogTime={logActivity}
            />
          );
        }
        return null;
      case 'quiz':
         if (selectedTileIndex !== null && roadmapData) {
          return (
            <QuizPage
              tile={roadmapData.tiles[selectedTileIndex]}
              onQuizComplete={handleQuizComplete}
              onBackToDetail={() => setCurrentPage('tileDetail')}
              onLogTime={logActivity}
            />
          )
         }
         return null;
      case 'profile':
        if (user) {
          return (
            <ProfilePage 
              user={user}
              activityLog={activityLog}
              onBack={handleGoToRoadmap}
              onUpdateProfile={handleUpdateProfile}
              appliedJobs={appliedJobs}
              onBuyDiamonds={handleBuyDiamonds}
            />
          )
        }
        return null;
       case 'career':
          return (
            <CareerPage 
              onBack={handleGoToRoadmap} 
              onCommunityClick={handleNavigateToCommunity}
              availableJobs={availableJobs}
              appliedJobs={appliedJobs}
              onApplyJob={handleApplyJob}
              user={user}
            />
          );
       case 'community':
          return (
             <CommunityPage 
                onBack={handleGoToRoadmap}
                allGroups={allGroups}
                joinedGroupIds={joinedGroupIds}
                onJoinGroup={handleJoinGroup}
                onCreateGroup={handleCreateGroup}
                user={user}
             />
          );
      default:
        return <LandingPage onGetStartedClick={handleStartFreeClick} onProfileClick={handleViewProfile} onCareerClick={handleNavigateToCareer} onCommunityClick={handleNavigateToCommunity} isLoggedIn={isLoggedIn} user={user} />;
    }
  }

  if (!modalRoot) return null; // Or a loading/error state if the root isn't found

  return (
    <div className="bg-black text-white min-h-screen font-sans">
      {renderCurrentPage()}
      
      {showAuthModal && ReactDOM.createPortal(
        <LoginModal onClose={() => setShowAuthModal(false)} onSuccess={handleAuthSuccess} />,
        modalRoot
      )}
      {showOnboarding && user && ReactDOM.createPortal(
        <OnboardingWizard onClose={() => setShowOnboarding(false)} onComplete={handleOnboardingComplete} />,
        modalRoot
      )}
      {showMiniGame && ReactDOM.createPortal(
        <MemoryGame onGameEnd={handleMiniGameComplete} />,
        modalRoot
      )}
      
      {isLoggedIn && !['landing', 'quiz', 'tileDetail'].includes(currentPage) && ReactDOM.createPortal(
         <button 
           onClick={() => setShowVoiceOrb(true)}
           className="fixed bottom-8 right-8 w-16 h-16 bg-blue-600 rounded-full shadow-lg shadow-blue-500/50 flex items-center justify-center text-white hover:bg-blue-700 transition-all duration-300 transform hover:scale-110 z-50"
           aria-label="Open AI Assistant"
         >
           <Sparkles size={28} />
         </button>,
         modalRoot
      )}

      {showVoiceOrb && ReactDOM.createPortal(
        <VoiceOrb onClose={() => setShowVoiceOrb(false)} />,
        modalRoot
      )}
    </div>
  );
};

export default App;
