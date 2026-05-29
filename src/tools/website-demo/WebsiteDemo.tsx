import React from 'react';
import { ArrowLeft, ExternalLink, Monitor } from 'lucide-react';
import { Link } from 'react-router-dom';

const websites = [
  {
    id: 'excellentjob',
    name: 'ExcellentJOB Website',
    description: 'The new ExcellentJOB website currently under development.',
    url: '/excellentjob/index.html', // Point to the static index explicitly to avoid SPA rewrite
    status: 'In Development'
  }
];

const WebsiteDemo: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link 
              to="/"
              className="p-2 -ml-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
                <Monitor className="w-5 h-5 text-purple-600" />
              </div>
              <h1 className="text-xl font-serif text-slate-800">Website Demos</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-serif text-slate-800 mb-2">Development Preview</h2>
          <p className="text-slate-600">Access live previews of websites currently being built by the Kandela Group.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {websites.map((site) => (
            <div key={site.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow group flex flex-col">
              <div className="p-6 flex-1">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-medium text-slate-900">{site.name}</h3>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                    {site.status}
                  </span>
                </div>
                <p className="text-sm text-slate-500 mb-6">{site.description}</p>
              </div>
              
              <div className="bg-slate-50 px-6 py-4 border-t border-slate-100 flex justify-end">
                <a
                  href={site.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-purple-700 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View Live Demo
                </a>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default WebsiteDemo;
