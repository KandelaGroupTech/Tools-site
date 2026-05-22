import { Gamepad2, FileSearch, ShieldCheck, Target, FileText, LineChart, QrCode } from 'lucide-react';

export type ToolStatus = 'live' | 'coming-soon' | 'beta';

export interface ToolDefinition {
    id: string;
    name: string;
    description: string;
    icon: any;
    route: string;
    status: ToolStatus;
    color: string;
}

export const toolsRegistry: ToolDefinition[] = [
    {
        id: 'games',
        name: 'Knowledge Games',
        description: 'Play trivia and knowledge games, compete on the leaderboard.',
        icon: Gamepad2,
        route: '/games',
        status: 'live',
        color: 'bg-emerald-50 text-emerald-600 border-emerald-200'
    },
    {
        id: 'cim-analyzer',
        name: 'CIM Analyzer',
        description: 'AI-powered extraction of key metrics from Confidential Information Memorandums.',
        icon: FileSearch,
        route: '/cim-analyzer',
        status: 'coming-soon',
        color: 'bg-blue-50 text-blue-600 border-blue-200'
    },
    {
        id: 'security-monitor',
        name: 'Security Monitor',
        description: 'Live grid view of Wyze camera feeds across your properties.',
        icon: ShieldCheck,
        route: '/security-monitor',
        status: 'coming-soon',
        color: 'bg-slate-50 text-slate-600 border-slate-200'
    },
    {
        id: 'deal-scorecard',
        name: 'Deal Scorecard',
        description: 'Evaluate acquisition opportunities against our investment criteria.',
        icon: Target,
        route: '/deal-scorecard',
        status: 'coming-soon',
        color: 'bg-indigo-50 text-indigo-600 border-indigo-200'
    },
    {
        id: 'meeting-summarizer',
        name: 'Meeting Summarizer',
        description: 'Clean up transcripts and extract action items with AI.',
        icon: FileText,
        route: '/meeting-summarizer',
        status: 'coming-soon',
        color: 'bg-amber-50 text-amber-600 border-amber-200'
    },
    {
        id: 'market-pulse',
        name: 'Market Pulse',
        description: 'Live dashboard of market conditions and lower middle market M&A trends.',
        icon: LineChart,
        route: '/market-pulse',
        status: 'coming-soon',
        color: 'bg-rose-50 text-rose-600 border-rose-200'
    },
    {
        id: 'qrcode-studio',
        name: 'QR Code Studio',
        description: 'Generate branded QR codes for Kandela Group materials.',
        icon: QrCode,
        route: '/qrcode-studio',
        status: 'coming-soon',
        color: 'bg-teal-50 text-teal-600 border-teal-200'
    }
];
