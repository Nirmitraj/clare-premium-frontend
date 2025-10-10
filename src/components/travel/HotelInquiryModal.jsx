// /src/components/travel/HotelInquiryModal.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

export default function HotelInquiryModal({
  open,
  onClose,
  onSubmit,
  title = "Hotels & Resorts",
  subtitle = "Bespoke stays, preferred rates, exclusive perks",
  imageUrl = "/media/hotelsandresorts.png",
  info = [
    "Hand-picked properties across city, beach & countryside.",
    "Preferred upgrades, early check-in / late check-out (when available).",
    "Dining reservations, spa bookings, private transfers & more.",
  ],
}) {
  const [form, setForm] = useState({
    destination: "",
    checkIn: "",
    checkOut: "",
    hotelLocation: "",
    firstName: "",
    lastName: "",
    children: 0,
    adults: 1,
    roomType: "",
    mealPlan: "",
    specialRequests: "",
    planType: "",
    planTypeOther: "",
    transportToHotel: "No",
    concierge: "No",
    flowers: "No",
    spa: "No",
    localGuides: "No",
    transfersTours: "No",
    forSomeoneElse: "No",
    someoneElseName: "",
    roomTypeOther: "",
    mealPlanOther: "",
  });

  // status: idle | submitting | success | error
  const [status, setStatus] = useState("idle");

  const modalRoot = useMemo(() => {
    let el = document.getElementById("modal-root");
    if (!el) {
      el = document.createElement("div");
      el.id = "modal-root";
      document.body.appendChild(el);
    }
    return el;
  }, []);

  const overlayRef = useRef(null);

  useEffect(() => {
    const onKey = (e) => {
      if (!open) return;
      if (e.key === "Escape") onClose?.();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (open) {
      // reset status each time modal opens
      setStatus("idle");
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => (document.body.style.overflow = prev);
    }
  }, [open]);

  const update = (name) => (e) =>
    setForm((f) => ({ ...f, [name]: e.target.value }));

  const updateNum = (name, min = 0) => (e) => {
    const v = Math.max(min, parseInt(e.target.value || "0", 10));
    setForm((f) => ({ ...f, [name]: v }));
  };

  const valid =
    form.destination.trim() &&
    form.checkIn &&
    form.checkOut &&
    form.firstName.trim() &&
    form.lastName.trim() &&
    Number(form.adults) > 0;

  const isLocked = status === "submitting" || status === "success";

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!valid || status === "submitting") return;
    setStatus("submitting");
    try {
      const payload = {
        ...form,
        hotelLocation: form.hotelLocation || "City center",
        roomType: form.roomType === "Other" ? form.roomTypeOther : form.roomType,
        mealPlan: form.mealPlan === "Other" ? form.mealPlanOther : form.mealPlan,
        planType: form.planType === "Other" ? form.planTypeOther : form.planType,
      };
      if (onSubmit) {
        await onSubmit(payload);
      } else {
        // fallback for local testing
        await new Promise((r) => setTimeout(r, 600));
        // console.log("Hotel enquiry:", payload);
      }
      setStatus("success");
    } catch (err) {
      // console.error(err);
      setStatus("error");
    }
  };

  if (!open) return null;

  return createPortal(
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[100] flex items-center justify-center"
      aria-modal="true"
      role="dialog"
      onMouseDown={(e) => {
        // close on clicking overlay, not the panel — but don't close while submitting
        if (e.target === overlayRef.current && status !== "submitting") onClose?.();
      }}
    >
      {/* Local styles for shimmer/shine + gold helpers */}
      <style>{`
        @keyframes shimmer {
          0%   { background-position: 0% center; }
          100% { background-position: 200% center; }
        }
        .animate-shimmer { animation: shimmer 3s linear infinite; }
        .gold-card {
          background:
            radial-gradient(1200px 400px at -10% -10%, rgba(212,175,55,0.12), transparent 40%),
            radial-gradient(800px 600px at 110% -10%, rgba(255,230,128,0.08), transparent 40%),
            linear-gradient(180deg, rgba(14,12,10,0.9) 0%, rgba(14,12,10,0.96) 100%);
        }
        .shine-bar {
          position: absolute;
          top: 0; left: -30%;
          width: 30%; height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,243,176,0.18), transparent);
          filter: blur(8px);
          animation: sweep 5s ease-in-out infinite;
          pointer-events: none;
        }
        @keyframes sweep {
          0% { transform: translateX(0); }
          50% { transform: translateX(380%); }
          100% { transform: translateX(380%); }
        }
      `}</style>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" />

      {/* Panel with gold gradient border + shine */}
      <div
        className={[
          "relative z-[101]",
          // Mobile: full screen; Desktop: contained
          "w-screen h-screen md:w-[92vw] md:h-auto md:max-h-[90vh]",
          // Gold gradient border
          "p-[1.5px] rounded-none md:rounded-2xl",
          "bg-gradient-to-br from-[#8a6b2e] via-[#d4af37] to-[#8a6b2e]",
          "shadow-[0_20px_80px_-20px_rgba(0,0,0,0.65),0_0_60px_-12px_rgba(212,175,55,0.35)]",
          "overflow-hidden"
        ].join(" ")}
      >
        {/* moving shine bar */}
        <div className="shine-bar" />

        {/* Inner card */}
        <div className="relative gold-card h-full rounded-none md:rounded-2xl">
          {/* Close (sticky on mobile) */}
          <div className="sticky top-0 z-[2] flex justify-end p-3 md:p-0 md:block md:static">
            <button
              onClick={onClose}
              disabled={status === "submitting"}
              className="inline-flex items-center justify-center rounded-lg p-2 md:absolute md:right-3 md:top-3
                         hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#d4af37]/70
                         ring-offset-0 disabled:opacity-60"
              aria-label="Close"
            >
              <X className="w-5 h-5 text-[#ffe9a6]" />
            </button>
          </div>

          {/* Two-pane layout */}
          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Left: hero + copy */}
            <div className="relative h-[36vh] md:h-auto">
              <div className="absolute inset-0">
                <img
                  src={imageUrl}
                  alt="Hotels & Resorts"
                  className="h-full w-full object-cover opacity-70"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/55 to-black/80" />
                {/* subtle gold glow at bottom */}
                <div className="absolute -bottom-24 left-1/2 -translate-x-1/2 w-[140%] h-48 blur-2xl
                                bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.25),transparent_60%)] pointer-events-none" />
              </div>

              {/* Text overlay (more concise on mobile) */}
              <div className="relative px-5 sm:px-8 md:px-10 pb-6 md:pb-10">
                <div className="text-[#e9cd76] text-[11px] md:text-xs uppercase tracking-[0.25em] mb-2 p-3">
                  Clare Premium
                </div>
                <h2 className="text-2xl sm:text-3xl font-semibold text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.45)]">
                  {title}
                </h2>
                <p className="text-white/85 mt-1 md:mt-2 text-sm md:text-base">{subtitle}</p>

                {/* On mobile, hide long list for compactness */}
                <ul className="hidden md:mt-6 md:space-y-2 md:text-white/85 md:text-sm md:block">
                  {info.map((line, i) => (
                    <li key={i} className="flex gap-2">
                      <span className="mt-1 h-1.5 w-1.5 rounded-full bg-[#d4af37]" />
                      <span>{line}</span>
                    </li>
                  ))}
                </ul>
                <div className="hidden md:block mt-6 text-xs text-white/70">
                  Tell us your preferences — we’ll handle the details.
                </div>
              </div>
            </div>

            {/* Right: form OR success screen */}
            {status === "success" ? (
              <div className="p-6 md:p-10 flex items-center justify-center bg-[#0f0f12]/95 max-h-[90vh]">
                <div className="w-full max-w-md text-center">
                  <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-gradient-to-br from-[#d4af37] via-[#ffe08a] to-[#d4af37] shadow-[0_0_40px_rgba(212,175,55,0.45)] grid place-items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-9 w-9 text-black" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-semibold text-white">Enquiry sent</h3>
                  <p className="mt-2 text-white/85">
                    Thanks! Our concierge team will contact you shortly at your registered email.
                  </p>
                  <div className="mt-6">
                    <button
                      onClick={onClose}
                      className="rounded-lg px-5 py-2 font-semibold text-black bg-gradient-to-r from-[#d4af37] via-[#ffe08a] to-[#d4af37] shadow-[0_0_32px_rgba(212,175,55,0.45)] hover:brightness-110"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                aria-busy={status === "submitting"}
                className="p-5 sm:p-6 md:p-7 overflow-y-auto max-h-[54vh] md:max-h-[90vh]"
              >
                <div className="grid grid-cols-1 gap-4">
                  {/* Destination + Dates */}
                  <div>
                    <label className="block text-sm text-white/85 mb-1">
                      Destination<span className="text-[#ffd369]">*</span>
                    </label>
                    <input
                      type="text"
                      disabled={isLocked}
                      className="w-full rounded-lg bg-white/5 border border-[#b69333]/30 px-3 py-2 text-white placeholder-white/40
                                 focus:outline-none focus:ring-2 focus:ring-[#ffd369]/60 disabled:opacity-60"
                      placeholder="City or region"
                      value={form.destination}
                      onChange={update("destination")}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm text-white/85 mb-1">
                        Check In<span className="text-[#ffd369]">*</span>
                      </label>
                      <input
                        type="date"
                        disabled={isLocked}
                        className="w-full rounded-lg bg-white/5 border border-[#b69333]/30 px-3 py-2 text-white
                                   focus:outline-none focus:ring-2 focus:ring-[#ffd369]/60 disabled:opacity-60"
                        value={form.checkIn}
                        onChange={update("checkIn")}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-white/85 mb-1">
                        Check Out<span className="text-[#ffd369]">*</span>
                      </label>
                      <input
                        type="date"
                        disabled={isLocked}
                        className="w-full rounded-lg bg-white/5 border border-[#b69333]/30 px-3 py-2 text-white
                                   focus:outline-none focus:ring-2 focus:ring-[#ffd369]/60 disabled:opacity-60"
                        value={form.checkOut}
                        onChange={update("checkOut")}
                        required
                      />
                    </div>
                  </div>

                  {/* Hotel Location */}
                  <div>
                    <label className="block text-sm text-white/85 mb-1">Hotel Location</label>
                    <select
                      disabled={isLocked}
                      className="w-full rounded-lg bg-white/5 border border-[#b69333]/30 px-3 py-2 text-white
                                 focus:outline-none focus:ring-2 focus:ring-[#ffd369]/60 disabled:opacity-60"
                      value={form.hotelLocation}
                      onChange={update("hotelLocation")}
                    >
                      <option value="">Select preference</option>
                      <option>City center</option>
                      <option>Airport area</option>
                      <option>Art and culture</option>
                      <option>Night life</option>
                    </select>
                  </div>

                  {/* Name + People */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm text-white/85 mb-1">
                        First Name<span className="text-[#ffd369]">*</span>
                      </label>
                      <input
                        type="text"
                        disabled={isLocked}
                        className="w-full rounded-lg bg-white/5 border border-[#b69333]/30 px-3 py-2 text-white
                                   focus:outline-none focus:ring-2 focus:ring-[#ffd369]/60 disabled:opacity-60"
                        value={form.firstName}
                        onChange={update("firstName")}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-white/85 mb-1">
                        Last Name<span className="text-[#ffd369]">*</span>
                      </label>
                      <input
                        type="text"
                        disabled={isLocked}
                        className="w-full rounded-lg bg-white/5 border border-[#b69333]/30 px-3 py-2 text-white
                                   focus:outline-none focus:ring-2 focus:ring-[#ffd369]/60 disabled:opacity-60"
                        value={form.lastName}
                        onChange={update("lastName")}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm text-white/85 mb-1">Children (5–12)</label>
                      <input
                        type="number"
                        min="0"
                        disabled={isLocked}
                        className="w-full rounded-lg bg-white/5 border border-[#b69333]/30 px-3 py-2 text-white
                                   focus:outline-none focus:ring-2 focus:ring-[#ffd369]/60 disabled:opacity-60"
                        value={form.children}
                        onChange={updateNum("children", 0)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-white/85 mb-1">
                        Adults (&gt;13)<span className="text-[#ffd369]">*</span>
                      </label>
                      <input
                        type="number"
                        min="1"
                        disabled={isLocked}
                        className="w-full rounded-lg bg-white/5 border border-[#b69333]/30 px-3 py-2 text-white
                                   focus:outline-none focus:ring-2 focus:ring-[#ffd369]/60 disabled:opacity-60"
                        value={form.adults}
                        onChange={updateNum("adults", 1)}
                        required
                      />
                    </div>
                  </div>

                  {/* Room Type + Meal Plan */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm text-white/85 mb-1">Room Type</label>
                      <select
                        disabled={isLocked}
                        className="w-full rounded-lg bg-white/5 border border-[#b69333]/30 px-3 py-2 text-white
                                   focus:outline-none focus:ring-2 focus:ring-[#ffd369]/60 disabled:opacity-60"
                        value={form.roomType}
                        onChange={update("roomType")}
                      >
                        <option value="">Select</option>
                        <option>Single</option>
                        <option>Double</option>
                        <option>Triple</option>
                        <option>Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm text-white/85 mb-1">Meal Plan</label>
                      <select
                        disabled={isLocked}
                        className="w-full rounded-lg bg-white/5 border border-[#b69333]/30 px-3 py-2 text-white
                                   focus:outline-none focus:ring-2 focus:ring-[#ffd369]/60 disabled:opacity-60"
                        value={form.mealPlan}
                        onChange={update("mealPlan")}
                      >
                        <option value="">Select</option>
                        <option>Room only</option>
                        <option>Breakfast</option>
                        <option>All Inclusive</option>
                        <option>Other</option>
                      </select>
                    </div>
                  </div>

                  {(form.roomType === "Other" || form.mealPlan === "Other") && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {form.roomType === "Other" && (
                        <div>
                          <label className="block text-sm text-white/85 mb-1">Room Type (Other)</label>
                          <input
                            type="text"
                            disabled={isLocked}
                            className="w-full rounded-lg bg-white/5 border border-[#b69333]/30 px-3 py-2 text-white
                                       focus:outline-none focus:ring-2 focus:ring-[#ffd369]/60 disabled:opacity-60"
                            value={form.roomTypeOther}
                            onChange={update("roomTypeOther")}
                          />
                        </div>
                      )}
                      {form.mealPlan === "Other" && (
                        <div>
                          <label className="block text-sm text-white/85 mb-1">Meal Plan (Other)</label>
                          <input
                            type="text"
                            disabled={isLocked}
                            className="w-full rounded-lg bg-white/5 border border-[#b69333]/30 px-3 py-2 text-white
                                       focus:outline-none focus:ring-2 focus:ring-[#ffd369]/60 disabled:opacity-60"
                            value={form.mealPlanOther}
                            onChange={update("mealPlanOther")}
                          />
                        </div>
                      )}
                    </div>
                  )}

                  {/* Plan Type */}
                  <div>
                    <label className="block text-sm text-white/85 mb-1">
                      Tell us more about your plan
                    </label>
                    <div className="grid grid-cols-2 gap-2 text-sm text-white">
                      {["Leisure", "Anniversary", "Business", "Other"].map((opt) => (
                        <label
                          key={opt}
                          className={`flex items-center gap-2 rounded-lg border px-3 py-2 cursor-pointer transition
                            ${
                              form.planType === opt
                                ? "border-[#d4af37] bg-[#d4af37]/10"
                                : "border-[#b69333]/30 bg-white/5 hover:bg-white/10"
                            } ${isLocked ? "opacity-60 pointer-events-none" : ""}`}
                        >
                          <input
                            type="radio"
                            name="planType"
                            className="accent-[#d4af37]"
                            checked={form.planType === opt}
                            onChange={() => setForm((f) => ({ ...f, planType: opt }))}
                            disabled={isLocked}
                          />
                          {opt}
                        </label>
                      ))}
                    </div>
                    {form.planType === "Other" && (
                      <input
                        type="text"
                        placeholder="Tell us more"
                        disabled={isLocked}
                        className="mt-2 w-full rounded-lg bg-white/5 border border-[#b69333]/30 px-3 py-2 text-white
                                   focus:outline-none focus:ring-2 focus:ring-[#ffd369]/60 disabled:opacity-60"
                        value={form.planTypeOther}
                        onChange={update("planTypeOther")}
                      />
                    )}
                  </div>

                  {/* Yes/No toggles */}
                  <YesNo
                    label="Transportation to the Hotel"
                    value={form.transportToHotel}
                    onChange={update("transportToHotel")}
                    disabled={isLocked}
                  />
                  <YesNo label="Concierge Service" value={form.concierge} onChange={update("concierge")} disabled={isLocked} />
                  <YesNo label="Flowers in room" value={form.flowers} onChange={update("flowers")} disabled={isLocked} />
                  <YesNo label="Spa Reservations" value={form.spa} onChange={update("spa")} disabled={isLocked} />
                  <YesNo
                    label="Local Maps, Guidebooks & Recommendations"
                    value={form.localGuides}
                    onChange={update("localGuides")}
                    disabled={isLocked}
                  />
                  <YesNo
                    label="Transfers and tours"
                    value={form.transfersTours}
                    onChange={update("transfersTours")}
                    disabled={isLocked}
                  />
                  <YesNo
                    label="Is this enquiry for someone else?"
                    value={form.forSomeoneElse}
                    onChange={update("forSomeoneElse")}
                    disabled={isLocked}
                  />
                  {form.forSomeoneElse === "Yes" && (
                    <div>
                      <label className="block text-sm text-white/85 mb-1">Recipient Name</label>
                      <input
                        type="text"
                        disabled={isLocked}
                        className="w-full rounded-lg bg-white/5 border border-[#b69333]/30 px-3 py-2 text-white
                                   focus:outline-none focus:ring-2 focus:ring-[#ffd369]/60 disabled:opacity-60"
                        value={form.someoneElseName}
                        onChange={update("someoneElseName")}
                      />
                    </div>
                  )}

                  {/* Special Requests */}
                  <div>
                    <label className="block text-sm text-white/85 mb-1">
                      Special Requests (max 1000 chars)
                    </label>
                    <textarea
                      disabled={isLocked}
                      className="w-full min-h-[96px] rounded-lg bg-white/5 border border-[#b69333]/30 px-3 py-2 text-white placeholder-white/40
                                 focus:outline-none focus:ring-2 focus:ring-[#ffd369]/60 disabled:opacity-60"
                      placeholder="Late check-in, adjoining rooms, accessibility needs, celebrations, etc."
                      maxLength={1000}
                      value={form.specialRequests}
                      onChange={update("specialRequests")}
                    />
                    <div className="text-right text-xs text-white/60">
                      {form.specialRequests.length}/1000
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={onClose}
                      disabled={status === "submitting"}
                      className="rounded-lg border border-[#b69333]/30 px-4 py-2 text-sm text-white hover:bg-white/10 disabled:opacity-60"
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      disabled={!valid || status === "submitting"}
                      className={[
                        "relative overflow-hidden rounded-lg px-5 py-2 text-sm font-semibold",
                        "shadow-[0_0_32px_rgba(212,175,55,0.45)]",
                        valid && status !== "submitting"
                          ? "text-black bg-gradient-to-r from-[#d4af37] via-[#ffe08a] to-[#d4af37] bg-[length:200%_auto] animate-shimmer hover:brightness-110"
                          : "bg-white/10 text-white/60 cursor-not-allowed"
                      ].join(" ")}
                    >
                      {status === "submitting" ? "Submitting..." : "Enquire Now"}
                    </button>
                  </div>

                  {status === "error" && (
                    <div className="mt-3 text-sm text-red-300">
                      Sorry, we couldn’t send your enquiry. Please try again.
                    </div>
                  )}
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>,
    modalRoot
  );
}

function YesNo({ label, value, onChange, disabled = false }) {
  return (
    <div>
      <div className="block text-sm text-white/85 mb-1">{label}</div>
      <div className={`inline-flex rounded-lg overflow-hidden border border-[#b69333]/30 ${disabled ? "opacity-60 pointer-events-none" : ""}`}>
        {["Yes", "No"].map((opt, i) => {
          const active = value === opt;
          return (
            <button
              type="button"
              key={opt}
              disabled={disabled}
              className={`px-4 py-2 text-sm transition ${
                active
                  ? "text-black bg-gradient-to-r from-[#d4af37] via-[#ffe08a] to-[#d4af37]"
                  : "bg-white/5 text-white/85 hover:bg-white/10"
              } ${i === 0 ? "border-r border-[#b69333]/30" : ""}`}
              onClick={() => onChange({ target: { value: opt } })}
            >
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}
