import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { auth } from './lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import LandingPage from './pages/LandingPage';
import JobPortal from './pages/JobPortal';
import GamesHub from './tools/games/GamesHub';
import TwoBirdsMenu from './tools/twobirds/TwoBirdsMenu';
import WebsiteDemo from './tools/website-demo/WebsiteDemo';
import SpeechCoach from './tools/speech-coach/SpeechCoach';
import SpeechCoachSession from './tools/speech-coach/SpeechCoachSession';

const App: React.FC = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, () => {
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  const isJobDomain = typeof window !== 'undefined' && (
    window.location.hostname === 'portal.excellentjob.com' ||
    window.location.hostname.includes('excellentjob')
  );

  return (
    <BrowserRouter>
      <Routes>
        {/* If visited from portal.excellentjob.com, root renders the JOB Portal */}
        <Route path="/" element={isJobDomain ? <JobPortal /> : <LandingPage />} />
        
        {/* Dedicated direct routes */}
        <Route path="/job" element={<JobPortal />} />
        <Route path="/portal" element={<JobPortal />} />

        {/* Public Tools */}
        <Route path="/games" element={<GamesHub />} />
        <Route path="/two-birds-menu" element={<TwoBirdsMenu />} />
        <Route path="/website-demo" element={<WebsiteDemo />} />
        <Route path="/speech-coach" element={<SpeechCoach />} />
        <Route path="/speech-coach/session" element={<SpeechCoachSession />} />

        {/* Auth routes */}
        <Route path="/login" element={
          <div className="min-h-screen bg-slate-50 flex items-center justify-center">
            <div className="bg-white p-8 rounded-xl shadow-sm text-center">
              <h2 className="text-xl font-serif text-slate-800 mb-4">Auth Required</h2>
              <p className="text-slate-600 text-sm">You must be logged in to access this tool.</p>
            </div>
          </div>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
