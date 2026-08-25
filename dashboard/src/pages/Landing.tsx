import React from "react";
import { Link } from "react-router-dom";
import { Briefcase, ArrowRight, Zap, Shield, Search, Lock, Eye, Trash2 } from "lucide-react";
import { motion } from "motion/react";
import { Tooltip } from "@base-ui/react";

export const Landing: React.FC = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: { type: "spring" as const, stiffness: 300, damping: 24 },
    },
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#090d16] text-slate-900 dark:text-slate-100 font-sans selection:bg-blue-500/30 flex flex-col">
      <Tooltip.Provider delay={300}>
        {/* Navbar */}
        <motion.nav
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-full p-6 flex justify-between items-center max-w-7xl mx-auto"
        >
          <div className="flex items-center gap-3">
            <Tooltip.Root>
              <Tooltip.Trigger className="cursor-default focus:outline-none">
                <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-sm shadow-blue-500/20 hover:scale-105 transition-transform">
                  <Briefcase className="w-5 h-5" />
                </div>
              </Tooltip.Trigger>
              <Tooltip.Portal>
                <Tooltip.Positioner sideOffset={8}>
                  <Tooltip.Popup className="bg-slate-800 text-slate-100 text-xs font-medium px-3 py-1.5 rounded-md shadow-xl animate-in fade-in zoom-in-95 data-ending-style:animate-out data-[ending-style]:fade-out data-ending-style:zoom-out-95">
                    Job Board Home
                    <Tooltip.Arrow className="fill-slate-800" />
                  </Tooltip.Popup>
                </Tooltip.Positioner>
              </Tooltip.Portal>
            </Tooltip.Root>
            <span className="text-xl font-bold tracking-tight">
              AI Job Board
            </span>
          </div>
          <div className="flex gap-4">
            <Link
              to="/login"
              className="text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white px-4 py-2 transition-colors"
            >
              Log in
            </Link>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/dashboard"
                className="bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-sm font-semibold rounded-lg px-5 py-2 shadow-sm transition-all duration-150"
              >
                Get Started
              </Link>
            </motion.div>
          </div>
        </motion.nav>

        {/* Hero Section */}
        <main className="flex-1 flex flex-col items-center justify-center text-center px-4 max-w-4xl mx-auto mt-20 mb-32">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800/50 text-blue-700 dark:text-blue-300 text-xs font-semibold uppercase tracking-wider mb-8"
          >
            <Zap className="w-3.5 h-3.5" />
            The future of job hunting
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold tracking-tight mb-6"
          >
            Find your next role with{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500">
              AI precision
            </span>
            .
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg md:text-xl text-slate-600 dark:text-slate-400 mb-10 max-w-2xl leading-relaxed"
          >
            Match your resume to the perfect jobs, track your applications, and
            land your dream career faster than ever before.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/dashboard"
                className="bg-blue-600 hover:bg-blue-700 text-white text-base font-semibold rounded-xl px-8 py-4 shadow-[0_0_40px_rgba(37,99,235,0.3)] hover:shadow-[0_0_60px_rgba(37,99,235,0.4)] transition-all duration-300 flex items-center justify-center gap-2 group"
              >
                Start matching now
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </motion.div>
        </main>

        {/* Feature grid */}
        <section className="bg-white dark:bg-[#111827] border-t border-slate-200 dark:border-slate-800 py-24 mt-auto overflow-hidden">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-8"
          >
            <motion.div
              variants={itemVariants}
              whileHover={{ y: -5 }}
              className="p-8 rounded-2xl bg-slate-50 dark:bg-[#0e1526] border border-slate-100 dark:border-slate-800/60 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-6">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold mb-3">Smart Matching</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                Our AI analyzes your resume and finds the exact jobs where your
                skills shine the brightest.
              </p>
            </motion.div>

            <motion.div
              variants={itemVariants}
              whileHover={{ y: -5 }}
              className="p-8 rounded-2xl bg-slate-50 dark:bg-[#0e1526] border border-slate-100 dark:border-slate-800/60 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-6">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold mb-3">Instant Feedback</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                Get immediate insights on why a job is a match and what skills
                you might need to highlight.
              </p>
            </motion.div>

            <motion.div
              variants={itemVariants}
              whileHover={{ y: -5 }}
              className="p-8 rounded-2xl bg-slate-50 dark:bg-[#0e1526] border border-slate-100 dark:border-slate-800/60 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-6">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold mb-3">Privacy First</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                Your data remains yours. We use secure on-device or private API
                endpoints to ensure confidentiality.
              </p>
            </motion.div>
          </motion.div>
        </section>

        {/* Privacy Policy Section */}
        <section className="bg-slate-50 dark:bg-[#090d16] border-t border-slate-200 dark:border-slate-800 py-24">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            className="max-w-7xl mx-auto px-6"
          >
            <motion.div variants={itemVariants} className="text-center mb-14">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 mb-5 mx-auto">
                <Shield className="w-6 h-6" />
              </div>
              <h2 className="text-3xl font-bold tracking-tight mb-3">Privacy at AI Job Board</h2>
              <p className="text-slate-600 dark:text-slate-400 max-w-xl mx-auto text-sm leading-relaxed">
                Your career data is sensitive. Here's our commitment to keeping it safe, transparent, and entirely yours.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-6 mb-10">
              <motion.div
                variants={itemVariants}
                className="p-6 rounded-2xl bg-white dark:bg-[#0e1526] border border-slate-100 dark:border-slate-800/60 shadow-sm"
              >
                <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4">
                  <Lock className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-slate-800 dark:text-slate-200 mb-2">Encrypted End-to-End</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                  All data in transit uses TLS 1.2+. Resume files and account data are encrypted at rest. Passwords are bcrypt-hashed — never stored in plain text.
                </p>
              </motion.div>

              <motion.div
                variants={itemVariants}
                className="p-6 rounded-2xl bg-white dark:bg-[#0e1526] border border-slate-100 dark:border-slate-800/60 shadow-sm"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4">
                  <Eye className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-slate-800 dark:text-slate-200 mb-2">No Selling, Ever</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                  We never sell your personal data or share it with advertisers. Your resume and job history exist only to power your search — nothing else.
                </p>
              </motion.div>

              <motion.div
                variants={itemVariants}
                className="p-6 rounded-2xl bg-white dark:bg-[#0e1526] border border-slate-100 dark:border-slate-800/60 shadow-sm"
              >
                <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-4">
                  <Trash2 className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-slate-800 dark:text-slate-200 mb-2">You're in Control</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                  Delete any resume, revoke access, or remove your account at any time. All personal data is purged within 14 days of account deletion.
                </p>
              </motion.div>
            </div>

            <motion.div variants={itemVariants} className="text-center">
              <Link
                to="/privacy"
                className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors group"
              >
                Read the full Privacy Policy
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </motion.div>
        </section>

        {/* Footer */}
        <footer className="bg-white dark:bg-[#0e1526] border-t border-slate-200 dark:border-slate-800 py-8">
          <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                <Briefcase className="w-4 h-4" />
              </div>
              <span className="text-sm font-bold tracking-tight">AI Job Board</span>
            </div>
            <p className="text-xs text-slate-400 dark:text-slate-500 text-center">
              &copy; {new Date().getFullYear()} AI Job Board. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <Link
                to="/privacy"
                className="text-xs text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                to="/login"
                className="text-xs text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                Sign In
              </Link>
            </div>
          </div>
        </footer>
      </Tooltip.Provider>
    </div>
  );
};
