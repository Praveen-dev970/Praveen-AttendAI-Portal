import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar.js';
import Header from './components/Header.js';
import DashboardView from './components/DashboardView.js';
import AttendanceView from './components/AttendanceView.js';
import CalculatorView from './components/CalculatorView.js';
import MarksView from './components/MarksView.js';
import ChartsView from './components/ChartsView.js';
import ProfileView from './components/ProfileView.js';
import SettingsView from './components/SettingsView.js';
import LoginView from './components/LoginView.js';
import CommandPalette from './components/CommandPalette.js';
import { motion } from 'motion/react';
import { LayoutDashboard, ClipboardCheck, Calculator, Award, BarChart3, User as UserIcon, Settings } from 'lucide-react';

import { api, getAuthToken, setAuthToken } from './lib/api.js';
import { triggerSync } from './lib/syncApi.js';
import { SyncProgressModal } from './components/SyncProgressModal.js';
import type { Student, DashboardResponse } from './types.js';

function mapDashboard(dashboard: DashboardResponse) {

    const attendance = dashboard.attendance ?? {};

    const overall = attendance.overall?.overall ?? {
        held: 0,
        attended: 0,
        percentage: 0,
    };

    const subjects = attendance.overall?.subjects ?? [];

    return {
        stats: {
            overallAttendance: Number(overall.percentage),
            classesPresent: Number(overall.attended),
            classesLate: 0,
            totalClasses: Number(overall.held),
            heldClasses: Number(overall.held),
            classesAbsent: Number(overall.held) - Number(overall.attended),
            bunkableClasses: Math.max(
                0,
                Math.floor(
                    Number(overall.attended) -
                    Number(overall.held) * 0.75
                )
            ),
            rollNumber: dashboard.student.roll_number,
            
        },

        subjects,

        subjectWise: subjects.map((subject) => ({
            subject: {
                subject: subject.subject,
            },

            stats: {
                held: subject.held,
                attended: subject.attended,
                percentage: subject.percentage,
                present: subject.attended,
                total: subject.held,
                late: 0,
                //rollNumber: dashboard.student.roll_number,
            },

            marks: null,
        })),

        marks: dashboard.marks
            ? [dashboard.marks]
            : [],
    };
}
export default function App() {
  const [syncing, setSyncing] = useState(false);
  const [syncJobId, setSyncJobId] = useState<string | null>(null);
  const [isSyncProgressOpen, setIsSyncProgressOpen] = useState(false);
  const [student, setStudent] = useState<Student | null>(null);
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [loading, setLoading] = useState<boolean>(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState<boolean>(false);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('attendai_theme');
    if (saved === 'dark' || saved === 'light') return saved;
    return 'light';
  });

  // Global keydown for Ctrl+K Command Palette
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Apply Theme
  useEffect(() => {
    localStorage.setItem('attendai_theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  // Database / Dashboard States
  const [stats, setStats] = useState<any | null>(null);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [records, setRecords] = useState<any[]>([]);
  const [subjectWise, setSubjectWise] = useState<any[]>([]);
  const [marks, setMarks] = useState<any[]>([]);

  const applyDashboard = (dashboard: DashboardResponse) => {
    const mapped = mapDashboard(dashboard);
    setStudent(dashboard.student as any);
    setStats(mapped.stats);
    setSubjects(mapped.subjects);
    setRecords([]);
    setSubjectWise(mapped.subjectWise);
    setMarks(mapped.marks);
  };

  // Authenticate session on boot
  useEffect(() => {
    const initAuth = async () => {
      const startTime = Date.now();
      const token = getAuthToken();
      if (token) {
        try {
          // New backend exposes a single dashboard endpoint — use it to bootstrap app state
          await loadAllData();
        } catch (err) {
          console.error('Session expired or invalid', err);
          setAuthToken(null);
        }
      }
      
      const elapsed = Date.now() - startTime;
      const minDelay = 2500; // Ensure preloader is shown for at least 2.5 seconds
      if (elapsed < minDelay) {
        await new Promise(resolve => setTimeout(resolve, minDelay - elapsed));
      }
      
      setLoading(false);
    };
    initAuth();
  }, []);

  const loadAllData = async () => {
    try {
      const dashboard = await api.getDashboard(false);
      applyDashboard(dashboard);
    } catch (err) {
      console.error('Failed to load portal metrics:', err);
    }
  };

  const handleLoginSuccess = async (loginRes: any) => {
    setLoading(true);
    const startTime = Date.now();

    const dashboard = loginRes?.dashboard;
    if (dashboard) {
      applyDashboard(dashboard as DashboardResponse);
    }

    const elapsed = Date.now() - startTime;
    const minDelay = 2500; // Ensure login loader is visible
    if (elapsed < minDelay) {
      await new Promise(resolve => setTimeout(resolve, minDelay - elapsed));
    }

    setLoading(false);
    setActiveTab('dashboard');
  };

  const handleLogout = () => {
    setAuthToken(null);
    setStudent(null);
    localStorage.removeItem('attendai_user');
  };

  const handleAddRecord = async (_subjectId: string, _date: string, _status: 'present' | 'absent' | 'late', _notes?: string) => {
    // NOTE: attendance modification endpoints removed in the new backend.
    // This is a no-op placeholder to avoid runtime errors until UI-level handlers are migrated.
    return;
  };

  const handleDeleteRecord = async (_recordId: string) => {
    return;
  };

  const handleSyncTriggered = async (_log: any) => {
    if (syncing) return;

    setSyncing(true);
    try {
      const job = await triggerSync();
      setSyncJobId(job.job_id);
      setIsSyncProgressOpen(true);
    } catch (err) {
      console.error('Failed to start portal sync:', err);
      setSyncing(false);
    }
  };

  const handleSyncFinished = async (status: 'completed' | 'failed') => {
    try {
      if (status === 'completed') {
        await loadAllData();
      }
    } finally {
      setSyncing(false);
    }
  };

  const handleProfileUpdated = (_updatedUser: any) => {
    // No-op: profile updates should call new backend endpoints when migrated.
    return;
  };

  // Render Loader
  if (loading) {
    const word1 = "Hello from";
    const word2 = "PRAVEEN";
    
    return (
      <div className="min-h-screen bg-[#0F172A] text-white flex flex-col items-center justify-center p-6 select-none relative overflow-hidden">
        {/* Glowing Background Orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-indigo-600/10 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-violet-600/10 blur-3xl" />
        
        <div className="relative z-10 flex flex-col items-center text-center space-y-6">
          {/* Elegant Animated Greeting */}
          <motion.h2 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-lg md:text-2xl font-display font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-slate-100 via-indigo-100 to-indigo-300"
          >
            {word1}
          </motion.h2>

          {/* Animated "AIML " name below */}
          <div className="flex items-center justify-center gap-1.5">
            {word2.split("").map((char, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0.3, y: 10, scale: 0.9 }}
                animate={{ 
                  opacity: [0.3, 1, 0.3], 
                  y: [10, -8, 10],
                  scale: [0.9, 1.15, 0.9],
                  color: ["#818cf8", "#c084fc", "#818cf8"]
                }}
                transition={{
                  duration: 1.5,
                  delay: index * 0.15,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className={`text-4xl md:text-6xl font-display font-extrabold tracking-widest ${
                  char === " " ? "w-4" : ""
                } drop-shadow-[0_0_20px_rgba(129,140,248,0.4)]`}
              >
                {char === " " ? "\u00A0" : char}
              </motion.span>
            ))}
          </div>

          {/* Subtitle / Loading indicator */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.4, 0.8, 0.4] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="flex flex-col items-center space-y-2 pt-6"
          >
            <p className="text-xs font-mono text-indigo-300/80 tracking-widest uppercase">
              Initializing Secure Environment
            </p>
            {/* Minimalist modern progress bar */}
            <div className="w-48 h-1 bg-slate-800 rounded-full overflow-hidden">
              <motion.div 
                animate={{ x: ["-100%", "100%"] }}
                transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                className="w-1/2 h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full"
              />
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // Render Login state if no user
  if (!student) {
    return <LoginView onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="min-h-screen p-3 md:p-6 flex flex-col md:flex-row gap-4 md:gap-6 max-w-[1440px] mx-auto select-none overflow-x-hidden relative bg-slate-50 dark:bg-[#090d16] text-slate-900 dark:text-slate-100 transition-colors duration-300">
      
      {/* Desktop Sidebar (static on md screens and up) */}
      <div className="hidden md:block w-64 shrink-0">
        <Sidebar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          student={student} 
          onLogout={handleLogout} 
          theme={theme}
          onToggleTheme={toggleTheme}
        />
      </div>

      {/* Mobile Sidebar Slide-Over Drawer with backdrop blur */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex animate-fade-in md:hidden" role="dialog" aria-modal="true" aria-label="Navigation menu">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          {/* Drawer Body */}
          <div className="relative z-10 w-64 max-w-[80vw] h-full flex flex-col">
            <Sidebar 
              activeTab={activeTab} 
              setActiveTab={(tab) => {
                setActiveTab(tab);
                setIsMobileMenuOpen(false);
              }} 
              student={student} 
              onLogout={handleLogout} 
              isMobile={true}
              onClose={() => setIsMobileMenuOpen(false)}
              theme={theme}
              onToggleTheme={toggleTheme}
            />
          </div>
        </div>
      )}

      {/* Main viewport */}
      <div className="flex-1 flex flex-col overflow-hidden min-h-[calc(100vh-2rem)]">
        
        {/* Dynamic header greeting & actions */}
        <Header 
          student={student} 
          onSyncTriggered={handleSyncTriggered} 
          syncing={syncing}
          onMenuClick={() => setIsMobileMenuOpen(true)}
          theme={theme}
          onToggleTheme={toggleTheme}
          onSearchClick={() => setIsCommandPaletteOpen(true)}
        />

        {/* Tab pages with subtle motion transitions */}
        <main className="flex-1 overflow-y-auto pr-1 pb-16 md:pb-0">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="w-full h-full"
          >
            {activeTab === 'dashboard' && stats && (
              <DashboardView
                stats={stats}
                subjectWise={subjectWise}
                marksResponse={marks[0]}
                onNavigate={setActiveTab}
              />
            )}

            {activeTab === 'attendance' && (
              <AttendanceView 
                subjects={subjects} 
                records={records} 
                onAddRecord={handleAddRecord} 
                onDeleteRecord={handleDeleteRecord} 
              />
            )}

            {activeTab === 'calculator' && (
              <CalculatorView 
                subjects={subjects} 
                subjectWise={subjectWise} 
              />
            )}

                  {activeTab === 'marks' && (
                    <MarksView 
                      semesters={marks[0]?.semesters || []} 
                      marksResponse={marks[0] || null}
                      onSyncTriggered={handleSyncTriggered}
                    />
                  )}

            {activeTab === 'charts' && stats && (
              <ChartsView 
                subjects={subjects} 
                marks={marks} 
                subjectWise={subjectWise} 
                stats={stats} 
                theme={theme}
              />
            )}

            {activeTab === 'profile' && stats && (
              <ProfileView 
                student={student} 
                onProfileUpdated={handleProfileUpdated} 
                stats={stats} 
              />
            )}

            {activeTab === 'settings' && (
              <SettingsView 
                onSyncTriggered={handleSyncTriggered} 
                theme={theme}
                onToggleTheme={toggleTheme}
              />
            )}
          </motion.div>
        </main>

      </div>

      <SyncProgressModal
        jobId={syncJobId}
        isOpen={isSyncProgressOpen}
        onClose={() => setIsSyncProgressOpen(false)}
        onFinished={handleSyncFinished}
      />

      {/* Mobile Bottom Navigation Bar (Glassmorphic, styled for premium UI) */}
      <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-white/80 dark:bg-slate-900/85 backdrop-blur-xl border-t border-slate-200/80 dark:border-slate-800/80 px-2 py-2 flex justify-around items-center shadow-lg transition-all">
        {[
          { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard },
          { id: 'attendance', name: 'Attendance', icon: ClipboardCheck },
          { id: 'calculator', name: 'Calculator', icon: Calculator },
          { id: 'marks', name: 'Marks', icon: Award },
          { id: 'profile', name: 'Profile', icon: UserIcon },
        ].map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              aria-label={item.name}
              aria-current={isActive ? 'page' : undefined}
              className={`flex min-h-12 flex-col items-center gap-1 rounded-2xl px-3 py-1 transition-all duration-300 active:scale-95 cursor-pointer ${
                isActive
                  ? 'text-indigo-600 dark:text-indigo-400 font-semibold scale-105'
                  : 'text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              <Icon className="w-5 h-5 transition-transform group-active:scale-90" />
              <span className="text-[9px] font-display font-medium tracking-tight">
                {item.name}
              </span>
            </button>
          );
        })}
      </div>

      {/* Command Palette overlays */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onNavigate={setActiveTab}
        subjects={subjects}
        subjectWise={subjectWise}
        onToggleTheme={toggleTheme}
        onTriggerSync={handleSyncTriggered}
        theme={theme}
      />

    </div>
  );
}
