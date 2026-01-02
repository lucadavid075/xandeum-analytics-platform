
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Server, Layers, Sparkles, Globe, BookOpen, ExternalLink, Coins, HelpCircle } from 'lucide-react';

interface SidebarProps {
  onAiToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onAiToggle }) => {
  const location = useLocation();

  const getNavClasses = (path: string) => {
    const isActive = location.pathname === path;
    return `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
      isActive 
        ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' 
        : 'text-slate-400 hover:text-white hover:bg-slate-800'
    }`;
  };

  const resourceLinkClasses = "flex items-center justify-between px-4 py-2.5 text-sm text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-all group";

  // Updated LogoIcon to exactly match the favicon provided
  const LogoIcon = () => (
    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <defs>
        <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2dd4bf" />
          <stop offset="100%" stopColor="#0f766e" />
        </linearGradient>
        <linearGradient id="grad2" x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#fbbf24" />
          <stop offset="100%" stopColor="#d97706" />
        </linearGradient>
      </defs>
      <path d="M10 10L30 30" stroke="url(#grad1)" strokeWidth="6" strokeLinecap="round" />
      <path d="M30 10L10 30" stroke="url(#grad2)" strokeWidth="6" strokeLinecap="round" />
    </svg>
  );

  // Custom X (formerly Twitter) Icon SVG
  const XIcon = () => (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="w-4 h-4 fill-current">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
    </svg>
  );

  // Custom Discord Icon SVG
  const DiscordIcon = () => (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="w-5 h-5 fill-current">
      <path d="M18.942 5.556a16.299 16.299 0 0 0-4.026-1.248.06.06 0 0 0-.063.03 11.362 11.362 0 0 0-.502 1.029.06.06 0 0 1-.101 0 15.03 15.03 0 0 0-4.505 0 .06.06 0 0 1-.101 0 11.332 11.332 0 0 0-.505-1.029.06.06 0 0 0-.063-.03 16.27 16.27 0 0 0-4.026 1.248.062.062 0 0 0-.028.023C1.905 10.03.957 14.385 1.357 18.682a.072.072 0 0 0 .027.05 16.39 16.39 0 0 0 4.935 2.493.064.064 0 0 0 .069-.022c.386-.525.727-1.085 1.015-1.674a.062.062 0 0 0-.034-.085 10.706 10.706 0 0 1-1.542-.735.063.063 0 0 1-.006-.105c.105-.078.209-.158.31-.24a.062.062 0 0 1 .066-.008 11.662 11.662 0 0 0 9.6 0 .062.062 0 0 1 .066.008c.101.082.205.162.31.24a.063.063 0 0 1-.006.105 10.584 10.584 0 0 1-1.544.735.062.062 0 0 0-.033.085c.29.589.63 1.149.102 1.674a.063.063 0 0 0 .068.022 16.364 16.364 0 0 0 4.938-2.493.064.064 0 0 0 .027-.05c.465-4.945-.785-9.263-3.614-13.103a.061.061 0 0 0-.028-.023zM8.02 15.331c-.966 0-1.758-.888-1.758-1.977 0-1.09.776-1.977 1.758-1.977.989 0 1.774.896 1.758 1.977 0 1.089-.769 1.977-1.758 1.977zm7.974 0c-.966 0-1.758-.888-1.758-1.977 0-1.09.776-1.977 1.758-1.977.989 0 1.774.896 1.758 1.977 0 1.089-.769 1.977-1.758 1.977z"></path>
    </svg>
  );

  return (
    <div className="w-64 bg-slate-900 border-r border-slate-800 h-screen fixed left-0 top-0 flex flex-col z-20">
      <div className="p-6 border-b border-slate-800 bg-slate-950/20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 flex-shrink-0 drop-shadow-[0_0_12px_rgba(45,212,191,0.2)]">
            <LogoIcon />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-wide">
              Xandeum
            </h1>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold">pNode Explorer</p>
          </div>
        </div>
        
        {/* Era Indicator - Blended with the new Teal/Amber theme */}
        <div className="mt-5 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-teal-500/5 to-amber-500/5 group-hover:from-teal-500/10 group-hover:to-amber-500/10 transition-all rounded-xl"></div>
          <div className="relative px-3.5 py-3 bg-slate-800/30 border border-teal-500/20 rounded-xl flex flex-col gap-1 backdrop-blur-md shadow-lg">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black text-teal-400 uppercase tracking-[0.1em]">Innovation Era</span>
              <div className="flex gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse shadow-[0_0_8px_rgba(251,191,36,0.8)]"></div>
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-black text-white tracking-tight flex items-center gap-1.5">
                <span className="bg-gradient-to-r from-teal-300 via-white to-amber-300 bg-clip-text text-transparent">Main Era</span>
              </span>
              <span className="text-[9px] text-slate-400 font-medium leading-none mt-1.5 italic">Real-world sedApps</span>
            </div>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1.5">
        <div className="mb-2 px-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Navigation</div>
        <Link to="/" className={getNavClasses("/")}>
          <LayoutDashboard size={18} />
          <span className="text-sm font-medium">Dashboard</span>
        </Link>
        <Link to="/ip-nodes" className={getNavClasses("/ip-nodes")}>
          <Server size={18} />
          <span className="text-sm font-medium">IP Nodes</span>
        </Link>
        <Link to="/pnodes" className={getNavClasses("/pnodes")}>
          <Layers size={18} />
          <span className="text-sm font-medium">pNodes</span>
        </Link>
        <Link to="/faq" className={getNavClasses("/faq")}>
          <HelpCircle size={18} />
          <span className="text-sm font-medium">FAQ</span>
        </Link>

        <div className="pt-6 pb-2 px-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Resources</div>
        <div className="space-y-1">
          <a 
            href="https://www.xandeum.network/" 
            target="_blank" 
            rel="noopener noreferrer" 
            className={resourceLinkClasses}
          >
            <div className="flex items-center gap-3">
              <Globe size={18} className="text-slate-500 group-hover:text-teal-400 transition-colors" />
              <span className="text-sm">Official Website</span>
            </div>
            <ExternalLink size={12} className="opacity-0 group-hover:opacity-50" />
          </a>
          <a 
            href="https://www.xandeum.network/docs?_gl=1*13magzj*_gcl_au*MTYyNjk0MTQzOC4xNzY0Njc4NzMz" 
            target="_blank" 
            rel="noopener noreferrer" 
            className={resourceLinkClasses}
          >
            <div className="flex items-center gap-3">
              <BookOpen size={18} className="text-slate-500 group-hover:text-amber-400 transition-colors" />
              <span className="text-sm">Documentation</span>
            </div>
            <ExternalLink size={12} className="opacity-0 group-hover:opacity-50" />
          </a>
          <a 
            href="https://stakexand.xandeum.network/?_gl=1*qwtfwk*_gcl_au*MTYyNjk0MTQzOC4xNzY0Njc4NzMz" 
            target="_blank" 
            rel="noopener noreferrer" 
            className={resourceLinkClasses}
          >
            <div className="flex items-center gap-3">
              <Coins size={18} className="text-slate-500 group-hover:text-yellow-400 transition-colors" />
              <span className="text-sm">XAND Staking Portal</span>
            </div>
            <ExternalLink size={12} className="opacity-0 group-hover:opacity-50" />
          </a>
        </div>
        
        <div className="pt-6 mt-4 border-t border-slate-800">
          <button 
            onClick={onAiToggle}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-gradient-to-r from-teal-600/20 to-amber-500/20 text-teal-300 border border-teal-500/20 hover:from-teal-600/30 hover:to-amber-500/30 hover:text-white transition-all group shadow-lg shadow-teal-900/10"
          >
            <Sparkles size={18} className="text-teal-400 group-hover:scale-110 transition-transform" />
            <span className="font-bold text-sm">AI Assistant</span>
          </button>
        </div>
      </nav>

      <div className="p-4 border-t border-slate-800 bg-slate-900/50">
        <div className="flex items-center justify-center gap-1.5 mb-4">
          <a 
            href="https://x.com/Xandeum" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="flex items-center gap-2 text-slate-400 hover:text-white transition-all group px-2.5 py-2 rounded-lg hover:bg-white/5 active:scale-95"
            title="Follow Xandeum on X"
          >
            <XIcon />
            <span className="text-[11px] font-bold tracking-tight">X</span>
          </a>
          
          <div className="w-px h-4 bg-slate-800 self-center mx-1 opacity-50"></div>

          <a 
            href="https://discord.gg/uqRSmmM5m" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="flex items-center gap-2 text-slate-400 hover:text-[#5865F2] transition-all group px-2.5 py-2 rounded-lg hover:bg-[#5865F2]/10 active:scale-95"
            title="Join Xandeum Discord"
          >
            <DiscordIcon />
            <span className="text-[11px] font-bold tracking-tight">Discord</span>
          </a>
        </div>
        
        <div className="bg-slate-800/80 rounded-xl p-3 border border-slate-700/50 shadow-inner">
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
             <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
             Operational
          </div>
          <div className="flex justify-between items-center mt-2 border-t border-slate-700/50 pt-2">
            <span className="text-[9px] text-slate-600 font-mono tracking-tighter uppercase">XandMinerD Ready</span>
            <span className="text-[9px] text-slate-600 font-mono">v1.2.0</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
