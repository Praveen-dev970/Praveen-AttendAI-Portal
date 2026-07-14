import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  ClipboardCheck, 
  Calculator, 
  Award, 
  BarChart3, 
  Settings, 
  LogOut,
  Sparkles,
  X,
  ChevronLeft,
  ChevronRight,
  Sun,
  Moon,
  User
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  student: any;
  onLogout: () => void;
  isMobile?: boolean;
  onClose?: () => void;
  theme?: 'light' | 'dark';
  onToggleTheme?: () => void;
}

export default function Sidebar({ 
  activeTab, 
  setActiveTab, 
  student, 
  onLogout, 
  isMobile, 
  onClose,
  theme,
  onToggleTheme 
}: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const displayName = String(student?.name || 'Student');

  const menuItems = [
    { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard },
    { id: 'attendance', name: 'Attendance', icon: ClipboardCheck },
    { id: 'calculator', name: 'Calculator', icon: Calculator },
    { id: 'marks', name: 'Marks Sync', icon: Award },
    { id: 'charts', name: 'Analytics', icon: BarChart3 },
    { id: 'profile', name: 'Profile', icon: User },
    { id: 'settings', name: 'Settings', icon: Settings },
  ];

  return (
    <div 
      className={`relative h-full flex flex-col justify-between select-none transition-all duration-300 border shadow-md backdrop-blur-xl ${
        theme === 'dark' 
          ? 'bg-[#0d1527]/75 border-slate-800/80 text-white shadow-slate-950/20' 
          : 'bg-white/90 border-slate-200/80 text-slate-800 shadow-slate-200/20'
      } ${
        isMobile 
          ? 'w-full rounded-r-3xl rounded-l-none p-5' 
          : isCollapsed 
          ? 'w-[78px] rounded-3xl p-4' 
          : 'w-64 rounded-3xl p-5'
      }`}
    >
      {/* Collapse / Expand Toggle Button (Desktop only) */}
      {!isMobile && (
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={`absolute -right-3 top-20 w-6 h-6 rounded-full border flex items-center justify-center transition-all cursor-pointer hover:scale-110 active:scale-95 shadow-md ${
            theme === 'dark' 
              ? 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white' 
              : 'bg-white border-slate-200 text-slate-500 hover:text-slate-800'
          }`}
          title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          {isCollapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
        </button>
      )}

      {/* Brand & Logo */}
      <div>
        <div className="flex items-center justify-between px-1 py-3">
          <div className="flex items-center gap-3 overflow-hidden">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-indigo-600 flex items-center justify-center text-white shrink-0 shadow-lg shadow-indigo-500/20"
            >
              <Sparkles className="w-5.5 h-5.5 text-indigo-50" />
            </motion.div>
            
            <AnimatePresence>
              {!isCollapsed && (
                <motion.div
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  className="whitespace-nowrap"
                >
                  <h1 className="font-display font-black text-lg tracking-tight leading-none">
                    AttendAI
                  </h1>
                  <span className="text-[9px] font-mono font-bold text-indigo-500 uppercase tracking-widest mt-0.5 block">
                    Praveen Portal
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {isMobile && onClose && (
            <button 
              onClick={onClose}
              className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800/60 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors cursor-pointer"
              aria-label="Close menu"
            >
              <X className="w-4.5 h-4.5" />
            </button>
          )}
        </div>

        {/* Divider */}
        <div className={`h-px my-4 mx-1 ${theme === 'dark' ? 'bg-slate-800/60' : 'bg-slate-200/60'}`} />

        {/* Navigation Items */}
        <nav className="space-y-1.5">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center rounded-2xl text-xs font-semibold transition-all relative group overflow-hidden cursor-pointer ${
                  isCollapsed ? 'justify-center p-3' : 'gap-3.5 px-4 py-3'
                } ${
                  isActive
                    ? theme === 'dark' 
                      ? 'text-white bg-indigo-500/15' 
                      : 'text-indigo-600 bg-indigo-50'
                    : theme === 'dark'
                    ? 'text-slate-400 hover:text-white hover:bg-slate-800/40'
                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100/60'
                }`}
                title={isCollapsed ? item.name : undefined}
              >
                {/* Active Indicator Bar */}
                {isActive && (
                  <motion.span 
                    layoutId="activeIndicator"
                    className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-indigo-500 rounded-r-full" 
                  />
                )}
                
                <Icon className={`w-4.5 h-4.5 shrink-0 transition-transform duration-300 group-hover:scale-105 ${
                  isActive 
                    ? 'text-indigo-500' 
                    : theme === 'dark' 
                    ? 'text-slate-400 group-hover:text-white' 
                    : 'text-slate-500 group-hover:text-slate-800'
                }`} />
                
                {!isCollapsed && (
                  <span className="font-display tracking-tight text-[12.5px]">{item.name}</span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Controls: User, Theme Switcher & Logout */}
      <div className="space-y-4">
        {/* Theme Switcher Widget */}
        {onToggleTheme && (
          <button
            onClick={onToggleTheme}
            className={`w-full flex items-center rounded-2xl text-xs font-medium transition-all group cursor-pointer ${
              isCollapsed ? 'justify-center p-3' : 'gap-3 px-4 py-2.5'
            } ${
              theme === 'dark' 
                ? 'bg-slate-800/30 text-slate-300 hover:bg-slate-800/60 hover:text-white' 
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200/50 hover:text-slate-800'
            }`}
            title="Toggle theme appearance"
          >
            {theme === 'dark' ? (
              <>
                <Sun className="w-4 h-4 shrink-0 text-amber-400 animate-spin-slow" />
                {!isCollapsed && <span className="font-display pl-0.5">Toggle Light Mode</span>}
              </>
            ) : (
              <>
                <Moon className="w-4 h-4 shrink-0 text-indigo-500" />
                {!isCollapsed && <span className="font-display pl-0.5">Toggle Dark Mode</span>}
              </>
            )}
          </button>
        )}

        {/* User Badge: show minimal info using Student or provided user object */}
        {student && (
          <div className={`flex items-center rounded-2xl border transition-colors ${
            isCollapsed ? 'justify-center p-2 border-transparent' : 'p-3 border-transparent md:border-dashed'
          } ${
            theme === 'dark' 
              ? 'bg-slate-800/20 dark:border-slate-800/50' 
              : 'bg-slate-50 border-slate-200'
          }`}>
            <div className="w-8.5 h-8.5 rounded-xl bg-indigo-600 text-white font-bold font-display text-xs flex items-center justify-center shrink-0 shadow-sm">
              {displayName.split(' ').map((n: string) => n[0]).join('') || 'U'}
            </div>
            
            {!isCollapsed && (
              <div className="min-w-0 flex-1 pl-2.5">
                <p className="text-xs font-bold truncate leading-none">
                  {displayName}
                </p>
                <span className="text-[9.5px] font-mono text-slate-400 block mt-1 truncate">
                  {displayName}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Logout Session */}
        <button
          onClick={onLogout}
          className={`w-full flex items-center rounded-2xl text-xs font-bold text-rose-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors group cursor-pointer ${
            isCollapsed ? 'justify-center p-3' : 'gap-3 px-4 py-3'
          }`}
          title="Sign out of student account"
        >
          <LogOut className="w-4.5 h-4.5 shrink-0 transition-transform group-hover:translate-x-0.5" />
          {!isCollapsed && <span className="font-display">Logout Session</span>}
        </button>
      </div>
    </div>
  );
}
