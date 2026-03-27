import React, { useState, useEffect } from 'react';
import { AppStep, ConcertDetails, Song } from './types';
import { Landing } from './components/Steps/Landing';
import { DetailsInput } from './components/Steps/DetailsInput';
import { SongList } from './components/Steps/SongList';
import { Visualizer } from './components/Steps/Visualizer';
import { ErrorBoundary } from './components/ErrorBoundary';
import { TermsPage } from './components/Legal/TermsPage';
import { PrivacyPage } from './components/Legal/PrivacyPage';
import { BlogGeneralPage } from './components/Blog/BlogGeneralPage';
import { BlogBillieEilishPage } from './components/Blog/BlogBillieEilishPage';
import { BlogTaylorSwiftPage } from './components/Blog/BlogTaylorSwiftPage';
import { BlogBadBunnyPage } from './components/Blog/BlogBadBunnyPage';
import { BlogTimelessMemoriesPage } from './components/Blog/BlogTimelessMemoriesPage';
import { BlogMinimalistDesignPage } from './components/Blog/BlogMinimalistDesignPage';
import { BlogIconicSetlistsPage } from './components/Blog/BlogIconicSetlistsPage';
import { BlogPersonalizingPage } from './components/Blog/BlogPersonalizingPage';
import { BlogInnovationsPage } from './components/Blog/BlogInnovationsPage';

// Restore state saved before the Stripe redirect, if returning from payment
function getRestoredState() {
  if (typeof window === 'undefined') return null;
  const params = new URLSearchParams(window.location.search);
  if (params.get('payment') !== 'success') return null;
  try {
    const saved = localStorage.getItem('setlistart_pending_purchase');
    if (!saved) return null;
    const parsed = JSON.parse(saved);
    if (parsed?.details && parsed?.songs) return parsed;
  } catch {}
  return null;
}

const App: React.FC = () => {
  const [currentPath, setCurrentPath] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return window.location.pathname;
    }
    return '/';
  });

  useEffect(() => {
    const handlePathChange = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener('popstate', handlePathChange);
    return () => window.removeEventListener('popstate', handlePathChange);
  }, []);

  // Handle legal pages
  if (currentPath === '/terms') {
    return <TermsPage />;
  }
  if (currentPath === '/privacy') {
    return <PrivacyPage />;
  }

  // Handle blog pages
  if (currentPath === '/blog/concert-setlist-poster') {
    return <BlogGeneralPage />;
  }
  if (currentPath === '/blog/billie-eilish-setlist-poster') {
    return <BlogBillieEilishPage />;
  }
  if (currentPath === '/blog/taylor-swift-setlist-poster') {
    return <BlogTaylorSwiftPage />;
  }
  if (currentPath === '/blog/bad-bunny-setlist-poster') {
    return <BlogBadBunnyPage />;
  }
  if (currentPath === '/blog/creating-timeless-concert-memories') {
    return <BlogTimelessMemoriesPage />;
  }
  if (currentPath === '/blog/minimalist-design-concert-memorabilia') {
    return <BlogMinimalistDesignPage />;
  }
  if (currentPath === '/blog/iconic-setlists-what-they-reveal') {
    return <BlogIconicSetlistsPage />;
  }
  if (currentPath === '/blog/personalizing-concert-experiences-with-art') {
    return <BlogPersonalizingPage />;
  }
  if (currentPath === '/blog/setlistart-bridging-music-and-art') {
    return <BlogInnovationsPage />;
  }

  const [step, setStep] = useState<AppStep>(() => {
    const restored = getRestoredState();
    return restored ? AppStep.VISUALIZE : AppStep.LANDING;
  });

  // App State
  const [details, setDetails] = useState<ConcertDetails>(() => {
    const restored = getRestoredState();
    return restored?.details || { artist: '', city: '', year: '' };
  });

  const [songs, setSongs] = useState<Song[]>(() => {
    const restored = getRestoredState();
    return restored?.songs || [];
  });

  const [songsFromApi, setSongsFromApi] = useState<boolean>(() => {
    const restored = getRestoredState();
    return restored?.songsFromApi || false;
  });

  const handleUpdateDetails = (patch: Partial<ConcertDetails>) => {
  setDetails(prev => ({ ...prev, ...patch }));
};


  // Navigation Handlers
  const handleStart = () => setStep(AppStep.DETAILS);
  
  const handleDetailsSubmit = (data: ConcertDetails) => {
    setDetails(data);
    setStep(AppStep.SONGS);
  };

  const handleUpdateSongs = (newSongs: Song[]) => {
    setSongs(newSongs);
  };

  const handleVisualize = () => {
    setStep(AppStep.VISUALIZE);
  };

  // Render Current Step
  const renderStep = () => {
    switch (step) {
      case AppStep.LANDING:
        return <Landing onStart={handleStart} />;
      
      case AppStep.DETAILS:
        return (
          <div className="h-full flex items-center justify-center px-4">
             <DetailsInput initialData={details} onNext={handleDetailsSubmit} />
          </div>
        );
      
      case AppStep.SONGS:
        return (
          <div className="h-full pt-10 px-4 pb-6">
            <SongList
              songs={songs}
              details={details}
              onUpdateSongs={handleUpdateSongs}
              onUpdateDetails={handleUpdateDetails}
              onSongsFromApi={setSongsFromApi}
              onNext={handleVisualize}
              onBack={() => setStep(AppStep.DETAILS)}
            />
          </div>
        );

      case AppStep.VISUALIZE:
        return (
          <ErrorBoundary>
          <Visualizer
            songs={songs}
            details={details}
            onBack={() => setStep(AppStep.SONGS)}
            songsFromApi={songsFromApi}
          />
          </ErrorBoundary>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="h-full w-full bg-slate-950 text-slate-50 font-sans selection:bg-brand-500 selection:text-white">
      {renderStep()}
    </div>
  );
};

export default App;
