'use client';

import { useState } from 'react';
import Papa from 'papaparse';
import Link from 'next/link';

export default function SyncPage() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [report, setReport] = useState<any>(null);
  const [csvData, setCsvData] = useState<any[]>([]);
  const [success, setSuccess] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setReport(null);
      setError('');
      setSuccess(false);
    }
  };

  const parseAndAnalyze = () => {
    if (!file) return;
    setLoading(true);
    setError('');
    
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        try {
          const expectedHeaders = [
            'Sync Key', 'Project Number', 'Cost Code', 'Bid Div', 'Division Name',
            'Division Sort', 'Scope Item', 'Unit', 'Bluebeam Subject', 'Quantity',
            'Base Rate', 'Modifier', 'Preliminary Cost', 'Source'
          ];
          
          const headers = results.meta.fields || [];
          const missing = expectedHeaders.filter(h => !headers.includes(h));
          if (missing.length > 0) {
            throw new Error(`CSV missing required headers: ${missing.join(', ')}`);
          }

          setCsvData(results.data);

          const res = await fetch('/api/sync?action=analyze', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ csvData: results.data }),
          });

          const data = await res.json();
          if (!res.ok) throw new Error(data.error || 'Failed to analyze CSV');

          setReport(data);
        } catch (err: any) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      },
      error: (err) => {
        setError(`Failed to parse CSV: ${err.message}`);
        setLoading(false);
      }
    });
  };

  const commitSync = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/sync?action=commit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ csvData }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to commit sync');
      
      setSuccess(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Sync from Excel</h1>
        <Link href="/" className="text-blue-600 hover:underline font-medium">
          &larr; Back to Projects
        </Link>
      </div>

      <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
        {!success ? (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Upload 04_Estimate CSV</label>
              <input
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            </div>
            
            {!report && (
              <button
                onClick={parseAndAnalyze}
                disabled={!file || loading}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded disabled:opacity-50"
              >
                {loading ? 'Analyzing...' : 'Analyze CSV'}
              </button>
            )}

            {error && (
              <div className="mt-4 p-4 bg-red-50 text-red-700 border border-red-200 rounded">
                <p className="font-medium">Sync Error</p>
                <p>{error}</p>
              </div>
            )}

            {report && (
              <div className="mt-6 border-t border-gray-200 pt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Pre-commit Report</h3>
                <dl className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-4 mb-6">
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500">Created</dt>
                    <dd className="mt-1 text-2xl font-semibold text-green-600">{report.created}</dd>
                  </div>
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500">Updated</dt>
                    <dd className="mt-1 text-2xl font-semibold text-blue-600">{report.updated}</dd>
                  </div>
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500">Orphaned</dt>
                    <dd className="mt-1 text-2xl font-semibold text-amber-600">{report.orphaned}</dd>
                  </div>
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500">Rejected</dt>
                    <dd className="mt-1 text-2xl font-semibold text-red-600">{report.rejected}</dd>
                  </div>
                </dl>
                <div className="flex space-x-4">
                  <button
                    onClick={commitSync}
                    disabled={loading}
                    className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-6 rounded disabled:opacity-50"
                  >
                    {loading ? 'Committing...' : 'Confirm & Sync'}
                  </button>
                  <button
                    onClick={() => { setReport(null); setFile(null); }}
                    disabled={loading}
                    className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium py-2 px-4 rounded"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-8">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
              <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-2">Sync Successful</h3>
            <p className="text-sm text-gray-500 mb-6">The estimate has been successfully synced with Airtable.</p>
            <Link href="/" className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded">
              Return to Projects
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
