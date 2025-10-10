// /src/components/lifestyle/RestaurantsEnquiryModal.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

const CUISINES = [
  "America","Italian","French","Indian","Oriental","Steakhouse","Seafood","Other"
];
const SEATING = ["Standard","Outdoor","High Top","Other"];
const PLAN_TYPES = ["Leisure","Business","Anniversary"];

export default function RestaurantsEnquiryModal({
  open,
  onClose,
  onSubmit,
  title = "Restaurant Enquiry",
  subtitle = "Tables, seating, and celebration extras",
  imageUrl = "/media/restaurants.png",
  info = [
    "Hard-to-get tables with preferred seating.",
    "Pre-pay options, special bottles, and flowers on arrival.",
    "Seamless transport to and from your reservation."
  ],
}) {
  const [form, setForm] = useState({
    location: "",
    restaurant: "",
    date: "",
    time: "",
    people: 2,

    pricePerPerson: 150, // slider 20–2000

    cuisine: "",
    cuisineOther: "",

    seating: "",
    seatingOther: "",

    specialRequests: "",
    planType: "Leisure",

    transportToRestaurant: "No",
    flowersOnTable: "No",
    specialBottleReady: "No", // wine/champagne ready
    prepayBill: "No",

    forSomeoneElse: "No",
    someoneElseName: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const valid =
    form.location.trim() &&
    form.date &&
    form.time &&
    Number(form.people) > 0;

  const update = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));
  const updateNum = (k, min = 0) => (e) =>
    setForm(f => ({ ...f, [k]: Math.max(min, parseInt(e.target.value || "0", 10)) }));

  // portal target
  const modalRoot = useMemo(() => {
    let el = document.getElementById("modal-root");
    if (!el) { el = document.createElement("div"); el.id = "modal-root"; document.body.appendChild(el); }
    return el;
  }, []);
  const overlayRef = useRef(null);

  useEffect(() => {
    const onKey = (e) => open && e.key === "Escape" && onClose?.();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (open) { const prev = document.body.style.overflow; document.body.style.overflow = "hidden"; return () => (document.body.style.overflow = prev); }
  }, [open]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!valid) return;

    setSubmitting(true);
    try {
      const payload = {
        location: form.location.trim(),
        restaurant: form.restaurant.trim(),
        date: form.date,
        time: form.time,
        people: Number(form.people),

        pricePerPersonUSD: Number(form.pricePerPerson),

        cuisine: form.cuisine,
        cuisineOther: form.cuisine === "Other" ? form.cuisineOther : "",

        seating: form.seating,
        seatingOther: form.seating === "Other" ? form.seatingOther : "",

        specialRequests: (form.specialRequests || "").slice(0, 1000),
        planType: form.planType,

        transportToRestaurant: form.transportToRestaurant,
        flowersOnTable: form.flowersOnTable,
        specialBottleReady: form.specialBottleReady,
        prepayBill: form.prepayBill,

        forSomeoneElse: form.forSomeoneElse,
        someoneElseName: form.forSomeoneElse === "Yes" ? (form.someoneElseName || "") : "",
      };

      await onSubmit?.(payload);
      setDone(true);
    } catch (err) {
      setError(err?.message || "Could not submit your request.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!open) return null;

  return createPortal(
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[100] flex items-center justify-center"
      aria-modal="true"
      role="dialog"
      onMouseDown={(e) => e.target === overlayRef.current && !submitting && onClose?.()}
    >
      {/* gold theme */}
      <style>{`
        @keyframes shimmer { 0%{background-position:0% center} 100%{background-position:200% center} }
        .animate-shimmer { animation: shimmer 3s linear infinite; }
        .gold-card {
          background:
            radial-gradient(1200px 400px at -10% -10%, rgba(212,175,55,0.12), transparent 40%),
            radial-gradient(800px 600px at 110% -10%, rgba(255,230,128,0.08), transparent 40%),
            linear-gradient(180deg, rgba(14,12,10,0.9) 0%, rgba(14,12,10,0.96) 100%);
        }
        .shine-bar {
          position: absolute; top: 0; left: -30%; width: 30%; height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,243,176,0.18), transparent);
          filter: blur(8px); animation: sweep 5s ease-in-out infinite; pointer-events: none;
        }
        @keyframes sweep { 0%{transform:translateX(0)} 50%{transform:translateX(380%)} 100%{transform:translateX(380%)} }
      `}</style>

      <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" />

      <div className="relative z-[101] w-screen h-screen md:w-[92vw] md:h-auto md:max-h-[90vh] p-[1.5px] rounded-none md:rounded-2xl bg-gradient-to-br from-[#8a6b2e] via-[#d4af37] to-[#8a6b2e] shadow-[0_20px_80px_-20px_rgba(0,0,0,0.65),0_0_60px_-12px_rgba(212,175,55,0.35)] overflow-hidden">
        <div className="shine-bar" />
        <div className="relative gold-card h-full rounded-none md:rounded-2xl">
          {/* Close */}
          <div className="sticky top-0 z-[2] flex justify-end p-3 md:p-0 md:block md:static">
            <button
              onClick={onClose}
              disabled={submitting}
              className="inline-flex items-center justify-center rounded-lg p-2 md:absolute md:right-3 md:top-3 hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#d4af37]/70 disabled:opacity-60"
              aria-label="Close"
            >
              <X className="w-5 h-5 text-[#ffe9a6]" />
            </button>
          </div>

          {/* Two-pane */}
          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Left: hero */}
            <div className="relative h-[36vh] md:h-auto">
              <div className="absolute inset-0">
                <img src={imageUrl} alt="Restaurants" className="h-full w-full object-cover opacity-70" />
                <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/55 to-black/80" />
                <div className="absolute -bottom-24 left-1/2 -translate-x-1/2 w-[140%] h-48 blur-2xl bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.25),transparent_60%)] pointer-events-none" />
              </div>
              <div className="relative px-5 sm:px-8 md:px-10 pb-6 md:pb-10">
                <div className="text-[#e9cd76] text-[11px] md:text-xs uppercase tracking-[0.25em] mb-2 p-3">
                  Clare Premium
                </div>
                <h2 className="text-2xl sm:text-3xl font-semibold text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.45)]">
                  {title}
                </h2>
                <p className="text-white/85 mt-1 md:mt-2 text-sm md:text-base">{subtitle}</p>
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

            {/* Right: form / success */}
            <div className="p-5 sm:p-6 md:p-7 overflow-y-auto max-h-[54vh] md:max-h-[90vh]">
              {done ? (
                <div className="text-center py-10">
                  <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-gradient-to-r from-[#d4af37] via-[#ffe08a] to-[#d4af37] shadow-[0_0_32px_rgba(212,175,55,0.45)]" />
                  <h3 className="text-xl font-semibold text-white">Thank you!</h3>
                  <p className="text-white/80 mt-1">Your restaurant enquiry has been submitted. We’ll be in touch soon.</p>
                  <button
                    onClick={onClose}
                    className="mt-6 rounded-lg px-5 py-2 text-sm font-semibold text-black bg-gradient-to-r from-[#d4af37] via-[#ffe08a] to-[#d4af37] bg-[length:200%_auto] animate-shimmer hover:brightness-110"
                  >
                    Close
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
                  {error && (
                    <div className="rounded-lg border border-red-500/30 bg-red-500/10 text-red-200 px-3 py-2 text-sm">
                      {error}
                    </div>
                  )}

                  {/* Location + Restaurant */}
                  <div>
                    <label className="block text-sm text-white/85 mb-1">
                      Location<span className="text-[#ffd369]">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="City / State / Country"
                      className="w-full rounded-lg bg-white/5 border border-[#b69333]/30 px-3 py-2 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#ffd369]/60"
                      value={form.location}
                      onChange={update("location")}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-white/85 mb-1">Restaurant</label>
                    <input
                      type="text"
                      placeholder="Restaurant name (optional)"
                      className="w-full rounded-lg bg-white/5 border border-[#b69333]/30 px-3 py-2 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#ffd369]/60"
                      value={form.restaurant}
                      onChange={update("restaurant")}
                    />
                  </div>

                  {/* Date & Time */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm text-white/85 mb-1">
                        Date<span className="text-[#ffd369]">*</span>
                      </label>
                      <input
                        type="date"
                        className="w-full rounded-lg bg-white/5 border border-[#b69333]/30 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#ffd369]/60"
                        value={form.date}
                        onChange={update("date")}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-white/85 mb-1">
                        Time<span className="text-[#ffd369]">*</span>
                      </label>
                      <input
                        type="time"
                        className="w-full rounded-lg bg-white/5 border border-[#b69333]/30 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#ffd369]/60"
                        value={form.time}
                        onChange={update("time")}
                        required
                      />
                    </div>
                  </div>

                  {/* People + Price slider */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm text-white/85 mb-1">
                        Number of People<span className="text-[#ffd369]">*</span>
                      </label>
                      <input
                        type="number"
                        min={1}
                        className="w-full rounded-lg bg-white/5 border border-[#b69333]/30 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#ffd369]/60"
                        value={form.people}
                        onChange={updateNum("people", 1)}
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-white/85 mb-1">Price Range (per person)</label>
                      <div className="flex items-center gap-3">
                        <input
                          type="range"
                          min={20}
                          max={2000}
                          value={form.pricePerPerson}
                          onChange={updateNum("pricePerPerson", 20)}
                          className="w-full accent-[#d4af37]"
                        />
                        <div className="text-sm min-w-[64px] text-white/85 text-right">${form.pricePerPerson}</div>
                      </div>
                    </div>
                  </div>

                  {/* Cuisine */}
                  <div>
                    <label className="block text-sm text-white/85 mb-1">Cuisine</label>
                    <div className="grid grid-cols-2 gap-2 text-sm text-white">
                      {CUISINES.map((opt) => (
                        <label
                          key={opt}
                          className={`flex items-center gap-2 rounded-lg border px-3 py-2 cursor-pointer transition ${
                            form.cuisine === opt
                              ? "border-[#d4af37] bg-[#d4af37]/10"
                              : "border-[#b69333]/30 bg-white/5 hover:bg-white/10"
                          }`}
                        >
                          <input
                            type="radio"
                            name="cuisine"
                            className="accent-[#d4af37]"
                            checked={form.cuisine === opt}
                            onChange={() => setForm((f) => ({ ...f, cuisine: opt }))}
                          />
                          {opt}
                        </label>
                      ))}
                    </div>
                    {form.cuisine === "Other" && (
                      <input
                        type="text"
                        placeholder="Tell us the cuisine"
                        className="mt-2 w-full rounded-lg bg-white/5 border border-[#b69333]/30 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#ffd369]/60"
                        value={form.cuisineOther}
                        onChange={update("cuisineOther")}
                      />
                    )}
                  </div>

                  {/* Seating */}
                  <div>
                    <label className="block text-sm text-white/85 mb-1">Seating Options</label>
                    <div className="grid grid-cols-2 gap-2 text-sm text-white">
                      {SEATING.map((opt) => (
                        <label
                          key={opt}
                          className={`flex items-center gap-2 rounded-lg border px-3 py-2 cursor-pointer transition ${
                            form.seating === opt
                              ? "border-[#d4af37] bg-[#d4af37]/10"
                              : "border-[#b69333]/30 bg-white/5 hover:bg-white/10"
                          }`}
                        >
                          <input
                            type="radio"
                            name="seating"
                            className="accent-[#d4af37]"
                            checked={form.seating === opt}
                            onChange={() => setForm((f) => ({ ...f, seating: opt }))}
                          />
                          {opt}
                        </label>
                      ))}
                    </div>
                    {form.seating === "Other" && (
                      <input
                        type="text"
                        placeholder="Tell us your seating preference"
                        className="mt-2 w-full rounded-lg bg-white/5 border border-[#b69333]/30 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#ffd369]/60"
                        value={form.seatingOther}
                        onChange={update("seatingOther")}
                      />
                    )}
                  </div>

                  {/* Plan */}
                  <div>
                    <label className="block text-sm text-white/85 mb-1">Tell us more about your plan</label>
                    <div className="grid grid-cols-2 gap-2 text-sm text-white">
                      {PLAN_TYPES.map((opt) => (
                        <label
                          key={opt}
                          className={`flex items-center gap-2 rounded-lg border px-3 py-2 cursor-pointer transition ${
                            form.planType === opt
                              ? "border-[#d4af37] bg-[#d4af37]/10"
                              : "border-[#b69333]/30 bg-white/5 hover:bg-white/10"
                          }`}
                        >
                          <input
                            type="radio"
                            name="planType"
                            className="accent-[#d4af37]"
                            checked={form.planType === opt}
                            onChange={() => setForm((f) => ({ ...f, planType: opt }))}
                          />
                          {opt}
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Toggles */}
                  <YesNo label="Transportation to the Restaurant" value={form.transportToRestaurant} onChange={update("transportToRestaurant")} />
                  <YesNo label="Flowers on table" value={form.flowersOnTable} onChange={update("flowersOnTable")} />
                  <YesNo label="Special Wine or Champagne ready" value={form.specialBottleReady} onChange={update("specialBottleReady")} />
                  <YesNo label="Do you want to prepay the bill?" value={form.prepayBill} onChange={update("prepayBill")} />

                  {/* Someone else */}
                  <YesNo label="Is this enquiry for someone else?" value={form.forSomeoneElse} onChange={update("forSomeoneElse")} />
                  {form.forSomeoneElse === "Yes" && (
                    <div>
                      <label className="block text-sm text-white/85 mb-1">Recipient Name</label>
                      <input
                        type="text"
                        className="w-full rounded-lg bg-white/5 border border-[#b69333]/30 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#ffd369]/60"
                        value={form.someoneElseName}
                        onChange={update("someoneElseName")}
                      />
                    </div>
                  )}

                  {/* Special Requests */}
                  <div>
                    <label className="block text-sm text-white/85 mb-1">Special Requests (max 1000 chars)</label>
                    <textarea
                      maxLength={1000}
                      placeholder="Occasion details, dietary notes, quiet area, window table, etc."
                      className="w-full min-h-[96px] rounded-lg bg-white/5 border border-[#b69333]/30 px-3 py-2 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#ffd369]/60"
                      value={form.specialRequests}
                      onChange={update("specialRequests")}
                    />
                    <div className="text-right text-xs text-white/60">{form.specialRequests.length}/1000</div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={onClose}
                      className="rounded-lg border border-[#b69333]/30 px-4 py-2 text-sm text-white hover:bg-white/10"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={!valid || submitting}
                      className={[
                        "relative overflow-hidden rounded-lg px-5 py-2 text-sm font-semibold",
                        "shadow-[0_0_32px_rgba(212,175,55,0.45)]",
                        valid && !submitting
                          ? "text-black bg-gradient-to-r from-[#d4af37] via-[#ffe08a] to-[#d4af37] bg-[length:200%_auto] animate-shimmer hover:brightness-110"
                          : "bg-white/10 text-white/60 cursor-not-allowed"
                      ].join(" ")}
                    >
                      {submitting ? "Submitting..." : "Enquire Now"}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>,
    modalRoot
  );
}

function YesNo({ label, value, onChange }) {
  return (
    <div>
      <div className="block text-sm text-white/85 mb-1">{label}</div>
      <div className="inline-flex rounded-lg overflow-hidden border border-[#b69333]/30">
        {["Yes", "No"].map((opt, i) => {
          const active = value === opt;
          return (
            <button
              type="button"
              key={opt}
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
