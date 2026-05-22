import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, Trophy, PlayCircle } from 'lucide-react';

const MOCK_QUESTIONS = [
    {
        question: "What does EBITDA stand for?",
        options: [
            "Earnings Before Interest, Taxes, Depreciation, and Amortization",
            "Equity Based Income Tax and Debt Assessment",
            "Earnings Before Investments, Trade, Dividends, and Assets",
            "Enterprise Business Income Tax and Depreciation Allowance"
        ],
        answerIndex: 0
    },
    {
        question: "In venture capital, what is a 'unicorn'?",
        options: [
            "A founder with multiple successful exits",
            "A startup valued at over $1 billion",
            "A company that has no debt",
            "An investment fund with a 100% return rate"
        ],
        answerIndex: 1
    },
    {
        question: "Which of the following is typically a current asset on a balance sheet?",
        options: [
            "Real Estate",
            "Patents",
            "Accounts Receivable",
            "Long-term Debt"
        ],
        answerIndex: 2
    }
];

const GamesHub: React.FC = () => {
    const [gameState, setGameState] = useState<'menu' | 'playing' | 'gameover'>('menu');
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);

    const startGame = () => {
        setScore(0);
        setCurrentQuestionIndex(0);
        setGameState('playing');
        setSelectedAnswer(null);
    };

    const handleAnswer = (index: number) => {
        if (selectedAnswer !== null) return; // Prevent multiple clicks
        
        setSelectedAnswer(index);
        
        const correct = index === MOCK_QUESTIONS[currentQuestionIndex].answerIndex;
        if (correct) {
            setScore(s => s + 100);
        }

        setTimeout(() => {
            if (currentQuestionIndex < MOCK_QUESTIONS.length - 1) {
                setCurrentQuestionIndex(i => i + 1);
                setSelectedAnswer(null);
            } else {
                setGameState('gameover');
            }
        }, 1200);
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-emerald-600 selection:text-white pb-20">
            {/* Header */}
            <header className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
                <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
                    <Link to="/" className="flex items-center text-slate-500 hover:text-emerald-600 transition-colors text-sm font-medium">
                        <ChevronLeft size={18} className="mr-1" /> Back to Hub
                    </Link>
                    <div className="font-serif font-bold text-slate-800 flex items-center gap-2">
                        <Trophy size={18} className="text-amber-500" />
                        <span className="text-amber-600">{score} pts</span>
                    </div>
                </div>
            </header>

            <main className="max-w-xl mx-auto px-4 pt-12">
                {gameState === 'menu' && (
                    <div className="text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-3xl mx-auto flex items-center justify-center mb-8 shadow-sm border border-emerald-200">
                            <span className="text-5xl">🎲</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-serif font-bold text-slate-900 mb-4">Finance Trivia</h1>
                        <p className="text-lg text-slate-600 mb-10">
                            Test your knowledge. Score points. Climb the leaderboard.
                        </p>
                        <button 
                            onClick={startGame}
                            className="bg-teal-600 hover:bg-teal-700 text-white font-medium py-4 px-10 rounded-full text-lg shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 mx-auto w-full max-w-xs"
                        >
                            <PlayCircle size={24} />
                            Play Now
                        </button>
                    </div>
                )}

                {gameState === 'playing' && (
                    <div className="animate-in fade-in zoom-in-95 duration-300">
                        <div className="flex justify-between text-sm text-slate-500 font-medium mb-6 px-2">
                            <span>Question {currentQuestionIndex + 1} of {MOCK_QUESTIONS.length}</span>
                        </div>
                        
                        <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6 md:p-8 mb-6">
                            <h2 className="text-xl md:text-2xl font-serif font-bold text-slate-800 mb-8 leading-snug">
                                {MOCK_QUESTIONS[currentQuestionIndex].question}
                            </h2>
                            
                            <div className="space-y-3">
                                {MOCK_QUESTIONS[currentQuestionIndex].options.map((opt, idx) => {
                                    const isSelected = selectedAnswer === idx;
                                    const isCorrect = idx === MOCK_QUESTIONS[currentQuestionIndex].answerIndex;
                                    const showResult = selectedAnswer !== null;
                                    
                                    let btnClass = "border-slate-200 bg-white hover:border-teal-300 hover:bg-teal-50 text-slate-700";
                                    
                                    if (showResult) {
                                        if (isCorrect) {
                                            btnClass = "border-emerald-500 bg-emerald-50 text-emerald-700 font-medium ring-1 ring-emerald-500";
                                        } else if (isSelected && !isCorrect) {
                                            btnClass = "border-rose-500 bg-rose-50 text-rose-700 ring-1 ring-rose-500";
                                        } else {
                                            btnClass = "border-slate-200 bg-slate-50 text-slate-400 opacity-60";
                                        }
                                    }

                                    return (
                                        <button
                                            key={idx}
                                            disabled={showResult}
                                            onClick={() => handleAnswer(idx)}
                                            className={`w-full text-left p-4 rounded-xl border-2 transition-all ${btnClass}`}
                                        >
                                            {opt}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                )}

                {gameState === 'gameover' && (
                    <div className="text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="w-24 h-24 bg-amber-100 text-amber-600 rounded-full mx-auto flex items-center justify-center mb-6 shadow-sm border border-amber-200">
                            <Trophy size={48} />
                        </div>
                        <h2 className="text-4xl font-serif font-bold text-slate-900 mb-2">Game Over!</h2>
                        <p className="text-xl text-slate-600 mb-8">You scored <span className="font-bold text-amber-600">{score}</span> points.</p>
                        
                        <div className="flex flex-col gap-3 max-w-xs mx-auto">
                            <button 
                                onClick={startGame}
                                className="bg-teal-600 hover:bg-teal-700 text-white font-medium py-3 px-6 rounded-full shadow-sm transition-all"
                            >
                                Play Again
                            </button>
                            <Link 
                                to="/"
                                className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-medium py-3 px-6 rounded-full transition-all"
                            >
                                Back to Hub
                            </Link>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default GamesHub;
