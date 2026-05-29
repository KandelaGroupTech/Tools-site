import React from 'react';
import { toolsRegistry } from '../tools-registry';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const LandingPage: React.FC = () => {
    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-teal-600 selection:text-white">
            {/* Header */}
            <header className="bg-white border-b border-slate-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-teal-600 rounded flex items-center justify-center shadow-inner">
                            <span className="font-serif text-white font-bold text-xl leading-none">K</span>
                        </div>
                        <div>
                            <p className="font-serif text-slate-800 text-lg tracking-wide leading-tight font-semibold">THE KANDELA GROUP</p>
                            <p className="text-[10px] text-teal-700 tracking-[0.2em] uppercase font-bold">Tools Hub</p>
                        </div>
                    </div>
                </div>
            </header>

            {/* Hero */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 flex-grow">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h1 className="text-4xl md:text-5xl font-serif font-bold text-slate-900 mb-6">
                        Internal tools, built for speed.
                    </h1>
                    <p className="text-lg text-slate-600 font-light">
                        A centralized platform for our proprietary utilities, calculators, and workflows.
                    </p>
                </div>

                {/* Tools Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {toolsRegistry.map((tool) => (
                        <Link 
                            key={tool.id} 
                            to={tool.route}
                            className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-teal-300 transition-all group flex flex-col h-full"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${tool.color}`}>
                                    <tool.icon size={24} />
                                </div>
                                <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${
                                    tool.status === 'live' 
                                        ? 'bg-emerald-100 text-emerald-700'
                                        : tool.status === 'beta'
                                            ? 'bg-amber-100 text-amber-700'
                                            : 'bg-slate-100 text-slate-500'
                                }`}>
                                    {tool.status.replace('-', ' ')}
                                </span>
                            </div>
                            
                            <h3 className="text-lg font-semibold text-slate-800 mb-2 group-hover:text-teal-700 transition-colors">
                                {tool.name}
                            </h3>
                            <p className="text-sm text-slate-600 font-light flex-grow mb-6">
                                {tool.description}
                            </p>
                            
                            <div className="flex items-center text-sm font-medium text-teal-600 group-hover:text-teal-700 mt-auto">
                                Open Tool <ChevronRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
                            </div>
                        </Link>
                    ))}
                </div>
            </main>
            
            {/* Footer */}
            <footer className="py-8 text-center text-sm text-slate-500 font-light border-t border-slate-200 mt-12 bg-white">
                &copy; {new Date().getFullYear()} The Kandela Group LLC. All Rights Reserved.
            </footer>
        </div>
    );
};

export default LandingPage;
