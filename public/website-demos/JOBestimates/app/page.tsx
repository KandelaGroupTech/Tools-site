import { projectsTable, lineItemsTable } from '@/lib/airtable';
import Link from 'next/link';

export const revalidate = 0; // Disable caching for now to always get fresh data

async function getProjectsData() {
  const [projectsRecords, lineItemsRecords] = await Promise.all([
    projectsTable.select({ sort: [{ field: 'Bid Due Date', direction: 'asc' }] }).all(),
    lineItemsTable.select({ fields: ['Project', 'Final Cost', 'State'] }).all(),
  ]);

  const projects = projectsRecords.map(record => ({
    id: record.id,
    projectNumber: record.get('Project Number') as string,
    projectName: record.get('Project Name') as string,
    jurisdiction: record.get('Jurisdiction') as string,
    jobSize: record.get('Job Size') as string,
    status: record.get('Status') as string,
    bidDueDate: record.get('Bid Due Date') as string,
  }));

  const projectStats = projects.map(p => {
    const pLines = lineItemsRecords.filter(line => {
      const pLinks = line.get('Project') as string[] | undefined;
      return pLinks && pLinks.includes(p.id);
    });

    let totalFinalCost = 0;
    let blankStateCount = 0;

    pLines.forEach(line => {
      totalFinalCost += (line.get('Final Cost') as number) || 0;
      if (!line.get('State')) {
        blankStateCount++;
      }
    });

    return {
      ...p,
      totalFinalCost,
      blankStateCount,
    };
  });

  return projectStats;
}

export default async function ProjectsPage() {
  const projects = await getProjectsData();

  return (
    <div className="max-w-7xl mx-auto p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
        <Link 
          href="/sync" 
          className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-4 rounded border border-gray-300"
        >
          Sync CSV
        </Link>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200 tabular-nums">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Project No.</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Loc/Size</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bid Due</th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Final Cost</th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Unresolved Lines</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {projects.map((p) => (
              <tr key={p.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                  <Link href={`/project/${p.projectNumber}`}>{p.projectNumber}</Link>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{p.projectName}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{p.jurisdiction} • {p.jobSize}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{p.status}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {p.bidDueDate ? new Date(p.bidDueDate).toLocaleDateString() : '—'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                  {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(p.totalFinalCost)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                  <span className={`font-bold ${p.blankStateCount > 0 ? 'text-red-600' : 'text-green-600'}`}>
                    {p.blankStateCount}
                  </span>
                </td>
              </tr>
            ))}
            {projects.length === 0 && (
              <tr>
                <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500">
                  No projects found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
