import React from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "motion/react";
import {
  Briefcase,
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
} from "lucide-react";

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
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: 36,
        height: 36,
        borderRadius: 9999,
        background: "var(--bg-surface)",
        border: "1px solid var(--lp-hairline)",
        cursor: "pointer",
        color: "var(--lp-ink-mute)",
        transition: "background 0.15s ease",
        touchAction: "manipulation",
      }}
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
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        height: 68,
        display: "flex",
        alignItems: "center",
        backgroundColor: scrolled
          ? "color-mix(in srgb, var(--lp-bg) 92%, transparent)"
          : "transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        borderBottom: scrolled
          ? `1px solid var(--lp-hairline)`
          : "1px solid transparent",
        transition:
          "background-color 0.25s ease, border-color 0.25s ease, backdrop-filter 0.25s ease",
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          width: "100%",
          padding: "0 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Link
          to="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            textDecoration: "none",
          }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: "var(--primary)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 4px 12px rgba(37,99,235,0.25)",
            }}
          >
            <Briefcase size={18} color="white" />
          </div>
          <span
            style={{
              fontSize: 16,
              fontWeight: 400,
              color: "var(--lp-ink)",
              letterSpacing: "-0.2px",
            }}
          >
            AI Job Board
          </span>
        </Link>

        <nav
          style={{ display: "flex", alignItems: "center", gap: 32 }}
          aria-label="Primary navigation"
        >
          {["features", "how-it-works"].map((id) => (
            <a
              key={id}
              href={`#${id}`}
              style={{
                fontSize: 14,
                fontWeight: 300,
                color: "var(--lp-ink-mute)",
                textDecoration: "none",
                transition: "color 0.15s ease",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.color = "var(--lp-ink)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = "var(--lp-ink-mute)")
              }
            >
              {id === "features" ? "Features" : "How it works"}
            </a>
          ))}
        </nav>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <LandingThemeToggle />
          <Link
            to="/login"
            style={{
              fontSize: 14,
              fontWeight: 400,
              color: "var(--lp-ink)",
              textDecoration: "none",
              padding: "8px 14px",
            }}
          >
            Sign in
          </Link>
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Link
              to="/login"
              id="nav-get-started"
              className="btn-primary"
              style={{ fontSize: 14 }}
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
      style={{
        minHeight: "100dvh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
        paddingTop: 68,
        background: "var(--lp-bg)",
      }}
    >
      {/* Gradient mesh — responds to CSS var */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 0,
          background: "var(--lp-hero-bg)",
        }}
      />
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 1,
          backgroundImage:
            "linear-gradient(rgba(83,58,253,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(83,58,253,0.04) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          maskImage:
            "radial-gradient(ellipse 80% 80% at 50% 0%, black 0%, transparent 100%)",
        }}
      />

      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "0 24px",
          width: "100%",
          position: "relative",
          zIndex: 2,
          textAlign: "center",
        }}
      >
        <motion.div
          {...(reduce ? {} : fadeUp(0.05))}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            padding: "4px 12px",
            background: "var(--s-primary-sub, var(--primary-border))",
            borderRadius: 9999,
            marginBottom: 32,
          }}
        >
          <Globe size={11} color="#4434d4" />
          <span
            style={{
              fontSize: 10,
              fontWeight: 400,
              color: "#4434d4",
              letterSpacing: "0.1px",
              textTransform: "uppercase",
            }}
          >
            The all-in-one career platform
          </span>
        </motion.div>

        <motion.h1
          {...(reduce ? {} : fadeUp(0.1))}
          style={{
            fontSize: "clamp(36px, 6vw, 56px)",
            fontWeight: 300,
            lineHeight: 1.03,
            letterSpacing: "-1.4px",
            color: "var(--lp-ink)",
            marginBottom: 24,
            maxWidth: 800,
            marginLeft: "auto",
            marginRight: "auto",
            fontFeatureSettings: '"ss01"',
          }}
        >
          Job search, networking,
          <br />
          and reviews —{" "}
          <span style={{ color: "var(--primary)" }}>under one roof.</span>
        </motion.h1>

        <motion.p
          {...(reduce ? {} : fadeUp(0.18))}
          style={{
            fontSize: 16,
            fontWeight: 300,
            lineHeight: 1.6,
            color: "var(--lp-ink-2)",
            marginBottom: 40,
            maxWidth: 560,
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          Our aim is to create a dashboard like LinkedIn clubbing job search,
          networking, Glassdoor reviews, Reddit community insights — all under
          one roof.
        </motion.p>

        <motion.div
          {...(reduce ? {} : fadeUp(0.25))}
          style={{
            display: "flex",
            gap: 12,
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
            <Link
              to="/login"
              id="hero-start"
              className="btn-primary"
              style={{ fontSize: 16, padding: "12px 28px" }}
            >
              Start for free <ArrowRight size={16} />
            </Link>
          </motion.div>
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <a
              href="#features"
              className="btn-secondary"
              style={{
                fontSize: 16,
                padding: "12px 28px",
                color: "var(--primary)",
                borderColor: "var(--primary)",
              }}
            >
              See features
            </a>
          </motion.div>
        </motion.div>

        <motion.div
          {...(reduce ? {} : fadeUp(0.35))}
          style={{
            marginTop: 64,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 16,
          }}
        >
          <span
            style={{
              fontSize: 12,
              fontWeight: 300,
              color: "var(--lp-ink-mute)",
              letterSpacing: 0.5,
            }}
          >
            Aggregates insights from
          </span>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 32,
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            {["LinkedIn", "Glassdoor", "Reddit", "Indeed", "Levels.fyi"].map(
              (name) => (
                <span
                  key={name}
                  style={{
                    fontSize: 14,
                    fontWeight: 400,
                    color: "var(--lp-ink-mute)",
                    letterSpacing: "-0.2px",
                    opacity: 0.75,
                  }}
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
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 80,
          background: "linear-gradient(to bottom, transparent, var(--lp-bg))",
          zIndex: 3,
        }}
      />
    </section>
  );
};

// ── Features ─────────────────────────────────────────────────────────────────
const Features: React.FC = () => {
  const reduce = useReducedMotion();
  return (
    <section
      id="features"
      style={{ background: "var(--lp-canvas-soft)", padding: "96px 24px" }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ marginBottom: 56, maxWidth: 560 }}>
          <motion.h2
            {...(reduce
              ? {}
              : {
                  initial: { opacity: 0, y: 20 },
                  whileInView: { opacity: 1, y: 0 },
                  viewport: { once: true },
                  transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
                })}
            style={{
              fontSize: 32,
              fontWeight: 300,
              color: "var(--lp-ink)",
              letterSpacing: "-0.64px",
              lineHeight: 1.1,
              marginBottom: 16,
              fontFeatureSettings: '"ss01"',
            }}
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
            style={{
              fontSize: 15,
              fontWeight: 300,
              color: "var(--lp-ink-2)",
              lineHeight: 1.6,
            }}
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
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: 16,
          }}
        >
          {FEATURES.map((f, i) => (
            <motion.article
              key={f.title}
              variants={staggerChild}
              whileHover={reduce ? {} : { y: -4 }}
              style={{
                background:
                  i % 2 === 0 ? "var(--lp-bg)" : "var(--lp-canvas-cream)",
                border: `1px solid var(--lp-hairline)`,
                borderRadius: 12,
                padding: 32,
                boxShadow: "var(--s-shadow-1)",
                transition: "box-shadow 0.2s ease, transform 0.2s ease",
              }}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  background: "rgba(37,99,235,0.08)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 20,
                }}
              >
                <f.icon size={20} color="var(--primary)" />
              </div>
              <h3
                style={{
                  fontSize: 18,
                  fontWeight: 300,
                  color: "var(--lp-ink)",
                  letterSpacing: "-0.22px",
                  marginBottom: 8,
                  fontFeatureSettings: '"ss01"',
                }}
              >
                {f.title}
              </h3>
              <p
                style={{
                  fontSize: 14,
                  fontWeight: 300,
                  color: "var(--lp-ink-mute)",
                  lineHeight: 1.6,
                }}
              >
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
    <section
      style={{ background: "var(--lp-canvas-cream)", padding: "96px 24px" }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: 64,
          alignItems: "center",
        }}
      >
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
          <h2
            style={{
              fontSize: 32,
              fontWeight: 300,
              color: "var(--lp-ink)",
              letterSpacing: "-0.64px",
              lineHeight: 1.1,
              marginBottom: 20,
              fontFeatureSettings: '"ss01"',
            }}
          >
            Stop piecing together the picture from five different apps.
          </h2>
          <p
            style={{
              fontSize: 15,
              fontWeight: 300,
              color: "var(--lp-ink-2)",
              lineHeight: 1.7,
              marginBottom: 32,
            }}
          >
            LinkedIn for networking. Glassdoor for reviews. Reddit for real
            talk. Indeed for listings. We bring all of it into a single
            intelligent surface — informed, connected, and fast.
          </p>
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Link
              to="/login"
              id="valueprop-cta"
              className="btn-primary"
              style={{ fontSize: 14 }}
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
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}
        >
          {STATS.map((s) => (
            <div
              key={s.label}
              style={{
                background: "rgba(255,255,255,0.55)",
                border: "1px solid rgba(255,255,255,0.7)",
                borderRadius: 12,
                padding: "24px 20px",
                backdropFilter: "blur(4px)",
              }}
            >
              <div
                className="tnum"
                style={{
                  fontSize: 26,
                  fontWeight: 300,
                  color: "var(--lp-ink)",
                  marginBottom: 4,
                }}
              >
                {s.value}
              </div>
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 300,
                  color: "var(--lp-ink-mute)",
                }}
              >
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
    <section
      id="how-it-works"
      style={{ background: "var(--lp-bg)", padding: "96px 24px" }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 64 }}>
          <motion.h2
            {...(reduce
              ? {}
              : {
                  initial: { opacity: 0, y: 20 },
                  whileInView: { opacity: 1, y: 0 },
                  viewport: { once: true },
                  transition: { duration: 0.6 },
                })}
            style={{
              fontSize: 32,
              fontWeight: 300,
              color: "var(--lp-ink)",
              letterSpacing: "-0.64px",
              marginBottom: 12,
              fontFeatureSettings: '"ss01"',
            }}
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
            style={{
              fontSize: 15,
              fontWeight: 300,
              color: "var(--lp-ink-mute)",
              maxWidth: 400,
              margin: "0 auto",
            }}
          >
            Four steps from signup to your first matched job.
          </motion.p>
        </div>

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          }}
        >
          {STEPS.map((step, i) => (
            <motion.div
              key={step.n}
              variants={staggerChild}
              style={{
                padding: "32px 24px",
                borderLeft: i > 0 ? `1px solid var(--lp-hairline)` : "none",
              }}
            >
              <div
                className="tnum"
                style={{
                  fontSize: 11,
                  fontWeight: 400,
                  color: "var(--primary-border)",
                  letterSpacing: "0.1px",
                  textTransform: "uppercase",
                  marginBottom: 16,
                }}
              >
                {step.n}
              </div>
              <h3
                style={{
                  fontSize: 18,
                  fontWeight: 300,
                  color: "var(--lp-ink)",
                  letterSpacing: "-0.22px",
                  marginBottom: 10,
                  fontFeatureSettings: '"ss01"',
                }}
              >
                {step.title}
              </h3>
              <p
                style={{
                  fontSize: 14,
                  fontWeight: 300,
                  color: "var(--lp-ink-mute)",
                  lineHeight: 1.6,
                }}
              >
                {step.body}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

// ── CTA Band ──────────────────────────────────────────────────────────────────
const CTABand: React.FC = () => {
  const reduce = useReducedMotion();
  return (
    <section
      style={{
        background: "#1c1e54",
        padding: "96px 24px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse 60% 80% at 90% 50%, rgba(37,99,235,0.25) 0%, transparent 60%), radial-gradient(ellipse 50% 60% at 10% 50%, rgba(249,107,238,0.15) 0%, transparent 60%)",
        }}
      />
      <div
        style={{
          maxWidth: 760,
          margin: "0 auto",
          textAlign: "center",
          position: "relative",
          zIndex: 1,
        }}
      >
        <motion.h2
          {...(reduce
            ? {}
            : {
                initial: { opacity: 0, y: 24 },
                whileInView: { opacity: 1, y: 0 },
                viewport: { once: true },
                transition: { duration: 0.7 },
              })}
          style={{
            fontSize: 40,
            fontWeight: 300,
            color: "#ffffff",
            letterSpacing: "-0.96px",
            lineHeight: 1.1,
            marginBottom: 16,
            fontFeatureSettings: '"ss01"',
          }}
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
          style={{
            fontSize: 15,
            fontWeight: 300,
            color: "rgba(255,255,255,0.65)",
            marginBottom: 40,
            lineHeight: 1.6,
          }}
        >
          Join thousands of professionals using AI Job Board to find roles
          faster, research smarter, and network better.
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
          style={{
            display: "flex",
            gap: 12,
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
            <Link
              to="/login"
              id="cta-band-primary"
              className="btn-primary"
              style={{ fontSize: 16, padding: "12px 28px" }}
            >
              Get started free <ArrowRight size={16} />
            </Link>
          </motion.div>
          <Link
            to="/login"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              fontSize: 16,
              fontWeight: 400,
              color: "rgba(255,255,255,0.75)",
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.15)",
              borderRadius: 9999,
              padding: "12px 28px",
              textDecoration: "none",
              transition: "background 0.15s ease",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background =
                "rgba(255,255,255,0.13)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background =
                "rgba(255,255,255,0.08)";
            }}
          >
            Sign in
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

// ── Footer ────────────────────────────────────────────────────────────────────
const Footer: React.FC = () => (
  <footer
    style={{
      background: "var(--lp-bg)",
      borderTop: `1px solid var(--lp-hairline)`,
      padding: "40px 24px",
    }}
  >
    <div
      style={{
        maxWidth: 1200,
        margin: "0 auto",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: 16,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div
          style={{
            width: 28,
            height: 28,
            borderRadius: 8,
            background: "var(--primary)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Briefcase size={14} color="white" />
        </div>
        <span
          style={{ fontSize: 13, fontWeight: 300, color: "var(--lp-ink-mute)" }}
        >
          AI Job Board
        </span>
      </div>
      <p
        style={{
          fontSize: 12,
          fontWeight: 300,
          color: "var(--lp-ink-mute)",
          letterSpacing: "-0.39px",
        }}
      >
        © 2026 AI Job Board. All rights reserved.
      </p>
      <div style={{ display: "flex", gap: 24 }}>
        {["Privacy", "Terms", "Contact"].map((l) => (
          <a
            key={l}
            href="#"
            style={{
              fontSize: 12,
              fontWeight: 300,
              color: "var(--lp-ink-mute)",
              textDecoration: "none",
              transition: "color 0.15s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--primary)")}
            onMouseLeave={(e) =>
              (e.currentTarget.style.color = "var(--lp-ink-mute)")
            }
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
  <div
    className="landing-page"
    style={{
      fontFamily:
        "'Inter', 'SF Pro Display', system-ui, -apple-system, sans-serif",
      fontFeatureSettings: '"ss01"',
      fontWeight: 300,
      WebkitFontSmoothing: "antialiased",
    }}
  >
    <Nav />
    <Hero />
    <Features />
    <ValueProp />
    <HowItWorks />
    <CTABand />
    <Footer />
  </div>
);
