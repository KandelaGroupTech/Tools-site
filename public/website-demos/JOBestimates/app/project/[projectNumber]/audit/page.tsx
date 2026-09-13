import { lineItemsTable, projectsTable } from '@/lib/airtable';
import { notFound } from 'next/navigation';
import Link from 'next/link';

export const revalidate = 0;

export default async function AuditPage({ params }: { params: Promise<{ projectNumber: string }> }) {
  const { projectNumber } = await params;
  
  const projects = await projectsTable.select({ filterByFormula: `{Project Number} = '${projectNumber}'` }).firstPage();
  if (projects.length === 0) notFound();
  const project = projects[0];

  const lines = await lineItemsTable.select({ filterByFormula: `SEARCH('${project.id}', ARRAYJOIN({Project}))` }).all();

  const allLines = lines.map(line => ({
    costCode: line.get('Cost Code') as string,
    scopeItem: line.get('Scope Item') as string,
    state: (line.get('State') as string) || '',
    finalCost: (line.get('Final Cost') as number) || 0,
    responsibleParty: (line.get('Responsible Party') as string) || '',
    exclusionReason: (line.get('Exclusion Reason') as string) || '',
    prelimMismatch: line.get('Prelim Mismatch') as string,
    subQuoteTotal: line.get('Sub Quote Total') as number,
  }));

  const blankLines = allLines.filter(l => !l.state);
  
  const substanceIssues = allLines.filter(l => 
    (l.state === 'PRICED' && l.finalCost === 0) ||
    (l.state === 'BY OTHERS' && !l.responsibleParty) ||
    (l.state === 'EXCLUDED' && !l.exclusionReason)
  );

  const subQuoteGaps = allLines.filter(l => l.state === 'PRICED' && !l.subQuoteTotal); // simplified

  const mismatches = allLines.filter(l => !!l.prelimMismatch);

  return (
    <div className="max-w-5xl mx-auto p-8">
      <div className="flex items-center space-x-4 mb-8">
        <Link href={`/project/${projectNumber}`} className="text-gray-500 hover:text-gray-900">&larr; Back to Estimate</Link>
        <h1 className="text-2xl font-bold text-gray-900">Audit Report: {projectNumber}</h1>
      </div>

      <div className="space-y-6">
        <section className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <h2 className="text-xl font-semibold mb-4 text-red-600 flex justify-between">
            <span>1. Blank Line Report</span>
            <span>{blankLines.length}</span>
          </h2>
          {blankLines.length > 0 ? (
            <ul className="list-disc pl-5 space-y-1">
              {blankLines.map(l => (
                <li key={l.costCode} className="text-sm font-mono text-gray-700">{l.costCode} — <span className="font-sans">{l.scopeItem}</span></li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500">No blank lines.</p>
          )}
        </section>

        <section className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <h2 className="text-xl font-semibold mb-4 flex justify-between">
            <span>2. State Without Substance</span>
            <span>{substanceIssues.length}</span>
          </h2>
          {substanceIssues.length > 0 ? (
             <ul className="list-disc pl-5 space-y-1">
             {substanceIssues.map(l => (
               <li key={l.costCode} className="text-sm font-mono text-gray-700">{l.costCode} — <span className="font-sans">{l.scopeItem} ({l.state})</span></li>
             ))}
           </ul>
          ) : (
            <p className="text-sm text-gray-500">No substance issues.</p>
          )}
        </section>

        <section className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <h2 className="text-xl font-semibold mb-4 flex justify-between">
            <span>3. Sub Quote Gaps</span>
            <span>{subQuoteGaps.length}</span>
          </h2>
          <p className="text-sm text-gray-500">List of PRICED lines with missing sub quotes.</p>
        </section>

        <section className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <h2 className="text-xl font-semibold mb-4 flex justify-between text-amber-600">
            <span>4. Prelim Mismatches</span>
            <span>{mismatches.length}</span>
          </h2>
          {mismatches.length > 0 ? (
             <ul className="list-disc pl-5 space-y-1">
             {mismatches.map(l => (
               <li key={l.costCode} className="text-sm font-mono text-gray-700">{l.costCode} — <span className="font-sans">{l.scopeItem}</span></li>
             ))}
           </ul>
          ) : (
            <p className="text-sm text-gray-500">No prelim mismatches.</p>
          )}
        </section>
      </div>
    </div>
  );
}
