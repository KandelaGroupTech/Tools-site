import { lineItemsTable } from '@/lib/airtable';
import { NextResponse } from 'next/server';

const EDITABLE_FIELDS = [
  'Final Cost',
  'State',
  'Responsible Party',
  'Exclusion Reason',
  'Notes / Basis',
] as const;

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();

    const updates: Record<string, any> = {};

    for (const key of Object.keys(body)) {
      if (!EDITABLE_FIELDS.includes(key as any)) {
        return NextResponse.json({ error: `Field '${key}' is not editable.` }, { status: 400 });
      }
      updates[key] = body[key];
    }

    // Validation
    if ('State' in updates) {
      const state = updates['State'];
      if (state !== '' && state !== 'PRICED' && state !== 'BY OTHERS' && state !== 'EXCLUDED' && state !== 'N-A' && state !== null) {
        return NextResponse.json({ error: `Invalid State value.` }, { status: 400 });
      }
      if (state === 'BY OTHERS' && (!body['Responsible Party'] || body['Responsible Party'].trim() === '')) {
        return NextResponse.json({ error: `Responsible Party is required when State is BY OTHERS.` }, { status: 400 });
      }
      if (state === 'EXCLUDED' && (!body['Exclusion Reason'] || body['Exclusion Reason'].trim() === '')) {
        return NextResponse.json({ error: `Exclusion Reason is required when State is EXCLUDED.` }, { status: 400 });
      }
    }

    if (Object.keys(updates).length > 0) {
      // In Airtable, passing null or '' clears a field. For Number fields like Final Cost, null clears it.
      await lineItemsTable.update(id, updates);
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message || 'Internal error' }, { status: 500 });
  }
}
