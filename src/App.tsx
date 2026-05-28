import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { auth } from './lib/firebase';
import { onAuthStateChanged, type User } from 'firebase/auth';
import LandingPage from './pages/LandingPage';
import GamesHub from './tools/games/GamesHub';
import TwoBirdsMenu from './tools/twobirds/TwoBirdsMenu';
import WebsiteDemo from './tools/website-demo/WebsiteDemo';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u: User | null) => {
      setUser(u);
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

  // Placeholder component for protected tools
  const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    if (!user) {
      // For now, redirect to Kandela Home login or just a local placeholder
      return <Navigate to="/login" />;
    }
    return <>{children}</>;
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        
        {/* Public Tools */}
        <Route path="/games" element={<GamesHub />} />
        <Route path="/two-birds-menu" element={<TwoBirdsMenu />} />
        <Route path="/website-demo" element={<WebsiteDemo />} />

        {/* Protected Tools */}
        <Route path="/cim-analyzer" element={<ProtectedRoute><div>CIM Analyzer (WIP)</div></ProtectedRoute>} />
        <Route path="/security-monitor" element={<ProtectedRoute><div>Security Monitor (WIP)</div></ProtectedRoute>} />
        <Route path="/deal-scorecard" element={<ProtectedRoute><div>Deal Scorecard (WIP)</div></ProtectedRoute>} />
        <Route path="/meeting-summarizer" element={<ProtectedRoute><div>Meeting Summarizer (WIP)</div></ProtectedRoute>} />
        <Route path="/market-pulse" element={<ProtectedRoute><div>Market Pulse (WIP)</div></ProtectedRoute>} />
        <Route path="/qrcode-studio" element={<ProtectedRoute><div>QR Code Studio (WIP)</div></ProtectedRoute>} />

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
