import React, { useState } from 'react';
import { Sparkles, Lock, ShieldCheck, ChevronRight, AlertCircle, CheckCircle2, Eye, EyeOff, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { api } from '../lib/api.js';

interface LoginViewProps {
  onLoginSuccess: (user: any) => void;
}

export default function LoginView({ onLoginSuccess }: LoginViewProps) {
  const [rollNumber, setRollNumber] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showForgotTip, setShowForgotTip] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Input Validation
    if (!rollNumber.trim()) {
      setError('Please input a valid University Roll Number.');
      setLoading(false);
      return;
    }
    if (password.length < 4) {
      setError('Password must contain at least 4 characters.');
      setLoading(false);
      return;
    }

    try {
    const res = await api.login(
      {
        roll_number: rollNumber,
        password: password,
      },
      rememberMe
    );      
    setSuccess('Credentials authenticated! Synchronizing academic index metrics...');
      onLoginSuccess(res.student);
    } catch (err: any) {
      setError(err.message || 'Authentication error. Please verify roll number and password.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = () => {
    setRollNumber('23A91A61');
    setPassword('praveen123');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 select-none relative overflow-hidden bg-[#070b13] text-white">
      
      {/* Premium Floating Gradient Orbs */}
      <motion.div 
        animate={{ 
          x: [0, 60, -40, 0], 
          y: [0, -50, 40, 0],
          scale: [1, 1.2, 0.9, 1]
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-12 -left-12 w-96 h-96 rounded-full bg-indigo-600/20 blur-3xl" 
      />
      
      <motion.div 
        animate={{ 
          x: [0, -40, 50, 0], 
          y: [0, 60, -40, 0],
          scale: [1, 0.9, 1.1, 1]
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-10 right-10 w-[450px] h-[450px] rounded-full bg-violet-600/15 blur-3xl" 
      />

      <motion.div 
        animate={{ 
          scale: [0.8, 1.1, 0.8]
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/3 right-1/4 w-80 h-80 rounded-full bg-teal-500/10 blur-3xl" 
      />

      {/* Main Glass Login Card */}
      <motion.div 
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-md bg-[#0d1527]/50 backdrop-blur-2xl border border-slate-800 shadow-2xl rounded-3xl p-8 relative z-10 space-y-6"
      >
        
        {/* Logo/Identity */}
        <div className="text-center space-y-2">
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-500 to-violet-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25 mx-auto"
          >
            <Sparkles className="w-7 h-7 animate-pulse text-indigo-100" />
          </motion.div>
          <div>
            <h1 className="font-display font-extrabold text-2xl tracking-tight text-white">
              AttendAI Portal
            </h1>
            <p className="text-[11px] text-indigo-300/70 font-mono tracking-widest uppercase block mt-1">
              University Attendance Sync Console
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-slate-800" />

        {/* Demo Credentials Helper Box */}
        <motion.div 
          onClick={fillDemo}
          whileHover={{ scale: 1.01, backgroundColor: "rgba(99,102,241,0.12)" }}
          whileTap={{ scale: 0.99 }}
          className="p-3.5 bg-indigo-950/20 border border-indigo-500/20 rounded-2xl cursor-pointer flex items-center justify-between group transition-all"
        >
          <div className="flex items-center gap-3">
            <span className="text-lg">💡</span>
            <div className="text-left">
              <span className="text-[10px] font-mono font-bold text-indigo-400 block uppercase tracking-wider">Quick Demo Login</span>
              <p className="text-xs text-indigo-200/90 font-display">
                Click to auto-authenticate <strong>Praveen Yeggada</strong>
              </p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-indigo-400 group-hover:translate-x-1 transition-transform" />
        </motion.div>

        {/* Responses notifications */}
        <AnimatePresence mode="wait">
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="p-3 bg-rose-950/30 border border-rose-800/50 text-rose-200 text-xs rounded-2xl flex items-center gap-2.5 font-display"
            >
              <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
              <p className="font-medium">{error}</p>
            </motion.div>
          )}

          {success && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="p-3 bg-emerald-950/30 border border-emerald-800/50 text-emerald-200 text-xs rounded-2xl flex items-center gap-2.5 font-display"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 animate-bounce" />
              <p className="font-medium">{success}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Auth form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Roll Number */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-mono font-semibold text-slate-400 uppercase tracking-wider">Roll Number</label>
            <div className="relative">
              <input
                type="text"
                required
                placeholder="e.g. 23A91A61"
                value={rollNumber}
                onChange={(e) => setRollNumber(e.target.value.toUpperCase())}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-900/40 border border-slate-800 rounded-xl text-xs font-display focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-100 placeholder-slate-500"
              />
              <ShieldCheck className="w-4 h-4 text-indigo-400 absolute left-3.5 top-3.5" />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-mono font-semibold text-slate-400 uppercase tracking-wider">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 bg-slate-900/40 border border-slate-800 rounded-xl text-xs font-display focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-100 placeholder-slate-500"
              />
              <Lock className="w-4 h-4 text-indigo-400 absolute left-3.5 top-3.5" />
              
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-slate-500 hover:text-indigo-400 transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Remember Me checkbox & Help link */}
          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-slate-800 bg-slate-900 text-indigo-600 focus:ring-indigo-500/20 cursor-pointer"
              />
              <span className="text-xs text-slate-400 group-hover:text-slate-200 transition-colors font-display">
                Remember Me
              </span>
            </label>

            <button
              type="button"
              onClick={() => setShowForgotTip(!showForgotTip)}
              className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors font-display font-medium cursor-pointer"
            >
              Forgot Password?
            </button>
          </div>

          {/* Forgot Password Notice */}
          <AnimatePresence>
            {showForgotTip && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="p-3 bg-indigo-950/40 border border-indigo-800/40 rounded-xl text-[10px] text-indigo-300 flex items-start gap-2 leading-relaxed"
              >
                <HelpCircle className="w-4 h-4 shrink-0 text-indigo-400 mt-0.5" />
                <span>
                  <strong>Portal Notice:</strong> For student safety, credential resets are handled manually. Please request assistance from your university academic administrator.
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-display font-semibold py-3 rounded-xl text-xs shadow-lg shadow-indigo-500/15 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <span>{loading ? 'Authenticating Secures...' : 'Authenticate Student ID'}</span>
            {loading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </button>
        </form>

        <div className="text-center pt-2">
          <p className="text-[10px] text-slate-500 font-mono tracking-wider uppercase">
            Secured end-to-end telemetry
          </p>
        </div>

      </motion.div>
    </div>
  );
}
