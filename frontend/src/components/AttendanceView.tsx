import React, { useState } from 'react';
import { 
  Plus, 
  Trash2, 
  Calendar, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Search, 
  Filter, 
  BookOpen, 
  AlertCircle 
} from 'lucide-react';
// Use new backend AttendanceSubject type
import type { AttendanceSubject } from '../types.js';
import { APP_BUTTON, APP_CARD } from '../lib/ui.js';

interface AttendanceViewProps {
  subjects: AttendanceSubject[];
  records: any[];
  onAddRecord: (subjectId: string, date: string, status: 'present' | 'absent' | 'late', notes?: string) => Promise<void>;
  onDeleteRecord: (id: string) => Promise<void>;
}

export default function AttendanceView({ subjects, records, onAddRecord, onDeleteRecord }: AttendanceViewProps) {
  const [selectedSubject, setSelectedSubject] = useState(subjects[0]?.subject || '');
  const [selectedStatus, setSelectedStatus] = useState<'present' | 'absent' | 'late'>('present');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');
  const [search, setSearch] = useState('');
  const [filterSubject, setFilterSubject] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedSubject) return;

    setIsSubmitting(true);
    try {
      await onAddRecord(selectedSubject, selectedDate, selectedStatus, notes);
      setNotes('');
      // Trigger temporary visual feedback
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filter logs
  const filteredRecords = records.filter(rec => {
    const matchesSubject = filterSubject === 'all' || rec.subjectId === filterSubject;
    const matchesStatus = filterStatus === 'all' || rec.status === filterStatus;
    
    const subjectName = subjects.find(s => s.subject === rec.subjectId)?.subject || '';
    const matchesSearch = subjectName.toLowerCase().includes(search.toLowerCase()) || 
                          (rec.notes && rec.notes.toLowerCase().includes(search.toLowerCase()));

    return matchesSubject && matchesStatus && matchesSearch;
  }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 select-none">
      
      {/* Logger Column */}
      <div className="xl:col-span-1 space-y-6">
        <div className={`${APP_CARD} p-5 md:p-6`}>
          <h3 className="mb-4 flex items-center gap-2 text-sm font-display font-bold tracking-wide text-slate-800 dark:text-white">
            <span className="w-2 h-2 rounded-full bg-indigo-500" />
            Log Manual Attendance
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Subject Picker */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400">SELECT COURSE</label>
              <select
                value={selectedSubject}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedSubject(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-display text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all cursor-pointer"
              >
                {subjects.map(sub => (
                  <option key={sub.subject} value={sub.subject} className="dark:bg-slate-900">{sub.subject}</option>
                ))}
              </select>
            </div>

            {/* Date Selection */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400">SESSION DATE</label>
              <div className="relative">
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSelectedDate(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all cursor-pointer"
                />
                <Calendar className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 top-3" />
              </div>
            </div>

            {/* Status Checkboxes matching coach-pro button grids */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400">ATTENDANCE STATUS</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedStatus('present')}
                  className={`py-2 rounded-xl text-xs font-semibold font-display transition-all border cursor-pointer ${
                    selectedStatus === 'present'
                      ? 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-900/50 text-indigo-700 dark:text-indigo-400 shadow-sm shadow-indigo-500/5'
                      : 'bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  Present
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedStatus('late')}
                  className={`py-2 rounded-xl text-xs font-semibold font-display transition-all border cursor-pointer ${
                    selectedStatus === 'late'
                      ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-900/50 text-amber-700 dark:text-amber-400 shadow-sm shadow-amber-500/5'
                      : 'bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  Late
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedStatus('absent')}
                  className={`py-2 rounded-xl text-xs font-semibold font-display transition-all border cursor-pointer ${
                    selectedStatus === 'absent'
                      ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-900/50 text-rose-700 dark:text-rose-400 shadow-sm shadow-rose-500/5'
                      : 'bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  Absent
                </button>
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400">NOTES / REASON</label>
              <input
                type="text"
                placeholder="e.g. Health check, lab class..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-display text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white font-display font-semibold py-2.5 text-xs shadow-md shadow-indigo-600/10 dark:shadow-indigo-500/5 flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 ${APP_BUTTON}`}
            >
              <Plus className="w-4 h-4" />
              <span>{isSubmitting ? 'Logging Record...' : 'Record Lecture'}</span>
            </button>
          </form>
        </div>

        {/* Quick diagnosis card */}
        <div className="rounded-3xl border border-slate-200/60 bg-[#0b1221] p-5 text-white shadow-sm transition-all duration-300 hover:shadow-lg dark:border-slate-800">
          <div className="flex items-start gap-3">
            <div className="p-1.5 bg-indigo-500/20 rounded-xl text-indigo-400">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-display font-bold text-white uppercase tracking-wider">
                75% Attendance Guard
              </h4>
              <p className="text-[10px] text-slate-300 leading-relaxed mt-1.5 font-light">
                Each missed lab counts as 3 classes in percentage weight. Log late arrivals promptly to ensure they register as partial presence.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* History List Column */}
      <div className="xl:col-span-2 space-y-6">
        <div className={`${APP_CARD} flex h-full min-h-[500px] flex-col justify-between p-5 md:p-6`}>
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800/80">
              <h3 className="text-sm font-display font-bold text-slate-800 dark:text-white uppercase tracking-wider flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-indigo-500" />
                Attendance Log Archive
              </h3>

              {/* In-tab Search */}
              <div className="relative w-full sm:w-48">
                <input
                  type="text"
                  placeholder="Search log..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="h-9 w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 text-[10px] text-slate-800 transition-all focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
                />
                <Search className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 absolute left-3 top-2.5" />
              </div>
            </div>

            {/* Quick Filter Bar */}
            <div className="flex flex-wrap items-center gap-3 py-4 text-xs">
              <div className="flex items-center gap-1 text-slate-400 font-mono text-[10px]">
                <Filter className="w-3 h-3" />
                <span>FILTERS</span>
              </div>
              
              <select
                value={filterSubject}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFilterSubject(e.target.value)}
                className="h-9 rounded-xl border border-slate-200 bg-white px-3 text-[10px] text-slate-800 transition-all focus:border-indigo-500 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 cursor-pointer"
              >
                <option value="all" className="dark:bg-slate-900">All Subjects</option>
                {subjects.map(s => (
                  <option key={s.subject} value={s.subject} className="dark:bg-slate-900">{s.subject}</option>
                ))}
              </select>

              <select
                value={filterStatus}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFilterStatus(e.target.value)}
                className="h-9 rounded-xl border border-slate-200 bg-white px-3 text-[10px] text-slate-800 transition-all focus:border-indigo-500 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 cursor-pointer"
              >
                <option value="all" className="dark:bg-slate-900">All Statuses</option>
                <option value="present" className="dark:bg-slate-900">Present</option>
                <option value="late" className="dark:bg-slate-900">Late</option>
                <option value="absent" className="dark:bg-slate-900">Absent</option>
              </select>
            </div>

            {/* Attendance Record List */}
            {filteredRecords.length === 0 ? (
              <div className="flex min-h-[280px] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200/80 bg-slate-50/50 p-6 text-center text-slate-400 dark:border-slate-800 dark:bg-slate-900/20 dark:text-slate-500">
                <BookOpen className="mb-3 h-9 w-9 text-slate-300 dark:text-slate-700" />
                <p className="text-xs font-display font-medium">No recorded logs match the current filters.</p>
              </div>
            ) : (
              <div className="overflow-y-auto max-h-[350px] pr-2 space-y-2.5">
                {filteredRecords.map((rec) => {
                const sub = subjects.find(s => s.subject === rec.subjectId);
                  return (
                    <div 
                      key={rec.id}
                      className="flex items-center justify-between p-3.5 bg-white dark:bg-[#0c1221]/40 hover:bg-slate-50/50 dark:hover:bg-[#121c33]/50 rounded-2xl border border-slate-100 dark:border-slate-800/80 hover:border-indigo-500/20 dark:hover:border-indigo-500/30 transition-all duration-200 shadow-sm"
                    >
                      <div className="flex items-center gap-3">
                        {/* Status Icon Indicator */}
                        {rec.status === 'present' ? (
                          <div className="p-2 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl text-emerald-600 dark:text-emerald-400">
                            <CheckCircle2 className="w-4 h-4" />
                          </div>
                        ) : rec.status === 'late' ? (
                          <div className="p-2 bg-amber-50 dark:bg-amber-950/40 rounded-xl text-amber-600 dark:text-amber-400">
                            <Clock className="w-4 h-4" />
                          </div>
                        ) : (
                          <div className="p-2 bg-rose-50 dark:bg-rose-950/40 rounded-xl text-rose-600 dark:text-rose-400">
                            <XCircle className="w-4 h-4" />
                          </div>
                        )}

                        <div>
                          <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 font-display">
                          {sub ? sub.subject : 'Unknown Subject'}
                          </p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[9px] font-mono font-bold text-slate-400 dark:text-slate-500">
                              {rec.date}
                            </span>
                            {rec.notes && (
                              <span className="text-[9px] text-slate-500 dark:text-slate-400 bg-slate-100/70 dark:bg-slate-800/80 px-1.5 py-0.5 rounded-md truncate max-w-[150px]">
                                {rec.notes}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md border tracking-wider uppercase ${
                          rec.status === 'present' 
                            ? 'bg-emerald-50/50 dark:bg-emerald-950/40 border-emerald-100/55 dark:border-emerald-900/50 text-emerald-700 dark:text-emerald-400' 
                            : rec.status === 'late' 
                            ? 'bg-amber-50/50 dark:bg-amber-950/40 border-amber-100/55 dark:border-amber-900/50 text-amber-700 dark:text-amber-400' 
                            : 'bg-rose-50/50 dark:bg-rose-950/40 border-rose-100/55 dark:border-rose-900/50 text-rose-700 dark:text-rose-400'
                        }`}>
                          {rec.status}
                        </span>

                        <button
                          onClick={() => onDeleteRecord(rec.id)}
                          className="p-1.5 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-slate-400 dark:text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 rounded-xl transition-all cursor-pointer"
                          title="Delete Record"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 text-[10px] text-slate-400 dark:text-slate-500 flex items-center justify-between font-mono">
            <span>Showing {filteredRecords.length} of {records.length} database logs</span>
            <span>Last database update: Live synced</span>
          </div>
        </div>
      </div>

    </div>
  );
}
