'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function ExclusionsPage({ params }: { params: Promise<{ projectNumber: string }> }) {
  const [data, setData] = useState<any[]>([]);
  const [projectNumber, setProjectNumber] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    params.then(p => {
      setProjectNumber(p.projectNumber);
      fetch(`/api/exclusions?project=${p.projectNumber}`)
        .then(r => r.json())
        .then(d => {
          setData(d.lines);
          setLoading(false);
        });
    });
  }, [params]);

  const handleCopy = () => {
    const text = data.map(l => {
      if (l.state === 'EXCLUDED') return `- ${l.scopeItem} (${l.costCode}): ${l.exclusionReason}`;
      return `- ${l.scopeItem} (${l.costCode}): By ${l.responsibleParty}`;
    }).join('\n');
    navigator.clipboard.writeText("Exclusions & Clarifications\n\n" + text);
    alert('Copied to clipboard!');
  };

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="flex justify-between items-center mb-6">
        <Link href={`/project/${projectNumber}`} className="text-gray-500 hover:text-gray-900">&larr; Back</Link>
        <button onClick={handleCopy} className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded shadow-sm text-sm font-medium hover:bg-gray-50">
          Copy All Text
        </button>
      </div>

      <div className="bg-white p-8 shadow">
        <h1 className="text-xl font-bold mb-6">Exclusions & Clarifications</h1>
        <ul className="space-y-4">
          {data.map(l => (
            <li key={l.costCode} className="text-sm">
              <span className="font-semibold">{l.scopeItem} ({l.costCode}): </span>
              {l.state === 'EXCLUDED' ? l.exclusionReason : `By ${l.responsibleParty}`}
            </li>
          ))}
          {data.length === 0 && <p className="text-gray-500 italic">No exclusions or by-others found.</p>}
        </ul>
      </div>
    </div>
  );
}
