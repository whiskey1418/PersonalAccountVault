import React, { useState, useMemo, useEffect, useRef, useCallback, createContext, useContext } from "react";
import {
  Search, Star, Shield, ShieldCheck, ShieldAlert, Lock, Unlock, Plus, X,
  Eye, EyeOff, Copy, Check, ChevronRight, ChevronLeft, ChevronDown, LayoutGrid, List,
  Sun, Moon, Monitor, Home, Users, Network, Tag, Folder, MoreVertical, Trash2, Pencil,
  Clock, AlertTriangle, KeyRound, Mail, Phone, Globe, FileText, RefreshCw, ArrowLeft,
  ArrowRight, Landmark, Wallet, Gamepad2, Briefcase, GraduationCap, ShoppingBag, Code2,
  Server, Tv, MoreHorizontal, SlidersHorizontal, Fingerprint, Link2, Settings as SettingsIcon,
  ArrowUpRight, ChevronsUpDown, Delete, ChevronUp, Sparkles, Info, ZoomIn, ZoomOut, Maximize2,
  CircleUser, Building2, GripVertical
} from "lucide-react";

/* ============================================================================
   DESIGN TOKENS
   Direction: "the steel behind the glass" — a vault should feel engineered,
   not decorated. Cool graphite/gunmetal surfaces (evoking brushed steel and
   safe-deposit boxes), a single signal-teal accent used only for security /
   trust states, and a warm brass accent reserved for "favorite / premium"
   moments — like the brass fittings on an old vault door. Data-dense fields
   (account numbers, backup codes) render in a functional monospace because
   that's genuinely how such data is transcribed, not as a decorative label
   face. Cards use one consistent radius for content containers and a second,
   larger radius reserved for hero/primary surfaces, so radius carries
   hierarchy instead of being uniform everywhere.
   ============================================================================ */
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap');

  .pav-root {
    --ink-950: #0B0E13;
    --ink-900: #12161D;
    --ink-800: #1A1F29;
    --ink-700: #232A36;
    --ink-600: #2E3644;
    --ink-500: #454E5F;
    --ink-400: #6B7688;
    --ink-300: #96A0B0;
    --ink-200: #C4CBD6;
    --ink-100: #E4E8EE;
    --paper-0: #FAFAF8;
    --paper-50: #F2F1EC;
    --paper-100: #E9E7DF;

    --teal-500: #17B8A6;
    --teal-400: #35D6C4;
    --teal-glow: rgba(23,184,166,0.18);
    --brass-400: #D8A94E;
    --brass-500: #C79438;
    --red-500: #E5533D;
    --amber-500: #E0A233;
    --green-500: #3FB27F;

    --font-display: 'Space Grotesk', ui-sans-serif, system-ui, sans-serif;
    --font-body: 'Inter', ui-sans-serif, system-ui, sans-serif;
    --font-mono: 'IBM Plex Mono', ui-monospace, monospace;

    font-family: var(--font-body);
  }

  .pav-root[data-theme='dark'] {
    --bg: var(--ink-950);
    --surface: var(--ink-900);
    --surface-raised: var(--ink-800);
    --surface-hover: var(--ink-700);
    --border: var(--ink-700);
    --border-soft: rgba(255,255,255,0.06);
    --text-primary: var(--ink-100);
    --text-secondary: var(--ink-300);
    --text-tertiary: var(--ink-400);
    --accent: var(--teal-400);
    --accent-strong: var(--teal-500);
    --accent-contrast: #06231F;
    --shadow-color: rgba(0,0,0,0.55);
  }
  .pav-root[data-theme='light'] {
    --bg: var(--paper-0);
    --surface: #FFFFFF;
    --surface-raised: #FFFFFF;
    --surface-hover: var(--paper-50);
    --border: var(--paper-100);
    --border-soft: rgba(18,22,29,0.07);
    --text-primary: var(--ink-900);
    --text-secondary: var(--ink-500);
    --text-tertiary: var(--ink-400);
    --accent: var(--teal-500);
    --accent-strong: #109384;
    --accent-contrast: #FFFFFF;
    --shadow-color: rgba(20,24,32,0.12);
  }

  .pav-root { background: var(--bg); color: var(--text-primary); }
  .pav-font-display { font-family: var(--font-display); letter-spacing: -0.01em; }
  .pav-font-mono { font-family: var(--font-mono); letter-spacing: 0.01em; }

  .pav-scrollbar::-webkit-scrollbar { width: 8px; height: 8px; }
  .pav-scrollbar::-webkit-scrollbar-thumb { background: var(--border); border-radius: 8px; }
  .pav-scrollbar::-webkit-scrollbar-track { background: transparent; }

  .pav-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 14px;
    transition: border-color 0.15s ease, transform 0.15s ease, background 0.15s ease;
  }
  .pav-card-hero { border-radius: 22px 22px 22px 8px; }
  .pav-focus:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }
  .pav-btn { transition: background 0.15s ease, border-color 0.15s ease, color 0.15s ease, transform 0.1s ease; }
  .pav-btn:active { transform: scale(0.97); }
  .pav-fade-in { animation: pavFadeIn 0.22s ease both; }
  .pav-slide-up { animation: pavSlideUp 0.28s cubic-bezier(.2,.8,.2,1) both; }
  .pav-slide-in-right { animation: pavSlideRight 0.32s cubic-bezier(.2,.8,.2,1) both; }
  @keyframes pavFadeIn { from { opacity: 0; } to { opacity: 1; } }
  @keyframes pavSlideUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes pavSlideRight { from { opacity: 0; transform: translateX(24px); } to { opacity: 1; transform: translateX(0); } }
  @media (prefers-reduced-motion: reduce) {
    .pav-fade-in, .pav-slide-up, .pav-slide-in-right { animation: none; }
  }

  .pav-input {
    background: var(--surface-hover);
    border: 1px solid var(--border);
    color: var(--text-primary);
    border-radius: 10px;
  }
  .pav-input::placeholder { color: var(--text-tertiary); }
  .pav-input:focus { outline: none; border-color: var(--accent); box-shadow: 0 0 0 3px var(--teal-glow); }

  .pav-dot-secure { background: var(--green-500); }
  .pav-dot-attention { background: var(--amber-500); }
  .pav-dot-risk { background: var(--red-500); }
`;

/* ============================================================================
   CATEGORY DEFINITIONS
   ============================================================================ */
const CATEGORY_DEFS = [
  { id: "banking", name: "Banking", icon: Landmark, color: "#3E7CB8" },
  { id: "ewallet", name: "E-Wallet", icon: Wallet, color: "#2FA88E" },
  { id: "email", name: "Email", icon: Mail, color: "#C0553C" },
  { id: "social", name: "Social Media", icon: Users, color: "#7A5FD0" },
  { id: "gaming", name: "Gaming", icon: Gamepad2, color: "#B0568E" },
  { id: "work", name: "Work", icon: Briefcase, color: "#4C6E8C" },
  { id: "school", name: "School", icon: GraduationCap, color: "#5C8A5A" },
  { id: "shopping", name: "Shopping", icon: ShoppingBag, color: "#C97A3D" },
  { id: "subscription", name: "Subscription", icon: RefreshCw, color: "#B33B4D" },
  { id: "developer", name: "Developer", icon: Code2, color: "#40495A" },
  { id: "hosting", name: "Hosting", icon: Server, color: "#2E8B84" },
  { id: "entertainment", name: "Entertainment", icon: Tv, color: "#A8434B" },
  { id: "website", name: "Website", icon: Globe, color: "#5A7AA8" },
  { id: "other", name: "Other", icon: MoreHorizontal, color: "#6B7688" },
];

/* ============================================================================
   SERVICE CATALOG — colour + initials badge stands in for a brand mark.
   No brand artwork is reproduced; this keeps every service visually
   distinct and recognisable by colour/initial without shipping inaccurate
   logo copies.
   ============================================================================ */
const SERVICE_CATALOG = {
  "Gmail": { color: "#D4483A", category: "email", initials: "Gm" },
  "Google": { color: "#4285F4", category: "email", initials: "G" },
  "Outlook": { color: "#0A5FC4", category: "email", initials: "Ou" },
  "Yahoo": { color: "#6B21D6", category: "email", initials: "Y!" },
  "Proton Mail": { color: "#6D4AFF", category: "email", initials: "Pm" },
  "Facebook": { color: "#1877F2", category: "social", initials: "f" },
  "Messenger": { color: "#00B2FF", category: "social", initials: "Ms" },
  "Instagram": { color: "#D6336C", category: "social", initials: "Ig" },
  "TikTok": { color: "#1F2937", category: "social", initials: "Tt" },
  "X / Twitter": { color: "#111827", category: "social", initials: "X" },
  "Threads": { color: "#1F2937", category: "social", initials: "@" },
  "Snapchat": { color: "#C9A400", category: "social", initials: "Sc" },
  "Reddit": { color: "#E1521A", category: "social", initials: "r/" },
  "Discord": { color: "#5865F2", category: "gaming", initials: "Ds" },
  "Steam": { color: "#1B2838", category: "gaming", initials: "St" },
  "Roblox": { color: "#1F2937", category: "gaming", initials: "Rb" },
  "Once Human": { color: "#8A6D2F", category: "gaming", initials: "OH" },
  "Epic Games": { color: "#2E2E2E", category: "gaming", initials: "Ep" },
  "Riot Games": { color: "#B0333F", category: "gaming", initials: "Ri" },
  "PlayStation": { color: "#0D3D8C", category: "gaming", initials: "Ps" },
  "Xbox": { color: "#1C8A1C", category: "gaming", initials: "Xb" },
  "Nintendo": { color: "#C81E22", category: "gaming", initials: "Ni" },
  "GCash": { color: "#0072CE", category: "ewallet", initials: "GC" },
  "MariBank": { color: "#0B2E7A", category: "banking", initials: "Mb" },
  "Maya": { color: "#00A85A", category: "ewallet", initials: "My" },
  "GoTyme": { color: "#E0631F", category: "banking", initials: "Gt" },
  "BPI": { color: "#A81E2D", category: "banking", initials: "BPI" },
  "BDO": { color: "#0047AB", category: "banking", initials: "BDO" },
  "Metrobank": { color: "#0A2F5C", category: "banking", initials: "Mt" },
  "UnionBank": { color: "#D6202B", category: "banking", initials: "UB" },
  "Security Bank": { color: "#E07A1F", category: "banking", initials: "SB" },
  "RCBC": { color: "#E0A800", category: "banking", initials: "RC" },
  "Landbank": { color: "#0A6E45", category: "banking", initials: "LB" },
  "PNB": { color: "#7A2233", category: "banking", initials: "PNB" },
  "Shopee": { color: "#E0501F", category: "shopping", initials: "Sh" },
  "Lazada": { color: "#1E2A7A", category: "shopping", initials: "Lz" },
  "Amazon": { color: "#B8871A", category: "shopping", initials: "Am" },
  "Zalora": { color: "#1F2937", category: "shopping", initials: "Za" },
  "GitHub": { color: "#24292E", category: "developer", initials: "Gh" },
  "GitLab": { color: "#C4551F", category: "developer", initials: "Gl" },
  "Netlify": { color: "#0D9E92", category: "hosting", initials: "Nt" },
  "Vercel": { color: "#1F2937", category: "hosting", initials: "▲" },
  "Cloudflare": { color: "#D67A17", category: "hosting", initials: "Cf" },
  "Netflix": { color: "#C11119", category: "entertainment", initials: "Nf" },
  "Spotify": { color: "#189A52", category: "entertainment", initials: "Sp" },
  "YouTube": { color: "#CC2020", category: "entertainment", initials: "Yt" },
  "Disney+": { color: "#0F3A9E", category: "entertainment", initials: "D+" },
  "Microsoft 365": { color: "#D6440E", category: "work", initials: "M365" },
  "Google Workspace": { color: "#3A7CE0", category: "work", initials: "Gw" },
};

function serviceMeta(name, fallbackCategory) {
  return (
    SERVICE_CATALOG[name] || {
      color: "#5C6577",
      category: fallbackCategory || "other",
      initials: (name || "?").slice(0, 2).toUpperCase(),
    }
  );
}
function categoryDef(id) {
  return CATEGORY_DEFS.find((c) => c.id === id) || CATEGORY_DEFS[CATEGORY_DEFS.length - 1];
}

/* ============================================================================
   UTILITIES
   ============================================================================ */
function daysAgo(dateStr) {
  const d = new Date(dateStr);
  const diff = Math.floor((Date.now() - d.getTime()) / 86400000);
  return diff;
}
function timeAgoLabel(dateStr) {
  if (!dateStr) return "Never";
  const d = daysAgo(dateStr);
  if (d <= 0) return "Today";
  if (d === 1) return "Yesterday";
  if (d < 7) return `${d} days ago`;
  if (d < 30) return `${Math.floor(d / 7)}w ago`;
  if (d < 365) return `${Math.floor(d / 30)}mo ago`;
  return `${Math.floor(d / 365)}y ago`;
}
function passwordStrength(pw) {
  if (!pw) return { score: 0, label: "None", color: "var(--red-500)" };
  let score = 0;
  if (pw.length >= 8) score += 20;
  if (pw.length >= 12) score += 20;
  if (pw.length >= 16) score += 10;
  if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) score += 20;
  if (/[0-9]/.test(pw)) score += 15;
  if (/[^A-Za-z0-9]/.test(pw)) score += 15;
  score = Math.min(100, score);
  let label = "Weak", color = "var(--red-500)";
  if (score >= 80) { label = "Strong"; color = "var(--green-500)"; }
  else if (score >= 50) { label = "Fair"; color = "var(--amber-500)"; }
  return { score, label, color };
}
function genPassword(opts) {
  const lower = "abcdefghijkmnopqrstuvwxyz";
  const upper = "ABCDEFGHJKLMNPQRSTUVWXYZ";
  const nums = "23456789";
  const syms = "!@#$%^&*()-_=+[]{}";
  const ambiguousExtra = "lI1O0";
  let pool = "";
  if (opts.lowercase) pool += lower + (opts.excludeAmbiguous ? "" : "lo");
  if (opts.uppercase) pool += upper + (opts.excludeAmbiguous ? "" : "IO");
  if (opts.numbers) pool += nums + (opts.excludeAmbiguous ? "" : "10");
  if (opts.symbols) pool += syms;
  if (!pool) pool = lower;
  let out = "";
  for (let i = 0; i < opts.length; i++) {
    out += pool[Math.floor(Math.random() * pool.length)];
  }
  return out;
}
function computeAccountHealth(account) {
  let score = 0;
  const issues = [];
  const strength = passwordStrength(account.password);
  score += (strength.score / 100) * 30;
  if (strength.score < 50) issues.push("Weak password");
  if (account.twoFAEnabled) score += 30; else issues.push("2FA not enabled");
  if (account.recoveryEmail || account.recoveryPhone) score += 20; else issues.push("Missing recovery information");
  if (account.passwordLastChanged && daysAgo(account.passwordLastChanged) < 365) score += 10;
  else issues.push("Password not changed in over a year");
  score += 10; // reuse penalty applied externally
  return { score: Math.round(Math.min(100, score)), issues };
}
function healthTier(score) {
  if (score >= 80) return { label: "Secure", color: "var(--green-500)", dot: "pav-dot-secure", Icon: ShieldCheck };
  if (score >= 50) return { label: "Needs attention", color: "var(--amber-500)", dot: "pav-dot-attention", Icon: ShieldAlert };
  return { label: "High risk", color: "var(--red-500)", dot: "pav-dot-risk", Icon: Shield };
}
function maskValue(v) {
  if (!v) return "";
  return "•".repeat(Math.min(14, Math.max(8, v.length)));
}

/* ============================================================================
   SEED DATA
   ============================================================================ */
const now = new Date();
const iso = (daysBack) => new Date(now.getTime() - daysBack * 86400000).toISOString();

// Sample data — no longer loaded by default. Kept here in case you want a
// quick way to demo the app; see DEFAULT_ACCOUNTS below.
const DEMO_ACCOUNTS = [
  {
    id: "acc-gmail-personal", service: "Gmail", displayName: "Personal Gmail", category: "email",
    username: "j.delacruz", email: "j.delacruz@gmail.com", phone: "+63 917 555 0142",
    loginUrl: "https://mail.google.com", password: "Marisol!Beach92", twoFAEnabled: true, twoFAMethod: "Authenticator app",
    backupCodesSaved: true, securityQuestions: false, passwordLastChanged: iso(40),
    recoveryEmail: "juan.backup@proton.me", recoveryPhone: "+63 917 555 9981",
    notes: "Primary email — used to recover almost every other account.", tags: ["Personal", "Important", "Recovery"],
    favorite: true, createdAt: iso(920), updatedAt: iso(40), lastAccessed: iso(0),
    customFields: [], relationships: [
      { targetId: "acc-facebook", type: "Recovery email" },
      { targetId: "acc-steam", type: "Login email" },
    ],
  },
  {
    id: "acc-gmail-work", service: "Gmail", displayName: "Work Gmail", category: "work",
    username: "juan.delacruz", email: "juan@northlightstudio.ph", phone: "",
    loginUrl: "https://mail.google.com", password: "Nl$tudio2026Work", twoFAEnabled: true, twoFAMethod: "Security key",
    backupCodesSaved: true, securityQuestions: false, passwordLastChanged: iso(12),
    recoveryEmail: "j.delacruz@gmail.com", recoveryPhone: "",
    notes: "Company Google Workspace account.", tags: ["Work", "Important"],
    favorite: false, createdAt: iso(500), updatedAt: iso(12), lastAccessed: iso(1),
    customFields: [{ id: "cf1", label: "Employee ID", type: "text", value: "NLS-2291" }],
    relationships: [],
  },
  {
    id: "acc-facebook", service: "Facebook", displayName: "Facebook", category: "social",
    username: "juan.delacruz.92", email: "j.delacruz@gmail.com", phone: "+63 917 555 0142",
    loginUrl: "https://facebook.com", password: "SunsetRun2024", twoFAEnabled: false, twoFAMethod: "",
    backupCodesSaved: false, securityQuestions: true, passwordLastChanged: iso(410),
    recoveryEmail: "j.delacruz@gmail.com", recoveryPhone: "",
    notes: "", tags: ["Personal"], favorite: true, createdAt: iso(1400), updatedAt: iso(410), lastAccessed: iso(2),
    customFields: [], relationships: [
      { targetId: "acc-instagram", type: "Connected account" },
      { targetId: "acc-messenger", type: "Parent account" },
    ],
  },
  {
    id: "acc-messenger", service: "Messenger", displayName: "Messenger", category: "social",
    username: "juan.delacruz.92", email: "j.delacruz@gmail.com", phone: "+63 917 555 0142",
    loginUrl: "https://messenger.com", password: "SunsetRun2024", twoFAEnabled: false, twoFAMethod: "",
    backupCodesSaved: false, securityQuestions: false, passwordLastChanged: iso(410),
    recoveryEmail: "", recoveryPhone: "",
    notes: "Linked to Facebook login.", tags: ["Personal"], favorite: false, createdAt: iso(1400), updatedAt: iso(410), lastAccessed: iso(5),
    customFields: [], relationships: [],
  },
  {
    id: "acc-instagram", service: "Instagram", displayName: "Instagram", category: "social",
    username: "juan.dlcz", email: "j.delacruz@gmail.com", phone: "",
    loginUrl: "https://instagram.com", password: "SunsetRun2024", twoFAEnabled: true, twoFAMethod: "SMS",
    backupCodesSaved: false, securityQuestions: false, passwordLastChanged: iso(410),
    recoveryEmail: "j.delacruz@gmail.com", recoveryPhone: "+63 917 555 0142",
    notes: "", tags: ["Personal"], favorite: false, createdAt: iso(1300), updatedAt: iso(410), lastAccessed: iso(1),
    customFields: [], relationships: [{ targetId: "acc-tiktok", type: "Connected account" }],
  },
  {
    id: "acc-tiktok", service: "TikTok", displayName: "TikTok", category: "social",
    username: "juandlcz", email: "j.delacruz@gmail.com", phone: "",
    loginUrl: "https://tiktok.com", password: "Tt#Vault2025!9q", twoFAEnabled: false, twoFAMethod: "",
    backupCodesSaved: false, securityQuestions: false, passwordLastChanged: iso(90),
    recoveryEmail: "", recoveryPhone: "",
    notes: "", tags: [], favorite: false, createdAt: iso(600), updatedAt: iso(90), lastAccessed: iso(3),
    customFields: [], relationships: [],
  },
  {
    id: "acc-steam", service: "Steam", displayName: "Main Steam", category: "gaming",
    username: "delacruz_jr", email: "j.delacruz@gmail.com", phone: "",
    loginUrl: "https://store.steampowered.com", password: "V4ultSteam!2025", twoFAEnabled: true, twoFAMethod: "Steam Guard (mobile)",
    backupCodesSaved: true, securityQuestions: false, passwordLastChanged: iso(60),
    recoveryEmail: "j.delacruz@gmail.com", recoveryPhone: "",
    notes: "Main gaming library.", tags: ["Gaming", "Personal"], favorite: true, createdAt: iso(1600), updatedAt: iso(60), lastAccessed: iso(0),
    customFields: [{ id: "cf2", label: "Steam ID", type: "text", value: "76561198002211903" }],
    relationships: [{ targetId: "acc-once-human", type: "Linked account" }],
  },
  {
    id: "acc-once-human", service: "Once Human", displayName: "Once Human", category: "gaming",
    username: "delacruz_jr", email: "j.delacruz@gmail.com", phone: "",
    loginUrl: "https://oncehuman.game", password: "V4ultSteam!2025", twoFAEnabled: false, twoFAMethod: "",
    backupCodesSaved: false, securityQuestions: false, passwordLastChanged: iso(60),
    recoveryEmail: "", recoveryPhone: "",
    notes: "Linked through Steam.", tags: ["Gaming"], favorite: false, createdAt: iso(200), updatedAt: iso(60), lastAccessed: iso(9),
    customFields: [], relationships: [],
  },
  {
    id: "acc-discord", service: "Discord", displayName: "Discord", category: "gaming",
    username: "delacruz#0192", email: "j.delacruz@gmail.com", phone: "+63 917 555 0142",
    loginUrl: "https://discord.com", password: "Disc0rd!Guild44", twoFAEnabled: true, twoFAMethod: "Authenticator app",
    backupCodesSaved: true, securityQuestions: false, passwordLastChanged: iso(15),
    recoveryEmail: "j.delacruz@gmail.com", recoveryPhone: "",
    notes: "", tags: ["Gaming"], favorite: false, createdAt: iso(800), updatedAt: iso(15), lastAccessed: iso(0),
    customFields: [], relationships: [],
  },
  {
    id: "acc-gcash", service: "GCash", displayName: "GCash", category: "ewallet",
    username: "09175550142", email: "j.delacruz@gmail.com", phone: "+63 917 555 0142",
    loginUrl: "https://gcash.com", password: "MPin: 221199", twoFAEnabled: true, twoFAMethod: "SMS OTP",
    backupCodesSaved: false, securityQuestions: true, passwordLastChanged: iso(20),
    recoveryEmail: "j.delacruz@gmail.com", recoveryPhone: "+63 917 555 9981",
    notes: "Primary e-wallet. Balance tracked in Finance Flow, not here.", tags: ["Important"], favorite: true,
    createdAt: iso(1000), updatedAt: iso(20), lastAccessed: iso(0),
    customFields: [{ id: "cf3", label: "Account Number", type: "text", value: "4921 0091 8823" }],
    relationships: [],
  },
  {
    id: "acc-maya", service: "Maya", displayName: "Maya", category: "ewallet",
    username: "09175550142", email: "j.delacruz@gmail.com", phone: "+63 917 555 0142",
    loginUrl: "https://maya.ph", password: "MayaPin!7743", twoFAEnabled: false, twoFAMethod: "",
    backupCodesSaved: false, securityQuestions: false, passwordLastChanged: iso(500),
    recoveryEmail: "", recoveryPhone: "",
    notes: "", tags: [], favorite: false, createdAt: iso(700), updatedAt: iso(500), lastAccessed: iso(20),
    customFields: [], relationships: [],
  },
  {
    id: "acc-bdo", service: "BDO", displayName: "BDO Savings", category: "banking",
    username: "jdelacruz92", email: "j.delacruz@gmail.com", phone: "+63 917 555 0142",
    loginUrl: "https://online.bdo.com.ph", password: "BdoSecure!2025x", twoFAEnabled: true, twoFAMethod: "SMS OTP",
    backupCodesSaved: false, securityQuestions: true, passwordLastChanged: iso(5),
    recoveryEmail: "j.delacruz@gmail.com", recoveryPhone: "+63 917 555 0142",
    notes: "", tags: ["Important", "Banking"], favorite: true, createdAt: iso(1800), updatedAt: iso(5), lastAccessed: iso(4),
    customFields: [{ id: "cf4", label: "Account Number", type: "text", value: "00381 0221 9938" }],
    relationships: [],
  },
  {
    id: "acc-bpi", service: "BPI", displayName: "BPI Checking", category: "banking",
    username: "juan.delacruz", email: "j.delacruz@gmail.com", phone: "",
    loginUrl: "https://www.bpi.com.ph", password: "Bpi!Checking19", twoFAEnabled: false, twoFAMethod: "",
    backupCodesSaved: false, securityQuestions: false, passwordLastChanged: iso(730),
    recoveryEmail: "", recoveryPhone: "",
    notes: "Rarely used — inherited from previous employer payroll.", tags: [], favorite: false,
    createdAt: iso(2000), updatedAt: iso(730), lastAccessed: iso(140),
    customFields: [], relationships: [],
  },
  {
    id: "acc-netflix", service: "Netflix", displayName: "Netflix", category: "entertainment",
    username: "", email: "j.delacruz@gmail.com", phone: "",
    loginUrl: "https://netflix.com", password: "StreamNight#21", twoFAEnabled: false, twoFAMethod: "",
    backupCodesSaved: false, securityQuestions: false, passwordLastChanged: iso(200),
    recoveryEmail: "", recoveryPhone: "",
    notes: "Family plan, shared with siblings.", tags: ["Subscription"], favorite: false,
    createdAt: iso(900), updatedAt: iso(200), lastAccessed: iso(0),
    customFields: [], relationships: [],
  },
  {
    id: "acc-spotify", service: "Spotify", displayName: "Spotify", category: "entertainment",
    username: "delacruzjr", email: "j.delacruz@gmail.com", phone: "",
    loginUrl: "https://spotify.com", password: "Spot1fyPlaylist!", twoFAEnabled: false, twoFAMethod: "",
    backupCodesSaved: false, securityQuestions: false, passwordLastChanged: iso(150),
    recoveryEmail: "", recoveryPhone: "",
    notes: "", tags: ["Subscription"], favorite: true, createdAt: iso(1100), updatedAt: iso(150), lastAccessed: iso(0),
    customFields: [], relationships: [],
  },
  {
    id: "acc-github", service: "GitHub", displayName: "GitHub", category: "developer",
    username: "jdelacruz-dev", email: "juan@northlightstudio.ph", phone: "",
    loginUrl: "https://github.com", password: "Gh$Commit2025!Key", twoFAEnabled: true, twoFAMethod: "Security key",
    backupCodesSaved: true, securityQuestions: false, passwordLastChanged: iso(8),
    recoveryEmail: "j.delacruz@gmail.com", recoveryPhone: "",
    notes: "Org owner for Northlight Studio repos.", tags: ["Work", "Developer", "Important"], favorite: true,
    createdAt: iso(1500), updatedAt: iso(8), lastAccessed: iso(0),
    customFields: [{ id: "cf5", label: "Org", type: "text", value: "northlight-studio" }],
    relationships: [{ targetId: "acc-vercel", type: "Connected account" }],
  },
  {
    id: "acc-vercel", service: "Vercel", displayName: "Vercel", category: "hosting",
    username: "", email: "juan@northlightstudio.ph", phone: "",
    loginUrl: "https://vercel.com", password: "", twoFAEnabled: true, twoFAMethod: "GitHub SSO",
    backupCodesSaved: false, securityQuestions: false, passwordLastChanged: iso(8),
    recoveryEmail: "", recoveryPhone: "",
    notes: "Sign-in via GitHub SSO — no separate password.", tags: ["Work", "Developer"], favorite: false,
    createdAt: iso(400), updatedAt: iso(8), lastAccessed: iso(2),
    customFields: [], relationships: [],
  },
  {
    id: "acc-shopee", service: "Shopee", displayName: "Shopee", category: "shopping",
    username: "", email: "j.delacruz@gmail.com", phone: "+63 917 555 0142",
    loginUrl: "https://shopee.ph", password: "Shopee!Cart2025", twoFAEnabled: false, twoFAMethod: "",
    backupCodesSaved: false, securityQuestions: false, passwordLastChanged: iso(300),
    recoveryEmail: "", recoveryPhone: "",
    notes: "", tags: [], favorite: false, createdAt: iso(760), updatedAt: iso(300), lastAccessed: iso(6),
    customFields: [], relationships: [],
  },
];

/* ============================================================================
   CONTEXT
   ============================================================================ */
const AppCtx = createContext(null);
const useApp = () => useContext(AppCtx);

/* ============================================================================
   ATOMS
   ============================================================================ */
function ServiceIcon({ account, size = 40, radius = 12 }) {
  const meta = serviceMeta(account.service, account.category);
  const cat = categoryDef(account.category);
  if (account.iconType === "emoji" && account.iconValue) {
    return (
      <div
        className="flex items-center justify-center shrink-0"
        style={{ width: size, height: size, borderRadius: radius, background: "var(--surface-hover)", fontSize: size * 0.5, border: "1px solid var(--border)" }}
      >
        {account.iconValue}
      </div>
    );
  }
  if (account.iconType === "category") {
    const Icon = cat.icon;
    return (
      <div
        className="flex items-center justify-center shrink-0"
        style={{ width: size, height: size, borderRadius: radius, background: cat.color + "26", border: `1px solid ${cat.color}55` }}
      >
        <Icon size={size * 0.5} color={cat.color} strokeWidth={2} />
      </div>
    );
  }
  const label = account.iconValue || meta.initials;
  return (
    <div
      className="flex items-center justify-center shrink-0 pav-font-display"
      style={{
        width: size, height: size, borderRadius: radius, background: meta.color,
        color: "#fff", fontSize: size * 0.34, fontWeight: 600,
      }}
    >
      {label}
    </div>
  );
}

function HealthBadge({ score, compact = false }) {
  const tier = healthTier(score);
  const { Icon } = tier;
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium pav-focus"
      style={{ background: tier.color + "1c", color: tier.color, border: `1px solid ${tier.color}40` }}
    >
      <Icon size={13} strokeWidth={2.25} />
      {!compact && tier.label}
    </span>
  );
}

function CategoryPill({ id }) {
  const cat = categoryDef(id);
  const Icon = cat.icon;
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium" style={{ background: cat.color + "1c", color: cat.color }}>
      <Icon size={12} /> {cat.name}
    </span>
  );
}

function Button({ children, variant = "primary", size = "md", icon: Icon, className = "", ...props }) {
  const sizes = { sm: "text-xs px-3 py-1.5 gap-1.5", md: "text-sm px-4 py-2.5 gap-2", lg: "text-sm px-5 py-3 gap-2" };
  const base = "pav-btn pav-focus inline-flex items-center justify-center rounded-xl font-medium whitespace-nowrap disabled:opacity-40 disabled:pointer-events-none";
  const variants = {
    primary: { background: "var(--accent)", color: "var(--accent-contrast)", border: "1px solid transparent" },
    secondary: { background: "var(--surface-hover)", color: "var(--text-primary)", border: "1px solid var(--border)" },
    ghost: { background: "transparent", color: "var(--text-secondary)", border: "1px solid transparent" },
    danger: { background: "transparent", color: "var(--red-500)", border: "1px solid var(--red-500)55" },
    outline: { background: "transparent", color: "var(--text-primary)", border: "1px solid var(--border)" },
  };
  return (
    <button className={`${base} ${sizes[size]} ${className}`} style={variants[variant]} {...props}>
      {Icon && <Icon size={size === "sm" ? 14 : 16} />}
      {children}
    </button>
  );
}

function IconButton({ icon: Icon, size = 34, active = false, className = "", ...props }) {
  return (
    <button
      className={`pav-btn pav-focus inline-flex items-center justify-center rounded-lg shrink-0 ${className}`}
      style={{
        width: size, height: size,
        background: active ? "var(--accent)" : "var(--surface-hover)",
        color: active ? "var(--accent-contrast)" : "var(--text-secondary)",
        border: "1px solid var(--border)",
      }}
      {...props}
    >
      <Icon size={Math.round(size * 0.48)} />
    </button>
  );
}

function Input({ label, className = "", right, ...props }) {
  return (
    <label className="block">
      {label && <div className="text-xs font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>{label}</div>}
      <div className="relative">
        <input className={`pav-input pav-focus w-full px-3.5 py-2.5 text-sm ${className}`} {...props} />
        {right && <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">{right}</div>}
      </div>
    </label>
  );
}

function Select({ label, className = "", children, ...props }) {
  return (
    <label className="block">
      {label && <div className="text-xs font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>{label}</div>}
      <div className="relative">
        <select className={`pav-input pav-focus w-full px-3.5 py-2.5 text-sm appearance-none pr-9 ${className}`} {...props}>
          {children}
        </select>
        <ChevronDown size={15} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "var(--text-tertiary)" }} />
      </div>
    </label>
  );
}

function Toggle({ checked, onChange, label, sub }) {
  return (
    <label className="flex items-center justify-between gap-3 cursor-pointer select-none py-0.5">
      {(label || sub) && (
        <div>
          {label && <div className="text-sm font-medium">{label}</div>}
          {sub && <div className="text-xs mt-0.5" style={{ color: "var(--text-tertiary)" }}>{sub}</div>}
        </div>
      )}
      <button
        type="button" role="switch" aria-checked={checked}
        onClick={() => onChange(!checked)}
        className="pav-btn pav-focus relative shrink-0 rounded-full"
        style={{ width: 42, height: 24, background: checked ? "var(--accent)" : "var(--ink-500)" }}
      >
        <span
          className="absolute top-1 rounded-full bg-white transition-all"
          style={{ width: 16, height: 16, left: checked ? 22 : 4, transition: "left 0.15s ease" }}
        />
      </button>
    </label>
  );
}

function ProgressRing({ score, size = 92, stroke = 8 }) {
  const tier = healthTier(score);
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (score / 100) * c;
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size / 2} cy={size / 2} r={r} stroke="var(--border)" strokeWidth={stroke} fill="none" />
        <circle
          cx={size / 2} cy={size / 2} r={r} stroke={tier.color} strokeWidth={stroke} fill="none"
          strokeLinecap="round" strokeDasharray={c} strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 0.6s cubic-bezier(.2,.8,.2,1)" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="pav-font-display text-xl font-semibold">{score}%</span>
      </div>
    </div>
  );
}

function CopyField({ label, value, secret = false, revealed, onToggleReveal, mono = true, icon: Icon }) {
  const { showToast } = useApp();
  if (!value) return null;
  const display = secret && !revealed ? maskValue(value) : value;
  const copy = () => {
    navigator.clipboard?.writeText(value).catch(() => {});
    showToast(`${label} copied`);
  };
  return (
    <div className="flex items-center justify-between gap-2 py-2.5" style={{ borderBottom: "1px solid var(--border-soft)" }}>
      <div className="min-w-0 flex-1">
        <div className="text-xs mb-1 flex items-center gap-1.5" style={{ color: "var(--text-tertiary)" }}>
          {Icon && <Icon size={12} />} {label}
        </div>
        <div className={`text-sm truncate ${mono ? "pav-font-mono" : ""}`} style={{ color: "var(--text-primary)" }}>{display}</div>
      </div>
      <div className="flex items-center gap-1 shrink-0">
        {secret && (
          <IconButton icon={revealed ? EyeOff : Eye} size={30} onClick={onToggleReveal} />
        )}
        <IconButton icon={Copy} size={30} onClick={copy} />
      </div>
    </div>
  );
}

function EmptyState({ icon: Icon, title, sub, action }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-6">
      <div className="flex items-center justify-center rounded-2xl mb-4" style={{ width: 56, height: 56, background: "var(--surface-hover)", border: "1px solid var(--border)" }}>
        <Icon size={24} style={{ color: "var(--text-tertiary)" }} />
      </div>
      <div className="text-sm font-semibold mb-1">{title}</div>
      {sub && <div className="text-sm max-w-xs mb-5" style={{ color: "var(--text-tertiary)" }}>{sub}</div>}
      {action}
    </div>
  );
}

function Toast({ message }) {
  if (!message) return null;
  return (
    <div
      className="pav-fade-in fixed left-1/2 -translate-x-1/2 px-4 py-2.5 rounded-xl text-sm font-medium flex items-center gap-2 shadow-lg"
      style={{ bottom: "max(24px, env(safe-area-inset-bottom))", background: "var(--ink-900)", color: "#fff", border: "1px solid var(--ink-700)", zIndex: 400 }}
    >
      <Check size={15} style={{ color: "var(--teal-400)" }} /> {message}
    </div>
  );
}

function ReauthModal({ onConfirm, onCancel }) {
  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);
  return (
    <div className="fixed inset-0 flex items-center justify-center p-4" style={{ background: "rgba(6,8,12,0.6)", zIndex: 300 }} onClick={onCancel}>
      <div className="pav-card pav-slide-up w-full max-w-xs p-6 text-center" onClick={(e) => e.stopPropagation()}>
        <div className="mx-auto mb-3 flex items-center justify-center rounded-2xl" style={{ width: 48, height: 48, background: "var(--teal-glow)" }}>
          <Fingerprint size={22} style={{ color: "var(--accent)" }} />
        </div>
        <div className="text-sm font-semibold mb-1">Confirm it's you</div>
        <div className="text-xs mb-4" style={{ color: "var(--text-tertiary)" }}>Re-enter your PIN to reveal this sensitive field.</div>
        <input
          autoFocus type="password" inputMode="numeric" value={pin} maxLength={4}
          onChange={(e) => { setPin(e.target.value.replace(/\D/g, "")); setError(false); }}
          className="pav-input pav-focus w-full text-center text-lg py-2.5 mb-1"
          placeholder="••••"
        />
        {error && <div className="text-xs mb-2" style={{ color: "var(--red-500)" }}>Incorrect PIN</div>}
        <div className="flex gap-2 mt-4">
          <Button variant="secondary" className="flex-1" onClick={onCancel}>Cancel</Button>
          <Button variant="primary" className="flex-1" onClick={() => { if (pin === "1234") onConfirm(); else setError(true); }}>Confirm</Button>
        </div>
      </div>
    </div>
  );
}

/* ============================================================================
   PIN STORAGE
   This file has no backend, so the PIN only lives in the visitor's own
   browser. We use localStorage when it's available (a real deployment on
   Vercel, for example) and quietly fall back to in-memory storage when it
   isn't (e.g. a sandboxed preview) — the vault still works, it just won't
   remember the PIN across a full page reload in that fallback case.
   The PIN itself is never stored — only a SHA-256 hash of it.
   ============================================================================ */
const PIN_STORAGE_KEY = "pav.pinHash.v1";
const memoryStore = new Map();

function getSafeLocalStorage() {
  try {
    if (typeof window !== "undefined" && window.localStorage) {
      const probeKey = "__pav_probe__";
      window.localStorage.setItem(probeKey, "1");
      window.localStorage.removeItem(probeKey);
      return window.localStorage;
    }
  } catch (e) {
    // Storage blocked (private mode, sandboxed preview, etc.) — fall back below.
  }
  return null;
}
function storageGet(key) {
  const ls = getSafeLocalStorage();
  if (ls) return ls.getItem(key);
  return memoryStore.has(key) ? memoryStore.get(key) : null;
}
function storageSet(key, value) {
  const ls = getSafeLocalStorage();
  if (ls) { ls.setItem(key, value); return; }
  memoryStore.set(key, value);
}
function storageRemove(key) {
  const ls = getSafeLocalStorage();
  if (ls) { ls.removeItem(key); return; }
  memoryStore.delete(key);
}
async function hashPin(pin) {
  if (typeof window !== "undefined" && window.crypto?.subtle) {
    try {
      const bytes = new TextEncoder().encode(`pav-vault-pin::${pin}`);
      const digest = await window.crypto.subtle.digest("SHA-256", bytes);
      return Array.from(new Uint8Array(digest)).map((b) => b.toString(16).padStart(2, "0")).join("");
    } catch (e) { /* fall through */ }
  }
  return `plain:${pin}`; // only reached if SubtleCrypto is unavailable
}

/* ============================================================================
   PIN PAD (shared by first-time setup, unlocking, and changing your PIN)
   ============================================================================ */
function PinPad({ heading, subheading, pinLength, error, shake, value, onDigit, onBackspace, footer, onForgot }) {
  return (
    <div className="w-full max-w-xs flex flex-col items-center pav-fade-in">
      <div className="flex items-center justify-center mb-5 rounded-3xl" style={{ width: 64, height: 64, background: "linear-gradient(155deg, var(--teal-500), #0C6E63)" }}>
        <Lock size={26} color="#fff" strokeWidth={2} />
      </div>
      <div className="pav-font-display text-lg font-semibold mb-1 text-center">{heading}</div>
      <div className="text-xs mb-8 text-center" style={{ color: error ? "var(--red-500)" : "var(--text-tertiary)" }}>{subheading}</div>

      <div className={`flex items-center gap-3 mb-8 ${shake ? "pav-shake" : ""}`} style={shake ? { animation: "pavShake 0.4s" } : {}}>
        {Array.from({ length: pinLength }).map((_, i) => (
          <div
            key={i} className="rounded-full transition-all"
            style={{
              width: 14, height: 14,
              background: i < value.length ? (error ? "var(--red-500)" : "var(--accent)") : "transparent",
              border: `2px solid ${i < value.length ? (error ? "var(--red-500)" : "var(--accent)") : "var(--border)"}`,
            }}
          />
        ))}
      </div>
      <style>{`@keyframes pavShake { 10%,90%{transform:translateX(-2px)} 20%,80%{transform:translateX(4px)} 30%,50%,70%{transform:translateX(-8px)} 40%,60%{transform:translateX(8px)} }`}</style>

      <div className="grid grid-cols-3 gap-3 w-full">
        {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((d) => (
          <button key={d} onClick={() => onDigit(d)} className="pav-btn pav-focus pav-font-display rounded-2xl text-lg font-medium py-4" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
            {d}
          </button>
        ))}
        <button onClick={() => {}} className="rounded-2xl py-4 flex items-center justify-center text-xs" style={{ color: "var(--text-tertiary)" }}>
          <Fingerprint size={20} />
        </button>
        <button onClick={() => onDigit("0")} className="pav-btn pav-focus pav-font-display rounded-2xl text-lg font-medium py-4" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>0</button>
        <button onClick={onBackspace} className="rounded-2xl py-4 flex items-center justify-center" style={{ color: "var(--text-tertiary)" }}>
          <Delete size={20} />
        </button>
      </div>
      {footer && <div className="text-xs mt-8 text-center" style={{ color: "var(--text-tertiary)" }}>{footer}</div>}
      {onForgot && (
        <button onClick={onForgot} className="pav-focus text-xs mt-4 underline" style={{ color: "var(--text-tertiary)" }}>
          Forgot your PIN?
        </button>
      )}
    </div>
  );
}

/* ============================================================================
   LOCK SCREEN — first launch asks you to create your own PIN; after that it
   just asks you to enter it. Nothing here is sent anywhere; the PIN (as a
   hash, never in plain text) stays in your own browser.
   ============================================================================ */
function LockScreen({ theme, hasPin, onVerifyPin, onSetPin, onForgotPin, onUnlock }) {
  const [stage, setStage] = useState(hasPin ? "unlock" : "create"); // create -> confirm -> unlock
  const [pin, setPin] = useState("");
  const [firstPin, setFirstPin] = useState("");
  const [error, setError] = useState(false);
  const [shake, setShake] = useState(false);
  const [busy, setBusy] = useState(false);

  const fail = (resetTo) => {
    setError(true); setShake(true);
    setTimeout(() => { setShake(false); setPin(""); setError(false); if (resetTo) setStage(resetTo); }, 420);
  };

  const submit = async (val) => {
    if (val.length !== 4 || busy) return;
    setBusy(true);
    try {
      if (stage === "unlock") {
        const ok = await onVerifyPin(val);
        if (ok) onUnlock(); else fail();
      } else if (stage === "create") {
        setFirstPin(val);
        setPin("");
        setStage("confirm");
      } else if (stage === "confirm") {
        if (val === firstPin) {
          await onSetPin(val);
          onUnlock();
        } else {
          setFirstPin("");
          fail("create");
        }
      }
    } finally {
      setBusy(false);
    }
  };

  const press = (d) => {
    if (pin.length >= 4 || busy) return;
    const next = pin + d;
    setPin(next); setError(false);
    if (next.length === 4) setTimeout(() => submit(next), 120);
  };
  const backspace = () => setPin((p) => p.slice(0, -1));

  const copy = {
    unlock: { heading: "Personal Account Vault", subheading: error ? "Incorrect PIN — try again" : "Enter your PIN to unlock" },
    create: { heading: "Create your PIN", subheading: "Choose a 4-digit PIN to protect this vault" },
    confirm: { heading: "Confirm your PIN", subheading: error ? "PINs didn't match — let's try again" : "Enter it once more to confirm" },
  }[stage];

  return (
    <div className="pav-root fixed inset-0 flex flex-col items-center justify-center px-6" data-theme={theme} style={{ background: "var(--bg)", color: "var(--text-primary)" }}>
      <style>{STYLES}</style>
      <PinPad
        heading={copy.heading}
        subheading={copy.subheading}
        pinLength={4}
        error={error}
        shake={shake}
        value={pin}
        onDigit={press}
        onBackspace={backspace}
        onForgot={stage === "unlock" ? onForgotPin : null}
        footer={stage !== "unlock" ? "Only you will know this PIN — it's not sent anywhere." : null}
      />
    </div>
  );
}

/* ============================================================================
   NAVIGATION
   ============================================================================ */
const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: Home },
  { id: "accounts", label: "Accounts", icon: Folder },
  { id: "map", label: "Account Map", icon: Network },
  { id: "security", label: "Security Center", icon: Shield },
  { id: "categories", label: "Categories", icon: Tag },
  { id: "settings", label: "Settings", icon: SettingsIcon },
];
const NAV_MOBILE = ["dashboard", "accounts", "map", "security", "settings"];

function Sidebar({ view, setView, accountCount, securityScore }) {
  return (
    <aside className="hidden md:flex flex-col w-64 shrink-0 h-screen sticky top-0 pav-scrollbar overflow-y-auto" style={{ background: "var(--surface)", borderRight: "1px solid var(--border)" }}>
      <div className="px-5 pt-6 pb-5 flex items-center gap-2.5" style={{ borderBottom: "1px solid var(--border-soft)" }}>
        <div className="flex items-center justify-center rounded-xl shrink-0" style={{ width: 34, height: 34, background: "linear-gradient(155deg, var(--teal-500), #0C6E63)" }}>
          <Lock size={16} color="#fff" />
        </div>
        <div>
          <div className="pav-font-display text-sm font-semibold leading-tight">Account Vault</div>
          <div className="text-xs " style={{ color: "var(--text-tertiary)" }}>{accountCount} accounts secured</div>
        </div>
      </div>
      <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const active = view === item.id;
          return (
            <button
              key={item.id} onClick={() => setView(item.id)}
              className="pav-btn pav-focus flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-left"
              style={{ background: active ? "var(--surface-hover)" : "transparent", color: active ? "var(--accent)" : "var(--text-secondary)" }}
            >
              <Icon size={17} strokeWidth={2.1} />
              {item.label}
              {item.id === "security" && (
                <span className="ml-auto text-xs pav-font-mono" style={{ color: healthTier(securityScore).color }}>{securityScore}%</span>
              )}
            </button>
          );
        })}
      </nav>
      <div className="px-5 py-4 text-xs " style={{ color: "var(--text-tertiary)", borderTop: "1px solid var(--border-soft)" }}>
        Separate from Finance Flow — this vault stores access, not balances.
      </div>
    </aside>
  );
}

function BottomNav({ view, setView, onAdd }) {
  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 flex items-stretch"
      style={{ background: "var(--surface)", borderTop: "1px solid var(--border)", paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      {NAV_MOBILE.slice(0, 2).map((id) => {
        const item = NAV_ITEMS.find((n) => n.id === id);
        const Icon = item.icon; const active = view === id;
        return (
          <button key={id} onClick={() => setView(id)} className="pav-focus flex-1 flex flex-col items-center justify-center gap-1 py-2.5">
            <Icon size={20} strokeWidth={2.1} style={{ color: active ? "var(--accent)" : "var(--text-tertiary)" }} />
            <span className="text-xs font-medium" style={{ color: active ? "var(--accent)" : "var(--text-tertiary)" }}>{item.label.split(" ")[0]}</span>
          </button>
        );
      })}
      <button onClick={onAdd} className="pav-focus flex-1 flex flex-col items-center justify-center">
        <div className="flex items-center justify-center rounded-full -mt-5 shadow-lg" style={{ width: 46, height: 46, background: "var(--accent)" }}>
          <Plus size={22} color="var(--accent-contrast)" />
        </div>
      </button>
      {NAV_MOBILE.slice(2).map((id) => {
        const item = NAV_ITEMS.find((n) => n.id === id);
        const Icon = item.icon; const active = view === id;
        return (
          <button key={id} onClick={() => setView(id)} className="pav-focus flex-1 flex flex-col items-center justify-center gap-1 py-2.5">
            <Icon size={20} strokeWidth={2.1} style={{ color: active ? "var(--accent)" : "var(--text-tertiary)" }} />
            <span className="text-xs font-medium" style={{ color: active ? "var(--accent)" : "var(--text-tertiary)" }}>{item.label.split(" ")[0]}</span>
          </button>
        );
      })}
    </nav>
  );
}

function TopBar({ search, setSearch, theme, setTheme, onAdd, onLock }) {
  const cycleTheme = () => setTheme(theme === "dark" ? "light" : "dark");
  return (
    <div className="sticky top-0 z-30 flex items-center gap-3 px-4 md:px-8 py-3.5" style={{ background: "var(--bg)", borderBottom: "1px solid var(--border-soft)" }}>
      <div className="relative flex-1 max-w-md">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--text-tertiary)" }} />
        <input
          value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder="Search accounts, usernames, tags…"
          className="pav-input pav-focus w-full pl-9 pr-3 py-2.5 text-sm"
        />
      </div>
      <div className="flex items-center gap-2 ml-auto">
        <IconButton icon={theme === "dark" ? Sun : Moon} onClick={cycleTheme} />
        <div className="hidden sm:block"><Button variant="primary" icon={Plus} onClick={onAdd}>Add Account</Button></div>
        <IconButton icon={Lock} onClick={onLock} />
      </div>
    </div>
  );
}

/* ============================================================================
   DASHBOARD
   ============================================================================ */
function AccountRow({ account, onClick }) {
  const health = computeAccountHealth(account);
  return (
    <button onClick={onClick} className="pav-btn pav-focus w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left" style={{ background: "transparent" }}
      onMouseEnter={(e) => (e.currentTarget.style.background = "var(--surface-hover)")}
      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
    >
      <ServiceIcon account={account} size={36} radius={10} />
      <div className="min-w-0 flex-1">
        <div className="text-sm font-medium truncate">{account.displayName || account.service}</div>
        <div className="text-xs truncate" style={{ color: "var(--text-tertiary)" }}>{account.email || account.username || "—"}</div>
      </div>
      <div className="hidden sm:block"><CategoryPill id={account.category} /></div>
      <div className="text-xs w-16 text-right shrink-0" style={{ color: "var(--text-tertiary)" }}>{timeAgoLabel(account.lastAccessed)}</div>
      <span className={`w-2 h-2 rounded-full shrink-0 ${healthTier(health.score).dot}`} />
    </button>
  );
}

function StatCard({ icon: Icon, label, value, accent }) {
  return (
    <div className="pav-card p-4 flex items-center gap-3">
      <div className="flex items-center justify-center rounded-xl shrink-0" style={{ width: 40, height: 40, background: (accent || "var(--accent)") + "1c" }}>
        <Icon size={18} style={{ color: accent || "var(--accent)" }} />
      </div>
      <div>
        <div className="pav-font-display text-xl font-semibold leading-none">{value}</div>
        <div className="text-xs mt-1" style={{ color: "var(--text-tertiary)" }}>{label}</div>
      </div>
    </div>
  );
}

function Dashboard({ accounts, setView, openDetail, openAdd }) {
  const total = accounts.length;
  const favorites = accounts.filter((a) => a.favorite).length;
  const withoutTwoFA = accounts.filter((a) => !a.twoFAEnabled).length;
  const recentlyAdded = [...accounts].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);
  const recentlyAccessed = [...accounts].sort((a, b) => new Date(b.lastAccessed) - new Date(a.lastAccessed)).slice(0, 5);
  const needsAttention = accounts.filter((a) => computeAccountHealth(a).score < 80).length;
  const overallScore = Math.round(accounts.reduce((s, a) => s + computeAccountHealth(a).score, 0) / (total || 1));

  const quickActions = [
    { label: "Add Account", icon: Plus, action: openAdd },
    { label: "Favorites", icon: Star, action: () => setView("accounts:favorites") },
    { label: "Security Center", icon: Shield, action: () => setView("security") },
    { label: "Account Map", icon: Network, action: () => setView("map") },
  ];

  return (
    <div className="px-4 md:px-8 py-6 pb-24 md:pb-10 max-w-6xl mx-auto pav-fade-in">
      <div className="flex items-end justify-between mb-6 gap-4 flex-wrap">
        <div>
          <div className="pav-font-display text-2xl font-semibold">Good to see you.</div>
          <div className="text-sm mt-1" style={{ color: "var(--text-tertiary)" }}>Here's where everything stands across your vault.</div>
        </div>
        <div className="hidden md:flex"><Button variant="primary" icon={Plus} onClick={openAdd}>Add Account</Button></div>
      </div>

      {total === 0 && (
        <div className="pav-card pav-card-hero p-8 mb-6 flex flex-col items-center text-center">
          <div className="flex items-center justify-center mb-4 rounded-2xl" style={{ width: 56, height: 56, background: "linear-gradient(155deg, var(--teal-500), #0C6E63)" }}>
            <Lock size={24} color="#fff" />
          </div>
          <div className="pav-font-display text-lg font-semibold mb-1">Your vault is empty</div>
          <div className="text-sm max-w-sm mb-5" style={{ color: "var(--text-tertiary)" }}>
            Add your first account to start tracking logins, security health, and recovery info in one place.
          </div>
          <Button variant="primary" icon={Plus} onClick={openAdd}>Add your first account</Button>
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <StatCard icon={Folder} label="Total accounts" value={total} />
        <StatCard icon={Star} label="Favorites" value={favorites} accent="var(--brass-400)" />
        <StatCard icon={AlertTriangle} label="Need attention" value={needsAttention} accent="var(--amber-500)" />
        <StatCard icon={ShieldAlert} label="Without 2FA" value={withoutTwoFA} accent="var(--red-500)" />
      </div>

      <div className="grid lg:grid-cols-3 gap-4 mb-6">
        <div className="pav-card pav-card-hero p-5 lg:col-span-1 flex flex-col items-center justify-center text-center">
          <div className="text-xs font-medium mb-4" style={{ color: "var(--text-tertiary)" }}>VAULT SECURITY SCORE</div>
          <ProgressRing score={overallScore} size={120} stroke={10} />
          <button onClick={() => setView("security")} className="pav-focus mt-4 text-xs font-medium flex items-center gap-1" style={{ color: "var(--accent)" }}>
            Open Security Center <ArrowUpRight size={13} />
          </button>
        </div>

        <div className="pav-card p-5 lg:col-span-2">
          <div className="text-sm font-semibold mb-3">Quick actions</div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {quickActions.map((qa) => {
              const Icon = qa.icon;
              return (
                <button key={qa.label} onClick={qa.action} className="pav-btn pav-focus flex flex-col items-center justify-center gap-2 rounded-xl py-4 text-center" style={{ background: "var(--surface-hover)", border: "1px solid var(--border)" }}>
                  <Icon size={18} style={{ color: "var(--accent)" }} />
                  <span className="text-xs font-medium">{qa.label}</span>
                </button>
              );
            })}
          </div>
          <div className="mt-4 pt-4 flex items-center justify-between gap-3 flex-wrap" style={{ borderTop: "1px solid var(--border-soft)" }}>
            <div className="text-xs" style={{ color: "var(--text-tertiary)" }}>
              This vault only manages access and credentials — balances and transactions live in Finance Flow.
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <div className="pav-card p-5">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm font-semibold">Recently added</div>
            <button onClick={() => setView("accounts")} className="pav-focus text-xs font-medium" style={{ color: "var(--accent)" }}>See all</button>
          </div>
          <div className="flex flex-col">
            {recentlyAdded.map((a) => <AccountRow key={a.id} account={a} onClick={() => openDetail(a.id)} />)}
          </div>
        </div>
        <div className="pav-card p-5">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm font-semibold">Recently accessed</div>
            <button onClick={() => setView("accounts")} className="pav-focus text-xs font-medium" style={{ color: "var(--accent)" }}>See all</button>
          </div>
          <div className="flex flex-col">
            {recentlyAccessed.map((a) => <AccountRow key={a.id} account={a} onClick={() => openDetail(a.id)} />)}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================================================================
   ACCOUNTS VIEW
   ============================================================================ */
function AccountCard({ account, onClick, onToggleFavorite }) {
  const health = computeAccountHealth(account);
  const tier = healthTier(health.score);
  return (
    <div onClick={onClick} className="pav-card pav-btn p-4 cursor-pointer flex flex-col gap-3" style={{}}
      onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--accent)")}
      onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
    >
      <div className="flex items-start justify-between">
        <ServiceIcon account={account} size={42} radius={12} />
        <button
          onClick={(e) => { e.stopPropagation(); onToggleFavorite(account.id); }}
          className="pav-focus p-1 -mr-1 -mt-1"
        >
          <Star size={17} fill={account.favorite ? "var(--brass-400)" : "none"} color={account.favorite ? "var(--brass-400)" : "var(--text-tertiary)"} />
        </button>
      </div>
      <div className="min-w-0">
        <div className="text-sm font-semibold truncate">{account.displayName || account.service}</div>
        <div className="text-xs truncate mt-0.5" style={{ color: "var(--text-tertiary)" }}>{account.email || account.username || "No login set"}</div>
      </div>
      <div className="flex items-center justify-between mt-1">
        <CategoryPill id={account.category} />
        <span className="inline-flex items-center gap-1 text-xs font-medium" style={{ color: tier.color }}>
          <span className={`w-1.5 h-1.5 rounded-full ${tier.dot}`} /> {tier.label}
        </span>
      </div>
    </div>
  );
}

function AccountListRow({ account, onClick, onToggleFavorite }) {
  const health = computeAccountHealth(account);
  const tier = healthTier(health.score);
  return (
    <div onClick={onClick} className="pav-btn flex items-center gap-3 px-3 py-3 rounded-xl cursor-pointer" style={{ borderBottom: "1px solid var(--border-soft)" }}
      onMouseEnter={(e) => (e.currentTarget.style.background = "var(--surface-hover)")}
      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
    >
      <ServiceIcon account={account} size={38} radius={10} />
      <div className="min-w-0 flex-1">
        <div className="text-sm font-medium truncate">{account.displayName || account.service}</div>
        <div className="text-xs truncate" style={{ color: "var(--text-tertiary)" }}>{account.email || account.username || "—"}</div>
      </div>
      <div className="hidden md:block w-32"><CategoryPill id={account.category} /></div>
      <div className="hidden sm:flex items-center gap-1 text-xs font-medium w-28" style={{ color: tier.color }}>
        <span className={`w-1.5 h-1.5 rounded-full ${tier.dot}`} /> {tier.label}
      </div>
      <div className="hidden lg:block text-xs w-20 text-right" style={{ color: "var(--text-tertiary)" }}>{timeAgoLabel(account.lastAccessed)}</div>
      <button onClick={(e) => { e.stopPropagation(); onToggleFavorite(account.id); }} className="pav-focus p-1 shrink-0">
        <Star size={16} fill={account.favorite ? "var(--brass-400)" : "none"} color={account.favorite ? "var(--brass-400)" : "var(--text-tertiary)"} />
      </button>
    </div>
  );
}

function AccountsView({ accounts, search, initialFilter, openDetail, toggleFavorite, openAdd }) {
  const [viewMode, setViewMode] = useState("grid");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [securityFilter, setSecurityFilter] = useState("all");
  const [favOnly, setFavOnly] = useState(initialFilter === "favorites");
  const [sortBy, setSortBy] = useState("recent");
  const [showFilters, setShowFilters] = useState(false);
  const [groupByService, setGroupByService] = useState(true);

  useEffect(() => { setFavOnly(initialFilter === "favorites"); }, [initialFilter]);

  const filtered = useMemo(() => {
    let list = accounts.filter((a) => {
      const q = search.trim().toLowerCase();
      const matchesSearch = !q || [a.displayName, a.service, a.username, a.email, a.category, ...(a.tags || []), a.notes]
        .filter(Boolean).some((f) => f.toLowerCase().includes(q));
      const matchesCategory = categoryFilter === "all" || a.category === categoryFilter;
      const health = computeAccountHealth(a).score;
      const matchesSecurity = securityFilter === "all"
        || (securityFilter === "secure" && health >= 80)
        || (securityFilter === "attention" && health >= 50 && health < 80)
        || (securityFilter === "risk" && health < 50);
      const matchesFav = !favOnly || a.favorite;
      return matchesSearch && matchesCategory && matchesSecurity && matchesFav;
    });
    list.sort((a, b) => {
      if (sortBy === "alpha") return (a.displayName || a.service).localeCompare(b.displayName || b.service);
      if (sortBy === "recent") return new Date(b.lastAccessed) - new Date(a.lastAccessed);
      if (sortBy === "added") return new Date(b.createdAt) - new Date(a.createdAt);
      return 0;
    });
    return list;
  }, [accounts, search, categoryFilter, securityFilter, favOnly, sortBy]);

  const grouped = useMemo(() => {
    if (!groupByService) return null;
    const map = new Map();
    filtered.forEach((a) => {
      const key = a.service;
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(a);
    });
    return Array.from(map.entries());
  }, [filtered, groupByService]);

  return (
    <div className="px-4 md:px-8 py-6 pb-24 md:pb-10 max-w-6xl mx-auto pav-fade-in">
      <div className="flex items-center justify-between mb-1 gap-3 flex-wrap">
        <div>
          <div className="pav-font-display text-2xl font-semibold">{favOnly ? "Favorites" : "All accounts"}</div>
          <div className="text-sm mt-1" style={{ color: "var(--text-tertiary)" }}>{filtered.length} of {accounts.length} accounts</div>
        </div>
        <div className="flex items-center gap-2">
          <IconButton icon={SlidersHorizontal} active={showFilters} onClick={() => setShowFilters((s) => !s)} />
          <IconButton icon={LayoutGrid} active={viewMode === "grid"} onClick={() => setViewMode("grid")} />
          <IconButton icon={List} active={viewMode === "list"} onClick={() => setViewMode("list")} />
        </div>
      </div>

      {showFilters && (
        <div className="pav-card pav-slide-up p-4 my-4 grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <Select label="Category" value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
            <option value="all">All categories</option>
            {CATEGORY_DEFS.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </Select>
          <Select label="Security status" value={securityFilter} onChange={(e) => setSecurityFilter(e.target.value)}>
            <option value="all">All statuses</option>
            <option value="secure">Secure</option>
            <option value="attention">Needs attention</option>
            <option value="risk">High risk</option>
          </Select>
          <Select label="Sort by" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="recent">Recently accessed</option>
            <option value="added">Recently added</option>
            <option value="alpha">Alphabetical</option>
          </Select>
          <div className="flex flex-col gap-2 justify-end">
            <Toggle checked={favOnly} onChange={setFavOnly} label="Favorites only" />
            <Toggle checked={groupByService} onChange={setGroupByService} label="Group by service" />
          </div>
        </div>
      )}

      <div className="mt-5">
        {filtered.length === 0 ? (
          <EmptyState
            icon={Folder} title="No accounts match"
            sub="Try adjusting your filters or search, or add a new account to your vault."
            action={<Button variant="primary" icon={Plus} onClick={openAdd}>Add Account</Button>}
          />
        ) : groupByService ? (
          <div className="flex flex-col gap-6">
            {grouped.map(([service, list]) => (
              <div key={service}>
                <div className="flex items-center gap-2 mb-2.5">
                  <ServiceIcon account={list[0]} size={22} radius={6} />
                  <span className="text-sm font-semibold">{service}</span>
                  <span className="text-xs" style={{ color: "var(--text-tertiary)" }}>{list.length} account{list.length > 1 ? "s" : ""}</span>
                </div>
                {viewMode === "grid" ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {list.map((a) => <AccountCard key={a.id} account={a} onClick={() => openDetail(a.id)} onToggleFavorite={toggleFavorite} />)}
                  </div>
                ) : (
                  <div className="pav-card px-2">{list.map((a) => <AccountListRow key={a.id} account={a} onClick={() => openDetail(a.id)} onToggleFavorite={toggleFavorite} />)}</div>
                )}
              </div>
            ))}
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {filtered.map((a) => <AccountCard key={a.id} account={a} onClick={() => openDetail(a.id)} onToggleFavorite={toggleFavorite} />)}
          </div>
        ) : (
          <div className="pav-card px-2">{filtered.map((a) => <AccountListRow key={a.id} account={a} onClick={() => openDetail(a.id)} onToggleFavorite={toggleFavorite} />)}</div>
        )}
      </div>
    </div>
  );
}

/* ============================================================================
   ACCOUNT DETAIL PANEL
   ============================================================================ */
function AccountDetail({ account, allAccounts, onClose, onEdit, onDelete, onToggleFavorite, reusedIds }) {
  const { showToast } = useApp();
  const [tab, setTab] = useState("overview");
  const [revealField, setRevealField] = useState(null);
  const [pendingReveal, setPendingReveal] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(false);

  if (!account) return null;
  const health = computeAccountHealth(account);
  const tier = healthTier(health.score);
  const strength = passwordStrength(account.password);
  const isReused = reusedIds.has(account.id);

  const requestReveal = (field) => {
    if (revealField === field) { setRevealField(null); return; }
    setPendingReveal(field);
  };
  const confirmReveal = () => { setRevealField(pendingReveal); setPendingReveal(null); };

  const related = (account.relationships || []).map((r) => ({ ...r, target: allAccounts.find((a) => a.id === r.targetId) })).filter((r) => r.target);
  const incoming = allAccounts.filter((a) => (a.relationships || []).some((r) => r.targetId === account.id))
    .map((a) => ({ source: a, type: (a.relationships.find((r) => r.targetId === account.id) || {}).type }));

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "security", label: "Security" },
    { id: "recovery", label: "Recovery" },
    { id: "notes", label: "Notes & fields" },
  ];

  return (
    <div className="fixed inset-0 flex justify-end" style={{ zIndex: 150 }}>
      <div className="absolute inset-0 pav-fade-in" style={{ background: "rgba(6,8,12,0.55)" }} onClick={onClose} />
      <div className="pav-slide-in-right relative w-full sm:max-w-lg h-full flex flex-col pav-scrollbar overflow-y-auto" style={{ background: "var(--bg)", borderLeft: "1px solid var(--border)" }}>
        {/* Header */}
        <div className="sticky top-0 z-10 px-5 pt-5 pb-4" style={{ background: "var(--bg)", borderBottom: "1px solid var(--border-soft)" }}>
          <div className="flex items-center justify-between mb-4">
            <button onClick={onClose} className="pav-focus flex items-center gap-1.5 text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
              <ArrowLeft size={16} /> Back
            </button>
            <div className="flex items-center gap-1.5">
              <IconButton icon={Star} active={account.favorite} onClick={() => onToggleFavorite(account.id)} />
              <IconButton icon={Pencil} onClick={() => onEdit(account.id)} />
              <IconButton icon={Trash2} onClick={() => setConfirmDelete(true)} />
            </div>
          </div>
          <div className="flex items-start gap-3">
            <ServiceIcon account={account} size={52} radius={14} />
            <div className="min-w-0 flex-1">
              <div className="pav-font-display text-lg font-semibold truncate">{account.displayName || account.service}</div>
              <div className="text-xs truncate mt-0.5" style={{ color: "var(--text-tertiary)" }}>{account.service} · {account.email || account.username || "—"}</div>
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                <CategoryPill id={account.category} />
                <HealthBadge score={health.score} />
                {isReused && (
                  <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium" style={{ background: "var(--red-500)1c", color: "var(--red-500)" }}>
                    <AlertTriangle size={12} /> Reused password
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 px-5 pt-3 shrink-0" style={{ borderBottom: "1px solid var(--border-soft)" }}>
          {tabs.map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)} className="pav-focus px-3 py-2 text-sm font-medium relative"
              style={{ color: tab === t.id ? "var(--accent)" : "var(--text-tertiary)" }}>
              {t.label}
              {tab === t.id && <span className="absolute left-0 right-0 -bottom-px h-0.5 rounded-full" style={{ background: "var(--accent)" }} />}
            </button>
          ))}
        </div>

        <div className="px-5 py-4 flex-1">
          {tab === "overview" && (
            <div className="pav-fade-in">
              <div className="flex items-center gap-3 mb-4">
                <Button variant="secondary" size="sm" icon={Copy} onClick={() => { navigator.clipboard?.writeText(account.username || account.email || ""); showToast("Login copied"); }}>Copy login</Button>
                {account.loginUrl && (
                  <a href={account.loginUrl} target="_blank" rel="noreferrer" className="pav-focus inline-flex items-center gap-1.5 text-xs font-medium" style={{ color: "var(--accent)" }}>
                    Open site <ArrowUpRight size={13} />
                  </a>
                )}
              </div>
              <CopyField label="Username" value={account.username} icon={CircleUser} />
              <CopyField label="Email" value={account.email} icon={Mail} />
              <CopyField label="Phone" value={account.phone} icon={Phone} />
              <CopyField
                label="Password" value={account.password} secret mono
                revealed={revealField === "password"} onToggleReveal={() => requestReveal("password")}
                icon={KeyRound}
              />
              <div className="flex items-center justify-between py-2.5" style={{ borderBottom: "1px solid var(--border-soft)" }}>
                <div className="text-xs" style={{ color: "var(--text-tertiary)" }}>Password strength</div>
                <div className="flex items-center gap-2 w-32">
                  <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: "var(--border)" }}>
                    <div className="h-full rounded-full" style={{ width: `${strength.score}%`, background: strength.color }} />
                  </div>
                  <span className="text-xs font-medium" style={{ color: strength.color }}>{strength.label}</span>
                </div>
              </div>
              <CopyField label="Login URL" value={account.loginUrl} icon={Globe} mono={false} />
              {(account.tags || []).length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-3">
                  {account.tags.map((t) => (
                    <span key={t} className="text-xs px-2.5 py-1 rounded-full" style={{ background: "var(--surface-hover)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>{t}</span>
                  ))}
                </div>
              )}
            </div>
          )}

          {tab === "security" && (
            <div className="pav-fade-in">
              <div className="flex items-center justify-between py-2.5" style={{ borderBottom: "1px solid var(--border-soft)" }}>
                <div className="text-sm">Two-factor authentication</div>
                <span className="text-xs font-medium inline-flex items-center gap-1.5" style={{ color: account.twoFAEnabled ? "var(--green-500)" : "var(--red-500)" }}>
                  {account.twoFAEnabled ? <ShieldCheck size={14} /> : <ShieldAlert size={14} />}
                  {account.twoFAEnabled ? (account.twoFAMethod || "Enabled") : "Not enabled"}
                </span>
              </div>
              <div className="flex items-center justify-between py-2.5" style={{ borderBottom: "1px solid var(--border-soft)" }}>
                <div className="text-sm">Backup codes saved</div>
                <span className="text-xs font-medium" style={{ color: account.backupCodesSaved ? "var(--green-500)" : "var(--text-tertiary)" }}>{account.backupCodesSaved ? "Yes" : "No"}</span>
              </div>
              <div className="flex items-center justify-between py-2.5" style={{ borderBottom: "1px solid var(--border-soft)" }}>
                <div className="text-sm">Security questions set</div>
                <span className="text-xs font-medium" style={{ color: account.securityQuestions ? "var(--green-500)" : "var(--text-tertiary)" }}>{account.securityQuestions ? "Yes" : "No"}</span>
              </div>
              <div className="flex items-center justify-between py-2.5" style={{ borderBottom: "1px solid var(--border-soft)" }}>
                <div className="text-sm">Password last changed</div>
                <span className="text-xs pav-font-mono" style={{ color: "var(--text-tertiary)" }}>{timeAgoLabel(account.passwordLastChanged)}</span>
              </div>
              {health.issues.length > 0 && (
                <div className="mt-4 rounded-xl p-3.5" style={{ background: tier.color + "12", border: `1px solid ${tier.color}35` }}>
                  <div className="text-xs font-semibold mb-2 flex items-center gap-1.5" style={{ color: tier.color }}><AlertTriangle size={13} /> Recommended improvements</div>
                  <ul className="text-xs space-y-1" style={{ color: "var(--text-secondary)" }}>
                    {health.issues.map((iss) => <li key={iss}>• {iss}</li>)}
                    {isReused && <li>• Password reused on another account</li>}
                  </ul>
                </div>
              )}
            </div>
          )}

          {tab === "recovery" && (
            <div className="pav-fade-in">
              <CopyField label="Recovery email" value={account.recoveryEmail} icon={Mail} mono={false} />
              <CopyField label="Recovery phone" value={account.recoveryPhone} icon={Phone} mono={false} />
              {!account.recoveryEmail && !account.recoveryPhone && (
                <EmptyState icon={ShieldAlert} title="No recovery information" sub="Add a recovery email or phone so you can regain access if you're ever locked out." />
              )}
              <div className="mt-5">
                <div className="text-sm font-semibold mb-2.5">Account relationships</div>
                {related.length === 0 && incoming.length === 0 ? (
                  <div className="text-xs" style={{ color: "var(--text-tertiary)" }}>No connected accounts yet.</div>
                ) : (
                  <div className="flex flex-col gap-2">
                    {related.map((r) => (
                      <div key={r.targetId} className="flex items-center gap-2.5 p-2.5 rounded-xl" style={{ background: "var(--surface-hover)", border: "1px solid var(--border)" }}>
                        <ServiceIcon account={r.target} size={30} radius={8} />
                        <div className="min-w-0 flex-1">
                          <div className="text-xs font-medium truncate">{r.target.displayName || r.target.service}</div>
                          <div className="text-xs " style={{ color: "var(--text-tertiary)" }}>{r.type}</div>
                        </div>
                        <Link2 size={13} style={{ color: "var(--text-tertiary)" }} />
                      </div>
                    ))}
                    {incoming.map((r) => (
                      <div key={r.source.id} className="flex items-center gap-2.5 p-2.5 rounded-xl" style={{ background: "var(--surface-hover)", border: "1px solid var(--border)" }}>
                        <ServiceIcon account={r.source} size={30} radius={8} />
                        <div className="min-w-0 flex-1">
                          <div className="text-xs font-medium truncate">{r.source.displayName || r.source.service}</div>
                          <div className="text-xs " style={{ color: "var(--text-tertiary)" }}>Uses this as: {r.type}</div>
                        </div>
                        <Link2 size={13} style={{ color: "var(--text-tertiary)" }} />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {tab === "notes" && (
            <div className="pav-fade-in">
              {account.notes && (
                <div className="mb-4 p-3.5 rounded-xl text-sm" style={{ background: "var(--surface-hover)", border: "1px solid var(--border)" }}>{account.notes}</div>
              )}
              {(account.customFields || []).length > 0 ? (
                account.customFields.map((f) => (
                  <CopyField key={f.id} label={f.label} value={f.value} secret={f.type === "secret" || f.type === "password"} mono={f.type !== "text"}
                    revealed={revealField === f.id} onToggleReveal={() => requestReveal(f.id)} />
                ))
              ) : !account.notes ? (
                <EmptyState icon={FileText} title="No notes or custom fields" sub="Add private notes or custom fields when you edit this account." />
              ) : null}
              <div className="mt-5 grid grid-cols-2 gap-3 text-xs" style={{ color: "var(--text-tertiary)" }}>
                <div>Created<div className="pav-font-mono mt-0.5" style={{ color: "var(--text-secondary)" }}>{timeAgoLabel(account.createdAt)}</div></div>
                <div>Last updated<div className="pav-font-mono mt-0.5" style={{ color: "var(--text-secondary)" }}>{timeAgoLabel(account.updatedAt)}</div></div>
              </div>
            </div>
          )}
        </div>
      </div>

      {pendingReveal && (
        <ReauthModal onConfirm={confirmReveal} onCancel={() => setPendingReveal(null)} />
      )}
      {confirmDelete && (
        <div className="fixed inset-0 flex items-center justify-center p-4" style={{ background: "rgba(6,8,12,0.6)", zIndex: 300 }} onClick={() => setConfirmDelete(false)}>
          <div className="pav-card pav-slide-up w-full max-w-xs p-5" onClick={(e) => e.stopPropagation()}>
            <div className="text-sm font-semibold mb-1.5">Delete this account?</div>
            <div className="text-xs mb-4" style={{ color: "var(--text-tertiary)" }}>This removes "{account.displayName || account.service}" from your vault. This can't be undone.</div>
            <div className="flex gap-2">
              <Button variant="secondary" className="flex-1" onClick={() => setConfirmDelete(false)}>Cancel</Button>
              <Button variant="danger" className="flex-1" onClick={() => { onDelete(account.id); setConfirmDelete(false); }}>Delete</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ============================================================================
   ADD / EDIT WIZARD
   ============================================================================ */
const WIZARD_STEPS = ["Service", "Basics", "Login", "Security", "Recovery", "Notes", "Review"];

function emptyDraft() {
  return {
    id: null, service: "", displayName: "", category: "other",
    iconType: "brand", iconValue: "",
    username: "", email: "", phone: "", loginUrl: "",
    password: "", twoFAEnabled: false, twoFAMethod: "", backupCodesSaved: false, securityQuestions: false,
    passwordLastChanged: new Date().toISOString(),
    recoveryEmail: "", recoveryPhone: "",
    notes: "", tags: [], favorite: false, customFields: [], relationships: [],
  };
}

function AddEditWizard({ accounts, editingAccount, onClose, onSave }) {
  const { showToast } = useApp();
  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState(() => editingAccount ? { ...editingAccount } : emptyDraft());
  const [customService, setCustomService] = useState(!SERVICE_CATALOG[draft.service] && !!draft.service);
  const [tagInput, setTagInput] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [genOpts, setGenOpts] = useState({ length: 16, uppercase: true, lowercase: true, numbers: true, symbols: true, excludeAmbiguous: true });
  const [duplicateWarning, setDuplicateWarning] = useState(null);

  const isEdit = !!editingAccount;
  const set = (patch) => setDraft((d) => ({ ...d, ...patch }));

  const potentialDup = useMemo(() => {
    if (!draft.service || isEdit) return null;
    return accounts.find((a) => a.service === draft.service && a.email && a.email === draft.email);
  }, [draft.service, draft.email, accounts, isEdit]);

  const suggestField = () => {
    const cat = draft.category;
    if (cat === "email") return "Recovery email, recovery phone, and backup codes matter most here — it's often the key to every other account.";
    if (cat === "banking" || cat === "ewallet") return "Add the account/reference number and make sure 2FA is on for this one.";
    if (cat === "social") return "Link a recovery email and consider noting which accounts are connected to this one.";
    if (cat === "gaming") return "Player/Steam ID goes well as a custom field. Note linked platform accounts too.";
    return null;
  };

  const next = () => {
    if (step === 0 && !draft.service) { showToast("Choose or name a service first"); return; }
    if (step === 1 && potentialDup && !duplicateWarning) { setDuplicateWarning(potentialDup); return; }
    setStep((s) => Math.min(WIZARD_STEPS.length - 1, s + 1));
  };
  const back = () => (step === 0 ? onClose() : setStep((s) => s - 1));

  const save = () => {
    const meta = serviceMeta(draft.service, draft.category);
    const final = {
      ...draft,
      id: draft.id || `acc-${Date.now()}`,
      category: draft.category || meta.category,
      createdAt: draft.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lastAccessed: draft.lastAccessed || new Date().toISOString(),
    };
    onSave(final);
  };

  const addTag = () => {
    const t = tagInput.trim();
    if (t && !draft.tags.includes(t)) set({ tags: [...draft.tags, t] });
    setTagInput("");
  };
  const removeTag = (t) => set({ tags: draft.tags.filter((x) => x !== t) });

  const addCustomField = () => set({ customFields: [...draft.customFields, { id: `cf-${Date.now()}`, label: "New field", type: "text", value: "" }] });
  const updateCustomField = (id, patch) => set({ customFields: draft.customFields.map((f) => (f.id === id ? { ...f, ...patch } : f)) });
  const removeCustomField = (id) => set({ customFields: draft.customFields.filter((f) => f.id !== id) });

  const popularServices = Object.keys(SERVICE_CATALOG);

  return (
    <div className="fixed inset-0 flex items-end sm:items-center justify-center" style={{ zIndex: 160 }}>
      <div className="absolute inset-0 pav-fade-in" style={{ background: "rgba(6,8,12,0.55)" }} onClick={onClose} />
      <div className="pav-slide-up relative w-full sm:max-w-xl sm:rounded-2xl flex flex-col pav-scrollbar overflow-hidden" style={{ background: "var(--bg)", border: "1px solid var(--border)", maxHeight: "88vh" }}>
        {/* Header */}
        <div className="px-5 pt-5 pb-4 shrink-0" style={{ borderBottom: "1px solid var(--border-soft)" }}>
          <div className="flex items-center justify-between mb-3">
            <div className="text-sm font-semibold pav-font-display">{isEdit ? "Edit account" : "Add account"}</div>
            <IconButton icon={X} onClick={onClose} />
          </div>
          <div className="flex items-center gap-1">
            {WIZARD_STEPS.map((s, i) => (
              <div key={s} className="flex-1 h-1 rounded-full" style={{ background: i <= step ? "var(--accent)" : "var(--border)" }} />
            ))}
          </div>
          <div className="text-xs mt-2" style={{ color: "var(--text-tertiary)" }}>Step {step + 1} of {WIZARD_STEPS.length} — {WIZARD_STEPS[step]}</div>
        </div>

        {/* Body */}
        <div className="px-5 py-5 flex-1 overflow-y-auto pav-scrollbar">
          {step === 0 && (
            <div className="pav-fade-in flex flex-col gap-4">
              <div className="text-sm font-semibold">What are you adding?</div>
              {!customService ? (
                <>
                  <div className="relative">
                    <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--text-tertiary)" }} />
                    <input
                      value={draft.service}
                      onChange={(e) => set({ service: e.target.value })}
                      placeholder="Search Gmail, Steam, GCash…"
                      className="pav-input pav-focus w-full pl-9 pr-3 py-2.5 text-sm"
                    />
                  </div>
                  <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 max-h-56 overflow-y-auto pav-scrollbar pr-1">
                    {popularServices.filter((s) => s.toLowerCase().includes(draft.service.toLowerCase())).map((s) => {
                      const meta = SERVICE_CATALOG[s];
                      const active = draft.service === s;
                      return (
                        <button key={s} onClick={() => set({ service: s, category: meta.category, iconType: "brand" })}
                          className="pav-btn pav-focus flex flex-col items-center gap-1.5 p-2.5 rounded-xl text-center"
                          style={{ background: active ? "var(--surface-hover)" : "transparent", border: `1px solid ${active ? "var(--accent)" : "var(--border)"}` }}
                        >
                          <div className="flex items-center justify-center rounded-lg pav-font-display text-xs font-semibold" style={{ width: 34, height: 34, background: meta.color, color: "#fff" }}>{meta.initials}</div>
                          <span className="text-xs leading-tight truncate w-full">{s}</span>
                        </button>
                      );
                    })}
                  </div>
                  <button onClick={() => { setCustomService(true); set({ iconType: "category" }); }} className="pav-focus text-xs font-medium text-left" style={{ color: "var(--accent)" }}>
                    Can't find it? Add a custom service →
                  </button>
                </>
              ) : (
                <>
                  <Input label="Service / account name" value={draft.service} onChange={(e) => set({ service: e.target.value })} placeholder="e.g. Personal blog host" />
                  <Select label="Category" value={draft.category} onChange={(e) => set({ category: e.target.value })}>
                    {CATEGORY_DEFS.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </Select>
                  <Input label="Emoji icon (optional)" value={draft.iconType === "emoji" ? draft.iconValue : ""} onChange={(e) => set({ iconType: "emoji", iconValue: e.target.value })} placeholder="🔒" maxLength={2} />
                  <button onClick={() => setCustomService(false)} className="pav-focus text-xs font-medium text-left" style={{ color: "var(--accent)" }}>← Choose from known services instead</button>
                </>
              )}
            </div>
          )}

          {step === 1 && (
            <div className="pav-fade-in flex flex-col gap-4">
              <div className="flex items-center gap-3 p-3 rounded-xl" style={{ background: "var(--surface-hover)", border: "1px solid var(--border)" }}>
                <ServiceIcon account={draft} size={38} radius={10} />
                <div className="text-sm font-medium">{draft.service}</div>
                <CategoryPill id={draft.category} />
              </div>
              {duplicateWarning && (
                <div className="p-3 rounded-xl text-xs" style={{ background: "var(--amber-500)14", border: "1px solid var(--amber-500)45", color: "var(--text-secondary)" }}>
                  <div className="font-medium mb-1" style={{ color: "var(--amber-500)" }}>You may already have this account</div>
                  An account for {draft.service} using {draft.email} already exists ("{duplicateWarning.displayName}"). You can still continue — some services support multiple accounts.
                  <div className="flex gap-2 mt-2">
                    <Button size="sm" variant="secondary" onClick={() => setDuplicateWarning(null)}>Edit details</Button>
                    <Button size="sm" variant="primary" onClick={() => { setDuplicateWarning(null); setStep(2); }}>Continue anyway</Button>
                  </div>
                </div>
              )}
              <Input label="Display name" value={draft.displayName} onChange={(e) => set({ displayName: e.target.value })} placeholder={`e.g. Work ${draft.service}`} />
              <Select label="Category" value={draft.category} onChange={(e) => set({ category: e.target.value })}>
                {CATEGORY_DEFS.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </Select>
              {suggestField() && (
                <div className="flex items-start gap-2 text-xs p-3 rounded-xl" style={{ background: "var(--teal-glow)", color: "var(--text-secondary)" }}>
                  <Sparkles size={14} className="shrink-0 mt-0.5" style={{ color: "var(--accent)" }} /> {suggestField()}
                </div>
              )}
            </div>
          )}

          {step === 2 && (
            <div className="pav-fade-in flex flex-col gap-4">
              <div className="text-sm font-semibold">Login information</div>
              <Input label="Username" value={draft.username} onChange={(e) => set({ username: e.target.value })} />
              <Input label="Email" type="email" value={draft.email} onChange={(e) => set({ email: e.target.value })} />
              <Input label="Phone" value={draft.phone} onChange={(e) => set({ phone: e.target.value })} />
              <Input label="Login URL" value={draft.loginUrl} onChange={(e) => set({ loginUrl: e.target.value })} placeholder="https://" />
              <Input
                label="Password" type={showPassword ? "text" : "password"} value={draft.password}
                onChange={(e) => set({ password: e.target.value, passwordLastChanged: new Date().toISOString() })}
                right={<IconButton size={26} icon={showPassword ? EyeOff : Eye} onClick={() => setShowPassword((s) => !s)} />}
              />
              {draft.password && (
                <div className="flex items-center gap-2 -mt-2">
                  <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: "var(--border)" }}>
                    <div className="h-full rounded-full" style={{ width: `${passwordStrength(draft.password).score}%`, background: passwordStrength(draft.password).color }} />
                  </div>
                  <span className="text-xs font-medium" style={{ color: passwordStrength(draft.password).color }}>{passwordStrength(draft.password).label}</span>
                </div>
              )}
              <div className="pav-card p-3.5">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-xs font-semibold flex items-center gap-1.5"><KeyRound size={13} /> Password generator</div>
                  <Button size="sm" variant="secondary" onClick={() => set({ password: genPassword(genOpts), passwordLastChanged: new Date().toISOString() })}>Generate</Button>
                </div>
                <div className="grid grid-cols-2 gap-x-3 gap-y-1.5">
                  <Toggle checked={genOpts.uppercase} onChange={(v) => setGenOpts((o) => ({ ...o, uppercase: v }))} label="Uppercase" />
                  <Toggle checked={genOpts.lowercase} onChange={(v) => setGenOpts((o) => ({ ...o, lowercase: v }))} label="Lowercase" />
                  <Toggle checked={genOpts.numbers} onChange={(v) => setGenOpts((o) => ({ ...o, numbers: v }))} label="Numbers" />
                  <Toggle checked={genOpts.symbols} onChange={(v) => setGenOpts((o) => ({ ...o, symbols: v }))} label="Symbols" />
                  <Toggle checked={genOpts.excludeAmbiguous} onChange={(v) => setGenOpts((o) => ({ ...o, excludeAmbiguous: v }))} label="Exclude ambiguous" />
                </div>
                <div className="mt-2">
                  <div className="text-xs mb-1 flex justify-between" style={{ color: "var(--text-tertiary)" }}><span>Length</span><span>{genOpts.length}</span></div>
                  <input type="range" min="8" max="32" value={genOpts.length} onChange={(e) => setGenOpts((o) => ({ ...o, length: +e.target.value }))} className="w-full" />
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="pav-fade-in flex flex-col gap-4">
              <div className="text-sm font-semibold">Security information</div>
              <Toggle checked={draft.twoFAEnabled} onChange={(v) => set({ twoFAEnabled: v })} label="Two-factor authentication" sub="Strongly recommended for important accounts" />
              {draft.twoFAEnabled && <Input label="2FA method" value={draft.twoFAMethod} onChange={(e) => set({ twoFAMethod: e.target.value })} placeholder="Authenticator app, SMS, security key…" />}
              <Toggle checked={draft.backupCodesSaved} onChange={(v) => set({ backupCodesSaved: v })} label="Backup codes saved" />
              <Toggle checked={draft.securityQuestions} onChange={(v) => set({ securityQuestions: v })} label="Security questions set" />
            </div>
          )}

          {step === 4 && (
            <div className="pav-fade-in flex flex-col gap-4">
              <div className="text-sm font-semibold">Recovery information</div>
              <Input label="Recovery email" value={draft.recoveryEmail} onChange={(e) => set({ recoveryEmail: e.target.value })} />
              <Input label="Recovery phone" value={draft.recoveryPhone} onChange={(e) => set({ recoveryPhone: e.target.value })} />
            </div>
          )}

          {step === 5 && (
            <div className="pav-fade-in flex flex-col gap-4">
              <div className="text-sm font-semibold">Notes, tags & custom fields</div>
              <label className="block">
                <div className="text-xs font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>Private notes</div>
                <textarea value={draft.notes} onChange={(e) => set({ notes: e.target.value })} rows={3} className="pav-input pav-focus w-full px-3.5 py-2.5 text-sm resize-none" />
              </label>
              <div>
                <div className="text-xs font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>Tags</div>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {draft.tags.map((t) => (
                    <span key={t} className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full" style={{ background: "var(--surface-hover)", border: "1px solid var(--border)" }}>
                      {t} <button onClick={() => removeTag(t)} className="pav-focus"><X size={11} /></button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())} placeholder="Add a tag and press Enter" className="pav-input pav-focus flex-1 px-3.5 py-2 text-sm" />
                  <Button size="sm" variant="secondary" onClick={addTag}>Add</Button>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="text-xs font-medium" style={{ color: "var(--text-secondary)" }}>Custom fields</div>
                  <button onClick={addCustomField} className="pav-focus text-xs font-medium" style={{ color: "var(--accent)" }}>+ Add field</button>
                </div>
                <div className="flex flex-col gap-2">
                  {draft.customFields.map((f) => (
                    <div key={f.id} className="flex gap-2 items-center">
                      <input value={f.label} onChange={(e) => updateCustomField(f.id, { label: e.target.value })} placeholder="Label" className="pav-input pav-focus w-28 px-2.5 py-2 text-xs shrink-0" />
                      <input value={f.value} onChange={(e) => updateCustomField(f.id, { value: e.target.value })} placeholder="Value" className="pav-input pav-focus flex-1 px-2.5 py-2 text-xs" />
                      <select value={f.type} onChange={(e) => updateCustomField(f.id, { type: e.target.value })} className="pav-input pav-focus px-2 py-2 text-xs w-20 shrink-0">
                        <option value="text">Text</option>
                        <option value="secret">Secret</option>
                        <option value="url">URL</option>
                        <option value="date">Date</option>
                      </select>
                      <button onClick={() => removeCustomField(f.id)} className="pav-focus shrink-0"><Trash2 size={14} style={{ color: "var(--text-tertiary)" }} /></button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 6 && (
            <div className="pav-fade-in flex flex-col gap-3">
              <div className="text-sm font-semibold mb-1">Review & save</div>
              <div className="pav-card p-4 flex items-center gap-3">
                <ServiceIcon account={draft} size={44} radius={12} />
                <div>
                  <div className="text-sm font-semibold">{draft.displayName || draft.service}</div>
                  <div className="text-xs" style={{ color: "var(--text-tertiary)" }}>{draft.email || draft.username || "No login set"}</div>
                </div>
                <span className="ml-auto"><CategoryPill id={draft.category} /></span>
              </div>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="pav-card p-3"><div style={{ color: "var(--text-tertiary)" }}>2FA</div><div className="font-medium mt-0.5">{draft.twoFAEnabled ? "Enabled" : "Not set"}</div></div>
                <div className="pav-card p-3"><div style={{ color: "var(--text-tertiary)" }}>Password strength</div><div className="font-medium mt-0.5">{passwordStrength(draft.password).label}</div></div>
                <div className="pav-card p-3"><div style={{ color: "var(--text-tertiary)" }}>Recovery info</div><div className="font-medium mt-0.5">{draft.recoveryEmail || draft.recoveryPhone ? "Added" : "None"}</div></div>
                <div className="pav-card p-3"><div style={{ color: "var(--text-tertiary)" }}>Tags</div><div className="font-medium mt-0.5">{draft.tags.length || "None"}</div></div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-4 flex items-center gap-2 shrink-0" style={{ borderTop: "1px solid var(--border-soft)" }}>
          <Button variant="secondary" icon={ChevronLeft} onClick={back} className="flex-1">{step === 0 ? "Cancel" : "Back"}</Button>
          {step < WIZARD_STEPS.length - 1 ? (
            <Button variant="primary" onClick={next} className="flex-1">Continue <ChevronRight size={16} /></Button>
          ) : (
            <Button variant="primary" onClick={save} className="flex-1">{isEdit ? "Save changes" : "Save account"}</Button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ============================================================================
   SECURITY CENTER
   ============================================================================ */
function findReusedGroups(accounts) {
  const map = new Map();
  accounts.forEach((a) => {
    if (!a.password) return;
    if (!map.has(a.password)) map.set(a.password, []);
    map.get(a.password).push(a);
  });
  return Array.from(map.values()).filter((g) => g.length > 1);
}

function IssueRow({ title, count, severity, accounts, onOpen }) {
  const [open, setOpen] = useState(false);
  const colors = { risk: "var(--red-500)", attention: "var(--amber-500)" };
  const color = colors[severity];
  if (count === 0) return null;
  return (
    <div className="pav-card overflow-hidden">
      <button onClick={() => setOpen((o) => !o)} className="pav-focus w-full flex items-center gap-3 p-4 text-left">
        <div className="flex items-center justify-center rounded-lg shrink-0" style={{ width: 32, height: 32, background: color + "1c" }}>
          <AlertTriangle size={15} style={{ color }} />
        </div>
        <div className="flex-1 text-sm font-medium">{title}</div>
        <span className="text-xs font-semibold pav-font-mono" style={{ color }}>{count}</span>
        <ChevronDown size={16} style={{ color: "var(--text-tertiary)", transform: open ? "rotate(180deg)" : "none", transition: "transform 0.15s" }} />
      </button>
      {open && (
        <div className="px-2 pb-2 pav-fade-in">
          {accounts.map((a) => <AccountRow key={a.id} account={a} onClick={() => onOpen(a.id)} />)}
        </div>
      )}
    </div>
  );
}

function SecurityCenter({ accounts, openDetail }) {
  const total = accounts.length || 1;
  const overallScore = Math.round(accounts.reduce((s, a) => s + computeAccountHealth(a).score, 0) / total);
  const noTwoFA = accounts.filter((a) => !a.twoFAEnabled);
  const weak = accounts.filter((a) => passwordStrength(a.password).score < 50);
  const reusedGroups = findReusedGroups(accounts);
  const reusedAccounts = reusedGroups.flat();
  const noRecovery = accounts.filter((a) => !a.recoveryEmail && !a.recoveryPhone);
  const secure = accounts.filter((a) => computeAccountHealth(a).score >= 80);
  const attention = accounts.filter((a) => { const s = computeAccountHealth(a).score; return s >= 50 && s < 80; });
  const risk = accounts.filter((a) => computeAccountHealth(a).score < 50);

  return (
    <div className="px-4 md:px-8 py-6 pb-24 md:pb-10 max-w-4xl mx-auto pav-fade-in">
      <div className="pav-font-display text-2xl font-semibold mb-1">Security Center</div>
      <div className="text-sm mb-6" style={{ color: "var(--text-tertiary)" }}>A clear picture of how well-protected your vault is.</div>

      <div className="pav-card pav-card-hero p-6 flex flex-col sm:flex-row items-center gap-6 mb-6">
        <ProgressRing score={overallScore} size={132} stroke={11} />
        <div className="flex-1 text-center sm:text-left">
          <div className="text-sm font-semibold mb-1">Vault Security: {overallScore}%</div>
          <div className="text-xs mb-3" style={{ color: "var(--text-tertiary)" }}>Based on 2FA coverage, password strength, reuse, and recovery information across all {accounts.length} accounts.</div>
          <div className="flex items-center justify-center sm:justify-start gap-4 text-xs">
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full pav-dot-secure" /> {secure.length} secure</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full pav-dot-attention" /> {attention.length} attention</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full pav-dot-risk" /> {risk.length} high risk</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <IssueRow title={`${noTwoFA.length} account${noTwoFA.length === 1 ? "" : "s"} do not have 2FA`} count={noTwoFA.length} severity="risk" accounts={noTwoFA} onOpen={openDetail} />
        <IssueRow title={`${weak.length} account${weak.length === 1 ? "" : "s"} are using weak passwords`} count={weak.length} severity="risk" accounts={weak} onOpen={openDetail} />
        <IssueRow title={`${reusedAccounts.length} account${reusedAccounts.length === 1 ? "" : "s"} are using reused passwords`} count={reusedAccounts.length} severity="attention" accounts={reusedAccounts} onOpen={openDetail} />
        <IssueRow title={`${noRecovery.length} account${noRecovery.length === 1 ? "" : "s"} are missing recovery information`} count={noRecovery.length} severity="attention" accounts={noRecovery} onOpen={openDetail} />
      </div>

      {reusedGroups.length > 0 && (
        <div className="mt-6">
          <div className="text-sm font-semibold mb-2.5">Password reuse groups</div>
          <div className="flex flex-col gap-2">
            {reusedGroups.map((group, i) => (
              <div key={i} className="pav-card p-3.5">
                <div className="text-xs font-medium mb-2 flex items-center gap-1.5" style={{ color: "var(--amber-500)" }}>
                  <AlertTriangle size={13} /> Same password used on {group.length} accounts
                </div>
                <div className="flex flex-wrap gap-2">
                  {group.map((a) => (
                    <button key={a.id} onClick={() => openDetail(a.id)} className="pav-focus flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs" style={{ background: "var(--surface-hover)", border: "1px solid var(--border)" }}>
                      <ServiceIcon account={a} size={18} radius={5} /> {a.displayName || a.service}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {noTwoFA.length === 0 && weak.length === 0 && reusedGroups.length === 0 && noRecovery.length === 0 && (
        <EmptyState icon={ShieldCheck} title="Your vault looks great" sub="No outstanding security issues right now. Keep it that way by reviewing periodically." />
      )}
    </div>
  );
}

/* ============================================================================
   ACCOUNT MAP
   ============================================================================ */
function AccountMap({ accounts, openDetail }) {
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [transform, setTransform] = useState({ x: 0, y: 0, scale: 1 });
  const dragRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef(null);

  const { nodes, edges } = useMemo(() => {
    const byId = new Map(accounts.map((a) => [a.id, a]));
    const childOf = new Map();
    accounts.forEach((a) => (a.relationships || []).forEach((r) => {
      if (!byId.has(r.targetId)) return;
      if (!childOf.has(a.id)) childOf.set(a.id, []);
      childOf.get(a.id).push({ id: r.targetId, type: r.type });
    }));
    const hasParent = new Set();
    childOf.forEach((children) => children.forEach((c) => hasParent.add(c.id)));
    const roots = accounts.filter((a) => !hasParent.has(a.id) && (childOf.get(a.id) || []).length > 0);
    const standalone = accounts.filter((a) => !hasParent.has(a.id) && !(childOf.get(a.id) || []).length);

    const nodesArr = [];
    const edgesArr = [];
    const colWidth = 210;
    const rowHeight = 92;
    let rootY = 60;

    roots.forEach((root) => {
      const layers = [[root.id]];
      let frontier = [root.id];
      const visited = new Set([root.id]);
      while (frontier.length) {
        const nextLayer = [];
        frontier.forEach((id) => {
          (childOf.get(id) || []).forEach((c) => {
            if (visited.has(c.id)) return;
            visited.add(c.id);
            nextLayer.push(c.id);
            edgesArr.push({ from: id, to: c.id, type: c.type });
          });
        });
        if (nextLayer.length) layers.push(nextLayer);
        frontier = nextLayer;
      }
      const maxRows = Math.max(...layers.map((l) => l.length));
      layers.forEach((layer, colIdx) => {
        const totalH = layer.length * rowHeight;
        const startY = rootY + (maxRows * rowHeight - totalH) / 2;
        layer.forEach((id, rowIdx) => {
          nodesArr.push({ id, x: 40 + colIdx * colWidth, y: startY + rowIdx * rowHeight });
        });
      });
      rootY += maxRows * rowHeight + 50;
    });
    standalone.forEach((a, i) => {
      nodesArr.push({ id: a.id, x: 40, y: rootY + i * rowHeight });
    });

    return { nodes: nodesArr, edges: edgesArr };
  }, [accounts]);

  const width = Math.max(700, ...nodes.map((n) => n.x + 200));
  const height = Math.max(400, ...nodes.map((n) => n.y + 80));

  const onWheel = (e) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.08 : 0.08;
    setTransform((t) => ({ ...t, scale: Math.min(2, Math.max(0.4, t.scale + delta)) }));
  };
  const onPointerDown = (e) => {
    dragRef.current = { startX: e.clientX, startY: e.clientY, ox: transform.x, oy: transform.y };
    setIsDragging(true);
    // Ensure this element keeps receiving move/up events even if the
    // pointer moves quickly off it (fixes drag state getting cleared
    // mid-drag, which was the root cause of the null-ref crash below).
    e.currentTarget.setPointerCapture?.(e.pointerId);
  };
  const onPointerMove = (e) => {
    const drag = dragRef.current;
    if (!drag) return;
    const dx = e.clientX - drag.startX;
    const dy = e.clientY - drag.startY;
    setTransform((t) => ({ ...t, x: drag.ox + dx, y: drag.oy + dy }));
  };
  const onPointerUp = (e) => {
    dragRef.current = null;
    setIsDragging(false);
    e.currentTarget?.releasePointerCapture?.(e.pointerId);
  };

  return (
    <div className="px-4 md:px-8 py-6 pb-24 md:pb-10 max-w-6xl mx-auto pav-fade-in">
      <div className="flex items-center justify-between mb-1 gap-3 flex-wrap">
        <div>
          <div className="pav-font-display text-2xl font-semibold">Account Map</div>
          <div className="text-sm mt-1" style={{ color: "var(--text-tertiary)" }}>How your accounts connect to each other.</div>
        </div>
        <div className="flex items-center gap-2">
          <Select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="!py-2 text-xs">
            <option value="all">All categories</option>
            {CATEGORY_DEFS.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </Select>
          <IconButton icon={ZoomIn} onClick={() => setTransform((t) => ({ ...t, scale: Math.min(2, t.scale + 0.15) }))} />
          <IconButton icon={ZoomOut} onClick={() => setTransform((t) => ({ ...t, scale: Math.max(0.4, t.scale - 0.15) }))} />
          <IconButton icon={Maximize2} onClick={() => setTransform({ x: 0, y: 0, scale: 1 })} />
        </div>
      </div>

      <div
        ref={containerRef}
        className="pav-card mt-4 overflow-hidden relative pav-scrollbar"
        style={{ height: "min(62vh, 560px)", cursor: isDragging ? "grabbing" : "grab", touchAction: "none" }}
        onWheel={onWheel} onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp} onPointerLeave={onPointerUp}
      >
        <svg width="100%" height="100%">
          <g transform={`translate(${transform.x}, ${transform.y}) scale(${transform.scale})`}>
            {edges.map((e, i) => {
              const a = nodes.find((n) => n.id === e.from), b = nodes.find((n) => n.id === e.to);
              if (!a || !b) return null;
              const midX = (a.x + b.x) / 2 + 82;
              return (
                <g key={i}>
                  <path d={`M ${a.x + 164} ${a.y + 24} C ${midX} ${a.y + 24}, ${midX} ${b.y + 24}, ${b.x} ${b.y + 24}`} fill="none" stroke="var(--border)" strokeWidth={1.5} />
                  <text x={midX} y={(a.y + b.y) / 2 + 18} fontSize="9" fill="var(--text-tertiary)" textAnchor="middle" className="pav-font-mono">{e.type}</text>
                </g>
              );
            })}
            {nodes.map((n) => {
              const acc = accounts.find((a) => a.id === n.id);
              if (!acc) return null;
              const dim = categoryFilter !== "all" && acc.category !== categoryFilter;
              const meta = serviceMeta(acc.service, acc.category);
              return (
                <foreignObject key={n.id} x={n.x} y={n.y} width={164} height={48} style={{ opacity: dim ? 0.25 : 1 }}>
                  <button
                    onClick={() => openDetail(acc.id)}
                    className="pav-btn pav-focus w-full h-full flex items-center gap-2 px-2.5 rounded-xl"
                    style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
                  >
                    <div className="flex items-center justify-center rounded-lg shrink-0 pav-font-display text-xs font-semibold" style={{ width: 26, height: 26, background: meta.color, color: "#fff" }}>{meta.initials}</div>
                    <span className="text-xs font-medium truncate">{acc.displayName || acc.service}</span>
                  </button>
                </foreignObject>
              );
            })}
          </g>
        </svg>
      </div>
      <div className="text-xs mt-2" style={{ color: "var(--text-tertiary)" }}>Drag to pan, scroll to zoom. Tap a node to open its account.</div>
    </div>
  );
}

/* ============================================================================
   CATEGORIES VIEW
   ============================================================================ */
function CategoriesView({ accounts, setView, setCategoryJump }) {
  const counts = useMemo(() => {
    const m = {};
    accounts.forEach((a) => { m[a.category] = (m[a.category] || 0) + 1; });
    return m;
  }, [accounts]);

  return (
    <div className="px-4 md:px-8 py-6 pb-24 md:pb-10 max-w-4xl mx-auto pav-fade-in">
      <div className="pav-font-display text-2xl font-semibold mb-1">Categories</div>
      <div className="text-sm mb-6" style={{ color: "var(--text-tertiary)" }}>Browse your vault by how accounts are organized.</div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {CATEGORY_DEFS.map((c) => {
          const Icon = c.icon;
          const count = counts[c.id] || 0;
          return (
            <button
              key={c.id}
              onClick={() => { setCategoryJump(c.id); setView("accounts"); }}
              className="pav-card pav-btn p-4 flex flex-col items-start gap-3 text-left"
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = c.color)}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
            >
              <div className="flex items-center justify-center rounded-xl" style={{ width: 38, height: 38, background: c.color + "1c" }}>
                <Icon size={18} style={{ color: c.color }} />
              </div>
              <div>
                <div className="text-sm font-semibold">{c.name}</div>
                <div className="text-xs mt-0.5" style={{ color: "var(--text-tertiary)" }}>{count} account{count === 1 ? "" : "s"}</div>
              </div>
            </button>
          );
        })}
      </div>
      <div className="text-xs mt-6" style={{ color: "var(--text-tertiary)" }}>
        Categories organize what an account is for. Renaming, reordering and custom colors are ready for a future release — for now, categories are used automatically based on each account's service.
      </div>
    </div>
  );
}

/* ============================================================================
   SETTINGS VIEW
   ============================================================================ */
/* ============================================================================
   CHANGE PIN MODAL
   ============================================================================ */
function ChangePinModal({ onClose, onVerifyPin, onSetPin }) {
  const { showToast } = useApp();
  const [stage, setStage] = useState("verify"); // verify -> create -> confirm
  const [pin, setPin] = useState("");
  const [firstPin, setFirstPin] = useState("");
  const [error, setError] = useState(false);
  const [shake, setShake] = useState(false);
  const [busy, setBusy] = useState(false);

  const fail = (resetTo) => {
    setError(true); setShake(true);
    setTimeout(() => { setShake(false); setPin(""); setError(false); if (resetTo) setStage(resetTo); }, 420);
  };

  const submit = async (val) => {
    if (val.length !== 4 || busy) return;
    setBusy(true);
    try {
      if (stage === "verify") {
        const ok = await onVerifyPin(val);
        if (ok) { setPin(""); setStage("create"); } else fail();
      } else if (stage === "create") {
        setFirstPin(val); setPin(""); setStage("confirm");
      } else if (stage === "confirm") {
        if (val === firstPin) {
          await onSetPin(val);
          showToast("PIN updated");
          onClose();
        } else { setFirstPin(""); fail("create"); }
      }
    } finally { setBusy(false); }
  };

  const press = (d) => {
    if (pin.length >= 4 || busy) return;
    const next = pin + d;
    setPin(next); setError(false);
    if (next.length === 4) setTimeout(() => submit(next), 120);
  };
  const backspace = () => setPin((p) => p.slice(0, -1));

  const copy = {
    verify: { heading: "Confirm it's you", subheading: error ? "Incorrect PIN — try again" : "Enter your current PIN" },
    create: { heading: "New PIN", subheading: "Choose a new 4-digit PIN" },
    confirm: { heading: "Confirm new PIN", subheading: error ? "PINs didn't match — let's try again" : "Enter it once more to confirm" },
  }[stage];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4" style={{ background: "rgba(0,0,0,0.5)" }}>
      <div className="pav-card pav-slide-up p-6 w-full max-w-xs flex flex-col items-center relative" style={{ background: "var(--surface)" }}>
        <button onClick={onClose} className="pav-focus absolute top-3 right-3 p-1" style={{ color: "var(--text-tertiary)" }}><X size={16} /></button>
        <PinPad
          heading={copy.heading}
          subheading={copy.subheading}
          pinLength={4}
          error={error}
          shake={shake}
          value={pin}
          onDigit={press}
          onBackspace={backspace}
        />
      </div>
    </div>
  );
}

function SettingsView({ theme, setTheme, settings, updateSettings, accounts, onLock, onVerifyPin, onSetPin }) {
  const [exportedOnce, setExportedOnce] = useState(false);
  const [changingPin, setChangingPin] = useState(false);
  const { showToast } = useApp();

  const doExport = () => {
    setExportedOnce(true);
    showToast("Encrypted export prepared");
  };

  return (
    <div className="px-4 md:px-8 py-6 pb-24 md:pb-10 max-w-2xl mx-auto pav-fade-in">
      <div className="pav-font-display text-2xl font-semibold mb-1">Settings</div>
      <div className="text-sm mb-6" style={{ color: "var(--text-tertiary)" }}>Vault preferences, security, and data.</div>

      <div className="flex flex-col gap-4">
        <div className="pav-card p-4">
          <div className="text-sm font-semibold mb-3">Appearance</div>
          <div className="grid grid-cols-3 gap-2">
            {[{ id: "light", label: "Light", icon: Sun }, { id: "dark", label: "Dark", icon: Moon }, { id: "system", label: "System", icon: Monitor }].map((opt) => {
              const Icon = opt.icon; const active = settings.themePref === opt.id;
              return (
                <button key={opt.id} onClick={() => updateSettings({ themePref: opt.id })} className="pav-btn pav-focus flex flex-col items-center gap-1.5 py-3 rounded-xl"
                  style={{ background: active ? "var(--surface-hover)" : "transparent", border: `1px solid ${active ? "var(--accent)" : "var(--border)"}` }}>
                  <Icon size={16} style={{ color: active ? "var(--accent)" : "var(--text-secondary)" }} />
                  <span className="text-xs font-medium">{opt.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="pav-card p-4 flex flex-col gap-3">
          <div className="text-sm font-semibold">Vault lock</div>
          <Select label="Auto-lock after inactivity" value={settings.autoLockMinutes} onChange={(e) => updateSettings({ autoLockMinutes: +e.target.value })}>
            <option value={1}>1 minute</option>
            <option value={5}>5 minutes</option>
            <option value={10}>10 minutes</option>
            <option value={15}>15 minutes</option>
            <option value={30}>30 minutes</option>
            <option value={0}>Never</option>
          </Select>
          <Toggle checked={settings.biometric} onChange={(v) => updateSettings({ biometric: v })} label="Biometric quick unlock" sub="Use Face ID / fingerprint where supported" />
          <Toggle checked={settings.reauthForSecrets} onChange={(v) => updateSettings({ reauthForSecrets: v })} label="Re-authenticate to reveal secrets" sub="Ask for your PIN before showing passwords or codes" />
          <div className="flex gap-2 flex-wrap mt-1">
            <Button variant="secondary" icon={Lock} onClick={onLock}>Lock vault now</Button>
            <Button variant="outline" icon={KeyRound} onClick={() => setChangingPin(true)}>Change PIN</Button>
          </div>
        </div>

        <div className="pav-card p-4 flex flex-col gap-3">
          <div className="text-sm font-semibold">Reminders</div>
          <Toggle checked={settings.remindPasswordAge} onChange={(v) => updateSettings({ remindPasswordAge: v })} label="Old password reminders" sub="Nudge when a password hasn't changed in a long time" />
          <Toggle checked={settings.remindMissing2FA} onChange={(v) => updateSettings({ remindMissing2FA: v })} label="Missing 2FA reminders" />
          <Toggle checked={settings.remindMissingRecovery} onChange={(v) => updateSettings({ remindMissingRecovery: v })} label="Missing recovery info reminders" />
        </div>

        <div className="pav-card p-4 flex flex-col gap-3">
          <div className="text-sm font-semibold">Backup & export</div>
          <div className="text-xs" style={{ color: "var(--text-tertiary)" }}>Exports include everything in this vault, including passwords. Store the file somewhere secure.</div>
          <div className="flex gap-2 flex-wrap">
            <Button variant="secondary" size="sm" onClick={doExport}>Export encrypted backup</Button>
            <Button variant="outline" size="sm" onClick={doExport}>Export as JSON</Button>
            <Button variant="outline" size="sm" onClick={() => showToast("Choose a backup file to import")}>Import backup</Button>
          </div>
          {exportedOnce && <div className="text-xs" style={{ color: "var(--accent)" }}>vault-backup-{new Date().toISOString().slice(0, 10)}.enc ready — this demo doesn't write files to disk.</div>}
        </div>

        <div className="pav-card p-4">
          <div className="text-sm font-semibold mb-1">About this vault</div>
          <div className="text-xs" style={{ color: "var(--text-tertiary)" }}>{accounts.length} accounts stored · Personal Account Vault v1.0 · Separate from Finance Flow.</div>
        </div>
      </div>

      {changingPin && (
        <ChangePinModal onClose={() => setChangingPin(false)} onVerifyPin={onVerifyPin} onSetPin={onSetPin} />
      )}
    </div>
  );
}

/* ============================================================================
   ROOT APP
   ============================================================================ */
const DEFAULT_SETTINGS = {
  themePref: "dark", autoLockMinutes: 5, biometric: true, reauthForSecrets: true,
  remindPasswordAge: true, remindMissing2FA: true, remindMissingRecovery: true,
};

export default function PersonalAccountVault() {
  const [locked, setLocked] = useState(true);
  const [pinHash, setPinHash] = useState(() => storageGet(PIN_STORAGE_KEY));
  // Vault starts empty — each person adds their own accounts.
  // Swap `[]` for `DEMO_ACCOUNTS` below if you ever want sample data again.
  const [accounts, setAccounts] = useState([]);
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [systemDark, setSystemDark] = useState(true);
  const [view, setView] = useState("dashboard");
  const [categoryJump, setCategoryJump] = useState(null);
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const [wizardOpen, setWizardOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [toast, setToastMsg] = useState("");
  const toastTimer = useRef(null);
  const lockTimer = useRef(null);

  useEffect(() => {
    if (window.matchMedia) {
      const mq = window.matchMedia("(prefers-color-scheme: dark)");
      setSystemDark(mq.matches);
      const handler = (e) => setSystemDark(e.matches);
      mq.addEventListener?.("change", handler);
      return () => mq.removeEventListener?.("change", handler);
    }
  }, []);

  const theme = settings.themePref === "system" ? (systemDark ? "dark" : "light") : settings.themePref;

  const showToast = useCallback((msg) => {
    setToastMsg(msg);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToastMsg(""), 2200);
  }, []);

  // Auto-lock on inactivity
  useEffect(() => {
    if (locked || !settings.autoLockMinutes) return;
    const resetTimer = () => {
      clearTimeout(lockTimer.current);
      lockTimer.current = setTimeout(() => setLocked(true), settings.autoLockMinutes * 60 * 1000);
    };
    const events = ["mousemove", "keydown", "click", "touchstart", "scroll"];
    events.forEach((ev) => window.addEventListener(ev, resetTimer));
    resetTimer();
    return () => { events.forEach((ev) => window.removeEventListener(ev, resetTimer)); clearTimeout(lockTimer.current); };
  }, [locked, settings.autoLockMinutes]);

  const verifyPin = useCallback(async (candidate) => {
    const h = await hashPin(candidate);
    return h === pinHash;
  }, [pinHash]);

  const setNewPin = useCallback(async (newPin) => {
    const h = await hashPin(newPin);
    storageSet(PIN_STORAGE_KEY, h);
    setPinHash(h);
  }, []);

  const forgotPin = useCallback(() => {
    const ok = typeof window === "undefined" || window.confirm(
      "There's no PIN recovery in this vault — resetting will erase your stored accounts and let you set a brand-new PIN. Continue?"
    );
    if (!ok) return;
    storageRemove(PIN_STORAGE_KEY);
    setPinHash(null);
    setAccounts([]);
  }, []);

  const openDetail = useCallback((id) => {
    setAccounts((prev) => prev.map((a) => (a.id === id ? { ...a, lastAccessed: new Date().toISOString() } : a)));
    setSelectedId(id);
  }, []);
  const closeDetail = () => setSelectedId(null);

  const openAdd = () => { setEditingId(null); setWizardOpen(true); };
  const openEdit = (id) => { setEditingId(id); setWizardOpen(true); setSelectedId(null); };
  const closeWizard = () => { setWizardOpen(false); setEditingId(null); };

  const saveAccount = (draft) => {
    setAccounts((prev) => {
      const exists = prev.some((a) => a.id === draft.id);
      if (exists) return prev.map((a) => (a.id === draft.id ? draft : a));
      return [draft, ...prev];
    });
    showToast(editingId ? "Account updated" : "Account added");
    closeWizard();
  };

  const deleteAccount = (id) => {
    setAccounts((prev) => prev.filter((a) => a.id !== id));
    setSelectedId(null);
    showToast("Account deleted");
  };

  const toggleFavorite = (id) => {
    setAccounts((prev) => prev.map((a) => (a.id === id ? { ...a, favorite: !a.favorite } : a)));
  };

  const reusedIds = useMemo(() => {
    const groups = findReusedGroups(accounts);
    const set = new Set();
    groups.forEach((g) => g.forEach((a) => set.add(a.id)));
    return set;
  }, [accounts]);

  const overallScore = useMemo(() => {
    if (!accounts.length) return 100;
    return Math.round(accounts.reduce((s, a) => s + computeAccountHealth(a).score, 0) / accounts.length);
  }, [accounts]);

  const selectedAccount = accounts.find((a) => a.id === selectedId) || null;
  const editingAccount = accounts.find((a) => a.id === editingId) || null;

  const goToView = (v) => {
    if (v === "accounts:favorites") { setCategoryJump("__favorites__"); setView("accounts"); return; }
    setCategoryJump(null);
    setView(v);
  };

  const ctxValue = useMemo(() => ({ showToast, settings }), [showToast, settings]);

  if (locked) {
    return (
      <AppCtx.Provider value={ctxValue}>
        <LockScreen
          theme={theme}
          hasPin={!!pinHash}
          onVerifyPin={verifyPin}
          onSetPin={setNewPin}
          onForgotPin={forgotPin}
          onUnlock={() => setLocked(false)}
        />
      </AppCtx.Provider>
    );
  }

  return (
    <AppCtx.Provider value={ctxValue}>
      <div className="pav-root min-h-screen w-full flex" data-theme={theme} style={{ background: "var(--bg)" }}>
        <style>{STYLES}</style>
        <Sidebar view={view} setView={goToView} accountCount={accounts.length} securityScore={overallScore} />

        <div className="flex-1 min-w-0">
          <TopBar search={search} setSearch={setSearch} theme={theme} setTheme={(t) => setSettings((s) => ({ ...s, themePref: t }))} onAdd={openAdd} onLock={() => setLocked(true)} />

          {view === "dashboard" && <Dashboard accounts={accounts} setView={goToView} openDetail={openDetail} openAdd={openAdd} />}
          {view === "accounts" && (
            <AccountsView
              accounts={accounts} search={search}
              initialFilter={categoryJump === "__favorites__" ? "favorites" : null}
              openDetail={openDetail} toggleFavorite={toggleFavorite} openAdd={openAdd}
            />
          )}
          {view === "map" && <AccountMap accounts={accounts} openDetail={openDetail} />}
          {view === "security" && <SecurityCenter accounts={accounts} openDetail={openDetail} />}
          {view === "categories" && <CategoriesView accounts={accounts} setView={setView} setCategoryJump={setCategoryJump} />}
          {view === "settings" && (
            <SettingsView
              theme={theme} setTheme={(t) => setSettings((s) => ({ ...s, themePref: t }))}
              settings={settings} updateSettings={(patch) => setSettings((s) => ({ ...s, ...patch }))}
              accounts={accounts} onLock={() => setLocked(true)}
              onVerifyPin={verifyPin} onSetPin={setNewPin}
            />
          )}
        </div>

        <BottomNav view={view} setView={goToView} onAdd={openAdd} />

        {selectedAccount && (
          <AccountDetail
            account={selectedAccount} allAccounts={accounts} onClose={closeDetail}
            onEdit={openEdit} onDelete={deleteAccount} onToggleFavorite={toggleFavorite}
            reusedIds={reusedIds}
          />
        )}
        {wizardOpen && (
          <AddEditWizard accounts={accounts} editingAccount={editingAccount} onClose={closeWizard} onSave={saveAccount} />
        )}
        <Toast message={toast} />
      </div>
    </AppCtx.Provider>
  );
}
