import { lineItemsTable, projectsTable } from '@/lib/airtable';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const projectNumber = url.searchParams.get('project');
  
  if (!projectNumber) return NextResponse.json({ error: 'Missing project' }, { status: 400 });

  const projects = await projectsTable.select({ filterByFormula: `{Project Number} = '${projectNumber}'` }).firstPage();
  if (projects.length === 0) return NextResponse.json({ lines: [] });

  const lines = await lineItemsTable.select({ filterByFormula: `AND(SEARCH('${projects[0].id}', ARRAYJOIN({Project})), OR({State} = 'EXCLUDED', {State} = 'BY OTHERS'))`, sort: [{field: 'Cost Code', direction: 'asc'}] }).all();

  const data = lines.map(l => ({
    costCode: l.get('Cost Code'),
    scopeItem: l.get('Scope Item'),
    state: l.get('State'),
    exclusionReason: l.get('Exclusion Reason'),
    responsibleParty: l.get('Responsible Party'),
  }));

  return NextResponse.json({ lines: data });
}
