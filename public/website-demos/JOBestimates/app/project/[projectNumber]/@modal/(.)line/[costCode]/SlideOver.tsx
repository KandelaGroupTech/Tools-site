'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { X } from 'lucide-react';

export default function SlideOver({ line, rate }: { line: any, rate: any }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'details' | 'quotes' | 'comments'>('details');

  const close = () => {
    router.back();
  };

  const fmtCurrency = (val: number | undefined | null) => {
    if (val === undefined || val === null || isNaN(val)) return '—';
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);
  };

  return (
    <div className="relative z-50" aria-labelledby="slide-over-title" role="dialog" aria-modal="true">
      <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={close}></div>

      <div className="fixed inset-0 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10 sm:pl-16">
            <div className="pointer-events-auto w-screen max-w-md flex flex-col h-full bg-white shadow-xl">
              <div className="flex items-start justify-between px-4 py-6 sm:px-6 border-b border-gray-200">
                <div className="flex flex-col">
                  <h2 className="text-lg font-bold text-gray-900" id="slide-over-title">
                    {line.costCode}
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">{line.scopeItem}</p>
                </div>
                <div className="ml-3 flex h-7 items-center">
                  <button type="button" onClick={close} className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none">
                    <span className="sr-only">Close panel</span>
                    <X className="h-6 w-6" />
                  </button>
                </div>
              </div>

              <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8 px-6" aria-label="Tabs">
                  <button 
                    onClick={() => setActiveTab('details')}
                    className={`${activeTab === 'details' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                  >
                    Details
                  </button>
                  <button 
                    onClick={() => setActiveTab('quotes')}
                    className={`${activeTab === 'quotes' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                  >
                    Sub Quotes
                  </button>
                  <button 
                    onClick={() => setActiveTab('comments')}
                    className={`${activeTab === 'comments' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                  >
                    Comments
                  </button>
                </nav>
              </div>

              <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
                {activeTab === 'details' && (
                  <div className="space-y-8 text-sm">
                    <div>
                      <h3 className="font-medium text-gray-900 mb-3">Preliminary Arithmetic</h3>
                      <div className="bg-gray-50 p-4 rounded-md border border-gray-200 font-mono flex items-center justify-between text-gray-700">
                        <div>
                          <span>{line.quantity.toLocaleString()} {line.unit}</span>
                          <span className="mx-2">×</span>
                          <span>{fmtCurrency(line.baseRate)}</span>
                          <span className="mx-2">×</span>
                          <span>{line.modifier.toFixed(3)}</span>
                        </div>
                        <div className="font-bold text-gray-900">
                          = {fmtCurrency(line.preliminaryCost)}
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-medium text-gray-900 mb-3">Rate Library Reference</h3>
                      {rate ? (
                        <div className="bg-gray-50 p-4 rounded-md border border-gray-200 text-gray-700">
                          <p className="mb-2"><strong>Source:</strong> {rate.source}</p>
                          <p className="whitespace-pre-wrap">{rate.assemblyNote}</p>
                        </div>
                      ) : (
                        <p className="text-gray-500 italic">No matching rate found in library.</p>
                      )}
                    </div>
                  </div>
                )}
                {activeTab === 'quotes' && (
                  <div>
                    {/* Simplified for time limit */}
                    <p className="text-gray-500 text-sm">Sub quotes would appear here.</p>
                    <div className="mt-4 border-t border-gray-200 pt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Upload Quote PDF</label>
                      <input type="file" accept="application/pdf" className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
                    </div>
                  </div>
                )}
                {activeTab === 'comments' && (
                  <div>
                    {/* Simplified for time limit */}
                    <p className="text-gray-500 text-sm mb-4">No comments.</p>
                    <textarea className="w-full border-gray-300 rounded shadow-sm sm:text-sm" rows={3} placeholder="Add a comment..."></textarea>
                    <button className="mt-2 bg-blue-600 text-white px-4 py-2 rounded text-sm">Post Comment</button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
