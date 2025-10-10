// /src/pages/Member.jsx
import React, { useMemo, useRef, useEffect, useState, useCallback } from "react";
import {
  FaFacebookF,
  FaInstagram,
  FaTiktok,
  FaLinkedinIn,
  FaYoutube,
} from "react-icons/fa";

import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import {
  Plane,
  Ship,
  Briefcase,
  ShoppingBag,
  Heart,
  Sparkles,
  LogOut,
  ArrowLeft,
  Hotel,
  Ticket,
  Car,
  MapPin,
  Landmark,
  Wine
} from "lucide-react";
import HotelInquiryModal from "../components/travel/HotelInquiryModal";import AirlineTicketsModal from "../components/travel/AirlineTicketsModal";
import TransfersModal from "../components/travel/TransfersModal";
import ActivitiesModal from "../components/travel/ActivitiesModal";
import ExcursionsModal from "../components/travel/ExcursionsModal";
import YachtEnquiryModal from "../components/lifestyle/YachtEnquiryModal"
import GolfEnquiryModal from "../components/lifestyle/GolfEnquiryModal"
import SkiEnquiryModal from "../components/lifestyle/SkiEnquiryModal"
import WellnessEnquiryModal from "../components/lifestyle/WellnessEnquiryModal"
import RestaurantsEnquiryModal from "../components/lifestyle/RestaurantsEnquiryModal"
import SpecialEventsModal from "../components/concierge/SpecialEventsModal"
import ArtsMuseumModal from "../components/concierge/ArtsMuseumModal"
import GiftDeliveryModal from "../components/concierge/GiftDeliveryModal"
import ShowsModal from "../components/concierge/ShowsModal"
import DestinationEventsModal from "../components/concierge/DestinationEventsModal"
import ThemeParksModal from "../components/concierge/ThemeParksModal"
import RestaurantsModal from "../components/cruises/RestaurantsModal"
import CasinosModal from "../components/cruises/CasinosModal"
import CruiseShowsModal from "../components/cruises/ShowsModal"
import CruiseExcursionModal from "../components/cruises/ExcursionModal"
import SightseeingModal from "../components/cruises/SightseeingModal"
import ExecutiveAirlinesModal from "../components/business/ExecutiveAirlinesModal"
import VillasModal from "../components/business/VillasModal";
import RentalHubModal from "../components/business/RentalHubModal";
import MeetingRoomsModal from "../components/business/MeetingRoomsModal";
import CarRentalModal from "../components/business/CarRentalModal";
import SpiritsWineModal from "../components/shopping/SpiritsWineModal";
import AccessoriesModal from "../components/shopping/AccessoriesModal";
import FashionModal from "../components/shopping/FashionModal";
import UniqueItemsModal from "../components/shopping/UniqueItemsModal";


export default function Member() {
  const logoUrl = "/logo.png";
  const navigate = useNavigate();
  const { fetchWithAuth, API_BASE, logout } = useAuth();
  const [activeModal, setActiveModal] = useState(null); 
  const openModal = (kind) => setActiveModal(kind);
  const closeModal = () => setActiveModal(null);
  const ENQUIRY_ENDPOINT = {
  hotel: "hotel",
  airline: "airline",
  transfers: "transfers", 
  activities: "activities",
  excursions: "excursions",
  yachts: "yachts", 
  golf: "golf", 
  ski: "ski", 
  wellness: "wellness", 
  restaurants: "restaurants", 
  specialEvents: "special-events",
  artsMuseum: "arts-museum",
  giftDelivery: "gift-delivery",
  shows: "shows",
  destinationEvents: "destination-events",
  themeParks: "theme-parks",
  cruiseRestaurants: "cruise-restaurants",
  cruiseCasinos: "cruise-casinos",
  cruiseShows: "cruise-shows",
  cruiseExcursions: "cruise-excursions",
  cruiseSightseeing: "cruise-sightseeing",
  executiveAirlines: "executive-airlines",
  villas: "villas",
  rentalHub: "rental-hub",
  meetingRooms: "meeting-rooms",
  CarRental: "car-rental",
  spiritsWine: "shopping-spirits-wine",
  accessories: "shopping-accessories",
  fashion: "shopping-fashion",
  uniqueItems: "shopping-unique-items",
  // ...
};
const GT_ID = "google_translate_element_member";
useEffect(() => {
  // 1) Promise that resolves when the Google element.js is truly ready
  function ensureGoogleTranslateReady() {
    // Reuse a single global promise so we don't inject multiple times
    if (!window.__gtReadyPromise) {
      window.__gtReadyPromise = new Promise((resolve, reject) => {
        // If already present, resolve immediately
        const ready =
          !!window.google?.translate?.TranslateElement &&
          !!window.google?.translate?.TranslateElement.InlineLayout;

        if (ready) return resolve(true);

        // Create script if it doesn't exist
        let s = document.querySelector('script[data-gt-widget="1"]');
        if (!s) {
          s = document.createElement("script");
          s.src = "https://translate.google.com/translate_a/element.js";
          s.async = true;
          s.defer = true;
          s.setAttribute("data-gt-widget", "1");
          s.onerror = () => reject(new Error("Failed to load Google Translate script"));
          document.head.appendChild(s);
        }

        // Poll briefly until the constructor is available
        const start = Date.now();
        const timer = setInterval(() => {
          const ok =
            !!window.google?.translate?.TranslateElement &&
            !!window.google?.translate?.TranslateElement.InlineLayout;
          if (ok) {
            clearInterval(timer);
            resolve(true);
          } else if (Date.now() - start > 8000) {
            clearInterval(timer);
            reject(new Error("Google Translate API not ready after 8s (CSP/ad-block?)"));
          }
        }, 150);
      });
    }
    return window.__gtReadyPromise;
  }

  // 2) Instantiate the widget in our specific container
  function mountTranslate() {
    const host = document.getElementById(GT_ID);
    if (!host) return;
    // reset any previous render if you navigated back
    host.innerHTML = "";
    try {
      /* global google */
      new window.google.translate.TranslateElement(
        {
          pageLanguage: "en",
          includedLanguages: "en,it,ko,fr,ru,vi,zh-CN,zh-TW,ja",
          layout: window.google.translate.TranslateElement.InlineLayout.VERTICAL,
        },
        GT_ID
      );
    } catch (e) {
      // Surface errors if any
      console.error("[GT] Instantiate failed:", e);
    }
  }

  let cancelled = false;

  ensureGoogleTranslateReady()
    .then(() => {
      if (!cancelled) mountTranslate();
    })
    .catch((err) => {
      console.error("[GT] Loader error:", err);
    });

  // If your dev build uses React.StrictMode, effects mount twice.
  // No explicit cleanup needed; we don't add event listeners here.
  return () => {
    cancelled = true;
  };
}, []);

const submitEnquiry = async (kind, payload) => {
  const path = ENQUIRY_ENDPOINT[kind];
  if (!path) throw new Error(`Unknown enquiry kind: ${kind}`);

  const res = await fetchWithAuth(`${API_BASE}/enquiries/${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    let msg = `Failed to submit enquiry (${res.status})`;
    try {
      const data = await res.json();
      if (typeof data.detail === "string") msg = data.detail;
      else if (Array.isArray(data.detail)) {
        // Pydantic/FastAPI often returns a list of {loc, msg}
        msg = data.detail.map(d => d.msg || JSON.stringify(d)).join(", ");
      }
    } catch {}
    throw new Error(msg);
  }
  return res.json();
};


  // ---- Header profile
  const [profile, setProfile] = useState(null);
  const [status, setStatus] = useState({ loading: true, error: null });

  useEffect(() => {
    (async () => {
      setStatus({ loading: true, error: null });
      try {
        const res = await fetchWithAuth(`${API_BASE}/auth/me`);
        if (res.ok) {
          const data = await res.json();
          setProfile(data);
          setStatus({ loading: false, error: null });
        } else {
          const text = await res.text().catch(() => "");
          setStatus({ loading: false, error: text || "Failed to load profile." });
        }
      } catch {
        setStatus({ loading: false, error: "Network error." });
      }
    })();
  }, [API_BASE, fetchWithAuth]);

  const onLogout = async () => {
    try {
      await logout();
    } finally {
      navigate("/", { replace: true });
    }
  };

  // ---- Top-level menu
  const ROOT_MENU = useMemo(
    () => [
      { id: "travel",    label: "Travel",    icon: Plane,      blurb: "Flights, hotels, itineraries", hasChildren: true },
      { id: "lifestyle", label: "Lifestyle", icon: Heart,      blurb: "Wellness, dining, events",     hasChildren: true },
      { id: "concierge", label: "Concierge", icon: Sparkles,   blurb: "On-demand requests",            hasChildren: true },
      { id: "cruises",   label: "Cruises",   icon: Ship,       blurb: "Ocean & river voyages",         hasChildren: true },
      { id: "business",  label: "Business",  icon: Briefcase,  blurb: "Corporate travel & perks",      hasChildren: true },
      { id: "shopping",  label: "Shopping",  icon: ShoppingBag,blurb: "Luxury retail & drops",         hasChildren: true },
    ],
    []
  );

  // ---- Submenus
  const SUBMENUS = useMemo(
    () => ({
      // Travel
      travel: [
        { id: "hotels",     label: "Hotel & Resorts", icon: Hotel,     blurb: "Preferred rates & upgrades" },
        { id: "air",        label: "Airline Tickets",  icon: Ticket,    blurb: "Domestic & international fares" },
        { id: "transfers",  label: "Transfers",        icon: Car,       blurb: "Chauffeur, limo & shuttles" },
        { id: "activities", label: "Activities",       icon: MapPin,    blurb: "Tours, dining, events" },
        { id: "excursions", label: "Excursions",       icon: Landmark,  blurb: "Day trips & experiences" },
      ],
      // Lifestyle
      lifestyle: [
        { id: "yachts",      label: "Yachts",       icon: Ship,     blurb: "Charters & coastal itineraries" },
        { id: "golf",        label: "Golf",         icon: MapPin,   blurb: "Tee times & resort packages" },
        { id: "ski",         label: "Ski",          icon: Landmark, blurb: "Lifts, passes & chalets" },
        { id: "wellness",    label: "Wellness",     icon: Heart,    blurb: "Spas, retreats & treatments" },
        { id: "restaurants", label: "Restaurants",  icon: Ticket,   blurb: "Tables, tastings & chef’s menus" },
      ],
      // Concierge
      concierge: [
        { id: "special-events",   label: "Special Events",       icon: Sparkles,   blurb: "Private invites & premieres" },
        { id: "arts-museum",      label: "Arts & Museum",        icon: Landmark,   blurb: "Exhibits & curator tours" },
        { id: "gift-delivery",    label: "World Wide Gift Delivery", icon: ShoppingBag, blurb: "Same-day & international" },
        { id: "shows",            label: "Shows",                icon: Ticket,     blurb: "VIP seating & access" },
        { id: "destination-events", label: "Destination Events", icon: MapPin,     blurb: "Weddings & celebrations" },
        { id: "theme-parks",      label: "Theme parks",          icon: MapPin,     blurb: "Passes & express entries" },
      ],
      // Cruises
      cruises: [
        { id: "restaurants", label: "Restaurants", icon: Ticket,    blurb: "Specialty dining & reservations" },
        { id: "casinos",     label: "Casinos",     icon: Sparkles,  blurb: "Gaming & exclusive lounges" },
        { id: "shows",       label: "Shows",       icon: Ticket,    blurb: "Main theater & headliners" },
        { id: "excursions",  label: "Excursions",  icon: Landmark,  blurb: "Ports, tours & adventures" },
        { id: "sightseeing", label: "Sightseeing", icon: MapPin,    blurb: "City highlights & photo ops" },
      ],
      // Business
      business: [
        { id: "executive-airlines", label: "Executive Airlines", icon: Plane,       blurb: "Charters & premium cabins" },
        { id: "villas",             label: "Villas",             icon: Hotel,       blurb: "Corporate stays & retreats" },
        { id: "rental-hub",         label: "Rental Hub",         icon: ShoppingBag, blurb: "Gear, venues & services" },
        { id: "meeting-rooms",      label: "Meeting Rooms",      icon: Briefcase,   blurb: "Boardrooms & A/V support" },
        { id: "car-rental",         label: "Car Rental",         icon: Car,         blurb: "Executive & long-term" },
      ],
      // Shopping
      shopping: [
        { id: "spirits-wine", label: "Spirits & Wine", icon: Sparkles,    blurb: "Allocations & rare finds" },
        { id: "accessories",  label: "Accessories",     icon: ShoppingBag, blurb: "Watches, jewelry & more" },
        { id: "unique-items", label: "Unique Items",    icon: Sparkles,    blurb: "One-of-a-kind & bespoke" },
        { id: "fashion",      label: "Fashion",         icon: ShoppingBag, blurb: "Runway & capsule drops" },
      ],
    }),
    []
  );

  // ===== Navigation state for drill-down =====
  const [activeRoot, setActiveRoot] = useState(null); // e.g. "travel"
  const isInSubmenu = !!activeRoot;
  const CURRENT_MENU = isInSubmenu ? SUBMENUS[activeRoot] ?? [] : ROOT_MENU;

  // ===== Arc layout =====
  const containerRef = useRef(null);
  const [spots, setSpots] = useState([]);
  const [ready, setReady] = useState(false);

  const computePositions = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const N = CURRENT_MENU.length;

    // Responsive item sizing
    const itemH = rect.width < 640 ? 68 : 60;
    const leftPadBase  = rect.width < 640 ? 12 : 16;
    const rightPad     = rect.width < 640 ? 12 : 24;

    // Top/bottom padding >= half item height
    const edgePad = Math.ceil(itemH / 2) + (rect.width < 640 ? 10 : 8);
    const topPad = edgePad;
    const bottomPad = edgePad;

    const H = Math.max(320, rect.height - topPad - bottomPad);

    // Width clamps
    const maxItemW = rect.width - leftPadBase - rightPad;
    const baseItemW = rect.width < 640
      ? Math.max(260, rect.width * 0.84)
      : Math.max(320, rect.width * 0.6);
    const itemW = Math.min(560, maxItemW, baseItemW);

    // Right-anchored + arc depth clamp
    const baseX = rect.width - itemW - rightPad;
    const nominalR = Math.min(
      rect.width * (rect.width < 640 ? 0.20 : 0.33),
      rect.width < 640 ? 110 : 210
    );
    const maxSafeR = Math.max(0, baseX - leftPadBase);
    const R = Math.min(nominalR, maxSafeR);

    const positions = [];
    for (let i = 0; i < N; i++) {
      const t = N === 1 ? 0.5 : i / (N - 1);
      const theta  = (-Math.PI / 2) + t * Math.PI; // -90→+90
      const xCurve = R * (1 - Math.cos(theta));
      const y = topPad + t * H;
      const x = baseX - xCurve;
      positions.push({ x, y, w: itemW, h: itemH });
    }

    setSpots(positions);
    setReady(true);
  }, [CURRENT_MENU]);

  useEffect(() => {
    computePositions();
    const obs = new ResizeObserver(computePositions);
    if (containerRef.current) obs.observe(containerRef.current);
    window.addEventListener("resize", computePositions);
    window.addEventListener("orientationchange", computePositions);
    return () => {
      obs.disconnect();
      window.removeEventListener("resize", computePositions);
      window.removeEventListener("orientationchange", computePositions);
    };
  }, [computePositions]);

  // ===== Indicators =====
  const [indicator, setIndicator] = useState({ x: 0, y: 0, visible: false });
  const [hl, setHl] = useState({ x: 0, y: 0, w: 0, h: 0, visible: false });

  const moveIndicatorsToIndex = (idx) => {
    const el = containerRef.current;
    const s = spots[idx];
    if (!el || !s) return;
    const rect = el.getBoundingClientRect();
    const gutter = rect.width < 640 ? 8 : 12;

    // Gold ball position
    const ballX = Math.min(s.x + s.w + gutter, rect.width - 6);

    // Highlight pill
    const padX = rect.width < 640 ? 6 : 8;
    const x = Math.max(s.x - padX, 0);
    const maxW = rect.width - x;
    const w = Math.min(s.w + padX * 2, maxW);
    const yTop = s.y - s.h / 2;

    setIndicator({ x: ballX, y: s.y, visible: true });
    setHl({ x, y: yTop, w, h: s.h, visible: true });
  };

  const handleEnter = (idx) => () => moveIndicatorsToIndex(idx);
  const handleFocus = (idx) => () => moveIndicatorsToIndex(idx);
  const handleTouch = (idx) => () => moveIndicatorsToIndex(idx);
  const handleLeave = () => {
    setIndicator((p) => ({ ...p, visible: false }));
    setHl((p) => ({ ...p, visible: false }));
  };

  // ===== Drill-down actions =====
const go = (id) => {
  if (isInSubmenu) {
    // Intercepts inside submenus
    if (activeRoot === "travel") {
      if (id === "hotels")  { openModal("hotel");   return; }
      if (id === "air")     { openModal("airline"); return; }
      if (id === "transfers"){ openModal("transfers"); return; }
      if (id === "activities") { openModal("activities"); return; }
      if (id === "excursions") { openModal("excursions"); return; }
    }
    if (activeRoot === "lifestyle") {
      if (id === "yachts")     { openModal("yachts");    return; } 
      if (id === "golf")     { openModal("golf");    return; } 
      if (id === "ski")     { openModal("ski");    return; } 
      if (id === "wellness")     { openModal("wellness");    return; } 
      if (id === "restaurants")     { openModal("restaurants");    return; } 
    }
  if (activeRoot === "concierge") {
    if (id === "special-events") { openModal("specialEvents"); return; }
    if (id === "arts-museum") { openModal("artsMuseum"); return; }
    if (id === "gift-delivery") { openModal("giftDelivery"); return; }
    if (id === "shows") { openModal("shows"); return; }
    if (id === "destination-events") { openModal("destinationEvents"); return; }
    if (id === "theme-parks") { openModal("themeParks"); return; }
  }
  if (isInSubmenu && activeRoot === "cruises") {
  if (id === "restaurants") { openModal("cruiseRestaurants"); return; }
  if (id === "casinos") { openModal("cruiseCasinos"); return; }
  if (id === "shows") { openModal("cruiseShows"); return; }
  if (id === "excursions") { openModal("cruiseExcursions"); return; }
  if (id === "sightseeing") { openModal("cruiseSightseeing"); return; }
}
if (isInSubmenu && activeRoot === "business") {
  if (id === "executive-airlines") { openModal("executiveAirlines"); return; }
  if (id === "villas") { openModal("villas"); return; }
  if (id === "rental-hub") { openModal("rentalHub"); return; }
  if (id === "meeting-rooms") { openModal("meetingRooms"); return; }
  if (id === "car-rental") { openModal("CarRental"); return; }
}
if (isInSubmenu && activeRoot === "shopping") {
  if (id === "spirits-wine") { openModal("spiritsWine"); return; }
  if (id === "accessories") { openModal("accessories"); return; }
  if (id === "fashion") { openModal("fashion"); return; }
  if (id === "unique-items") { openModal("uniqueItems"); return; }
}


    // default: navigate to the sub-route
    navigate(`/${activeRoot}/${id}`);
    return;
  }

    const clicked = ROOT_MENU.find((m) => m.id === id);
    if (clicked?.hasChildren && SUBMENUS[id]) {
      setActiveRoot(id);
      return;
    }
    navigate(`/${id}`);
  };

  const goBack = () => setActiveRoot(null);
  const activeRootLabel = activeRoot ? ROOT_MENU.find(m => m.id === activeRoot)?.label : "";

  return (
    <>
      <div className="relative min-h-screen text-white overflow-hidden">
        {/* Background video (public/media) */}
        <video
          className="fixed inset-0 -z-20 h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster="/media/luxury-bg-poster.jpg"
        >
          <source src="/media/luxury-bg.webm" type="video/webm" />
          <source src="/media/luxury-bg.mp4"  type="video/mp4" />
        </video>

        {/* Contrast overlay */}
        <div
          aria-hidden
          className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_20%_10%,rgba(0,0,0,0.35),transparent_40%),radial-gradient(circle_at_80%_20%,rgba(0,0,0,0.35),transparent_40%),linear-gradient(180deg,rgba(0,0,0,0.55)_0%,rgba(0,0,0,0.65)_60%,rgba(0,0,0,0.86)_100%)]"
        />

        {/* Top bar */}
        <header className="px-4 sm:px-6 lg:px-8 pt-5">
          <div className="mx-auto max-w-6xl flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 sm:gap-3">
            <img
              src={logoUrl}
              alt="Clare Premium logo"
              className="h-5 w-5 sm:h-6 sm:w-6 rounded-md object-contain ring-1 ring-white/10"
              loading="eager"
              decoding="async"
            />
            <h1 className="text-xs sm:text-sm tracking-[0.25em] uppercase text-[#d4af37]">
              Clare Premium
            </h1>
          </div>

            <div className="flex items-center gap-3 sm:gap-4">
              <div className="text-right">
                <div className="text-sm sm:text-base font-medium">
                  {status.loading ? "Welcome" : profile ? `Welcome, ${profile.first_name}` : "Welcome"}
                </div>
                <div className="text-[11px] sm:text-xs text-white/70 truncate max-w-[50vw] sm:max-w-xs">
                  {profile?.email || ""}
                </div>
              </div>
              <button
                onClick={onLogout}
                className="inline-flex items-center gap-2 rounded-xl border border-white/20 px-2 py-2 sm:px-3 sm:py-1.5 hover:bg-white/10"
                title="Logout"
              >
                <LogOut className="w-5 h-5 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline text-sm">Logout</span>
              </button>

            </div>
          </div>
        </header>

        {/* Mobile back bar (ONLY when in submenu) */}
        {isInSubmenu && (
          <div className="sm:hidden px-3 pt-3">
            <div className="mx-auto max-w-6xl">
              <div className="flex items-center justify-between bg-black/35 backdrop-blur-md ring-1 ring-white/10 rounded-xl px-3 py-2">
                <button
                  onClick={goBack}
                  className="inline-flex items-center gap-2 rounded-lg border border-white/20 px-3 py-2 hover:bg-white/10"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span className="text-sm">Back</span>
                </button>
                <div className="text-sm font-semibold text-[#d4af37]">{activeRootLabel}</div>
                <div className="w-10" />{/* spacer */}
              </div>
            </div>
          </div>
        )}

        {/* Arc + Side panel container */}
        <main className="px-3 sm:px-6 lg:px-8 pb-14 sm:pb-16">
          <div className="mx-auto max-w-6xl mt-3 sm:mt-6">
            <div className="relative">
              {/* Left sliding back panel — visible on sm+ only */}
              <div
                className={[
                  "hidden sm:block absolute top-0 left-0 h-full",
                  "transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
                  isInSubmenu ? "w-52 opacity-100" : "w-0 opacity-0",
                  "overflow-hidden z-[5]"
                ].join(" ")}
              >
                <div className="h-full bg-black/35 backdrop-blur-md ring-1 ring-white/10 rounded-r-2xl p-4 flex flex-col gap-3">
                  <button
                    onClick={goBack}
                    className="inline-flex items-center gap-2 rounded-xl border border-white/20 px-3 py-2 hover:bg-white/10"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span className="text-sm">Back</span>
                  </button>

                  <div className="mt-2">
                    <div className="text-xs uppercase tracking-wide text-white/60">Section</div>
                    <div className="text-lg font-semibold text-[#d4af37]">
                      {activeRootLabel}
                    </div>
                  </div>
                </div>
              </div>

              {/* Arc container (adds left padding only on sm+) */}
              <div
                ref={containerRef}
                onMouseLeave={handleLeave}
                className={[
                  "relative min-h-[540px] sm:min-h-[620px] lg:min-h-[680px] overflow-hidden",
                  "transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
                  // On mobile, never push the arc; on sm+ shift only when submenu is open
                  isInSubmenu ? "pl-0 sm:pl-52" : "pl-0"
                ].join(" ")}
              >
                {/* Hover highlight pill */}
                <div
                  className={[
                    "pointer-events-none absolute rounded-xl",
                    "bg-[#d4af37]/12 ring-1 ring-[#d4af37]/25",
                    "backdrop-blur-[2px]",
                    "transition-[top,left,width,height,opacity] duration-400",
                    "ease-[cubic-bezier(0.22,1,0.36,1)]",
                    "z-[1]"
                  ].join(" ")}
                  style={{
                    top: ready ? `${hl.y}px` : 0,
                    left: ready ? `${hl.x}px` : 0,
                    width: ready ? `${hl.w}px` : 0,
                    height: ready ? `${hl.h}px` : 0,
                    opacity: hl.visible ? 1 : 0,
                  }}
                  aria-hidden
                />

                {/* Gold ball indicator */}
                <div
                  className={[
                    "pointer-events-none absolute rounded-full bg-[#d4af37]",
                    "shadow-[0_0_36px_rgba(212,175,55,0.9)]",
                    "transition-[top,left,opacity] duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)]",
                    "-translate-y-1/2",
                    "h-3 w-3 sm:h-4 sm:w-4",
                    "z-[2]"
                  ].join(" ")}
                  style={{
                    top: ready ? `${indicator.y}px` : 0,
                    left: ready ? `${indicator.x}px` : 0,
                    opacity: indicator.visible ? 1 : 0.35,
                  }}
                  aria-hidden
                />

                {/* Items */}
                {spots.map((s, idx) => {
                  const item = CURRENT_MENU[idx];
                  if (!item) return null;
                  const { id, label, icon: Icon, blurb } = item;

                  return (
                    <button
                      key={`${isInSubmenu ? `${activeRoot}-` : ""}${id}`}
                      onMouseEnter={handleEnter(idx)}
                      onFocus={handleFocus(idx)}
                      onTouchStart={handleTouch(idx)}
                      onClick={() => go(id)}
                      className={[
                        "group absolute flex items-center gap-2 sm:gap-3 text-left rounded-md",
                        "px-0 py-0 transition-all duration-300",
                        "focus:outline-none focus-visible:ring-2 focus-visible:ring-[#d4af37]/60",
                        "active:scale-[0.995]",
                        "z-[3]"
                      ].join(" ")}
                      style={{
                        top: `${s.y - s.h / 2}px`,
                        left: `${s.x}px`,
                        width: `${s.w}px`,
                        height: `${s.h}px`,
                      }}
                      aria-label={`${label} menu`}
                    >
                      <span className="grid place-items-center shrink-0 p-0.5 transition-transform duration-300 group-hover:scale-[1.08]">
                        <Icon className="w-5 h-5 opacity-90" />
                      </span>

                      <span className="min-w-0">
                        <span
                          className={[
                            "block",
                            "text-[15px] sm:text-base md:text-lg font-semibold",
                            "transition-all duration-300",
                            "group-hover:text-[#d4af37] group-focus:text-[#d4af37]",
                            "group-hover:underline underline-offset-4",
                            "filter group-hover:drop-shadow-[0_0_12px_rgba(212,175,55,0.6)]"
                          ].join(" ")}
                        >
                          {label}
                        </span>
                        <span className="block text-xs sm:text-sm text-white/75 line-clamp-1">
                          {blurb}
                        </span>
                      </span>

                      <span className="ml-2 sm:ml-3 h-px flex-1 bg-white/0 transition-all duration-300 group-hover:bg-[#d4af37]/60" />
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </main>
{/* Google Translate chip (bottom-left) */}
<div className="fixed left-4 bottom-4 sm:left-6 sm:bottom-6 z-40">
  <div
    className="
      inline-flex items-center gap-2 rounded-xl
      bg-white/10 border border-white/15 backdrop-blur-xl
      px-3 py-1.5 shadow-[0_8px_30px_-10px_rgba(0,0,0,0.5)]
    "
  >
    <div className="gt-chip">
      <div id={GT_ID} className="min-w-[110px] min-h-[32px]" />
    </div>
  </div>
</div>
{/* Footer — translucent */}
<footer className="relative z-20 mt-16">
  {/* subtle gradient divider */}
  <div
    aria-hidden
    className="h-px w-full bg-gradient-to-r from-transparent via-white/25 to-transparent mb-6"
  />

  <div className="mx-auto max-w-6xl px-6">
    <div
      className={[
        "rounded-2xl",
        "bg-white/10",                   // translucency
        "backdrop-blur-xl",              // frosted
        "border border-white/10",        // subtle border
        "ring-1 ring-white/5",           // soft glow edge
        "shadow-[0_10px_60px_-15px_rgba(0,0,0,0.6)]",
      ].join(" ")}
    >
      <div className="px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-10 text-white">
        {/* Left - Branding */}
        <div className="space-y-4">
          <img
            src={logoUrl}
            alt="Clare Senior Care"
            className="h-10 w-auto rounded-md ring-1 ring-white/10"
            loading="lazy"
            decoding="async"
          />
          <p className="text-sm text-white/70">
            © {new Date().getFullYear()} Clare Senior Care. All rights reserved.
          </p>
          <h4 className="text-base font-semibold">Connect with us</h4>
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
                className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
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
            <span className="font-medium">Toll-Free Phone:</span>{" "}
            <a className="text-white/80 hover:underline" href="tel:+17814003541">
              888-479-8354
            </a>
          </div>
          <div>
            <span className="font-medium">Text:</span>{" "}
            <a className="text-white/80 hover:underline" href="sms:+18577544890">
              857-754-4890
            </a>
          </div>
          <div>
            <span className="font-medium">Fax:</span>{" "}
            <span className="text-white/80">617-789-9753</span>
          </div>
          <div>
            <span className="font-medium">Want to Join:</span>{" "}
            <a className="text-white/80 hover:underline" href="mailto:AFC4me@clare-afc.com">
              AFC4me@clare-afc.com
            </a>
          </div>
          <div>
            <span className="font-medium">Current Members:</span>{" "}
            <a className="text-white/80 hover:underline" href="mailto:info@clareseniorcare.store">
              info@clareseniorcare.store
            </a>
          </div>

          <div className="mt-6">
            <h4 className="text-base font-semibold">Open Hours</h4>
            <p className="mt-2 text-sm text-white/80">
              Monday to Friday <span className="font-medium text-white">10 AM–5 PM</span>
            </p>
          </div>
        </div>

        {/* Right - Offices */}
        <div className="text-sm text-white/80 space-y-6">
          <address className="not-italic">
            <div className="font-medium text-white">Braintree Office</div>
            300 Granite St<br />
            <span className="text-white/60">Ste 100</span>
            <br />
            Braintree, Massachusetts 02184
          </address>
          <address className="not-italic">
            <div className="font-medium text-white">Quincy Office</div>
            100 Hancock Street, Unit #304<br />
            <span className="text-white/60">(Inside Workbar)</span>
            <br />
            Quincy, Massachusetts 02171
          </address>
        </div>
      </div>
    </div>
  </div>
</footer>

      </div>

      {/* Modal (portal renders to body) */}
      <HotelInquiryModal
  open={activeModal === "hotel"}
  onClose={closeModal}
  onSubmit={(payload) => submitEnquiry("hotel", payload)}
/>
      <AirlineTicketsModal
  open={activeModal === "airline"}
  onClose={closeModal}
  onSubmit={(payload) => submitEnquiry("airline", payload)}
/>

<TransfersModal
  open={activeModal === "transfers"}
  onClose={closeModal}
  onSubmit={(payload) => submitEnquiry("transfers", payload)}
/>
<ActivitiesModal
  open={activeModal === "activities"}
  onClose={closeModal}
  onSubmit={(payload) => submitEnquiry("activities", payload)}
/>
<ExcursionsModal
  open={activeModal === "excursions"}
  onClose={closeModal}
  onSubmit={(payload) => submitEnquiry("excursions", payload)}
/>
<YachtEnquiryModal
  open={activeModal === "yachts"}
  onClose={closeModal}
  onSubmit={(payload) => submitEnquiry("yachts", payload)}
/>
<GolfEnquiryModal
  open={activeModal === "golf"}
  onClose={closeModal}
  onSubmit={(payload) => submitEnquiry("golf", payload)}
/>
<SkiEnquiryModal
  open={activeModal === "ski"}
  onClose={closeModal}
  onSubmit={(payload) => submitEnquiry("ski", payload)}
/>
<WellnessEnquiryModal
  open={activeModal === "wellness"}
  onClose={closeModal}
  onSubmit={(payload) => submitEnquiry("wellness", payload)}
/>
<RestaurantsEnquiryModal
  open={activeModal === "restaurants"}
  onClose={closeModal}
  onSubmit={(payload) => submitEnquiry("restaurants", payload)}
/>
<SpecialEventsModal
  open={activeModal === "specialEvents"}
  onClose={closeModal}
  onSubmit={(payload) => submitEnquiry("specialEvents", payload)}
/>
<ArtsMuseumModal
  open={activeModal === "artsMuseum"}
  onClose={closeModal}
  onSubmit={(payload) => submitEnquiry("artsMuseum", payload)}
/>
<GiftDeliveryModal
  open={activeModal === "giftDelivery"}
  onClose={closeModal}
  onSubmit={(payload) => submitEnquiry("giftDelivery", payload)}
/>
<ShowsModal
  open={activeModal === "shows"}
  onClose={closeModal}
  onSubmit={(payload) => submitEnquiry("shows", payload)}
/>
<DestinationEventsModal
  open={activeModal === "destinationEvents"}
  onClose={closeModal}
  onSubmit={(payload) => submitEnquiry("destinationEvents", payload)}
/>
<ThemeParksModal
  open={activeModal === "themeParks"}
  onClose={closeModal}
  onSubmit={(payload) => submitEnquiry("themeParks", payload)}
/>
<RestaurantsModal
  open={activeModal === "cruiseRestaurants"}
  onClose={closeModal}
  onSubmit={(payload) => submitEnquiry("cruiseRestaurants", payload)}
/>
<CasinosModal
  open={activeModal === "cruiseCasinos"}
  onClose={closeModal}
  onSubmit={(payload) => submitEnquiry("cruiseCasinos", payload)}
/>
<CruiseShowsModal
  open={activeModal === "cruiseShows"}
  onClose={closeModal}
  onSubmit={(payload) => submitEnquiry("cruiseShows", payload)}
/>
<CruiseExcursionModal
  open={activeModal === "cruiseExcursions"}
  onClose={closeModal}
  onSubmit={(payload) => submitEnquiry("cruiseExcursions", payload)}
/>
<SightseeingModal
  open={activeModal === "cruiseSightseeing"}
  onClose={closeModal}
  onSubmit={(payload) => submitEnquiry("cruiseSightseeing", payload)}
/>
<ExecutiveAirlinesModal
  open={activeModal === "executiveAirlines"}
  onClose={closeModal}
  onSubmit={(payload) => submitEnquiry("executiveAirlines", payload)}
/>
<VillasModal
  open={activeModal === "villas"}
  onClose={closeModal}
  onSubmit={(payload) => submitEnquiry("villas", payload)}
/>
<RentalHubModal
  open={activeModal === "rentalHub"}
  onClose={closeModal}
  onSubmit={(payload) => submitEnquiry("rentalHub", payload)}
/>
<MeetingRoomsModal
  open={activeModal === "meetingRooms"}
  onClose={closeModal}
  onSubmit={(payload) => submitEnquiry("meetingRooms", payload)}
/>
<CarRentalModal
  open={activeModal === "CarRental"}
  onClose={closeModal}
  onSubmit={(payload) => submitEnquiry("CarRental", payload)}
/>
<SpiritsWineModal
  open={activeModal === "spiritsWine"}
  onClose={closeModal}
  onSubmit={(payload) => submitEnquiry("spiritsWine", payload)}
/>
<AccessoriesModal
  open={activeModal === "accessories"}
  onClose={closeModal}
  onSubmit={(payload) => submitEnquiry("accessories", payload)}
/>
<FashionModal
  open={activeModal === "fashion"}
  onClose={closeModal}
  onSubmit={(payload) => submitEnquiry("fashion", payload)}
/>
<UniqueItemsModal
  open={activeModal === "uniqueItems"}
  onClose={closeModal}
  onSubmit={(payload) => submitEnquiry("uniqueItems", payload)}
/>
    </>
  );
}
