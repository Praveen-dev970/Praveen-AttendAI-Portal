import React, { useState, useEffect } from 'react';
import { Search, RefreshCw, CloudLightning, Menu, Sun, Moon, Clock, Calendar } from 'lucide-react';

interface HeaderProps {
  student: any;
  onSyncTriggered: (log: any) => void;
  syncing: boolean;
  onMenuClick?: () => void;
  theme?: 'light' | 'dark';
  onToggleTheme?: () => void;
  onSearchClick?: () => void;
}

export default function Header({ student, onSyncTriggered, syncing, onMenuClick, theme, onToggleTheme, onSearchClick }: HeaderProps) {
  const [currentTime, setCurrentTime] = useState(new Date());

  // Active clock tick effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const handleSyncClick = (service: string) => {
    void onSyncTriggered({ service });
  };

  const formattedTime = currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
  const formattedDate = currentTime.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
  const displayName = student.name?.split(" ").slice(-1)[0] || student.name;

  return (
    <header className="flex flex-col lg:flex-row lg:items-center justify-between pb-6 select-none gap-4 border-b border-slate-100 dark:border-slate-800/60 mb-6">
      {/* Left section: Drawer toggle & Breadcrumbs greeting */}
      <div className="flex items-center gap-3">
        {onMenuClick && (
          <button 
            onClick={onMenuClick}
            className="p-2 md:hidden bg-white dark:bg-[#0c1221] border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 cursor-pointer shadow-sm active:scale-95 transition-all"
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}
        
        <div>
          <div className="flex items-center gap-1.5 text-[10px] md:text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">
            <span>Portal</span>
            <span className="text-slate-300 dark:text-slate-700">/</span>
            <span className="text-slate-500 dark:text-slate-400">Attendance Center</span>
          </div>
          <h2 className="text-lg md:text-2xl font-display font-bold text-slate-900 dark:text-white mt-1 leading-tight flex items-center gap-2">
            <span>{getGreeting()}, {displayName.split(' ')[0] || 'Student'}</span>
            <span className="text-xl md:text-2xl animate-pulse">👋</span>
          </h2>
        </div>
      </div>

      {/* Right control widgets dashboard panel */}
      <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto justify-between lg:justify-end">
        
        {/* Real-time Ticking Clock & Calendar Widget */}
        <div className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-[#0d1527]/50 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl shadow-sm text-xs text-slate-600 dark:text-slate-400 font-medium">
          <div className="flex items-center gap-1 border-r border-slate-200 dark:border-slate-800 pr-2.5">
            <Clock className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400" />
            <span className="font-mono font-bold tabular-nums text-slate-800 dark:text-slate-200">{formattedTime}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400" />
            <span className="text-[11px] font-display text-slate-500 dark:text-slate-400">{formattedDate}</span>
          </div>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Quick Search trigger which opens palette */}
          <button
            type="button"
            onClick={onSearchClick}
            aria-label="Search commands"
            className="relative hidden w-44 cursor-pointer text-left sm:block lg:w-56 group"
          >
            <div className="w-full pl-9 pr-12 py-2 bg-white dark:bg-[#0c1221]/50 border border-slate-200 dark:border-slate-800/80 rounded-2xl text-xs text-slate-400 dark:text-slate-500 flex items-center group-hover:border-indigo-500/50 dark:group-hover:border-indigo-500/40 transition-all duration-300 shadow-sm">
              <span className="font-display text-[11px]">Search commands...</span>
            </div>
            <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3 top-2.5 group-hover:text-indigo-500 transition-colors" />
            
            <div className="absolute right-2 top-1.5 flex items-center gap-0.5 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-850 px-1.5 py-0.5 rounded-md">
              <span className="text-[8px] font-mono font-bold text-slate-400 dark:text-slate-500">⌘K</span>
            </div>
          </button>

          {/* Synchronizer Portal */}
          <div className="flex items-center gap-1 bg-white dark:bg-[#0c1221]/50 border border-slate-200 dark:border-slate-800 p-1 rounded-2xl shadow-sm">
            <button
              onClick={() => handleSyncClick('Attendance portal')}
              disabled={syncing}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-[11px] sm:text-xs font-semibold transition-all duration-300 cursor-pointer ${
                syncing
                  ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white shadow-sm'
              }`}
            >
              <RefreshCw className={`w-3.5 h-3.5 ${syncing ? 'animate-spin' : ''}`} />
              <span className="font-display">
                {syncing ? 'Syncing...' : 'Portal Sync'}
              </span>
            </button>
            
            <button
              onClick={() => handleSyncClick('University Marks server')}
              disabled={syncing}
              className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800/60 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 rounded-xl transition-all cursor-pointer"
              title="Sync Academic Marks"
              aria-label="Sync academic marks"
            >
              <CloudLightning className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            </button>
          </div>

          {/* Theme switcher toggle button */}
          {onToggleTheme && (
            <button 
              onClick={onToggleTheme}
              className="p-2 bg-white dark:bg-[#0c1221]/50 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-2xl shadow-sm text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-amber-400 transition-all cursor-pointer"
              title={theme === 'dark' ? "Switch to light theme" : "Switch to dark theme"}
              aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-500" />}
            </button>
          )}

          {/* Profile Avatar Widget */}
          <div className="flex items-center gap-2 bg-white dark:bg-[#0c1221]/50 border border-slate-200 dark:border-slate-800 p-1 rounded-2xl shadow-sm pr-2.5">
            <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center text-white font-bold text-xs shadow-sm">
              {displayName.split(' ').map((n: string) => n[0]).join('') || 'U'}
            </div>
            <div className="hidden sm:block text-left leading-none">
              <p className="text-[11px] font-bold text-slate-800 dark:text-slate-200 leading-none">
                {displayName.split(' ')[0] || 'Praveen'}
              </p>
              <span className="text-[9px] font-mono text-indigo-600 dark:text-indigo-400 block mt-0.5 font-bold">
                {displayName}
              </span>
            </div>
          </div>
        </div>

      </div>
    </header>
  );
}
