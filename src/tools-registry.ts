import { Gamepad2, Utensils, Globe, Mic } from 'lucide-react';

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
        id: 'two-birds-menu',
        name: 'Two Birds Menu',
        description: 'Plan daycare meals and easily search for ingredient and allergen information.',
        icon: Utensils,
        route: '/two-birds-menu',
        status: 'live',
        color: 'bg-teal-50 text-teal-600 border-teal-200'
    },
    {
        id: 'website-demo',
        name: 'Website Demos',
        description: 'View live demos of websites currently in development.',
        icon: Globe,
        route: '/website-demo',
        status: 'live',
        color: 'bg-purple-50 text-purple-600 border-purple-200'
    },
    {
        id: 'speech-coach',
        name: 'Speech Coach',
        description: 'Practice public speaking and improve enunciation with real-time feedback.',
        icon: Mic,
        route: '/speech-coach',
        status: 'live',
        color: 'bg-indigo-50 text-indigo-600 border-indigo-200'
    }
];

