import { useUser, useAuth, SignIn } from '@clerk/clerk-react';
import { UserButton } from '@clerk/clerk-react';
import { Calculator, Users, Layers, ExternalLink, ArrowRight, ShieldAlert } from 'lucide-react';
import InteractiveBg from '../components/InteractiveBg';

const REQUIRED_ORG_ID = 'org_3Jbdb08bbG3dgwTJmsmS6uaKh2b';

const jobTools = [
  {
    id: 'excellentestimator',
    name: 'JOB TI Estimating Tool',
    description: 'An AI-powered tool for mapping plain-English scope to the JOB cost catalog, calculating budgets, and managing add alternates.',
    url: '/website-demos/excellentestimator/',
    status: 'LIVE',
    icon: Calculator,
    iconColor: 'text-oxblood-red',
    iconBg: 'bg-red-50',
    primary: true
  },
  {
    id: 'excellentzohocrm',
    name: 'Excellent CRM',
    description: 'The team CRM application integrated with Zoho for client pipeline tracking, contact records, and active deals.',
    url: '/website-demos/excellentzohocrm',
    status: 'LIVE',
    icon: Users,
    iconColor: 'text-blue-600',
    iconBg: 'bg-blue-50',
    primary: true
  },
  {
    id: 'job-materials-library',
    name: 'JOB Materials Library',
    description: 'A catalog of materials JOB uses in commercial building to serve as reference for internal pricing and client selections.',
    url: 'https://materialslibrary.vercel.app',
    status: 'IN DEVELOPMENT',
    icon: Layers,
    iconColor: 'text-amber-600',
    iconBg: 'bg-amber-50',
    primary: false
  }
];

export default function JobPortal() {
  const { isLoaded, isSignedIn, user } = useUser();
  const { signOut } = useAuth();

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-white relative flex flex-col items-center justify-center p-4">
        <InteractiveBg />
        <div className="relative z-10 flex flex-col items-center">
          <img src="/website-demos/excellentestimator/JOB-logo.png" alt="JOB Logo" className="w-36 mb-4 animate-pulse" />
          <div className="text-slate-500 font-sans text-sm">Loading JOB Portal...</div>
        </div>
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <div className="min-h-screen bg-white relative flex flex-col items-center justify-center p-4">
        <InteractiveBg />
        <div className="relative z-10 flex flex-col items-center">
          <div className="mb-6 flex flex-col items-center text-center max-w-sm">
            <img src="/website-demos/excellentestimator/JOB-logo.png" alt="JOB Logo" className="w-40 mb-3" />
            <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">JOB Internal Tools Portal</h1>
            <p className="text-slate-500 text-sm mt-1">Sign in with your Journey Office Builders credentials</p>
          </div>
          <SignIn routing="hash" />
        </div>
      </div>
    );
  }

  // Check organization memberships
  const memberships = user.organizationMemberships || [];
  const isMember = memberships.some(m => m.organization?.id === REQUIRED_ORG_ID);

  if (!isMember) {
    return (
      <div className="min-h-screen bg-white relative flex flex-col items-center justify-center p-4">
        <InteractiveBg />
        <div className="relative z-10 bg-white/95 backdrop-blur-md p-8 rounded-2xl shadow-sm border border-red-200 max-w-md w-full text-center">
          <ShieldAlert className="w-12 h-12 text-red-600 mx-auto mb-3" />
          <h2 className="text-xl font-semibold text-slate-900 mb-2">Access Restricted</h2>
          <p className="text-slate-600 text-sm mb-6 leading-relaxed">
            Your account (<span className="font-medium text-slate-800">{user.primaryEmailAddress?.emailAddress}</span>) is not a member of the <span className="font-semibold text-slate-900">Journey Office Builders LLC</span> organization.
          </p>
          <button
            onClick={() => signOut()}
            className="w-full bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium py-2.5 px-4 rounded-xl transition-colors shadow-sm"
          >
            Sign Out & Switch Account
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white relative flex flex-col font-sans">
      <InteractiveBg />

      {/* Top Header */}
      <header className="bg-white/85 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="h-9 w-9 bg-white border border-slate-100 rounded-lg flex items-center justify-center shadow-xs p-1">
              <img src="/website-demos/excellentestimator/JOB-logo.png" alt="JOB Logo" className="max-h-full max-w-full" />
            </div>
            <div>
              <div className="text-sm font-bold tracking-tight text-slate-900 leading-none">JOURNEY OFFICE BUILDERS</div>
              <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider mt-0.5">Internal Tools Portal</div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <span className="hidden sm:inline text-xs font-medium text-slate-600">
              {user.primaryEmailAddress?.emailAddress}
            </span>
            <UserButton />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 flex-1 w-full">
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Internal tools, built for speed.
          </h1>
          <p className="mt-3 text-base sm:text-lg text-slate-600 leading-relaxed">
            A centralized platform for our proprietary utilities, calculators, and workflows.
          </p>
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobTools.map((tool) => {
            const IconComponent = tool.icon;
            const isLive = tool.status === 'LIVE';

            return (
              <a
                key={tool.id} 
                href={tool.url}
                className="bg-gradient-to-br from-[#9b1536] via-[#850f2c] to-[#6e0a23] rounded-2xl shadow-lg shadow-red-950/15 border border-red-900/30 p-6 flex flex-col justify-between hover:shadow-2xl hover:shadow-red-950/30 hover:-translate-y-1 transition-all duration-300 group text-left cursor-pointer"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-11 h-11 rounded-xl bg-white/15 border border-white/20 flex items-center justify-center backdrop-blur-xs text-white group-hover:bg-white/25 transition-colors">
                      <IconComponent className="w-5 h-5 text-white" />
                    </div>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wide border backdrop-blur-xs ${
                      isLive 
                        ? 'bg-emerald-500/20 text-emerald-200 border-emerald-400/30' 
                        : 'bg-amber-500/20 text-amber-200 border-amber-400/30'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${isLive ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`}></span>
                      {tool.status}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-white group-hover:text-red-100 transition-colors tracking-tight">
                    {tool.name}
                  </h3>
                  <p className="mt-2.5 text-sm text-white/85 leading-relaxed font-normal">
                    {tool.description}
                  </p>
                </div>

                <div className="pt-6 mt-5 border-t border-white/15 flex items-center justify-between text-white">
                  <span className="inline-flex items-center text-sm font-semibold text-white group-hover:text-red-100 transition-colors">
                    Open Tool <ArrowRight className="w-4 h-4 ml-1.5 transition-transform group-hover:translate-x-1.5" />
                  </span>
                  {tool.url.startsWith('http') && (
                    <ExternalLink className="w-3.5 h-3.5 text-white/70" />
                  )}
                </div>
              </a>
            );
          })}
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-200/80 bg-white/80 backdrop-blur-sm py-6">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-xs text-slate-400">
          © {new Date().getFullYear()} Journey Office Builders LLC. Confidential & Internal Use Only.
        </div>
      </footer>
    </div>
  );
}
