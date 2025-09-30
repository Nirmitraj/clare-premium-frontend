import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useAuth } from "../auth/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  Plane,
  Ship,
  Briefcase,
  ShoppingBag,
  Heart,
  Sparkles,
  LogOut,
} from "lucide-react";

export default function Member() {
  const { fetchWithAuth, API_BASE, logout } = useAuth();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [status, setStatus] = useState({ loading: true, error: null });
  const [active, setActive] = useState(null);

  const MENU = useMemo(
    () => [
      { id: "travel", label: "Travel", icon: Plane },
      { id: "lifestyle", label: "Lifestyle", icon: Heart },
      { id: "concierge", label: "Concierge", icon: Sparkles },
      { id: "cruises", label: "Cruises", icon: Ship },
      { id: "business", label: "Business", icon: Briefcase },
      { id: "shopping", label: "Shopping", icon: ShoppingBag },
    ],
    []
  );

  const sectionIds = useMemo(() => MENU.map((m) => m.id), [MENU]);

  const loadProfile = useCallback(async () => {
    setStatus({ loading: true, error: null });
    try {
      const res = await fetchWithAuth(`${API_BASE}/auth/me`);
      if (res.ok) {
        const data = await res.json();
        setProfile(data);
        setStatus({ loading: false, error: null });
      } else if (res.status === 401) {
        setStatus({ loading: false, error: "Session expired. Please sign in again." });
        navigate("/", { replace: true });
      } else {
        const text = await res.text().catch(() => "");
        setStatus({ loading: false, error: text || "Failed to load profile." });
      }
    } catch {
      setStatus({ loading: false, error: "Network error." });
    }
  }, [fetchWithAuth, API_BASE, navigate]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  // Track active section for menu highlighting
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        }),
      { root: null, rootMargin: "-45% 0px -45% 0px", threshold: 0.01 }
    );

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [sectionIds]);

  const handleLogout = async () => {
    try {
      await logout();
    } finally {
      navigate("/", { replace: true });
    }
  };

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div
      className="
        relative min-h-screen text-white 
        [scroll-behavior:smooth]
      "
    >
      {/* Luxury background */}
      <div
        aria-hidden
        className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_20%_10%,rgba(255,255,255,0.06),transparent_35%),radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.06),transparent_35%),linear-gradient(180deg,#0b0b0c_0%,#0e0e12_60%,#0b0b0c_100%)]"
      />

      {/* Sidebar (desktop) */}
      <aside
        className="
          hidden md:flex fixed left-6 top-6 bottom-6 z-30
          w-60 flex-col rounded-2xl border border-white/10
          bg-white/10 backdrop-blur-xl
          shadow-[0_15px_60px_-20px_rgba(0,0,0,0.6)]
          overflow-hidden
        "
      >
        <div className="px-4 py-4 border-b border-white/10 flex items-center gap-2 text-[#d4af37]">
          <Sparkles className="w-5 h-5" />
          <span className="uppercase tracking-[0.25em] text-xs">Clare Premium</span>
        </div>

        <nav className="p-2 space-y-1 overflow-y-auto">
          {MENU.map((item) => {
            const Icon = item.icon;
            const isActive = active === item.id;
            return (
              <button
                key={item.id}
                onClick={() => scrollTo(item.id)}
                className={[
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors",
                  isActive
                    ? "bg-white/20 text-white ring-1 ring-white/25"
                    : "text-white/90 hover:text-white hover:bg-white/10",
                ].join(" ")}
              >
                <Icon className="w-4.5 h-4.5 opacity-90" />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="mt-auto p-3 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 px-3 py-2.5 text-sm"
          >
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </aside>

      {/* Bottom dock (mobile) */}
      <nav
        className="
          md:hidden fixed bottom-4 left-1/2 -translate-x-1/2 z-30
          w-[92%] max-w-lg rounded-2xl border border-white/10 bg-white/10 backdrop-blur-xl
          shadow-[0_15px_60px_-20px_rgba(0,0,0,0.6)]
          px-2 py-2
        "
      >
        <ul className="flex items-center justify-between">
          {MENU.map((item) => {
            const Icon = item.icon;
            const isActive = active === item.id;
            return (
              <li key={item.id}>
                <button
                  onClick={() => scrollTo(item.id)}
                  className={[
                    "flex flex-col items-center px-3 py-1.5 rounded-xl text-[11px]",
                    isActive ? "bg-white/15" : "hover:bg-white/10",
                  ].join(" ")}
                >
                  <Icon className="w-4.5 h-4.5 mb-1" />
                  {item.label}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Main content (with left padding for sidebar) */}
      <main className="md:pl-[18rem]">
        {/* Header / Greeting */}
        <header className="px-4 sm:px-6 lg:px-8 pt-6 md:pt-8">
          <div
            className="
              mx-auto max-w-6xl 
              rounded-2xl border border-white/10 bg-white/10 backdrop-blur-xl
              shadow-[0_15px_60px_-20px_rgba(0,0,0,0.6)]
              p-5 sm:p-6 lg:p-8
            "
          >
            <div className="flex items-center gap-4">
              <div
                className="
                  h-12 w-12 rounded-full bg-gradient-to-br from-[#d4af37]/70 to-[#c2922b]/70
                  ring-1 ring-white/20 flex items-center justify-center text-black font-semibold
                "
              >
                {profile
                  ? (profile.first_name?.[0] || "C").toUpperCase()
                  : "C"}
              </div>
              <div className="flex-1">
                <h1 className="text-2xl sm:text-3xl font-semibold leading-tight">
                  {profile ? `Hey, ${profile.first_name}` : "Member"}
                </h1>
                <p className="text-white/70">
                  {status.loading
                    ? "Loading your profile..."
                    : "Welcome to your members area."}
                </p>
              </div>
              <div className="hidden sm:flex">
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center gap-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 px-4 py-2"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            </div>

            {status.error && (
              <div className="mt-4 rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                {status.error}
              </div>
            )}

            {profile && (
              <div className="mt-4 rounded-xl border border-white/10 bg-white/5 p-4">
                <div className="text-white/90 font-medium">
                  {profile.first_name} {profile.last_name}
                </div>
                <div className="text-white/70 text-sm">{profile.email}</div>
              </div>
            )}
          </div>
        </header>

        {/* Sections */}
        <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8 md:py-10 space-y-10">
          {MENU.map(({ id, label, icon: Icon }) => (
            <div
              key={id}
              id={id}
              className="
                rounded-2xl border border-white/10 bg-white/10 backdrop-blur-xl
                shadow-[0_15px_60px_-20px_rgba(0,0,0,0.6)]
                p-5 sm:p-6 lg:p-8 scroll-mt-24
              "
            >
              <div className="flex items-center gap-3 mb-3 text-[#d4af37]">
                <Icon className="w-5 h-5" />
                <h2 className="text-xl sm:text-2xl font-semibold">{label}</h2>
              </div>
              <p className="text-white/80">
                This is your {label.toLowerCase()} hub. You can place members-only
                content, tools, or links here. Build out the functionality you want
                (requests, bookings, itineraries, etc.) and keep the look cohesive with
                the premium glass effect and gold accents.
              </p>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}
