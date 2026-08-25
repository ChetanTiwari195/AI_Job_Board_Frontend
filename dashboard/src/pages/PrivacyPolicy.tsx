import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Briefcase, ChevronDown, ArrowLeft, Shield } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const sections = [
  {
    id: "information-we-collect",
    title: "1. Information We Collect",
    content: [
      { type: "heading", text: "Account Information" },
      { type: "text", text: "When you sign up, we collect your email address and a hashed password. We do not store plain-text passwords." },
      { type: "heading", text: "Resume Data" },
      { type: "text", text: "You may upload resumes in PDF or DOCX format. We store these files securely and parse their content (skills, experience, education) solely to perform AI-powered job matching. You can delete any resume at any time." },
      { type: "heading", text: "Job Interaction Data" },
      { type: "text", text: "We record which jobs you save, apply to, or dismiss. This interaction history is used exclusively to improve match quality for your account and is never shared externally." },
      { type: "heading", text: "Usage & Analytics" },
      { type: "text", text: "We collect anonymized, aggregated usage metrics (e.g., page views, feature engagement) using privacy-respecting analytics. No personally identifiable information is attached to these events." },
      { type: "heading", text: "Device & Technical Data" },
      { type: "text", text: "Standard server logs capture your IP address, browser type, and request timestamps for security and debugging purposes. Logs are rotated and purged after 30 days." },
    ],
  },
  {
    id: "how-we-use",
    title: "2. How We Use Your Information",
    content: [
      { type: "text", text: "Your data is used strictly for the following purposes:" },
      { type: "list", items: [
        { bold: "AI Job Matching", rest: " — Your resume content and skills are processed by our AI models to rank and surface the most relevant job listings for you. Processing happens server-side over encrypted connections; we do not send your full resume to third-party AI providers without your explicit consent." },
        { bold: "Application Tracking", rest: " — Saved and applied jobs are stored to give you a persistent, organized view of your job search." },
        { bold: "Service Improvement", rest: " — Anonymized usage patterns help us identify bugs, prioritize features, and improve match accuracy over time." },
        { bold: "Security & Fraud Prevention", rest: " — Technical logs are used to detect and block malicious access attempts." },
        { bold: "Communications", rest: " — If you opt in, we may send email notifications about new matching jobs or service announcements. You can unsubscribe at any time." },
      ]},
      { type: "text", text: "We do not use your data for advertising, sell it to third parties, or use it to build behavioral profiles for external purposes." },
    ],
  },
  {
    id: "ai-processing",
    title: "3. AI & Resume Processing",
    content: [
      { type: "heading", text: "On-Platform Processing" },
      { type: "text", text: "By default, resume parsing and skill extraction is performed on our own infrastructure. Your resume content is not forwarded to external AI APIs unless you explicitly enable a premium AI match feature." },
      { type: "heading", text: "Third-Party AI APIs (Optional)" },
      { type: "text", text: "If you enable enhanced AI features, anonymized portions of your resume (skills list, job titles, years of experience) may be sent to a third-party large language model provider over an encrypted connection. Full personal details such as your name, address, and contact information are stripped before transmission." },
      { type: "heading", text: "No Training on Your Data" },
      { type: "text", text: "We do not use your resume or job interaction data to train our AI models or fine-tune any third-party models. Your data is never used as training material." },
      { type: "heading", text: "Match Scores" },
      { type: "text", text: "AI-generated match scores are probabilistic estimates, not guarantees of employment suitability. They are provided as a guide only." },
    ],
  },
  {
    id: "data-sharing",
    title: "4. Data Sharing & Third Parties",
    content: [
      { type: "heading", text: "Service Providers" },
      { type: "text", text: "We use a small set of trusted infrastructure providers (e.g., cloud hosting, database services, email delivery) who process data on our behalf under strict data processing agreements. They are not permitted to use your data for their own purposes." },
      { type: "heading", text: "Legal Requirements" },
      { type: "text", text: "We may disclose your information if required by law, court order, or to protect the safety, rights, or property of AI Job Board, our users, or the public." },
      { type: "heading", text: "Business Transfers" },
      { type: "text", text: "In the event of a merger, acquisition, or sale of assets, your data may be transferred. We will notify you via email and/or a prominent notice on the site before your data becomes subject to a different privacy policy." },
      { type: "text", text: "We never sell your personal data." },
    ],
  },
  {
    id: "data-retention",
    title: "5. Data Retention",
    content: [
      { type: "table", rows: [
        ["Account information", "Until account deletion + 30-day grace period"],
        ["Resume files", "Until you delete them, or account deletion"],
        ["Job interaction history", "Until account deletion"],
        ["Server logs", "30 days, then auto-purged"],
        ["Anonymized analytics", "Indefinitely (no PII attached)"],
      ]},
      { type: "text", text: "When you delete your account, all personal data is permanently removed from our active databases within 14 days. Anonymized, aggregated analytics derived from your activity may remain." },
    ],
  },
  {
    id: "security",
    title: "6. Security",
    content: [
      { type: "text", text: "We implement industry-standard safeguards to protect your data:" },
      { type: "list", items: [
        { bold: "Encryption in Transit", rest: " — All data between your browser and our servers is encrypted using TLS 1.2 or higher." },
        { bold: "Encryption at Rest", rest: " — Resume files and sensitive account data are encrypted at rest in our storage systems." },
        { bold: "Password Hashing", rest: " — Passwords are hashed using bcrypt with a per-user salt. We never store or transmit plain-text passwords." },
        { bold: "Access Controls", rest: " — Internal access to user data is restricted to personnel who require it, governed by role-based access control." },
        { bold: "Vulnerability Monitoring", rest: " — We regularly audit our dependencies and infrastructure for known vulnerabilities." },
      ]},
      { type: "text", text: "No system is 100% secure. If you suspect unauthorized access to your account, please contact us immediately at security@aijobboard.app." },
    ],
  },
  {
    id: "your-rights",
    title: "7. Your Rights",
    content: [
      { type: "text", text: "Depending on your location, you may have the following rights regarding your personal data:" },
      { type: "list", items: [
        { bold: "Access", rest: " — Request a copy of the personal data we hold about you." },
        { bold: "Correction", rest: " — Ask us to correct inaccurate or incomplete data." },
        { bold: "Deletion", rest: " — Request that we delete your personal data. You can also self-serve this by deleting your account in Settings." },
        { bold: "Portability", rest: " — Request your data in a structured, machine-readable format." },
        { bold: "Objection", rest: " — Object to processing of your data for certain purposes." },
        { bold: "Withdraw Consent", rest: " — Where processing is based on consent, you can withdraw it at any time." },
      ]},
      { type: "text", text: "To exercise any of these rights, email us at privacy@aijobboard.app. We will respond within 30 days. We may ask you to verify your identity before acting on a request." },
    ],
  },
  {
    id: "cookies",
    title: "8. Cookies & Local Storage",
    content: [
      { type: "heading", text: "Strictly Necessary" },
      { type: "text", text: "Session/authentication token stored in an HTTP-only cookie to keep you logged in." },
      { type: "heading", text: "Preferences" },
      { type: "text", text: "Your chosen color theme (light/dark) is stored in localStorage — no server involved." },
      { type: "heading", text: "Analytics (Optional)" },
      { type: "text", text: "If analytics are enabled, a privacy-preserving, cookieless analytics tool may be used. No cross-site tracking cookies are set." },
      { type: "text", text: "We do not use third-party advertising cookies or tracking pixels. You can clear all cookies and localStorage at any time through your browser settings." },
    ],
  },
  {
    id: "children",
    title: "9. Children's Privacy",
    content: [
      { type: "text", text: "AI Job Board is designed for adults engaged in professional job searching. We do not knowingly collect personal information from anyone under the age of 16 (or the applicable age of digital consent in your jurisdiction)." },
      { type: "text", text: "If we become aware that a minor has provided us with personal data, we will take steps to delete that information promptly. If you believe a minor has registered, please contact us at privacy@aijobboard.app." },
    ],
  },
  {
    id: "changes",
    title: "10. Changes to This Policy",
    content: [
      { type: "text", text: "We may update this Privacy Policy from time to time to reflect changes in our practices, technology, or legal requirements. When we make material changes, we will:" },
      { type: "list", items: [
        { bold: "", rest: "Update the \"Last Updated\" date at the top of this page." },
        { bold: "", rest: "Send a notification email to registered users at least 14 days before the change takes effect (for significant changes)." },
        { bold: "", rest: "Display a prominent banner on the platform." },
      ]},
      { type: "text", text: "Your continued use of AI Job Board after the effective date constitutes acceptance of the changes." },
    ],
  },
  {
    id: "extension",
    title: "12. Chrome Extension — Data Collected",
    content: [
      { type: "text", text: "The \"Resume Optimizer\" Chrome extension (manifest v3) is a companion tool with a single purpose: ATS keyword analysis and AI-powered LaTeX resume optimization. To perform this function, the extension transmits the following data to AI Job Board servers over an encrypted HTTPS connection:" },
      { type: "list", items: [
        { bold: "Resume content", rest: " — The LaTeX or plain-text resume you upload or paste into the extension. Used exclusively to perform keyword analysis and generate an optimized version. Not retained beyond your session unless you explicitly click \"Save Resume to Cloud\"." },
        { bold: "Job description text", rest: " — The job posting you paste for comparison. Processed server-side to extract relevant keywords and compute an ATS match score. Not stored." },
        { bold: "Account credentials & auth token", rest: " — Your email address and (bcrypt-hashed) password are used only for account authentication. After login, an auth token is stored in browser localStorage; your raw password is never stored locally." },
      ]},
      { type: "heading", text: "What is NOT collected" },
      { type: "list", items: [
        { bold: "", rest: "Browsing history or content of any page you visit." },
        { bold: "", rest: "Data from any tab other than the extension's own side panel." },
        { bold: "", rest: "Any information not directly provided by you inside the extension UI." },
      ]},
      { type: "heading", text: "Consent" },
      { type: "text", text: "On first launch the extension displays a prominent consent screen listing the above data points. No data is transmitted until you explicitly click \"I Agree\". You may decline at any time; clicking Decline prevents all data transmission and the extension will not function. You can revoke consent by clearing the extension's local storage via chrome://extensions → Details → Storage." },
      { type: "heading", text: "Single Purpose Compliance" },
      { type: "text", text: "Data collection is strictly limited to what is necessary to perform ATS analysis and resume optimization — the extension's declared single purpose. No data is used for advertising, analytics unrelated to the core feature, or any cross-site tracking." },
    ],
  },
  {
    id: "contact",
    title: "13. Contact Us",
    content: [
      { type: "text", text: "If you have any questions, concerns, or requests regarding this Privacy Policy, please reach out:" },
      { type: "list", items: [
        { bold: "General Privacy", rest: ": privacy@aijobboard.app" },
        { bold: "Security Issues", rest: ": security@aijobboard.app" },
      ]},
      { type: "text", text: "We aim to respond to all privacy-related inquiries within 5 business days. Thank you for trusting AI Job Board with your job search journey." },
    ],
  },
];

type ContentBlock =
  | { type: "text"; text: string }
  | { type: "heading"; text: string }
  | { type: "list"; items: { bold: string; rest: string }[] }
  | { type: "table"; rows: string[][] };

const renderContent = (blocks: ContentBlock[]) =>
  blocks.map((block, i) => {
    if (block.type === "heading") {
      return (
        <p key={i} className="font-semibold text-slate-800 dark:text-slate-200 mt-4 first:mt-0">
          {block.text}
        </p>
      );
    }
    if (block.type === "text") {
      return (
        <p key={i} className="text-slate-600 dark:text-slate-400 leading-relaxed">
          {block.text}
        </p>
      );
    }
    if (block.type === "list") {
      return (
        <ul key={i} className="space-y-1.5 ml-1">
          {block.items.map((item, j) => (
            <li key={j} className="flex gap-2 text-slate-600 dark:text-slate-400">
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-500/60 flex-shrink-0" />
              <span>
                {item.bold && (
                  <strong className="text-slate-700 dark:text-slate-300 font-semibold">
                    {item.bold}
                  </strong>
                )}
                {item.rest}
              </span>
            </li>
          ))}
        </ul>
      );
    }
    if (block.type === "table") {
      return (
        <div key={i} className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700 mt-2">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-slate-100 dark:bg-slate-800/60">
                <th className="px-4 py-2.5 text-left font-semibold text-slate-700 dark:text-slate-300">Data Type</th>
                <th className="px-4 py-2.5 text-left font-semibold text-slate-700 dark:text-slate-300">Retention Period</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {block.rows.map(([type, period]) => (
                <tr key={type} className="bg-white dark:bg-[#090d16]">
                  <td className="px-4 py-2.5 text-slate-600 dark:text-slate-400">{type}</td>
                  <td className="px-4 py-2.5 text-slate-600 dark:text-slate-400">{period}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }
    return null;
  });

const AccordionItem: React.FC<{
  section: (typeof sections)[0];
  isOpen: boolean;
  onToggle: () => void;
}> = ({ section, isOpen, onToggle }) => (
  <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
    <button
      onClick={onToggle}
      className="w-full flex items-center justify-between px-6 py-4 text-left bg-white dark:bg-[#0e1526] hover:bg-slate-50 dark:hover:bg-[#111827] transition-colors duration-150 cursor-pointer"
      aria-expanded={isOpen}
    >
      <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
        {section.title}
      </span>
      <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
        <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0" />
      </motion.div>
    </button>
    <AnimatePresence initial={false}>
      {isOpen && (
        <motion.div
          key="content"
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.25, ease: "easeInOut" }}
          className="overflow-hidden"
        >
          <div className="px-6 py-5 bg-slate-50 dark:bg-[#090d16] border-t border-slate-200 dark:border-slate-800">
            <div className="text-sm space-y-3">
              {renderContent(section.content as ContentBlock[])}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);

export const PrivacyPolicy: React.FC = () => {
  const [openId, setOpenId] = useState<string | null>("information-we-collect");

  const toggle = (id: string) => setOpenId((prev) => (prev === id ? null : id));

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#090d16] text-slate-900 dark:text-slate-100 font-sans">
      {/* Header */}
      <header className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0e1526]">
        <div className="max-w-4xl mx-auto px-6 py-5 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group" aria-label="Back to home">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-sm shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <Briefcase className="w-5 h-5" />
            </div>
            <span className="text-lg font-bold tracking-tight">AI Job Board</span>
          </Link>
          <Link
            to="/"
            className="flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to home
          </Link>
        </div>
      </header>

      {/* Hero */}
      <div className="border-b border-slate-200 dark:border-slate-800 bg-gradient-to-b from-blue-50/50 dark:from-blue-950/20 to-transparent">
        <div className="max-w-4xl mx-auto px-6 py-14 text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 mb-6 mx-auto">
            <Shield className="w-7 h-7" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight mb-3">Privacy Policy</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            Last updated: <time dateTime="2026-08-25">August 25, 2026</time>
          </p>
          <p className="mt-4 text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-sm leading-relaxed">
            At <strong className="text-slate-800 dark:text-slate-200">AI Job Board</strong>, your privacy is fundamental — not an afterthought.
            This policy explains exactly what data we collect, why we collect it, and how we protect it,
            written in plain language, not legalese.
          </p>
        </div>
      </div>

      {/* Accordion content */}
      <main className="max-w-4xl mx-auto px-6 py-12 space-y-3">
        {sections.map((section) => (
          <AccordionItem
            key={section.id}
            section={section}
            isOpen={openId === section.id}
            onToggle={() => toggle(section.id)}
          />
        ))}

        <p className="text-center text-xs text-slate-400 dark:text-slate-600 pt-8 pb-4">
          This Privacy Policy applies to the AI Job Board web application and its associated services.
          Questions?{" "}
          <a href="mailto:privacy@aijobboard.app" className="text-blue-500 hover:underline">
            privacy@aijobboard.app
          </a>
        </p>
      </main>
    </div>
  );
};
