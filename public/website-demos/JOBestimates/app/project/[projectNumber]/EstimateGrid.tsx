'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { ChevronDown, ChevronRight, AlertTriangle, Paperclip, MessageSquare } from 'lucide-react';

interface Project {
  id: string;
  projectNumber: string;
  projectName: string;
  jurisdiction: string;
  jobSize: string;
  usf: number;
  rsf: number;
}

interface LineItem {
  id: string;
  costCode: string;
  bidDiv: string;
  divisionName: string;
  divisionSort: number;
  scopeItem: string;
  unit: string;
  quantity: number;
  baseRate: number;
  modifier: number;
  preliminaryCost: number;
  prelimCheck: number;
  prelimMismatch: string;
  finalCost: number;
  variance: number;
  state: string;
  responsibleParty: string;
  exclusionReason: string;
  notesBasis: string;
  subQuoteCount?: number;
  unresolvedCommentCount?: number;
}

export default function EstimateGrid({ project, initialLineItems }: { project: Project; initialLineItems: LineItem[] }) {
  const [lineItems, setLineItems] = useState(initialLineItems);
  const [collapsedDivisions, setCollapsedDivisions] = useState<Record<string, boolean>>({});
  const [filterState, setFilterState] = useState<string>('ALL');
  const [search, setSearch] = useState('');
  
  // State for inline edit modal/popover (for missing Responsible Party / Exclusion Reason)
  const [editingLine, setEditingLine] = useState<LineItem | null>(null);
  const [tempState, setTempState] = useState('');
  const [tempReason, setTempReason] = useState('');

  const toggleDivision = (div: string) => {
    setCollapsedDivisions(prev => ({ ...prev, [div]: !prev[div] }));
  };

  const handleUpdate = async (id: string, updates: Partial<LineItem>) => {
    // Optimistic update
    setLineItems(prev => prev.map(l => l.id === id ? { ...l, ...updates, variance: (updates.finalCost !== undefined ? updates.finalCost : l.finalCost) - l.preliminaryCost } : l));
    
    try {
      const payload: Record<string, any> = {};
      if (updates.finalCost !== undefined) payload['Final Cost'] = updates.finalCost;
      if (updates.state !== undefined) payload['State'] = updates.state;
      if (updates.responsibleParty !== undefined) payload['Responsible Party'] = updates.responsibleParty;
      if (updates.exclusionReason !== undefined) payload['Exclusion Reason'] = updates.exclusionReason;

      await fetch(`/api/line-items/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    } catch (e) {
      console.error(e);
      // Revert if needed (omitted for brevity)
    }
  };

  const handleStateChange = (line: LineItem, newState: string) => {
    if (newState === 'BY OTHERS' || newState === 'EXCLUDED') {
      setTempState(newState);
      setTempReason(newState === 'BY OTHERS' ? line.responsibleParty || '' : line.exclusionReason || '');
      setEditingLine(line);
    } else {
      handleUpdate(line.id, { state: newState, responsibleParty: '', exclusionReason: '' });
    }
  };

  const saveComplexState = () => {
    if (!editingLine) return;
    if (tempState === 'BY OTHERS') {
      if (!tempReason.trim()) {
        alert("Responsible Party is required");
        return;
      }
      handleUpdate(editingLine.id, { state: tempState, responsibleParty: tempReason, exclusionReason: '' });
    } else if (tempState === 'EXCLUDED') {
      if (!tempReason.trim()) {
        alert("Exclusion Reason is required");
        return;
      }
      handleUpdate(editingLine.id, { state: tempState, exclusionReason: tempReason, responsibleParty: '' });
    }
    setEditingLine(null);
  };

  const fmtCurrency = (val: number | undefined | null) => {
    if (val === undefined || val === null || isNaN(val)) return '—';
    if (val === 0) return '—';
    const numStr = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);
    if (val < 0) return `(${numStr.replace('-', '')})`;
    return numStr;
  };

  const fmtNum = (val: number | undefined | null, decimals: number = 2) => {
    if (val === undefined || val === null || isNaN(val)) return '—';
    return new Intl.NumberFormat('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals }).format(val);
  };

  const filteredItems = useMemo(() => {
    return lineItems.filter(l => {
      let matchesState = true;
      if (filterState === 'BLANK') matchesState = !l.state;
      else if (filterState !== 'ALL') matchesState = l.state === filterState;

      let matchesSearch = true;
      if (search) {
        const term = search.toLowerCase();
        matchesSearch = l.costCode.toLowerCase().includes(term) || l.scopeItem.toLowerCase().includes(term);
      }
      return matchesState && matchesSearch;
    });
  }, [lineItems, filterState, search]);

  const divisions = useMemo(() => {
    const divs = new Map<string, { name: string; items: LineItem[]; prelimTotal: number; finalTotal: number }>();
    filteredItems.forEach(l => {
      const key = `${l.divisionSort}-${l.bidDiv}`;
      if (!divs.has(key)) {
        divs.set(key, { name: l.divisionName, items: [], prelimTotal: 0, finalTotal: 0 });
      }
      const d = divs.get(key)!;
      d.items.push(l);
      d.prelimTotal += l.preliminaryCost || 0;
      d.finalTotal += l.finalCost || 0;
    });
    return Array.from(divs.entries()).sort((a, b) => a[0].localeCompare(b[0]));
  }, [filteredItems]);

  const totalPrelim = lineItems.reduce((acc, l) => acc + (l.preliminaryCost || 0), 0);
  const totalFinal = lineItems.reduce((acc, l) => acc + (l.finalCost || 0), 0);
  const totalVariance = totalFinal - totalPrelim;
  const blankStateCount = lineItems.filter(l => !l.state).length;

  return (
    <>
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-[1600px] mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-gray-500 hover:text-gray-900">&larr;</Link>
              <h1 className="text-xl font-bold text-gray-900">{project.projectNumber} {project.projectName}</h1>
            </div>
            <div className="text-sm text-gray-500 mt-1 ml-8">
              {project.jurisdiction} • {project.jobSize} • {project.usf?.toLocaleString()} USF • {project.rsf?.toLocaleString()} RSF
            </div>
            <div className="mt-2 ml-8 flex space-x-4">
               <Link href={`/project/${project.projectNumber}/audit`} className="text-sm text-blue-600 hover:underline">Audit Report</Link>
               <Link href={`/project/${project.projectNumber}/exclusions`} className="text-sm text-blue-600 hover:underline">Exclusions</Link>
            </div>
          </div>
          
          <button 
            onClick={() => setFilterState(filterState === 'BLANK' ? 'ALL' : 'BLANK')}
            className={`text-2xl font-bold cursor-pointer hover:opacity-80 px-4 py-2 rounded-lg transition-colors ${
              blankStateCount > 0 ? 'text-red-600 bg-red-50' : 'text-green-600 bg-green-50'
            }`}
          >
            {blankStateCount > 0 ? `${blankStateCount} LINES UNRESOLVED` : 'ALL LINES RESOLVED'}
          </button>
          
          <div className="text-right text-sm">
            <div className="grid grid-cols-2 gap-x-4">
              <div className="text-gray-500">Preliminary:</div>
              <div className="font-medium text-gray-900 tabular-nums">{fmtCurrency(totalPrelim)}</div>
              <div className="text-gray-500">Final Cost:</div>
              <div className="font-bold text-gray-900 tabular-nums">{fmtCurrency(totalFinal)}</div>
              <div className="text-gray-500">Variance:</div>
              <div className={`font-medium tabular-nums ${totalVariance < 0 ? 'text-red-600' : 'text-gray-900'}`}>{fmtCurrency(totalVariance)}</div>
              <div className="text-gray-500">$/USF:</div>
              <div className="font-medium text-gray-900 tabular-nums">{fmtCurrency(totalFinal / (project.usf || 1))}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <select 
            value={filterState} 
            onChange={e => setFilterState(e.target.value)}
            className="text-sm border-gray-300 rounded-md py-1 pl-2 pr-8"
          >
            <option value="ALL">All States</option>
            <option value="BLANK">Blank Only</option>
            <option value="PRICED">Priced</option>
            <option value="BY OTHERS">By Others</option>
            <option value="EXCLUDED">Excluded</option>
            <option value="N-A">N/A</option>
          </select>
          <input 
            type="text" 
            placeholder="Search code or scope..." 
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="text-sm border-gray-300 rounded-md py-1 px-3 w-64"
          />
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-4 pb-12 overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 tabular-nums text-sm">
          <thead className="bg-gray-50 sticky top-[104px] z-0 shadow-sm border-b border-gray-200">
            <tr>
              <th className="px-2 py-2 text-left font-medium text-gray-500 uppercase w-24">Cost Code</th>
              <th className="px-2 py-2 text-left font-medium text-gray-500 uppercase">Scope Item</th>
              <th className="px-2 py-2 text-right font-medium text-gray-500 uppercase w-28">Quantity</th>
              <th className="px-2 py-2 text-right font-medium text-gray-500 uppercase w-24">Base Rate</th>
              <th className="px-2 py-2 text-right font-medium text-gray-500 uppercase w-16">Mod</th>
              <th className="px-2 py-2 text-right font-medium text-gray-500 uppercase w-28">Preliminary</th>
              <th className="px-2 py-2 text-center font-medium text-gray-500 uppercase w-12">Sub</th>
              <th className="px-2 py-2 text-right font-medium text-gray-900 uppercase w-32 bg-gray-100">Final</th>
              <th className="px-2 py-2 text-right font-medium text-gray-500 uppercase w-24">Variance</th>
              <th className="px-2 py-2 text-left font-medium text-gray-900 uppercase w-32 bg-gray-100">State</th>
              <th className="px-2 py-2 text-center font-medium text-gray-500 w-12"><Paperclip className="h-4 w-4 inline" /></th>
              <th className="px-2 py-2 text-center font-medium text-gray-500 w-12"><MessageSquare className="h-4 w-4 inline" /></th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {divisions.map(([key, div]) => {
              const isCollapsed = collapsedDivisions[key];
              const bidDiv = key.split('-')[1];
              return (
                <React.Fragment key={key}>
                  <tr className="bg-gray-100/80 border-t-2 border-gray-300 font-semibold cursor-pointer hover:bg-gray-200/80" onClick={() => toggleDivision(key)}>
                    <td colSpan={5} className="px-2 py-2 text-gray-900">
                      <div className="flex items-center">
                        {isCollapsed ? <ChevronRight className="h-4 w-4 mr-1" /> : <ChevronDown className="h-4 w-4 mr-1" />}
                        {bidDiv} {div.name}
                      </div>
                    </td>
                    <td className="px-2 py-2 text-right text-gray-700">{fmtCurrency(div.prelimTotal)}</td>
                    <td></td>
                    <td className="px-2 py-2 text-right text-gray-900 bg-gray-200/50">{fmtCurrency(div.finalTotal)}</td>
                    <td colSpan={4}></td>
                  </tr>
                  {!isCollapsed && div.items.map(line => {
                    const isBlank = !line.state;
                    const isMismatch = !!line.prelimMismatch;
                    return (
                      <tr key={line.id} className={`hover:bg-gray-50 group ${isBlank ? 'bg-red-50/50 border-l-4 border-l-red-500' : 'border-l-4 border-l-transparent'}`}>
                        <td className="px-2 py-1.5 font-mono text-gray-500 relative">
                          <Link href={`/project/${project.projectNumber}/line/${line.costCode}`} className="hover:text-blue-600 hover:underline">
                            {line.costCode}
                          </Link>
                          {isMismatch && (
                            <div className="absolute -left-1 top-1.5" title="Mismatch with Excel logic">
                              <AlertTriangle className="h-4 w-4 text-amber-500" />
                            </div>
                          )}
                        </td>
                        <td className="px-2 py-1.5 text-gray-900 truncate max-w-xs" title={line.scopeItem}>{line.scopeItem}</td>
                        <td className="px-2 py-1.5 text-right whitespace-nowrap">
                          <span className="text-gray-900">{fmtNum(line.quantity)}</span>
                          <span className="text-gray-400 ml-1 text-xs">{line.unit}</span>
                        </td>
                        <td className="px-2 py-1.5 text-right text-gray-500">{fmtCurrency(line.baseRate)}</td>
                        <td className="px-2 py-1.5 text-right text-gray-500">{fmtNum(line.modifier, 3)}</td>
                        <td className="px-2 py-1.5 text-right text-gray-500">{fmtCurrency(line.preliminaryCost)}</td>
                        <td className="px-2 py-1.5 text-center text-gray-500">
                          {/* Sub Quote Total placeholder - would be calculated if quotes were loaded */}
                          —
                        </td>
                        <td className="px-2 py-1.5 text-right bg-gray-50/50">
                          <input 
                            type="number" 
                            className="w-full text-right border-0 bg-transparent focus:ring-1 focus:ring-blue-500 rounded px-1"
                            value={line.finalCost === null ? '' : line.finalCost}
                            onChange={(e) => {
                              const val = e.target.value === '' ? null : parseFloat(e.target.value);
                              handleUpdate(line.id, { finalCost: val as number });
                            }}
                          />
                        </td>
                        <td className={`px-2 py-1.5 text-right ${line.variance < 0 ? 'text-red-600' : 'text-gray-500'}`}>
                          {fmtCurrency(line.variance)}
                        </td>
                        <td className="px-2 py-1.5 bg-gray-50/50">
                          <select 
                            className={`w-full text-sm border-0 bg-transparent focus:ring-1 focus:ring-blue-500 rounded py-0 pl-1 pr-6 ${!line.state ? 'text-red-600 font-bold' : 'text-gray-900'}`}
                            value={line.state || ''}
                            onChange={(e) => handleStateChange(line, e.target.value)}
                          >
                            <option value=""></option>
                            <option value="PRICED">PRICED</option>
                            <option value="BY OTHERS">BY OTHERS</option>
                            <option value="EXCLUDED">EXCLUDED</option>
                            <option value="N-A">N-A</option>
                          </select>
                        </td>
                        <td className="px-2 py-1.5 text-center text-gray-400">{line.subQuoteCount || ''}</td>
                        <td className="px-2 py-1.5 text-center text-gray-400">{line.unresolvedCommentCount || ''}</td>
                      </tr>
                    );
                  })}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

      {editingLine && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full border border-gray-200">
            <h3 className="text-lg font-bold mb-4">{tempState === 'BY OTHERS' ? 'Responsible Party Required' : 'Exclusion Reason Required'}</h3>
            <p className="text-sm text-gray-600 mb-4 font-mono">{editingLine.costCode} — {editingLine.scopeItem}</p>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {tempState === 'BY OTHERS' ? 'Who is responsible?' : 'Why is this excluded?'}
              </label>
              {tempState === 'BY OTHERS' ? (
                <input 
                  type="text"
                  autoFocus
                  className="w-full border-gray-300 rounded shadow-sm sm:text-sm"
                  value={tempReason}
                  onChange={e => setTempReason(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') saveComplexState(); }}
                />
              ) : (
                <textarea 
                  autoFocus
                  className="w-full border-gray-300 rounded shadow-sm sm:text-sm"
                  rows={3}
                  value={tempReason}
                  onChange={e => setTempReason(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter' && e.ctrlKey) saveComplexState(); }}
                />
              )}
            </div>
            <div className="flex justify-end space-x-3">
              <button 
                onClick={() => setEditingLine(null)} 
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50"
              >
                Cancel
              </button>
              <button 
                onClick={saveComplexState}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
