import Airtable from 'airtable';

if (!process.env.AIRTABLE_PAT || !process.env.AIRTABLE_BASE_ID) {
  throw new Error('AIRTABLE_PAT and AIRTABLE_BASE_ID must be set');
}

const base = new Airtable({ apiKey: process.env.AIRTABLE_PAT }).base(process.env.AIRTABLE_BASE_ID);

export const projectsTable = base('Projects');
export const lineItemsTable = base('Line_Items');
export const subQuotesTable = base('Sub_Quotes');
export const commentsTable = base('Comments');
export const rateLibraryTable = base('Rate_Library');

export default base;
