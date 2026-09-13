import * as fs from 'fs';

const AIRTABLE_PAT = process.env.AIRTABLE_PAT;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;

if (!AIRTABLE_PAT || !AIRTABLE_BASE_ID) {
  console.error("Missing AIRTABLE_PAT or AIRTABLE_BASE_ID environment variables.");
  process.exit(1);
}

const META_API_URL = `https://api.airtable.com/v0/meta/bases/${AIRTABLE_BASE_ID}/tables`;

const headers = {
  'Authorization': `Bearer ${AIRTABLE_PAT}`,
  'Content-Type': 'application/json',
};

async function createTable(name: string, description: string, fields: any[]) {
  console.log(`Creating table: ${name}...`);
  const response = await fetch(META_API_URL, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      name,
      description,
      fields,
    }),
  });

  if (!response.ok) {
    const err = await response.json();
    console.error(`Failed to create table ${name}:`, JSON.stringify(err, null, 2));
    throw new Error(`Failed to create table ${name}`);
  }

  const data = await response.json();
  console.log(`Successfully created table: ${name} (ID: ${data.id})`);
  return data;
}

async function addField(tableId: string, field: any) {
  console.log(`Adding field ${field.name} to table ${tableId}...`);
  const response = await fetch(`${META_API_URL}/${tableId}/fields`, {
    method: 'POST',
    headers,
    body: JSON.stringify(field),
  });

  if (!response.ok) {
    const err = await response.json();
    console.error(`Failed to add field ${field.name}:`, JSON.stringify(err, null, 2));
    throw new Error(`Failed to add field ${field.name}`);
  }

  const data = await response.json();
  console.log(`Successfully added field: ${field.name}`);
  return data;
}

async function run() {
  try {
    const getTables = await fetch(META_API_URL, { headers });
    const tablesData = await getTables.json();
    const existingTables = tablesData.tables || [];

    let lineItemsTable = existingTables.find((t: any) => t.name === 'Line_Items');

    let subQuotesTable = existingTables.find((t: any) => t.name === 'Sub_Quotes');
    if (!subQuotesTable && lineItemsTable) {
      subQuotesTable = await createTable('Sub_Quotes', 'Subcontractor quotes attached to line items', [
        { name: 'Quote ID', type: 'singleLineText' },
        { name: 'Line Item', type: 'multipleRecordLinks', options: { linkedTableId: lineItemsTable.id } },
        { name: 'Subcontractor', type: 'singleLineText' },
        { name: 'Trade', type: 'singleSelect', options: { choices: [{name: 'Self'}, {name: 'Sub'}, {name: 'VOR'}, {name: 'Others'}, {name: 'LL'}] } },
        { name: 'Amount', type: 'currency', options: { precision: 2, symbol: '$' } },
        { name: 'Date Received', type: 'date', options: { dateFormat: { name: 'local' } } },
        { name: 'Is Selected', type: 'checkbox', options: { color: 'greenBright', icon: 'check' } },
        { name: 'Scope Included', type: 'multilineText' },
        { name: 'Scope Excluded', type: 'multilineText' },
        { name: 'PDF', type: 'multipleAttachments' },
        { name: 'Uploaded By', type: 'singleLineText' },
      ]);
    }

    let commentsTable = existingTables.find((t: any) => t.name === 'Comments');
    if (!commentsTable && lineItemsTable) {
      commentsTable = await createTable('Comments', 'Comments on line items', [
        { name: 'Comment ID', type: 'singleLineText' },
        { name: 'Line Item', type: 'multipleRecordLinks', options: { linkedTableId: lineItemsTable.id } },
        { name: 'Author', type: 'singleLineText' },
        { name: 'Body', type: 'multilineText' },
        { name: 'Created', type: 'dateTime', options: { dateFormat: { name: 'local' }, timeFormat: { name: '12hour' }, timeZone: 'client' } },
        { name: 'Resolved', type: 'checkbox', options: { color: 'greenBright', icon: 'check' } },
      ]);
    }

    let rateLibraryTable = existingTables.find((t: any) => t.name === 'Rate_Library');
    if (!rateLibraryTable) {
      rateLibraryTable = await createTable('Rate_Library', 'Reference rates', [
        { name: 'Cost Code', type: 'singleLineText' },
        { name: 'Unit', type: 'singleSelect', options: { choices: [{name: 'EA'}, {name: 'LF'}, {name: 'SF'}, {name: 'SY'}, {name: 'CY'}, {name: 'HRS'}, {name: 'LS'}, {name: 'ALLOW'}] } },
        { name: 'Rate — Small', type: 'currency', options: { precision: 2, symbol: '$' } },
        { name: 'Rate — Mid', type: 'currency', options: { precision: 2, symbol: '$' } },
        { name: 'Rate — Big', type: 'currency', options: { precision: 2, symbol: '$' } },
        { name: 'Effective Date', type: 'date', options: { dateFormat: { name: 'local' } } },
        { name: 'Source', type: 'singleLineText' },
        { name: 'Assembly Note', type: 'multilineText' },
      ]);
    }

    console.log("Done creating base schema.");
  } catch (err) {
    console.error(err);
  }
}

run();
