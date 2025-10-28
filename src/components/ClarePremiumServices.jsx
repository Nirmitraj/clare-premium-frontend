import React, { useMemo, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { LogIn, ChevronRight, Sparkles, Menu, X } from "lucide-react";
import FaqModal from "./FaqModal";
import RegisterModal from "./RegisterModal";
import {
  FaFacebookF,
  FaInstagram,
  FaTiktok,
  FaLinkedinIn,
  FaYoutube,
} from "react-icons/fa";
// UI primitives
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

const DEFAULT_IMAGES = {
  lifestyle:
    "https://images.unsplash.com/photo-1542051841857-5f90071e7989?q=80&w=1600&auto=format&fit=crop",
  business:
    "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1600&auto=format&fit=crop",
  concierge:
    "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?q=80&w=1600&auto=format&fit=crop",
  travel:
    "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?q=80&w=1600&auto=format&fit=crop",
  cruises:
    "https://images.unsplash.com/photo-1505852679233-d9fd70aff56d?q=80&w=1600&auto=format&fit=crop",
  shopping:
    "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?q=80&w=1600&auto=format&fit=crop",
};

const NAV = [
  { key: "faqs", label: "FAQs", type: "modal" },
  { key: "lifestyle", label: "Lifestyle" },
  { key: "business", label: "Business" },
  { key: "concierge", label: "Concierge" },
  { key: "travel", label: "Travel" },
  { key: "cruises", label: "Cruises" },
  { key: "shopping", label: "Shopping" },
];

const Section = ({ id, title, blurb, image, onLogin }) => {
  return (
    <section
      id={id}
      className="relative h-[78vh] min-h-[520px] md:h-[92vh] md:min-h-[640px] w-full scroll-mt-24 md:scroll-mt-28"
    >
      {/* Background image */}
      <div
        aria-hidden
        className="absolute inset-0 bg-center bg-cover"
        style={{ backgroundImage: `url(${image})` }}
      />
      {/* Dark overlay (lighter on mobile so image is visible) */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/25 to-black/60 md:from-black/60 md:via-black/35 md:to-black/70" />

      {/* Content */}
      <motion.div
        className="relative z-10 h-full flex items-end md:items-center"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="mx-auto px-4 sm:px-6 lg:px-10 w-full max-w-6xl pb-10 md:pb-0">
          <div
            className={[
              "rounded-2xl md:rounded-3xl",
              "border border-white/10",
              // More transparent + compact on mobile so BG shows
              "bg-black/25 md:bg-white/10",
              "backdrop-blur-md md:backdrop-blur-xl",
              "p-4 sm:p-6 md:p-8 lg:p-10",
              "shadow-[0_10px_40px_-12px_rgba(0,0,0,0.5)]",
              "max-w-xl sm:max-w-2xl",
            ].join(" ")}
          >
<div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4 text-[#d4af37]">
  <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
  <span className="uppercase tracking-[0.25em] sm:tracking-[0.3em] text-[10px] sm:text-xs">
    Exclusive • Clare Premium
  </span>
</div>

            <h2 className="text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold leading-snug sm:leading-tight mb-2 sm:mb-3 drop-shadow-lg">
              {title}
            </h2>
            <p className="text-white/85 text-sm sm:text-base md:text-lg leading-relaxed mb-5 sm:mb-6">
              {blurb}
            </p>
            <div className="flex items-center gap-3">
              <Button
                onClick={onLogin}
                className="rounded-xl sm:rounded-2xl px-4 sm:px-5 md:px-6 py-5 sm:py-5 text-sm sm:text-base"
              >
                <LogIn className="w-4 h-4 mr-2" /> Login
              </Button>
              <a
                href="#top"
                onClick={(e) => {
                  e.preventDefault();
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="group inline-flex items-center gap-2 text-white/90 hover:text-white transition-colors text-sm sm:text-base"
              >
                Back to top
                <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </a>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default function ClarePremiumServices({
  newMembersUrl = "/new-members",
  images = DEFAULT_IMAGES,
  logoUrl = "/logo.png",
}) {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showFAQ, setShowFAQ] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Active section spy
  const [active, setActive] = useState(null);
  const sectionIds = useMemo(
    () => ["lifestyle", "business", "concierge", "travel", "cruises", "shopping"],
    []
  );

// Works in JS and Vite/CRA
const API_BASE = (import.meta?.env?.VITE_API_BASE) || "http://localhost:8000";


const [authLoading, setAuthLoading] = useState(false);
const [authError, setAuthError] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    setAuthError(null);
    setAuthLoading(true);
    const form = new FormData(e.currentTarget);
    const email = String(form.get("email") || "");
    const password = String(form.get("password") || "");

    try {
      await login(email, password);   // ⬅️ updates isAuthenticated in context
      setShowLogin(false);
      navigate("/member", { replace: true });
    } catch (err) {
      setAuthError(err?.message || "Login failed");
    } finally {
      setAuthLoading(false);
    }
  };


// Register modal state
const [showRegister, setShowRegister] = useState(false);
const [regLoading, setRegLoading] = useState(false);
const [regError, setRegError] = useState(null);

const handleRegister = async (e) => {
  e.preventDefault();
  setRegError(null);
  setRegLoading(true);

  const form = new FormData(e.currentTarget);
  const first_name = String(form.get("first_name") || "").trim();
  const last_name  = String(form.get("last_name") || "").trim();
  const email      = String(form.get("email") || "").trim();
  const password   = String(form.get("password") || "");

  try {
    // 1) Create user
    const regRes = await fetch(`${API_BASE}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email, password, first_name, last_name }),
    });

    if (!regRes.ok) {
      let msg = "Registration failed";
      try {
        const err = await regRes.json();
        // FastAPI validation errors arrive as an array in `detail`
        if (typeof err?.detail === "string") msg = err.detail;
        else if (Array.isArray(err?.detail)) {
          msg = err.detail.map(d => d?.msg || d?.detail || "").filter(Boolean).join(", ");
        }
      } catch {}
      setRegError(msg || "Registration failed");
      return;
    }

    // 2) Auto-login (to get access token and set refresh cookie)
    const loginRes = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email, password }),
    });

    if (!loginRes.ok) {
      setRegError("Account created but login failed. Please sign in.");
      return;
    }

    const data = await loginRes.json(); // { access_token, refresh_token?: 'cookie' }
    if (data?.access_token) {
      localStorage.setItem("access_token", data.access_token);
    }
    // If your backend still returns a real refresh token, keep it; if it returns "cookie", ignore.
    if (data?.refresh_token && data.refresh_token !== "cookie") {
      localStorage.setItem("refresh_token", data.refresh_token);
    }

    setShowRegister(false);
    setShowLogin(false);
    navigate("/member");
  } catch (err) {
    console.error(err);
    setRegError("Network error — is the backend running?");
  } finally {
    setRegLoading(false);
  }
};







  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      {
        root: null,
        rootMargin: "-45% 0px -45% 0px",
        threshold: 0.01,
      }
    );

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [sectionIds]);

  const SECTIONS = useMemo(
    () => [
      {
        id: "lifestyle",
        title: "Lifestyle Curation",
        blurb:
          "Personalized wellness, elite experiences, and curated routines crafted for discerning lifestyles.",
        image: images.lifestyle,
      },
      {
        id: "business",
        title: "Business Assistance",
        blurb:
          "Executive-grade support — scheduling, coordination, and white-glove logistics for your day-to-day.",
        image: images.business,
      },
      {
        id: "concierge",
        title: "Concierge Services",
        blurb:
          "On-demand solutions from reservations to private events — handled with absolute discretion.",
        image: images.concierge,
      },
      {
        id: "travel",
        title: "Travel Planning",
        blurb:
          "Door-to-door journeys, visas to villas — seamless itineraries designed entirely around you.",
        image: images.travel,
      },
      {
        id: "cruises",
        title: "Luxury Cruises",
        blurb:
          "Yachts and ocean liners, exclusive shore experiences, and effortless embarkations.",
        image: images.cruises,
      },
      {
        id: "shopping",
        title: "Private Shopping",
        blurb:
          "Personal stylists, private showings, and rare finds — delivered to your doorstep.",
        image: images.shopping,
      },
    ],
    [images]
  );

  const handleNav = (item) => {
    if (item.type === "modal" && item.key === "faqs") {
      setShowFAQ(true);
      setMobileOpen(false);
      return;
    }
    if (item.type === "link" && item.key === "new") {
      window.open(newMembersUrl, "_blank", "noopener,noreferrer");
      setMobileOpen(false);
      return;
    }
    const el = document.getElementById(item.key);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    setMobileOpen(false);
  };


  return (
    <div id="top" className="relative min-h-screen text-white selection:bg-white/20">
      {/* Luxury BG */}

      <div
        aria-hidden
        className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_20%_10%,rgba(255,255,255,0.06),transparent_35%),radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.06),transparent_35%),linear-gradient(180deg,#0b0b0c_0%,#0e0e12_60%,#0b0b0c_100%)]"
      />

      {/* Sticky Logo */}
<a
  href="#top"
  className="fixed left-4 sm:left-6 top-4 sm:top-6 z-50 inline-flex items-center gap-2 sm:gap-3 no-underline"
  onClick={(e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }}
  aria-label="Back to top"
>
  <img
    src={logoUrl}
    alt="Clare Senior Care Logo"
    className="h-5 w-5 sm:h-6 sm:w-6 rounded-md object-contain ring-1 ring-white/10"
    loading="eager"
    decoding="async"
  />
  <span className="hidden sm:block text-xs sm:text-sm tracking-[0.25em] uppercase text-[#d4af37]">
    Clare Premium
  </span>
</a>


      {/* Mobile hamburger (top-right) */}
<button
  aria-label="Open menu"
  className="fixed right-4 sm:right-6 top-4 sm:top-6 z-50 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 backdrop-blur-md md:hidden"
  onClick={() => setMobileOpen((v) => !v)}
>
  {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
</button>


      {/* Mobile sheet menu */}
      <div
        className={[
          "fixed inset-0 z-40 md:hidden transition-opacity",
          mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none",
        ].join(" ")}
      >
        <div
          className="absolute inset-0 bg-black/50"
          onClick={() => setMobileOpen(false)}
        />
        <div
          className={[
            "absolute right-0 top-0 h-full w-[78%] max-w-xs",
            "bg-[#0f1012]/95 border-l border-white/10 backdrop-blur-xl",
            "pt-20 pb-6 px-4 sm:px-5",
            "shadow-[0_10px_60px_-15px_rgba(0,0,0,0.7)]",
            "transition-transform",
            mobileOpen ? "translate-x-0" : "translate-x-full",
          ].join(" ")}
        >
          <nav>
            <ul className="space-y-1.5">
              {NAV.map((item) => (
                <li key={item.key}>
                  <button
                    onClick={() => handleNav(item)}
                    className={[
                      "w-full text-left px-3 py-3 rounded-xl",
                      "text-[15px] text-white/90 hover:text-white hover:bg-white/10",
                    ].join(" ")}
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          <div className="mt-6 border-t border-white/10 pt-4">
            <Button
              onClick={() => {
                setShowLogin(true);
                setMobileOpen(false);
              }}
              className="w-full rounded-xl"
            >
              <LogIn className="w-4 h-4 mr-2" /> Member Login
            </Button>
          </div>
        </div>
      </div>

      {/* Frosted Navigation (desktop / tablets) */}
      <nav className="sticky top-0 z-30 hidden md:block">
        <div className="mx-auto max-w-6xl px-4 pt-6">
          <div className="backdrop-blur-xl bg-white/10 border border-white/10 rounded-2xl shadow-[0_10px_60px_-15px_rgba(0,0,0,0.5)]">
            <ul className="flex flex-wrap items-center justify-center gap-1 p-2">
              {NAV.map((item) => {
                const isSection = !item.type;
                const isActive = isSection && active === item.key;
                return (
                  <li key={item.key}>
                    <button
                      onClick={() => handleNav(item)}
                      className={
                        "px-4 py-2 md:px-5 md:py-2.5 text-sm md:text-[15px] rounded-xl transition-colors " +
                        (isActive
                          ? "bg-white/20 text-white ring-1 ring-white/30"
                          : "text-white/90 hover:text-white hover:bg-white/10")
                      }
                      aria-current={isActive ? "page" : undefined}
                    >
                      {item.label}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </nav>

{/* Hero */}
<header className="relative isolate">

  <div className="mx-auto px-4 sm:px-6 lg:px-10 py-16 md:py-24 lg:py-32 w-full max-w-6xl">
    <motion.h1
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="text-3xl sm:text-4xl md:text-6xl font-semibold tracking-tight"
    >
      Premium Services for a Life Well Lived
    </motion.h1>

    <motion.p
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
      className="mt-4 sm:mt-5 max-w-2xl text-white/80 text-base sm:text-lg md:text-xl"
    >
      White-glove assistance across lifestyle, business, travel, and more —
      delivered with the discretion and care of Clare Senior Care.
    </motion.p>

{/* 👉 New CTA Buttons */}
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
  className="mt-8 flex flex-wrap items-center gap-4"
>
  <Button
    onClick={() => setShowLogin(true)}
    className="rounded-xl px-6 py-3 text-base"
  >
    <LogIn className="w-4 h-4 mr-2" /> Login
  </Button>


  <a
    href="https://clareseniorcare.com/home-health-service-private-pay/"
    target="_blank"
    className="inline-flex items-center justify-center rounded-xl px-6 py-3 text-base font-medium text-white bg-white/10 hover:bg-white/20 border border-white/20 transition-colors"
  >
    Want to Join?
  </a>

  {/* Google Translate in CTA row (branding kept) */}
  <div
    className="
      inline-flex items-center gap-2 rounded-xl
      bg-white/10 border border-white/15 backdrop-blur-xl
      px-3 py-1.5 shadow-[0_8px_30px_-10px_rgba(0,0,0,0.5)]
      w-auto
      sm:ml-1
    "
  >
    <div className="gt-chip">
  <div id="google_translate_element" />
</div>
  </div>
</motion.div>
  </div>
</header>



      {/* Sections */}
      <div className="[scroll-behavior:smooth]">
        {SECTIONS.map((s) => (
          <Section key={s.id} {...s} onLogin={() => setShowLogin(true)} />
        ))}
      </div>

{/* Footer */}
<footer className="bg-[#0b0b0c] text-white">
  <div className="mx-auto max-w-6xl px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-10">
    {/* Left - Branding */}
    <div className="space-y-4">
      <img
        src={logoUrl}
        alt="Clare Senior Care"
        className="h-10 w-auto rounded-md"
      />
      <p className="text-sm text-white/60">
        © {new Date().getFullYear()} Clare Senior Care. All rights reserved.
      </p>
      <h4 className="text-base font-semibold text-white">Connect with us</h4>
      <div className="mt-4 flex flex-wrap gap-3">
        {[
          {
            name: "Facebook",
            icon: <FaFacebookF size={18} />,
            href: "https://www.facebook.com/clareseniorcareafc",
          },
          {
            name: "Instagram",
            icon: <FaInstagram size={18} />,
            href: "https://www.instagram.com/clare_senior_care_afc_gafc/",
          },
          {
            name: "TikTok",
            icon: <FaTiktok size={18} />,
            href: "https://www.tiktok.com/@clareseniorcare",
          },
          {
            name: "LinkedIn",
            icon: <FaLinkedinIn size={18} />,
            href: "https://www.linkedin.com/in/clare-senior-care/",
          },
          {
            name: "YouTube",
            icon: <FaYoutube size={18} />,
            href: "https://www.youtube.com/@clareseniorcare",
          },
        ].map((s) => (
          <a
            key={s.name}
            href={s.href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white"
            aria-label={s.name}
          >
            {s.icon}
          </a>
        ))}
      </div>
    </div>

    {/* Middle - Contact Info */}
    <div className="space-y-2 text-sm">
      <div>
        <span className="font-medium text-white">Toll-Free Phone:</span>{" "}
        <a className="text-white/70 hover:underline" href="tel:+17814003541">
          888-479-8354
        </a>
      </div>
      <div>
        <span className="font-medium text-white">Text:</span>{" "}
        <a className="text-white/70 hover:underline" href="sms:+18577544890">
          857-754-4890
        </a>
      </div>
      <div>
        <span className="font-medium text-white">Fax:</span>{" "}
        <span className="text-white/70">617-789-9753</span>
      </div>
      <div>
        <span className="font-medium text-white">Want to Join:</span>{" "}
        <a
          className="text-white/70 hover:underline"
          href="mailto:AFC4me@clare-afc.com"
        >
          AFC4me@clare-afc.com
        </a>
      </div>
      <div>
        <span className="font-medium text-white">Current Members:</span>{" "}
        <a
          className="text-white/70 hover:underline"
          href="mailto:info@clareseniorcare.store"
        >
          info@clareseniorcare.store
        </a>
      </div>

      <div className="mt-6">
        <h4 className="text-base font-semibold text-white">Open Hours</h4>
        <p className="mt-2 text-sm text-white/70">
          Monday to Friday <span className="font-medium text-white">10 AM–5 PM</span>
        </p>
      </div>
    </div>

    {/* Right - Offices */}
    <div className="text-sm text-white/70 space-y-6">
      <address className="not-italic">
        <div className="font-medium text-white">Braintree Office</div>
        300 Granite St<br />
        <span className="text-white/50">Ste 100</span>
        <br />
        Braintree, Massachusetts 02184
      </address>
      <address className="not-italic">
        <div className="font-medium text-white">Quincy Office</div>
        100 Hancock Street, Unit #304<br />
        <span className="text-white/50">(Inside Workbar)</span>
        <br />
        Quincy, Massachusetts 02171
      </address>
    </div>
  </div>
</footer>


      {/* FAQ Modal */}
      <FaqModal open={showFAQ} onOpenChange={setShowFAQ} />

      {/* Login Modal */}
      <Dialog open={showLogin} onOpenChange={setShowLogin}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Member Login</DialogTitle>
            <DialogDescription>
              Access your premium dashboard and requests.
            </DialogDescription>
          </DialogHeader>
<form className="space-y-4" onSubmit={handleLogin}>


            <div className="space-y-2">
              <label className="text-sm text-white/80" htmlFor="email">
                Email
              </label>
              <Input id="email" name="email" type="email" placeholder="you@example.com" required />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-white/80" htmlFor="password">
                Password
              </label>
              <Input id="password" name="password" type="password" maxLength={256} placeholder="••••••••" required />
            </div>
            <div className="flex items-center justify-between pt-2">
              {authError && (
                <p className="text-sm text-red-400">{authError}</p>
              )}
              <Button type="submit" className="rounded-xl" disabled={authLoading}>
                {authLoading ? "Signing in..." : "Sign in"}
              </Button>
              {/* <Button
                type="button"
                onClick={() => setShowRegister(true)}
                className="rounded-xl px-3 py-3 text-base border border-white/20 bg-white/10 hover:bg-white/20"
              >
                Create account
              </Button> */}
            </div>

          </form>
        </DialogContent>
    {/* Register Modal */}
      </Dialog>
      <RegisterModal
  open={showRegister}
  onOpenChange={setShowRegister}
  handleRegister={handleRegister}
  regLoading={regLoading}
  regError={regError}
  setShowLogin={setShowLogin}
/>

    </div>
  );
}
