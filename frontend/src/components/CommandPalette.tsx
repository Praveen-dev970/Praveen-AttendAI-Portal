import React, { useState, useEffect, useRef } from 'react';
import { Search, Laptop, Sun, Moon, RefreshCw, LayoutDashboard, ClipboardCheck, Calculator, Award, BarChart3, Settings, Sparkles, Command, User } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (tab: string) => void;
  subjects: any[];
  subjectWise: any[];
  onToggleTheme: () => void;
  onTriggerSync: (service: string) => void;
  theme: 'light' | 'dark';
}

export default function CommandPalette({
  isOpen,
  onClose,
  onNavigate,
  subjects,
  subjectWise,
  onToggleTheme,
  onTriggerSync,
  theme
}: CommandPaletteProps) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    }
  }, [isOpen]);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Command palette items list
  const getFilteredItems = () => {
    const items: any[] = [];

    // 1. Navigation items
    const navs = [
      { id: 'dashboard', name: 'Go to Dashboard', category: 'Navigation', icon: LayoutDashboard, action: () => onNavigate('dashboard') },
      { id: 'attendance', name: 'Go to Attendance Logs', category: 'Navigation', icon: ClipboardCheck, action: () => onNavigate('attendance') },
      { id: 'calculator', name: 'Go to Attendance Calculator', category: 'Navigation', icon: Calculator, action: () => onNavigate('calculator') },
      { id: 'marks', name: 'Go to Marks Sync', category: 'Navigation', icon: Award, action: () => onNavigate('marks') },
      { id: 'charts', name: 'Go to Analytics & Charts', category: 'Navigation', icon: BarChart3, action: () => onNavigate('charts') },
      { id: 'profile', name: 'Go to Student Profile', category: 'Navigation', icon: User, action: () => onNavigate('profile') },
      { id: 'settings', name: 'Go to Portal Settings', category: 'Navigation', icon: Settings, action: () => onNavigate('settings') },
    ];

    // 2. Action items
    const actions = [
      { id: 'theme', name: `Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`, category: 'Actions', icon: theme === 'light' ? Moon : Sun, action: () => { onToggleTheme(); onClose(); } },
      { id: 'sync-attendance', name: 'Sync Attendance Portal', category: 'Actions', icon: RefreshCw, action: () => { onTriggerSync('Attendance portal'); onClose(); } },
      { id: 'sync-marks', name: 'Sync University Marks Server', category: 'Actions', icon: RefreshCw, action: () => { onTriggerSync('University Marks server'); onClose(); } },
      { id: 'sync-biometrics', name: 'Sync Biometric Swipes', category: 'Actions', icon: RefreshCw, action: () => { onTriggerSync('Biometric Attendance'); onClose(); } },
    ];

    // 3. Subject Search items
    const subs = subjectWise.map(item => {
      const percentage = item.stats?.percentage ?? 100;
      const isSafe = percentage >= 75;
      return {
        id: `subject-${item.subject.id}`,
        name: `${item.subject.name} (${item.subject.code}) - ${percentage}% Attendance`,
        category: 'Course Analytics',
        icon: Sparkles,
        meta: isSafe ? 'Safe' : 'Alert',
        action: () => {
          onNavigate('attendance');
          onClose();
        }
      };
    });

    const allItems = [...navs, ...actions, ...subs];

    if (!query) return allItems;

    return allItems.filter(item => 
      item.name.toLowerCase().includes(query.toLowerCase()) ||
      item.category.toLowerCase().includes(query.toLowerCase())
    );
  };

  const filteredItems = getFilteredItems();

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % filteredItems.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + filteredItems.length) % filteredItems.length);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredItems[selectedIndex]) {
          filteredItems[selectedIndex].action();
        }
      } else if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, filteredItems, selectedIndex, onClose]);

  // Group items by category for semantic rendering
  const groupedItems = filteredItems.reduce((acc: any, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {});

  // Flattened array representing visual rendering order to match selectedIndex
  const flatRenderedList: any[] = [];
  Object.keys(groupedItems).forEach(cat => {
    flatRenderedList.push(...groupedItems[cat]);
  });

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-[10vh] px-4 select-none">
        {/* Backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-md"
          onClick={onClose}
        />

        {/* Palette Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: -8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: -8 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          ref={containerRef}
          className="relative w-full max-w-xl bg-white dark:bg-[#0c1221] border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[70vh] z-10"
        >
          {/* Input Header */}
          <div className="relative flex items-center border-b border-slate-100 dark:border-slate-800 px-5 py-4">
            <Search className="w-5 h-5 text-slate-400 dark:text-slate-500 shrink-0" />
            <input
              ref={inputRef}
              type="text"
              placeholder="Search tabs, actions, course attendance ratios..."
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setSelectedIndex(0);
              }}
              className="w-full ml-3 text-sm bg-transparent border-none outline-none text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:ring-0 focus:outline-none"
            />
            
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 px-2 py-1 rounded-lg">
              <span className="text-[9px] font-mono font-bold text-slate-400">ESC</span>
            </div>
          </div>

          {/* Results List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {filteredItems.length === 0 ? (
              <div className="text-center py-12 text-slate-400 dark:text-slate-500 space-y-1.5">
                <Command className="w-8 h-8 text-slate-300 dark:text-slate-700 mx-auto" />
                <p className="text-xs font-display">No commands or classes found matching your search query.</p>
              </div>
            ) : (
              Object.keys(groupedItems).map(category => (
                <div key={category} className="space-y-1.5">
                  <h4 className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 pl-2">
                    {category}
                  </h4>
                  <div className="space-y-1">
                    {groupedItems[category].map((item: any) => {
                      const Icon = item.icon;
                      // Find index of this item in the unified flat rendered list for matching visual selectedIndex
                      const overallIndex = flatRenderedList.findIndex(f => f.id === item.id);
                      const isHighlighted = overallIndex === selectedIndex;

                      return (
                        <button
                          key={item.id}
                          onClick={item.action}
                          onMouseEnter={() => setSelectedIndex(overallIndex)}
                          className={`w-full text-left flex items-center justify-between px-3.5 py-3 rounded-2xl transition-all cursor-pointer ${
                            isHighlighted
                              ? 'bg-indigo-500/10 dark:bg-indigo-500/15 border-l-2 border-indigo-500 text-slate-900 dark:text-white'
                              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900/40'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`p-1.5 rounded-xl transition-colors ${
                              isHighlighted ? 'bg-indigo-500/20 text-indigo-400' : 'bg-slate-100 dark:bg-slate-900 text-slate-400 dark:text-slate-500'
                            }`}>
                              <Icon className="w-4 h-4" />
                            </div>
                            <span className="text-xs font-semibold font-display truncate max-w-[340px]">
                              {item.name}
                            </span>
                          </div>

                          {item.meta && (
                            <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-md border ${
                              item.meta === 'Safe'
                                ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-100 dark:border-emerald-900/50 text-emerald-600 dark:text-emerald-400'
                                : 'bg-rose-50 dark:bg-rose-950/40 border-rose-100 dark:border-rose-900/50 text-rose-600 dark:text-rose-400'
                            }`}>
                              {item.meta}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Key Hints Footer */}
          <div className="bg-slate-50 dark:bg-slate-950 px-5 py-3 border-t border-slate-100 dark:border-slate-800 text-[10px] text-slate-400 dark:text-slate-500 flex items-center justify-between font-mono">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <span className="bg-slate-200 dark:bg-slate-900 px-1 py-0.5 rounded text-[8px]">↑↓</span> Navigate
              </span>
              <span className="flex items-center gap-1">
                <span className="bg-slate-200 dark:bg-slate-900 px-1 py-0.5 rounded text-[8px]">Enter</span> Select
              </span>
            </div>
            <span>AttendAI Smart Console</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
