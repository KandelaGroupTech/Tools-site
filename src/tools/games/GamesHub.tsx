import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

const GamesHub: React.FC = () => {
    return (
        <div className="min-h-screen bg-emerald-950 text-white font-sans selection:bg-emerald-600 selection:text-white">
            <header className="bg-emerald-900 border-b border-emerald-800">
                <div className="max-w-4xl mx-auto px-4 py-4 flex items-center">
                    <Link to="/" className="flex items-center text-emerald-400 hover:text-white transition-colors text-sm font-medium">
                        <ChevronLeft size={18} className="mr-1" /> Back to Hub
                    </Link>
                </div>
            </header>
            <main className="max-w-4xl mx-auto px-4 py-16 text-center">
                <div className="w-20 h-20 bg-emerald-800 rounded-2xl mx-auto flex items-center justify-center mb-8 shadow-inner shadow-emerald-950/50">
                    <span className="text-4xl">🎲</span>
                </div>
                <h1 className="text-5xl font-serif font-bold text-white mb-6">Knowledge Games</h1>
                <p className="text-xl text-emerald-300 font-light mb-12">
                    Test your financial knowledge and compete on the global leaderboard.
                </p>
                <div className="bg-emerald-900/50 border border-emerald-800 rounded-3xl p-8 max-w-lg mx-auto backdrop-blur-sm">
                    <h2 className="text-2xl font-medium text-emerald-100 mb-2">Coming Soon</h2>
                    <p className="text-emerald-400 text-sm">
                        The trivia engine is currently under development. Check back shortly!
                    </p>
                </div>
            </main>
        </div>
    );
};

export default GamesHub;
