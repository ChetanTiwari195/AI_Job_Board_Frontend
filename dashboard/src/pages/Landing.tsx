import React from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "motion/react";
import {
  ArrowRight,
  Search,
  Users,
  Star,
  MessageSquare,
  TrendingUp,
  Zap,
  ChevronRight,
  Globe,
  Moon,
  Sun,
  ExternalLink,
  Sparkles,
  Target,
  Sparkles,
  Target,
  Layers,
  Eye,
  Lock,
  Shield,
  GitBranch,
  Link2,
  Share2,
  Briefcase,
} from "lucide-react";

// ── Brand logo mark (hex + upward-curving arrow) ──────────────────────────
const LogoMark: React.FC<{ size?: number }> = ({ size = 36 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 100 100"
    fill="none"
    width={size}
    height={size}
    aria-hidden="true"
  >
    <polygon points="50,10 85,30 85,70 50,90 15,70 15,30" fill="#0A66C2" />
    <line
      x1="50"
      y1="30"
      x2="50"
      y2="70"
      stroke="white"
      strokeWidth="8"
      strokeLinecap="round"
    />
    <path
      d="M 34 36 L 34 54 A 16 16 0 0 0 50 70 A 16 16 0 0 0 66 54 A 16 16 0 0 0 50 38 L 48 38"
      stroke="white"
      strokeWidth="8"
      strokeLinecap="round"
      fill="none"
    />
  </svg>
);

// ── Theme toggle (standalone, no App.tsx dependency) ───────────────────────
const LandingThemeToggle: React.FC = () => {
  const [dark, setDark] = React.useState(
    () =>
      document.documentElement.classList.contains("dark") ||
      window.matchMedia("(prefers-color-scheme: dark)").matches,
  );

  const toggle = () => {
    const next = !dark;
    document.documentElement.classList.toggle("dark", next);
    setDark(next);
  };

  return (
    <button
      onClick={toggle}
      aria-label="Toggle theme"
      className="flex items-center justify-center w-9 h-9 rounded-full bg-[var(--bg-surface)] border border-[var(--lp-hairline)] cursor-pointer text-[var(--lp-ink-mute)] transition-colors duration-150 touch-manipulation hover:bg-[var(--bg-surface-hover)]"
    >
      {dark ? <Sun size={15} /> : <Moon size={15} />}
    </button>
  );
};

// ── Motion helpers ─────────────────────────────────────────────────────────
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] as const },
});

const fadeInView = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.15 },
  transition: { duration: 0.65, delay, ease: [0.16, 1, 0.3, 1] as const },
});

const stagger = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const staggerChild = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] as const },
  },
};

// ── Feature data ───────────────────────────────────────────────────────────
const FEATURES = [
  {
    icon: Search,
    title: "AI Job Search",
    body: "Semantic search across thousands of postings. Find roles that fit your skills, not just keywords.",
    warm: false,
  },
  {
    icon: Users,
    title: "Professional Network",
    body: "Connect with alumni, hiring managers, and peers — LinkedIn-style intelligence, minus the noise.",
    warm: true,
  },
  {
    icon: Star,
    title: "Glassdoor Reviews",
    body: "Real salary data and employer reviews aggregated so you negotiate from a position of knowledge.",
    warm: false,
  },
  {
    icon: MessageSquare,
    title: "Community Insights",
    body: "Reddit-style threads from people actually working at companies you're considering.",
    warm: true,
  },
  {
    icon: TrendingUp,
    title: "Resume Matching",
    body: "Upload your resume and get an instant match score for every job — backed by real AI.",
    warm: false,
  },
  {
    icon: Zap,
    title: "One-Click Apply",
    body: "Auto-fill applications with your saved profile. Track every submission from one dashboard.",
    warm: true,
  },
];

const STEPS = [
  {
    n: "01",
    title: "Upload your resume",
    body: "Drag-and-drop your resume PDF. Our AI parses skills, experience, and preferences in seconds.",
  },
  {
    n: "02",
    title: "Discover matched roles",
    body: "Get a curated feed of jobs ranked by how well they fit you — with an explanation for every match score.",
  },
  {
    n: "03",
    title: "Research & connect",
    body: "Read insider reviews, salary ranges, and community threads before you apply.",
  },
  {
    n: "04",
    title: "Apply with confidence",
    body: "One-click apply with your saved profile. Track every application from one place.",
  },
];

const STATS = [
  { label: "Jobs indexed", value: "2.4M+" },
  { label: "Company reviews", value: "890K+" },
  { label: "Active users", value: "48K" },
  { label: "Avg. match score", value: "91%" },
];

// ── Founders data ──────────────────────────────────────────────────────────
const FOUNDERS = [
  {
    name: "Chetanya Saini",
    role: "Co-Founder & CEO",
    bio: "Obsessed with the gap between talent and opportunity. Previously built ML pipelines at scale. Believes the job search is broken — and is fixing it one model at a time.",
    image: "/assets/founder1.jpg",
    links: {
      twitter: "#",
      linkedin: "#",
      github: "#",
    },
    accent: "from-blue-500/20 to-indigo-500/10",
    borderAccent: "border-blue-500/20",
  },
  {
    name: "Co-Founder",
    role: "Co-Founder & CTO",
    bio: "Full-stack engineer with a design eye. Spent years watching engineers struggle with ATS black boxes. Now building the transparency layer that job seekers deserve.",
    image: "/assets/founder2.jpg",
    links: {
      twitter: "#",
      linkedin: "#",
      github: "#",
    },
    accent: "from-violet-500/20 to-purple-500/10",
    borderAccent: "border-violet-500/20",
  },
];

// ── Vision pillars ─────────────────────────────────────────────────────────
const PILLARS = [
  {
    icon: Target,
    title: "Precision over volume",
    body: "The internet has too many job boards. We're building the one that actually surfaces the right role — not just a wall of postings.",
  },
  {
    icon: Layers,
    title: "Context, not just listings",
    body: "Salary data, team culture, real employee sentiment, and network paths to the hiring manager — all in one place.",
  },
  {
    icon: Eye,
    title: "Radical transparency",
    body: "Every AI score comes with an explanation. We don't hide the algorithm. You always know why a role ranked the way it did.",
  },
  {
    icon: Sparkles,
    title: "AI that works for you",
    body: "Not spray-and-pray. Intelligent match scoring, auto-tailored applications, and insights that compound over time.",
  },
];

// ── Product features for extension card ───────────────────────────────────
const EXTENSION_FEATURES = [
  "Match your resume against any job in one click",
  "Auto-extract requirements from any posting",
  "Works on LinkedIn, Indeed, Greenhouse, Lever & more",
  "Zero data stored — privacy-first architecture",
];

// ── Nav ─────────────────────────────────────────────────────────────────────
const Nav: React.FC = () => {
  const [scrolled, setScrolled] = React.useState(false);
  React.useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 h-[68px] flex items-center transition-all duration-250 ${
        scrolled
          ? "bg-[color-mix(in_srgb,var(--lp-bg)_92%,transparent)] backdrop-blur-md border-b border-[var(--lp-hairline)]"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="max-w-[1200px] mx-auto w-full px-6 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 no-underline">
          <LogoMark size={36} />
          <span className="text-base font-normal text-[var(--lp-ink)] tracking-tight">
            <span style={{ color: "#0A66C2", fontWeight: 600 }}>Link</span>bay
          </span>
        </Link>

        <nav
          className="hidden md:flex items-center gap-8"
          aria-label="Primary navigation"
        >
          {[
            { id: "features", label: "Features" },
            { id: "how-it-works", label: "How it works" },
            { id: "about", label: "About" },
            { id: "founders", label: "Founders" },
            { id: "products", label: "Products" },
          ].map(({ id, label }) => (
            <a
              key={id}
              href={`#${id}`}
              className="text-sm font-light text-[var(--lp-ink-mute)] no-underline transition-colors duration-150 hover:text-[var(--lp-ink)]"
            >
              {label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2.5">
          <LandingThemeToggle />
          <Link
            to="/login"
            className="text-sm font-normal text-[var(--lp-ink)] no-underline py-2 px-3.5"
          >
            Sign in
          </Link>
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Link
              to="/login"
              id="nav-get-started"
              className="btn-primary text-sm"
            >
              Get started
            </Link>
          </motion.div>
        </div>
      </div>
    </motion.header>
  );
};

// ── Hero ─────────────────────────────────────────────────────────────────────
const Hero: React.FC = () => {
  const reduce = useReducedMotion();
  return (
    <section
      id="hero"
      className="min-h-[100dvh] flex flex-col items-center justify-center relative overflow-hidden pt-[68px] bg-[var(--lp-bg)]"
    >
      {/* Gradient mesh */}
      <div
        aria-hidden="true"
        className="absolute inset-0 z-0 bg-[var(--lp-hero-bg)]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 z-10 bg-[linear-gradient(rgba(83,58,253,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(83,58,253,0.04)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_0%,black_0%,transparent_100%)]"
      />

      <div className="max-w-[1200px] mx-auto px-6 w-full relative z-20 text-center">
        <motion.div
          {...(reduce ? {} : fadeUp(0.05))}
          className="inline-flex items-center gap-1.5 py-1 px-3 bg-[var(--s-primary-sub,var(--primary-border))] rounded-full mb-8"
        >
          <Globe size={11} color="#4434d4" />
          <span className="text-[10px] font-normal text-[#4434d4] tracking-wide uppercase">
            The all-in-one career platform
          </span>
        </motion.div>

        <motion.h1
          {...(reduce ? {} : fadeUp(0.1))}
          className="text-[clamp(36px,6vw,56px)] font-light leading-[1.03] tracking-[-1.4px] text-[var(--lp-ink)] mb-6 max-w-[800px] mx-auto [font-feature-settings:'ss01']"
        >
          Job search, networking,
          <br />
          and reviews —{" "}
          <span className="text-[var(--primary)]">under one roof.</span>
        </motion.h1>

        <motion.p
          {...(reduce ? {} : fadeUp(0.18))}
          className="text-base font-light leading-relaxed text-[var(--lp-ink-2)] mb-10 max-w-[560px] mx-auto"
        >
          Our aim is to create a dashboard like LinkedIn clubbing job search,
          networking, Glassdoor reviews, Reddit community insights — all under
          one roof.
        </motion.p>

        <motion.div
          {...(reduce ? {} : fadeUp(0.25))}
          className="flex gap-3 justify-center flex-wrap"
        >
          <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
            <Link
              to="/login"
              id="hero-start"
              className="btn-primary text-base py-3 px-7"
            >
              Start for free <ArrowRight size={16} />
            </Link>
          </motion.div>
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <a
              href="#features"
              className="btn-secondary text-base py-3 px-7 text-[var(--primary)] border-[var(--primary)]"
            >
              See features
            </a>
          </motion.div>
        </motion.div>

        <motion.div
          {...(reduce ? {} : fadeUp(0.35))}
          className="mt-16 flex flex-col items-center gap-4"
        >
          <span className="text-xs font-light text-[var(--lp-ink-mute)] tracking-[0.5px]">
            Aggregates insights from
          </span>
          <div className="flex items-center gap-8 flex-wrap justify-center">
            {["LinkedIn", "Glassdoor", "Reddit", "Indeed", "Levels.fyi"].map(
              (name) => (
                <span
                  key={name}
                  className="text-sm font-normal text-[var(--lp-ink-mute)] tracking-tight opacity-75"
                >
                  {name}
                </span>
              ),
            )}
          </div>
        </motion.div>
      </div>

      <div
        aria-hidden="true"
        className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-b from-transparent to-[var(--lp-bg)] z-30"
      />
    </section>
  );
};

// ── Features ─────────────────────────────────────────────────────────────────
const Features: React.FC = () => {
  const reduce = useReducedMotion();
  return (
    <section id="features" className="bg-[var(--lp-canvas-soft)] py-24 px-6">
      <div className="max-w-[1200px] mx-auto">
        <div className="mb-14 max-w-[560px]">
          <motion.h2
            {...(reduce
              ? {}
              : {
                  initial: { opacity: 0, y: 20 },
                  whileInView: { opacity: 1, y: 0 },
                  viewport: { once: true },
                  transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
                })}
            className="text-[32px] font-light text-[var(--lp-ink)] tracking-tight leading-[1.1] mb-4 [font-feature-settings:'ss01']"
          >
            Everything you need
            <br />
            to land your next role.
          </motion.h2>
          <motion.p
            {...(reduce
              ? {}
              : {
                  initial: { opacity: 0, y: 16 },
                  whileInView: { opacity: 1, y: 0 },
                  viewport: { once: true },
                  transition: { duration: 0.6, delay: 0.08 },
                })}
            className="text-[15px] font-light text-[var(--lp-ink-2)] leading-relaxed"
          >
            We've pulled the best of every career platform into a single,
            intelligent dashboard. No more switching tabs.
          </motion.p>
        </div>

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
          className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-4"
        >
          {FEATURES.map((f, i) => (
            <motion.article
              key={f.title}
              variants={staggerChild}
              whileHover={reduce ? {} : { y: -4 }}
              className={`border border-[var(--lp-hairline)] rounded-xl p-8 shadow-[var(--s-shadow-1)] transition-all duration-200 ${i % 2 === 0 ? "bg-[var(--lp-bg)]" : "bg-[var(--lp-canvas-cream)]"}`}
            >
              <div className="w-10 h-10 rounded-xl bg-blue-600/10 flex items-center justify-center mb-5">
                <f.icon size={20} className="text-[var(--primary)]" />
              </div>
              <h3 className="text-lg font-light text-[var(--lp-ink)] tracking-tight mb-2 [font-feature-settings:'ss01']">
                {f.title}
              </h3>
              <p className="text-sm font-light text-[var(--lp-ink-mute)] leading-relaxed m-0">
                {f.body}
              </p>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

// ── Value prop ────────────────────────────────────────────────────────────────
const ValueProp: React.FC = () => {
  const reduce = useReducedMotion();
  return (
    <section className="bg-[var(--lp-canvas-cream)] py-24 px-6">
      <div className="max-w-[1200px] mx-auto grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-16 items-center">
        <motion.div
          {...(reduce
            ? {}
            : {
                initial: { opacity: 0, x: -24 },
                whileInView: { opacity: 1, x: 0 },
                viewport: { once: true },
                transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
              })}
        >
          <h2 className="text-[32px] font-light text-[var(--lp-ink)] tracking-tight leading-[1.1] mb-5 [font-feature-settings:'ss01']">
            Stop piecing together the picture from five different apps.
          </h2>
          <p className="text-[15px] font-light text-[var(--lp-ink-2)] leading-[1.7] mb-8">
            LinkedIn for networking. Glassdoor for reviews. Reddit for real
            talk. Indeed for listings. We bring all of it into a single
            intelligent surface — informed, connected, and fast.
          </p>
          <motion.div
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="inline-block"
          >
            <Link
              to="/login"
              id="valueprop-cta"
              className="btn-primary text-sm"
            >
              Try the dashboard <ChevronRight size={14} />
            </Link>
          </motion.div>
        </motion.div>

        <motion.div
          {...(reduce
            ? {}
            : {
                initial: { opacity: 0, x: 24 },
                whileInView: { opacity: 1, x: 0 },
                viewport: { once: true },
                transition: { duration: 0.7, delay: 0.1 },
              })}
          className="grid grid-cols-2 gap-3"
        >
          {STATS.map((s) => (
            <div
              key={s.label}
              className="bg-white/55 border border-white/70 rounded-xl py-6 px-5 backdrop-blur-sm"
            >
              <div className="tnum text-[26px] font-light text-[var(--lp-ink)] mb-1">
                {s.value}
              </div>
              <div className="text-xs font-light text-[var(--lp-ink-mute)]">
                {s.label}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

// ── How it works ──────────────────────────────────────────────────────────────
const HowItWorks: React.FC = () => {
  const reduce = useReducedMotion();
  return (
    <section id="how-it-works" className="bg-[var(--lp-bg)] py-24 px-6">
      <div className="max-w-[1200px] mx-auto">
        <div className="text-center mb-16">
          <motion.h2
            {...(reduce
              ? {}
              : {
                  initial: { opacity: 0, y: 20 },
                  whileInView: { opacity: 1, y: 0 },
                  viewport: { once: true },
                  transition: { duration: 0.6 },
                })}
            className="text-[32px] font-light text-[var(--lp-ink)] tracking-tight mb-3 [font-feature-settings:'ss01']"
          >
            Up and running in minutes.
          </motion.h2>
          <motion.p
            {...(reduce
              ? {}
              : {
                  initial: { opacity: 0, y: 16 },
                  whileInView: { opacity: 1, y: 0 },
                  viewport: { once: true },
                  transition: { duration: 0.6, delay: 0.08 },
                })}
            className="text-[15px] font-light text-[var(--lp-ink-mute)] max-w-[400px] mx-auto m-0"
          >
            Four steps from signup to your first matched job.
          </motion.p>
        </div>

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
          className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))]"
        >
          {STEPS.map((step, i) => (
            <motion.div
              key={step.n}
              variants={staggerChild}
              className={`py-8 px-6 ${i > 0 ? "border-l border-[var(--lp-hairline)]" : "border-none"}`}
            >
              <div className="tnum text-[11px] font-normal text-[var(--primary-border)] tracking-wide uppercase mb-4">
                {step.n}
              </div>
              <h3 className="text-lg font-light text-[var(--lp-ink)] tracking-tight mb-2.5 [font-feature-settings:'ss01']">
                {step.title}
              </h3>
              <p className="text-sm font-light text-[var(--lp-ink-mute)] leading-relaxed m-0">
                {step.body}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

// ── About ─────────────────────────────────────────────────────────────────────
const About: React.FC = () => {
  const reduce = useReducedMotion();
  return (
    <section
      id="about"
      className="bg-[var(--lp-canvas-soft)] py-32 px-6 relative overflow-hidden"
    >
      {/* Subtle background orb */}
      <div
        aria-hidden="true"
        className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(37,99,235,0.06)_0%,transparent_70%)] pointer-events-none"
      />

      <div className="max-w-[1200px] mx-auto relative z-10">
        {/* Section header */}
        <div className="max-w-[640px] mb-20">
          <motion.div
            {...(reduce ? {} : fadeInView(0))}
            className="inline-flex items-center gap-1.5 py-1 px-3 bg-[var(--primary-subtle)] border border-[var(--primary-border)] rounded-full mb-6"
          >
            <span className="text-[10px] font-medium text-[var(--primary)] tracking-widest uppercase">
              Our Vision
            </span>
          </motion.div>
          <motion.h2
            {...(reduce ? {} : fadeInView(0.05))}
            className="text-[clamp(28px,4vw,42px)] font-light text-[var(--lp-ink)] tracking-tight leading-[1.1] mb-6 [font-feature-settings:'ss01']"
          >
            The job market is broken.
            <br />
            <span className="text-[var(--primary)]">We're rebuilding it.</span>
          </motion.h2>
          <motion.p
            {...(reduce ? {} : fadeInView(0.1))}
            className="text-[16px] font-light text-[var(--lp-ink-2)] leading-[1.75]"
          >
            Every year, millions of qualified candidates get filtered out by ATS
            systems that can't read context. Every year, companies miss
            incredible talent because job boards trade in keywords, not humans.
            We started Linkbay because we lived this frustration — and because
            we knew AI could do better.
          </motion.p>
        </div>

        {/* Pillars bento — 2×2 dense grid */}
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-20"
        >
          {PILLARS.map((p) => (
            <motion.div
              key={p.title}
              variants={staggerChild}
              whileHover={reduce ? {} : { y: -3 }}
              className="group relative bg-[var(--lp-bg)] border border-[var(--lp-hairline)] rounded-2xl p-8 transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] hover:border-[var(--primary-border)] hover:shadow-[0_8px_32px_rgba(37,99,235,0.08)]"
            >
              {/* Inner accent glow on hover */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              <div className="w-11 h-11 rounded-xl bg-[var(--primary-subtle)] border border-[var(--primary-border)] flex items-center justify-center mb-5 relative z-10">
                <p.icon
                  size={20}
                  className="text-[var(--primary)]"
                  strokeWidth={1.5}
                />
              </div>
              <h3 className="text-[17px] font-normal text-[var(--lp-ink)] tracking-tight mb-3 relative z-10 [font-feature-settings:'ss01']">
                {p.title}
              </h3>
              <p className="text-sm font-light text-[var(--lp-ink-mute)] leading-relaxed m-0 relative z-10">
                {p.body}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Manifesto strip */}
        <motion.div
          {...(reduce ? {} : fadeInView(0.1))}
          className="relative rounded-2xl overflow-hidden"
        >
          {/* Outer bezel shell */}
          <div className="p-[1px] rounded-2xl bg-gradient-to-br from-[var(--primary-border)] via-[var(--lp-hairline)] to-[var(--lp-hairline)]">
            <div className="bg-[var(--lp-bg)] rounded-[calc(1rem-1px)] px-10 py-12 md:px-16 md:py-14">
              <div className="max-w-[720px]">
                <p className="text-[clamp(18px,2.5vw,26px)] font-light text-[var(--lp-ink)] leading-[1.55] tracking-tight [font-feature-settings:'ss01'] mb-8">
                  "We're not building another job board. We're building the
                  career intelligence layer that every professional deserves —
                  where your next opportunity finds{" "}
                  <em className="not-italic text-[var(--primary)]">you</em>,
                  informed and ready."
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-[1px] bg-[var(--lp-hairline)]" />
                  <span className="text-sm font-light text-[var(--lp-ink-mute)]">
                    The Linkbay team
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Future undertakings */}
        <motion.div {...(reduce ? {} : fadeInView(0.05))} className="mt-20">
          <h3 className="text-sm font-medium text-[var(--lp-ink-mute)] uppercase tracking-widest mb-8">
            On the roadmap
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              {
                title: "AI Interview Coach",
                desc: "Real-time mock interviews with role-specific question banks and instant feedback.",
                soon: true,
              },
              {
                title: "Salary Negotiation AI",
                desc: "Know your exact market value before you negotiate — data from 890K+ verified offers.",
                soon: true,
              },
              {
                title: "Company Intelligence",
                desc: "Deep-dive org charts, funding stage alerts, and hiring velocity signals for target companies.",
                soon: false,
              },
            ].map((item) => (
              <div
                key={item.title}
                className="bg-[var(--lp-bg)] border border-[var(--lp-hairline)] rounded-xl p-6"
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <h4 className="text-[15px] font-normal text-[var(--lp-ink)] tracking-tight [font-feature-settings:'ss01']">
                    {item.title}
                  </h4>
                  <span className="shrink-0 text-[10px] font-medium text-[var(--primary)] bg-[var(--primary-subtle)] border border-[var(--primary-border)] px-2 py-0.5 rounded-full uppercase tracking-wider">
                    {item.soon ? "Soon" : "2026"}
                  </span>
                </div>
                <p className="text-[13px] font-light text-[var(--lp-ink-mute)] leading-relaxed m-0">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

// ── Founders ──────────────────────────────────────────────────────────────────
const Founders: React.FC = () => {
  const reduce = useReducedMotion();
  return (
    <section
      id="founders"
      className="bg-[var(--lp-bg)] py-32 px-6 relative overflow-hidden"
    >
      {/* Background gradient mesh */}
      <div
        aria-hidden="true"
        className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(139,92,246,0.05)_0%,transparent_70%)] pointer-events-none"
      />

      <div className="max-w-[1200px] mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-20">
          <motion.div
            {...(reduce ? {} : fadeInView(0))}
            className="inline-flex items-center gap-1.5 py-1 px-3 bg-[var(--primary-subtle)] border border-[var(--primary-border)] rounded-full mb-6"
          >
            <span className="text-[10px] font-medium text-[var(--primary)] tracking-widest uppercase">
              The Team
            </span>
          </motion.div>
          <motion.h2
            {...(reduce ? {} : fadeInView(0.05))}
            className="text-[clamp(28px,4vw,42px)] font-light text-[var(--lp-ink)] tracking-tight leading-[1.1] [font-feature-settings:'ss01']"
          >
            Built by people who felt the pain.
          </motion.h2>
          <motion.p
            {...(reduce ? {} : fadeInView(0.1))}
            className="text-[15px] font-light text-[var(--lp-ink-2)] mt-4 max-w-[480px] mx-auto leading-relaxed"
          >
            Two engineers who spent too many hours on job boards that didn't
            understand them — and decided to build one that does.
          </motion.p>
        </div>

        {/* Founder cards — double-bezel architecture */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-[880px] mx-auto">
          {FOUNDERS.map((founder, i) => (
            <motion.div
              key={founder.name}
              {...(reduce
                ? {}
                : {
                    initial: { opacity: 0, y: 32 },
                    whileInView: { opacity: 1, y: 0 },
                    viewport: { once: true, amount: 0.2 },
                    transition: {
                      duration: 0.7,
                      delay: i * 0.12,
                      ease: [0.16, 1, 0.3, 1],
                    },
                  })}
              whileHover={reduce ? {} : { y: -6 }}
              className="group"
            >
              {/* Outer bezel shell */}
              <div
                className={`p-[1.5px] rounded-[1.75rem] bg-gradient-to-b from-[var(--lp-hairline)] to-transparent transition-all duration-500 group-hover:from-[var(--primary-border)]`}
              >
                {/* Inner core */}
                <div className="bg-[var(--lp-bg)] rounded-[calc(1.75rem-1.5px)] overflow-hidden shadow-[inset_0_1px_1px_rgba(255,255,255,0.06)]">
                  {/* Image area — full bleed */}
                  <div className="relative h-72 overflow-hidden bg-[var(--bg-surface)]">
                    <img
                      src={founder.image}
                      alt={`${founder.name} — ${founder.role}`}
                      className="w-full h-full object-cover object-center transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-105"
                      onError={(e) => {
                        // Graceful fallback if image not yet added
                        const target = e.currentTarget;
                        target.style.display = "none";
                        const parent = target.parentElement;
                        if (parent && !parent.querySelector(".img-fallback")) {
                          const fb = document.createElement("div");
                          fb.className =
                            "img-fallback w-full h-full flex items-center justify-center";
                          fb.innerHTML = `<div style="width:80px;height:80px;border-radius:50%;background:var(--primary-subtle);border:1px solid var(--primary-border);display:flex;align-items:center;justify-content:center;font-size:28px;font-weight:300;color:var(--primary)">${founder.name.charAt(0)}</div>`;
                          parent.appendChild(fb);
                        }
                      }}
                    />
                    {/* Gradient overlay at bottom */}
                    <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[var(--lp-bg)] to-transparent" />
                  </div>

                  {/* Card body */}
                  <div className="px-8 pb-8 pt-4">
                    <div className="mb-1">
                      <h3 className="text-[20px] font-normal text-[var(--lp-ink)] tracking-tight [font-feature-settings:'ss01']">
                        {founder.name}
                      </h3>
                      <p className="text-[13px] font-medium text-[var(--primary)] tracking-wide mt-0.5">
                        {founder.role}
                      </p>
                    </div>

                    <p className="text-[14px] font-light text-[var(--lp-ink-2)] leading-[1.7] mt-4 mb-6">
                      {founder.bio}
                    </p>

                    {/* Social links */}
                    <div className="flex items-center gap-2">
                      {[
                        {
                          href: founder.links.twitter,
                          icon: Share2,
                          label: "Twitter",
                        },
                        {
                          href: founder.links.linkedin,
                          icon: Link2,
                          label: "LinkedIn",
                        },
                        {
                          href: founder.links.github,
                          icon: GitBranch,
                          label: "GitHub",
                        },
                      ].map(({ href, icon: Icon, label }) => (
                        <a
                          key={label}
                          href={href}
                          aria-label={label}
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-[var(--lp-ink-mute)] border border-[var(--lp-hairline)] bg-[var(--bg-surface)] transition-all duration-200 hover:text-[var(--primary)] hover:border-[var(--primary-border)] hover:bg-[var(--primary-subtle)]"
                        >
                          <Icon size={14} strokeWidth={1.5} />
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Tagline strip */}
        <motion.p
          {...(reduce ? {} : fadeInView(0.05))}
          className="text-center text-sm font-light text-[var(--lp-ink-mute)] mt-16 max-w-[440px] mx-auto leading-relaxed"
        >
          We're a small, focused team. If you share the obsession,{" "}
          <a
            href="mailto:hello@aijobboard.io"
            className="text-[var(--primary)] no-underline hover:underline"
          >
            reach out
          </a>
          .
        </motion.p>
      </div>
    </section>
  );
};

// ── Products ──────────────────────────────────────────────────────────────────
const Products: React.FC = () => {
  const reduce = useReducedMotion();
  return (
    <section
      id="products"
      className="bg-[var(--lp-canvas-soft)] py-32 px-6 relative overflow-hidden"
    >
      <div
        aria-hidden="true"
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(37,99,235,0.04)_0%,transparent_70%)] pointer-events-none"
      />

      <div className="max-w-[1200px] mx-auto relative z-10">
        {/* Header */}
        <div className="mb-16">
          <motion.div
            {...(reduce ? {} : fadeInView(0))}
            className="inline-flex items-center gap-1.5 py-1 px-3 bg-[var(--primary-subtle)] border border-[var(--primary-border)] rounded-full mb-6"
          >
            <span className="text-[10px] font-medium text-[var(--primary)] tracking-widest uppercase">
              Products
            </span>
          </motion.div>
          <motion.h2
            {...(reduce ? {} : fadeInView(0.05))}
            className="text-[clamp(28px,4vw,42px)] font-light text-[var(--lp-ink)] tracking-tight leading-[1.1] max-w-[560px] [font-feature-settings:'ss01']"
          >
            Tools built for the
            <br />
            modern job seeker.
          </motion.h2>
          <motion.p
            {...(reduce ? {} : fadeInView(0.1))}
            className="text-[15px] font-light text-[var(--lp-ink-2)] mt-4 max-w-[480px] leading-relaxed"
          >
            Beyond the dashboard, we're shipping browser-native tools that work
            where you already spend your time.
          </motion.p>
        </div>

        {/* Extension card — full-width Stripe-style feature card */}
        <motion.div
          {...(reduce
            ? {}
            : {
                initial: { opacity: 0, y: 36 },
                whileInView: { opacity: 1, y: 0 },
                viewport: { once: true, amount: 0.15 },
                transition: { duration: 0.75, ease: [0.16, 1, 0.3, 1] },
              })}
          className="group"
        >
          {/* Outer bezel */}
          <div className="p-[1.5px] rounded-[2rem] bg-gradient-to-br from-[var(--primary-border)] via-[var(--lp-hairline)] to-[var(--lp-hairline)] transition-all duration-500 group-hover:from-[rgba(37,99,235,0.4)]">
            <div className="bg-[var(--lp-bg)] rounded-[calc(2rem-1.5px)] overflow-hidden shadow-[inset_0_1px_1px_rgba(255,255,255,0.04)]">
              <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[480px]">
                {/* Left — text content */}
                <div className="flex flex-col justify-center px-10 py-14 md:px-14">
                  {/* Extension badge */}
                  <div className="inline-flex items-center gap-2 self-start mb-6 px-3 py-1.5 rounded-full bg-[var(--primary-subtle)] border border-[var(--primary-border)]">
                    <ExternalLink
                      size={13}
                      className="text-[var(--primary)]"
                      strokeWidth={1.5}
                    />
                    <span className="text-[11px] font-medium text-[var(--primary)] tracking-wide">
                      Chrome Extension
                    </span>
                    <span className="text-[10px] font-medium text-[var(--primary-border)] bg-[var(--primary)] px-1.5 py-0.5 rounded-full">
                      Free
                    </span>
                  </div>

                  <h3 className="text-[clamp(22px,3vw,32px)] font-light text-[var(--lp-ink)] tracking-tight leading-[1.15] mb-4 [font-feature-settings:'ss01']">
                    Resume Match Extension
                  </h3>
                  <p className="text-[15px] font-light text-[var(--lp-ink-2)] leading-[1.7] mb-8 max-w-[420px]">
                    Install once. Then, on any job page, press the button and
                    get an instant AI-powered match score between your resume
                    and that role — with a breakdown of every gap and strength.
                  </p>

                  {/* Feature list */}
                  <ul className="space-y-3 mb-10">
                    {EXTENSION_FEATURES.map((feat) => (
                      <li key={feat} className="flex items-start gap-2.5">
                        <div className="w-4 h-4 rounded-full bg-[var(--primary-subtle)] border border-[var(--primary-border)] flex items-center justify-center shrink-0 mt-0.5">
                          <div className="w-1.5 h-1.5 rounded-full bg-[var(--primary)]" />
                        </div>
                        <span className="text-[13px] font-light text-[var(--lp-ink-2)] leading-snug">
                          {feat}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA cluster */}
                  <div className="flex flex-wrap items-center gap-3">
                    <motion.div
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      <a
                        href="#"
                        id="ext-install-cta"
                        className="btn-primary text-sm"
                      >
                        <ExternalLink size={14} />
                        Add to Chrome — Free
                      </a>
                    </motion.div>
                    <a
                      href="#"
                      className="text-sm font-light text-[var(--lp-ink-mute)] no-underline hover:text-[var(--primary)] transition-colors duration-150"
                    >
                      View source on GitHub →
                    </a>
                  </div>
                </div>

                {/* Right — image showcase */}
                <div className="relative bg-[var(--bg-surface)] lg:rounded-r-[calc(2rem-1.5px)] overflow-hidden min-h-[320px] lg:min-h-0">
                  {/* Primary screenshot */}
                  <img
                    src="/assets/extension-preview.png"
                    alt="Resume Match Extension in action"
                    className="absolute inset-0 w-full h-full object-cover object-left-top transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-[1.03]"
                    onError={(e) => {
                      const target = e.currentTarget;
                      target.style.display = "none";
                      const parent = target.parentElement;
                      if (parent && !parent.querySelector(".ext-fallback")) {
                        const fb = document.createElement("div");
                        fb.className =
                          "ext-fallback absolute inset-0 flex flex-col items-center justify-center gap-4";
                        fb.innerHTML = `
                          <div style="width:64px;height:64px;border-radius:16px;background:var(--primary-subtle);border:1px solid var(--primary-border);display:flex;align-items:center;justify-content:center;">
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="4"/><line x1="21.17" y1="8" x2="12" y2="8"/><line x1="3.95" y1="6.06" x2="8.54" y2="14"/><line x1="10.88" y1="21.94" x2="15.46" y2="14"/></svg>
                          </div>
                          <p style="font-size:13px;font-weight:300;color:var(--text-muted);text-align:center;max-width:200px;line-height:1.5;">Drop extension-preview.png in public/assets/ to show a screenshot here</p>
                        `;
                        parent.appendChild(fb);
                      }
                    }}
                  />

                  {/* Decorative grid overlay */}
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-[linear-gradient(rgba(37,99,235,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(37,99,235,0.03)_1px,transparent_1px)] bg-[size:32px_32px] opacity-60 pointer-events-none"
                  />
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* "More coming" teaser */}
        <motion.div
          {...(reduce ? {} : fadeInView(0.05))}
          className="mt-8 text-center"
        >
          <p className="text-sm font-light text-[var(--lp-ink-mute)]">
            More products in development —{" "}
            <a
              href="#"
              className="text-[var(--primary)] no-underline hover:underline"
            >
              join the waitlist
            </a>
            .
          </p>
        </motion.div>
      </div>
    </section>
  );
};

// ── CTA Band ──────────────────────────────────────────────────────────────────
const CTABand: React.FC = () => {
  const reduce = useReducedMotion();
  return (
    <section className="bg-[#1c1e54] py-24 px-6 relative overflow-hidden">
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(ellipse_60%_80%_at_90%_50%,rgba(37,99,235,0.25)_0%,transparent_60%),radial-gradient(ellipse_50%_60%_at_10%_50%,rgba(249,107,238,0.15)_0%,transparent_60%)]"
      />
      <div className="max-w-[760px] mx-auto text-center relative z-10">
        <motion.h2
          {...(reduce
            ? {}
            : {
                initial: { opacity: 0, y: 24 },
                whileInView: { opacity: 1, y: 0 },
                viewport: { once: true },
                transition: { duration: 0.7 },
              })}
          className="text-[40px] font-light text-white tracking-[-0.96px] leading-[1.1] mb-4 [font-feature-settings:'ss01']"
        >
          Your next career move starts here.
        </motion.h2>
        <motion.p
          {...(reduce
            ? {}
            : {
                initial: { opacity: 0, y: 16 },
                whileInView: { opacity: 1, y: 0 },
                viewport: { once: true },
                transition: { duration: 0.6, delay: 0.1 },
              })}
          className="text-[15px] font-light text-white/65 mb-10 leading-relaxed max-w-xl mx-auto"
        >
          Join thousands of professionals using Linkbay to find roles faster,
          research smarter, and network better.
        </motion.p>
        <motion.div
          {...(reduce
            ? {}
            : {
                initial: { opacity: 0, y: 16 },
                whileInView: { opacity: 1, y: 0 },
                viewport: { once: true },
                transition: { duration: 0.6, delay: 0.18 },
              })}
          className="flex gap-3 justify-center flex-wrap"
        >
          <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
            <Link
              to="/login"
              id="cta-band-primary"
              className="btn-primary text-base py-3 px-7"
            >
              Get started free <ArrowRight size={16} />
            </Link>
          </motion.div>
          <Link
            to="/login"
            className="inline-flex items-center gap-1.5 text-base font-normal text-white/75 bg-white/10 border border-white/15 rounded-full py-3 px-7 no-underline transition-colors duration-150 hover:bg-white/15"
          >
            Sign in
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

// ── Privacy Section ─────────────────────────────────────────────────────────────
const PrivacySection: React.FC = () => {
  const reduce = useReducedMotion();
  return (
    <section className="bg-[var(--lp-canvas-cream)] py-24 px-6 relative overflow-hidden border-t border-[var(--lp-hairline)]">
      <div className="max-w-[1200px] mx-auto text-center relative z-10">
        <motion.div
          {...(reduce ? {} : fadeInView(0))}
          className="inline-flex items-center gap-1.5 py-1 px-3 bg-[var(--primary-subtle)] border border-[var(--primary-border)] rounded-full mb-6"
        >
          <Shield size={11} className="text-[var(--primary)]" />
          <span className="text-[10px] font-medium text-[var(--primary)] tracking-widest uppercase">
            Privacy First
          </span>
        </motion.div>
        
        <motion.h2
          {...(reduce ? {} : fadeInView(0.05))}
          className="text-[clamp(28px,4vw,42px)] font-light text-[var(--lp-ink)] tracking-tight leading-[1.1] mb-5 max-w-[560px] mx-auto [font-feature-settings:'ss01']"
        >
          Your career data is sensitive.
        </motion.h2>
        
        <motion.p
          {...(reduce ? {} : fadeInView(0.1))}
          className="text-[15px] font-light text-[var(--lp-ink-2)] mb-12 leading-relaxed max-w-[600px] mx-auto"
        >
          We're committed to keeping it safe, transparent, and entirely yours. We never sell your personal data or share it with advertisers.
        </motion.p>
        
        <div className="grid md:grid-cols-3 gap-6 mb-12 text-left">
          <motion.div
            {...(reduce ? {} : fadeInView(0.15))}
            className="p-8 rounded-2xl bg-[var(--lp-bg)] border border-[var(--lp-hairline)] shadow-[var(--s-shadow-1)]"
          >
            <div className="w-10 h-10 rounded-xl bg-[var(--primary-subtle)] flex items-center justify-center mb-5">
              <Lock size={18} className="text-[var(--primary)]" />
            </div>
            <h3 className="text-lg font-light text-[var(--lp-ink)] mb-2 tracking-tight">Encrypted End-to-End</h3>
            <p className="text-[13px] font-light text-[var(--lp-ink-mute)] leading-relaxed m-0">
              All data in transit uses TLS 1.2+. Resume files and account data are encrypted at rest. Passwords are never stored in plain text.
            </p>
          </motion.div>
          
          <motion.div
            {...(reduce ? {} : fadeInView(0.2))}
            className="p-8 rounded-2xl bg-[var(--lp-bg)] border border-[var(--lp-hairline)] shadow-[var(--s-shadow-1)]"
          >
            <div className="w-10 h-10 rounded-xl bg-[var(--primary-subtle)] flex items-center justify-center mb-5">
              <Eye size={18} className="text-[var(--primary)]" />
            </div>
            <h3 className="text-lg font-light text-[var(--lp-ink)] mb-2 tracking-tight">No Selling, Ever</h3>
            <p className="text-[13px] font-light text-[var(--lp-ink-mute)] leading-relaxed m-0">
              Your resume and job history exist only to power your search. We never use your data to build behavioral profiles for external purposes.
            </p>
          </motion.div>
          
          <motion.div
            {...(reduce ? {} : fadeInView(0.25))}
            className="p-8 rounded-2xl bg-[var(--lp-bg)] border border-[var(--lp-hairline)] shadow-[var(--s-shadow-1)]"
          >
            <div className="w-10 h-10 rounded-xl bg-[var(--primary-subtle)] flex items-center justify-center mb-5">
              <Shield size={18} className="text-[var(--primary)]" />
            </div>
            <h3 className="text-lg font-light text-[var(--lp-ink)] mb-2 tracking-tight">You're in Control</h3>
            <p className="text-[13px] font-light text-[var(--lp-ink-mute)] leading-relaxed m-0">
              Delete any resume, revoke access, or remove your account at any time. All personal data is purged within 14 days of account deletion.
            </p>
          </motion.div>
        </div>

        <motion.div {...(reduce ? {} : fadeInView(0.3))} className="inline-block">
          <Link
            to="/privacy"
            className="inline-flex items-center gap-2 text-sm font-light text-[var(--primary)] hover:text-[var(--primary-hover)] transition-colors group no-underline"
          >
            Read the full Privacy Policy
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

// ── Footer ────────────────────────────────────────────────────────────────────
const Footer: React.FC = () => (
  <footer className="bg-[var(--lp-bg)] border-t border-[var(--lp-hairline)] py-10 px-6">
    <div className="max-w-[1200px] mx-auto flex items-center justify-between flex-wrap gap-4">
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg bg-[var(--primary)] flex items-center justify-center">
          <Briefcase size={14} color="white" />
        </div>
        <span className="text-[13px] font-light text-[var(--lp-ink-mute)]">
          Linkbay
        </span>
      </div>
      <p className="text-xs text-[var(--lp-ink-mute)]">
        © 2026 Linkbay. All rights reserved.
      </p>
      <div className="flex gap-6">
        {["Privacy", "Terms", "Contact"].map((l) => (
          <a
            key={l}
            href="#"
            className="text-xs font-light text-[var(--lp-ink-mute)] no-underline transition-colors duration-150 hover:text-[var(--primary)]"
          >
            {l}
          </a>
        ))}
      </div>
    </div>
  </footer>
);

// ── Page ──────────────────────────────────────────────────────────────────────
export const Landing: React.FC = () => (
  <div className="font-sans font-light antialiased [font-feature-settings:'ss01'] overflow-x-hidden">
    <Nav />
    <Hero />
    <Features />
    <ValueProp />
    <HowItWorks />
    <About />
    <Founders />
    <Products />
    <PrivacySection />
    <CTABand />
    <Footer />
  </div>
);
