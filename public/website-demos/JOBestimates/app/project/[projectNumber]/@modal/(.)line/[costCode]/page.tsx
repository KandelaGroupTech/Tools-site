import { lineItemsTable, rateLibraryTable } from '@/lib/airtable';
import { notFound } from 'next/navigation';
import SlideOver from './SlideOver';

export const revalidate = 0;

export default async function LineItemIntercept({ params }: { params: Promise<{ projectNumber: string, costCode: string }> }) {
  const { projectNumber, costCode } = await params;
  
  const lines = await lineItemsTable.select({ filterByFormula: `AND(SEARCH('${projectNumber}', ARRAYJOIN({Project})), {Cost Code} = '${costCode}')` }).firstPage();
  if (lines.length === 0) {
    notFound();
  }
  const line = lines[0];

  const rates = await rateLibraryTable.select({ filterByFormula: `{Cost Code} = '${costCode}'` }).firstPage();
  const rate = rates.length > 0 ? rates[0] : null;

  const lineData = {
    id: line.id,
    costCode: line.get('Cost Code') as string,
    scopeItem: line.get('Scope Item') as string,
    quantity: line.get('Quantity') as number,
    unit: line.get('Unit') as string,
    baseRate: line.get('Base Rate') as number,
    modifier: line.get('Modifier') as number,
    preliminaryCost: line.get('Preliminary Cost') as number,
    finalCost: line.get('Final Cost') as number,
    state: (line.get('State') as string) || '',
    responsibleParty: line.get('Responsible Party') as string,
    exclusionReason: line.get('Exclusion Reason') as string,
    notesBasis: line.get('Notes / Basis') as string,
  };

  const rateData = rate ? {
    assemblyNote: rate.get('Assembly Note') as string,
    source: rate.get('Source') as string,
  } : null;

  return <SlideOver line={lineData} rate={rateData} />;
}
