import { projectsTable, lineItemsTable } from '@/lib/airtable';
import EstimateGrid from './EstimateGrid';
import { notFound } from 'next/navigation';
import Link from 'next/link';

export const revalidate = 0;

export default async function ProjectPage({ params }: { params: Promise<{ projectNumber: string }> }) {
  const { projectNumber } = await params;

  const projects = await projectsTable.select({ filterByFormula: `{Project Number} = '${projectNumber}'` }).firstPage();
  if (projects.length === 0) {
    notFound();
  }
  const project = projects[0];

  const lines = await lineItemsTable.select({ filterByFormula: `SEARCH('${project.id}', ARRAYJOIN({Project}))`, sort: [{ field: 'Division Sort', direction: 'asc' }, { field: 'Cost Code', direction: 'asc' }] }).all();

  const projectData = {
    id: project.id,
    projectNumber: project.get('Project Number') as string,
    projectName: project.get('Project Name') as string,
    jurisdiction: project.get('Jurisdiction') as string,
    jobSize: project.get('Job Size') as string,
    usf: project.get('USF') as number,
    rsf: project.get('RSF') as number,
  };

  const lineItems = lines.map(line => ({
    id: line.id,
    costCode: line.get('Cost Code') as string,
    bidDiv: line.get('Bid Div') as string,
    divisionName: line.get('Division Name') as string,
    divisionSort: line.get('Division Sort') as number,
    scopeItem: line.get('Scope Item') as string,
    unit: line.get('Unit') as string,
    quantity: line.get('Quantity') as number,
    baseRate: line.get('Base Rate') as number,
    modifier: line.get('Modifier') as number,
    preliminaryCost: line.get('Preliminary Cost') as number,
    prelimCheck: line.get('Prelim Check') as number,
    prelimMismatch: line.get('Prelim Mismatch') as string,
    finalCost: line.get('Final Cost') as number,
    variance: line.get('Variance') as number,
    state: (line.get('State') as string) || '',
    responsibleParty: line.get('Responsible Party') as string,
    exclusionReason: line.get('Exclusion Reason') as string,
    notesBasis: line.get('Notes / Basis') as string,
  }));

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <EstimateGrid project={projectData} initialLineItems={lineItems} />
    </div>
  );
}
