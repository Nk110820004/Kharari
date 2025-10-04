import React, { useState, useEffect, useCallback } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation, useParams } from 'react-router-dom';
import LandingPage from './components/pages/LandingPage';
import RoadmapPage from './components/pages/RoadmapPage';
import LoginModal from './components/auth/LoginModal';
import OnboardingWizard from './components/onboarding/OnboardingWizard';
import { generateRoadmap, generateFurtherTopics, Roadmap } from './lib/gemini';
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
import VideoPage from './components/pages/VideoPage';
import { getUserProfile, updateUserProfile, logUserActivity } from './lib/userStorage';

const AUTH_ROUTES = ['/login', '/signup'];

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
  
  const [currentTopic, setCurrentTopic] = useState('');
  const [roadmapData, setRoadmapData] = useState<Roadmap | null>(null);
  const [furtherTopics, setFurtherTopics] = useState<string[]>([]);
  const [isLoadingRoadmap, setIsLoadingRoadmap] = useState(false);
  const [roadmapError, setRoadmapError] = useState('');

  const [selectedTileIndex, setSelectedTileIndex] = useState<number | null>(null);
  
  const [user, setUser] = useState<User | null>(null);
  const [activityLog, setActivityLog] = useState<ActivityLog[]>([]);
  const [completedTiles, setCompletedTiles] = useState<boolean[]>([]);
  
  const [showVoiceOrb, setShowVoiceOrb] = useState(false);
  
  const [availableJobs, setAvailableJobs] = useState<Job[]>(initialJobs);
  const [appliedJobs, setAppliedJobs] = useState<Job[]>([]);

  const [allGroups, setAllGroups] = useState<StudyGroup[]>(initialGroups);
  const [joinedGroupIds, setJoinedGroupIds] = useState<Set<string>>(new Set());
  
  const [showMiniGame, setShowMiniGame] = useState(false);

  const modalRoot = document.getElementById('modal-root');

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (AUTH_ROUTES.includes(location.pathname)) {
      setShowAuthModal(true);
    }
  }, [location.pathname]);

  const handleCloseAuthModal = () => {
    setShowAuthModal(false);
    if (AUTH_ROUTES.includes(location.pathname)) {
      navigate('/');
    }
  };

  useEffect(() => {
    (async () => {
      const { supabase } = await import('./lib/supabaseClient');
      const { getRoadmap } = await import('./lib/roadmapStorage');

      const { data: { session } } = await supabase.auth.getSession();
      if (session && !user) {
        setIsLoggedIn(true);
        const userProfile = await getUserProfile();
        if (userProfile) {
          setUser(userProfile);
        } else {
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

        const existingRoadmap = await getRoadmap();
        if (existingRoadmap) {
          setRoadmapData(existingRoadmap.roadmap);
          setCurrentTopic(existingRoadmap.topic);
          setCompletedTiles(existingRoadmap.completedTiles);
          navigate('/roadmap');
        }
      }

      const { data: authListener } = supabase.auth.onAuthStateChange(async (_event, sess) => {
        if (sess) {
          setIsLoggedIn(true);
          const userProfile = await getUserProfile();
          if (userProfile) {
            setUser(userProfile);
          } else {
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
        } else {
          setIsLoggedIn(false);
          setUser(null);
          setRoadmapData(null);
          setCurrentTopic('');
          navigate('/');
        }
      });
      return () => {
        authListener?.subscription.unsubscribe();
      };
    })();
  }, [navigate]);

  useEffect(() => {
    if (!roadmapData) {
      return;
    }
    setSelectedTileIndex(null);
    setUser(prevUser => {
      if (!prevUser) {
        return prevUser;
      }
      return { ...prevUser, miniGameAttempts: 0 };
    });
  }, [roadmapData]);

  const handleStartFreeClick = () => {
    navigate('/signup');
  };

  const handleAuthSuccess = async () => {
    setShowAuthModal(false);
    const { getRoadmap } = await import('./lib/roadmapStorage');
    const existingRoadmap = await getRoadmap();
    if (existingRoadmap) {
      setRoadmapData(existingRoadmap.roadmap);
      setCurrentTopic(existingRoadmap.topic);
      setCompletedTiles(existingRoadmap.completedTiles);
      navigate('/roadmap');
    } else {
      setShowOnboarding(true);
    }
  };

  const handleOnboardingComplete = async (username: string, phone: string, language: string, topic: string) => {
    setShowOnboarding(false);
    if(user) {
      const updatedUser = { ...user, name: username, phone, language };
      setUser(updatedUser);
      await updateUserProfile(updatedUser);
    }
    setIsLoadingRoadmap(true);
    setRoadmapError('');
    setCurrentTopic(topic);
    navigate('/roadmap');

    const map: Record<string, 'en'|'hi'|'ta'|'ml'> = { English: 'en', Hindi: 'hi', Tamil: 'ta', Malayalam: 'ml' } as const;
    const langCode = map[language] ?? 'en';

    try {
      const [data, furtherData] = await Promise.all([
        generateRoadmap(topic, langCode),
        generateFurtherTopics(topic)
      ]);
      setRoadmapData(data);
      setCompletedTiles(new Array(data.tiles.length).fill(false));
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
  
  const logActivity = useCallback(async (timeSpent: number, tileCompleted: boolean) => {
    const todayStr = new Date().toISOString().split('T')[0];
    const newLogEntry = { date: todayStr, timeSpent, completed: tileCompleted };

    try {
      await logUserActivity(newLogEntry);
    } catch(e) {
      console.warn("Failed to log user activity", e);
    }

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
        const yesterdayStr = yesterday.toISOString().split('T')[0];

        let newStreak = user.currentStreak;
        if (user.lastActivityDate !== todayStr) {
          if (user.lastActivityDate === yesterdayStr) {
              newStreak++;
          } else {
              newStreak = 1;
          }
        }
        
        let newDiamonds = user.diamonds;
        if (newStreak > 0 && newStreak % 7 === 0 && user.currentStreak < newStreak) {
            newDiamonds += 20;
        }
        
        const updatedUser = {
            ...user,
            currentStreak: newStreak,
            highestStreak: Math.max(user.highestStreak, newStreak),
            lastActivityDate: todayStr,
            diamonds: newDiamonds
        };
        setUser(updatedUser);
        try {
          await updateUserProfile(updatedUser);
        } catch(e) {
          console.warn("Failed to update user profile", e);
        }
    }
  }, [user]);

  const handleSelectTile = (index: number) => {
    setSelectedTileIndex(index);
    navigate(`/roadmap/tile/${index}`);
  }

  const handleQuizComplete = (tileIndex: number, passed: boolean) => {
    if (!roadmapData || Number.isNaN(tileIndex) || tileIndex < 0 || tileIndex >= roadmapData.tiles.length) {
      setSelectedTileIndex(null);
      navigate('/roadmap');
      return;
    }

    if (passed && user) {
      const newCompletedTiles = [...completedTiles];
      newCompletedTiles[tileIndex] = true;
      setCompletedTiles(newCompletedTiles);
      logActivity(0, true);

      const allCompleted = newCompletedTiles.every(t => t);
      if (allCompleted) {
        const updatedUser = { ...user, diamonds: user.diamonds + 50 };
        setUser(updatedUser);
        updateUserProfile(updatedUser);
      }
    }

    setSelectedTileIndex(null);
    navigate('/roadmap');
  };

  const handleUpdateProfile = async (updatedProfile: User) => {
    setUser(updatedProfile);
    try {
      await updateUserProfile(updatedProfile);
    } catch(e) {
      console.warn("Failed to update profile", e);
    }
    navigate('/roadmap');
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
  
  const handlePlayMiniGame = async (tileIndex: number) => {
      setSelectedTileIndex(tileIndex);
      setShowMiniGame(true);
  };

  const handleMiniGameComplete = async (won: boolean) => {
      setShowMiniGame(false);
      if (user) {
          let updatedUser = { ...user };
          if (user.miniGameAttempts >= 3) {
            updatedUser.diamonds -= 20;
          }
          updatedUser.miniGameAttempts += 1;

          if (won && selectedTileIndex !== null) {
              const newCompletedTiles = [...completedTiles];
              newCompletedTiles[selectedTileIndex] = true;
              setCompletedTiles(newCompletedTiles);
          }
          setUser(updatedUser);
          try {
            await updateUserProfile(updatedUser);
          } catch(e) {
            console.warn("Failed to update user after minigame", e);
          }
      }
      setSelectedTileIndex(null);
  };
  
  const handleBuyDiamonds = async (amount: number) => {
    if (user) {
        const updatedUser = { ...user, diamonds: user.diamonds + amount };
        setUser(updatedUser);
        try {
          await updateUserProfile(updatedUser);
        } catch(e) {
          console.warn("Failed to update diamonds", e);
        }
    }
  };

  const landingPageElement = (
    <LandingPage
      onGetStartedClick={handleStartFreeClick}
      onProfileClick={() => navigate('/profile')}
      onCareerClick={() => navigate('/career')}
      onCommunityClick={() => navigate('/community')}
      isLoggedIn={isLoggedIn}
      user={user}
    />
  );

  const TileDetailRoute: React.FC = () => {
    const { tileIndex } = useParams<{ tileIndex: string }>();
    const index = Number(tileIndex);
    const hasTile = Boolean(roadmapData) && !Number.isNaN(index) && index >= 0 && roadmapData!.tiles.length > index;

    useEffect(() => {
      if (hasTile) {
        setSelectedTileIndex(index);
      }
    }, [hasTile, index]);

    if (!hasTile || !roadmapData) {
      return <Navigate to="/roadmap" replace />;
    }

    return (
      <TileDetailPage
        tile={roadmapData.tiles[index]}
        tileNumber={index + 1}
        onTakeQuiz={() => navigate(`/roadmap/tile/${index}/quiz`)}
        onBackToRoadmap={() => navigate('/roadmap')}
        onLogTime={logActivity}
      />
    );
  };

  const QuizRoute: React.FC = () => {
    const { tileIndex } = useParams<{ tileIndex: string }>();
    const index = Number(tileIndex);
    const hasTile = Boolean(roadmapData) && !Number.isNaN(index) && index >= 0 && roadmapData!.tiles.length > index;

    useEffect(() => {
      if (hasTile) {
        setSelectedTileIndex(index);
      }
    }, [hasTile, index]);

    if (!hasTile || !roadmapData) {
      return <Navigate to="/roadmap" replace />;
    }

    return (
      <QuizPage
        tile={roadmapData.tiles[index]}
        onQuizComplete={(passed) => handleQuizComplete(index, passed)}
        onBackToDetail={() => navigate(`/roadmap/tile/${index}`)}
        onLogTime={logActivity}
      />
    );
  };

  if (!modalRoot) return null;

  return (
    <div className="bg-black text-white min-h-screen font-sans">
      <Routes>
        <Route path="/" element={landingPageElement} />
        <Route path="/login" element={landingPageElement} />
        <Route path="/signup" element={landingPageElement} />
        <Route
          path="/roadmap"
          element={
            <RoadmapPage
              topic={currentTopic}
              roadmapData={roadmapData}
              furtherTopics={furtherTopics}
              isLoading={isLoadingRoadmap}
              error={roadmapError}
              onGoHome={() => navigate('/')}
              onSelectTile={handleSelectTile}
              completedTiles={completedTiles}
              onProfileClick={() => navigate('/profile')}
              onCareerClick={() => navigate('/career')}
              onCommunityClick={() => navigate('/community')}
              onPlayMiniGame={handlePlayMiniGame}
              miniGameAttempts={user?.miniGameAttempts ?? 0}
              userDiamonds={user?.diamonds ?? 0}
              user={user}
              onStartOnboarding={() => setShowOnboarding(true)}
              onRequireAuth={() => navigate('/login')}
              isLoggedIn={isLoggedIn}
            />
          }
        />
        <Route path="/roadmap/tile/:tileIndex" element={<TileDetailRoute />} />
        <Route path="/roadmap/tile/:tileIndex/quiz" element={<QuizRoute />} />
        <Route path="/video/:videoId" element={<VideoPage />} />
        <Route
          path="/profile"
          element={
            user ? (
              <ProfilePage
                user={user}
                activityLog={activityLog}
                onBack={() => navigate('/roadmap')}
                onUpdateProfile={handleUpdateProfile}
                appliedJobs={appliedJobs}
                onBuyDiamonds={handleBuyDiamonds}
              />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/career"
          element={
            <CareerPage
              onBack={() => navigate('/roadmap')}
              onCommunityClick={() => navigate('/community')}
              availableJobs={availableJobs}
              appliedJobs={appliedJobs}
              onApplyJob={handleApplyJob}
              user={user}
            />
          }
        />
        <Route
          path="/community"
          element={
            <CommunityPage
              onBack={() => navigate('/roadmap')}
              allGroups={allGroups}
              joinedGroupIds={joinedGroupIds}
              onJoinGroup={handleJoinGroup}
              onCreateGroup={handleCreateGroup}
              user={user}
            />
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      
      {showAuthModal && ReactDOM.createPortal(
        <LoginModal
          onClose={handleCloseAuthModal}
          onSuccess={handleAuthSuccess}
          initialMode={location.pathname === '/login' ? 'login' : 'signup'}
        />,
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
      
      {isLoggedIn && !['/', '/quiz'].includes(location.pathname) && !location.pathname.startsWith('/roadmap/tile/') && !location.pathname.startsWith('/video/') && ReactDOM.createPortal(
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

const AppWrapper: React.FC = () => (
  <Router>
    <App />
  </Router>
);

export default AppWrapper;
