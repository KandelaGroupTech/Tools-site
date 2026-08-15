import React from 'react';
import { Link } from 'react-router-dom';
import { Mic, Activity, LineChart } from 'lucide-react';

export default function SpeechCoach() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Speech Coach</h1>
        <p className="text-slate-500 mt-2 text-lg">Master your public speaking and enunciation.</p>
      </header>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="h-12 w-12 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center mb-4">
            <Mic size={24} />
          </div>
          <h2 className="text-xl font-semibold text-slate-900 mb-2">Ready to practice?</h2>
          <p className="text-slate-600 mb-6">
            Start a new session to read a generated passage. We will analyze your 
            pacing, pausing, and facial expressions to help you improve.
          </p>
          <Link 
            to="/speech-coach/session" 
            className="inline-flex items-center justify-center px-4 py-2 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 transition-colors"
          >
            Start Session
          </Link>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <div className="h-12 w-12 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center mb-4">
            <LineChart size={24} />
          </div>
          <h2 className="text-xl font-semibold text-slate-900 mb-2">Your Progress</h2>
          <p className="text-slate-500 italic">Complete a session to see your recent scores and improvements here.</p>
        </div>
      </div>
    </div>
  );
}
