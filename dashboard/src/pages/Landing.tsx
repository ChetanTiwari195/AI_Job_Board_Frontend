import React from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, ArrowRight, Zap, Shield, Search } from 'lucide-react';

export const Landing: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#090d16] text-slate-900 dark:text-slate-100 font-sans selection:bg-blue-500/30 flex flex-col">
      {/* Navbar */}
      <nav className="w-full p-6 flex justify-between items-center max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-sm shadow-blue-500/20">
            <Briefcase className="w-5 h-5" />
          </div>
          <span className="text-xl font-bold tracking-tight">AI Job Board</span>
        </div>
        <div className="flex gap-4">
          <Link to="/login" className="text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white px-4 py-2 transition-colors">
            Log in
          </Link>
          <Link to="/dashboard" className="bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-sm font-semibold rounded-lg px-5 py-2 shadow-sm transition-all duration-150">
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 max-w-4xl mx-auto mt-20 mb-32">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800/50 text-blue-700 dark:text-blue-300 text-xs font-semibold uppercase tracking-wider mb-8 animate-fade-in">
          <Zap className="w-3.5 h-3.5" />
          The future of job hunting
        </div>
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 animate-fade-in" style={{ animationDelay: '100ms' }}>
          Find your next role with <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500">AI precision</span>.
        </h1>
        <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 mb-10 max-w-2xl leading-relaxed animate-fade-in" style={{ animationDelay: '200ms' }}>
          Match your resume to the perfect jobs, track your applications, and land your dream career faster than ever before.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 animate-fade-in" style={{ animationDelay: '300ms' }}>
          <Link to="/dashboard" className="bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-base font-semibold rounded-xl px-8 py-4 shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2 group">
            Start matching now
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </main>

      {/* Feature grid */}
      <section className="bg-white dark:bg-[#111827] border-t border-slate-200 dark:border-slate-800 py-24 mt-auto">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-8">
          <div className="p-8 rounded-2xl bg-slate-50 dark:bg-[#0e1526] border border-slate-100 dark:border-slate-800/60 hover:-translate-y-1 hover:shadow-md transition-all duration-300">
            <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-6">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold mb-3">Smart Matching</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
              Our AI analyzes your resume and finds the exact jobs where your skills shine the brightest.
            </p>
          </div>
          <div className="p-8 rounded-2xl bg-slate-50 dark:bg-[#0e1526] border border-slate-100 dark:border-slate-800/60 hover:-translate-y-1 hover:shadow-md transition-all duration-300">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-6">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold mb-3">Instant Feedback</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
              Get immediate insights on why a job is a match and what skills you might need to highlight.
            </p>
          </div>
          <div className="p-8 rounded-2xl bg-slate-50 dark:bg-[#0e1526] border border-slate-100 dark:border-slate-800/60 hover:-translate-y-1 hover:shadow-md transition-all duration-300">
            <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-6">
              <Shield className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold mb-3">Privacy First</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
              Your data remains yours. We use secure on-device or private API endpoints to ensure confidentiality.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
