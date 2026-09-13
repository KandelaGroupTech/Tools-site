import { projectsTable, lineItemsTable } from '@/lib/airtable';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const url = new URL(request.url);
    const action = url.searchParams.get('action'); // 'analyze' or 'commit'
    const { csvData } = await request.json(); 

    if (!csvData || csvData.length === 0) {
      return NextResponse.json({ error: 'Empty CSV' }, { status: 400 });
    }

    const firstRow = csvData[0];
    const projectNumber = firstRow['Project Number'];
    if (!projectNumber) {
      return NextResponse.json({ error: 'Missing Project Number in CSV' }, { status: 400 });
    }

    const costCodeRegex = /^\d{5}-\d{2}$/;
    for (const row of csvData) {
      if (!costCodeRegex.test(row['Cost Code'])) {
        return NextResponse.json({ error: `Invalid Cost Code format: ${row['Cost Code']}` }, { status: 400 });
      }
    }

    // Since we need to know what exists, let's fetch current lines for this project ID if it exists.
    let projectId = '';
    const projects = await projectsTable.select({ filterByFormula: `{Project Number} = '${projectNumber}'` }).all();
    if (projects.length > 0) {
      projectId = projects[0].id;
    }

    const syncKeyMap = new Map();
    if (projectId) {
      // Find lines that belong to this project. Easiest way is to just fetch all and filter in JS if the base is small, 
      // but to be safe, filter by formula.
      const existingLines = await lineItemsTable.select({ filterByFormula: `SEARCH('${projectId}', ARRAYJOIN({Project}))` }).all();
      existingLines.forEach(record => {
        syncKeyMap.set(record.get('Sync Key'), record.id);
      });
    }

    const createBatches = [];
    const updateBatches = [];
    const orphanedRows = [];

    const csvSyncKeys = new Set();
    const now = new Date().toISOString();

    for (const row of csvData) {
      const syncKey = row['Sync Key'];
      csvSyncKeys.add(syncKey);

      const parsedQuantity = parseFloat(row['Quantity']) || 0;
      const parsedBaseRate = parseFloat(row['Base Rate']) || 0;
      const parsedModifier = parseFloat(row['Modifier']) || 1;
      const parsedPrelim = parseFloat(row['Preliminary Cost']) || 0;
      const divSort = parseInt(row['Division Sort']) || 0;

      const recordData = {
        'Sync Key': syncKey,
        'Project': [projectId],
        'Cost Code': row['Cost Code'],
        'Bid Div': row['Bid Div'],
        'Division Name': row['Division Name'],
        'Division Sort': divSort,
        'Scope Item': row['Scope Item'],
        'Unit': row['Unit'] || 'EA',
        'Bluebeam Subject': row['Bluebeam Subject'] || '',
        'Quantity': parsedQuantity,
        'Base Rate': parsedBaseRate,
        'Modifier': parsedModifier,
        'Preliminary Cost': parsedPrelim,
        'Source': row['Source'] || 'JOB',
        'Last Synced': now
      };

      if (syncKeyMap.has(syncKey)) {
        updateBatches.push({ id: syncKeyMap.get(syncKey), fields: recordData });
      } else {
        // Only require project ID if creating, but we need it. If it doesn't exist, it will be created in commit phase.
        createBatches.push({ fields: recordData });
      }
    }

    for (const [key, id] of syncKeyMap.entries()) {
      if (!csvSyncKeys.has(key)) {
        orphanedRows.push(key);
      }
    }

    if (action === 'analyze') {
      return NextResponse.json({
        created: createBatches.length,
        updated: updateBatches.length,
        orphaned: orphanedRows.length,
        rejected: 0,
        success: true
      });
    }

    if (action === 'commit') {
      if (!projectId) {
        const newProject = await projectsTable.create({
          'Project Number': projectNumber,
          'Project Name': `Project ${projectNumber}`, 
          'Status': 'Active',
          'Last Synced': now
        });
        projectId = newProject.id;
        createBatches.forEach(b => b.fields['Project'] = [projectId]);
      } else {
        await projectsTable.update(projectId, { 'Last Synced': now });
      }

      const chunkArray = (arr: any[], size: number) => {
        const chunks = [];
        for (let i = 0; i < arr.length; i += size) {
          chunks.push(arr.slice(i, i + size));
        }
        return chunks;
      };

      for (const chunk of chunkArray(createBatches, 10)) {
        await lineItemsTable.create(chunk);
      }

      for (const chunk of chunkArray(updateBatches, 10)) {
        await lineItemsTable.update(chunk);
      }

      return NextResponse.json({
        created: createBatches.length,
        updated: updateBatches.length,
        success: true
      });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });

  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message || 'Internal error' }, { status: 500 });
  }
}

