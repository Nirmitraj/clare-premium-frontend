// /src/components/business/CarRentalModal.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

const PLAN_TYPES = ["Leisure", "Business", "Anniversary", "Other"];
const CAR_TYPES = ["Compact", "Intermediate", "Full Size", "SUV", "Luxury", "Convertible"];
const SAFETY_SEATS = ["Infant seat", "Child Seat", "Booster seat"];
const INSURANCE = [
  "CDW - Collision Damage Waiver",
  "SLP - Supplemental Liability Protection",
  "PAI - Personal Accident Insurance",
  "PEC - Personal Effects Coverage",
];

export default function CarRentalModal({
  open,
  onClose,
  onSubmit,
  title = "Car Rental",
  subtitle = "Pickups, returns, safety seats, insurance — handled",
  imageUrl = "/media/car-rental.png",
  info = [
    "Share your pickup/return details and preferred car type.",
    "Add safety seats, insurance, and flight info if needed.",
    "We’ll secure the best options and rates for you.",
  ],
}) {
  const [form, setForm] = useState({
    pickupLocation: "",
    pickupDateTime: "", // datetime-local

    returnLocation: "",
    returnDateTime: "", // datetime-local

    driverName: "",
    driverAge: "",

    addlDriver: "No",
    addlDriverName: "",
    addlDriverAge: "",

    carType: "",
    safetySeats: [],

    flightInfo: "",
    specialRequests: "",
    planType: "",
    planTypeOther: "",

    gps: "No",
    insurance: [],

    forSomeoneElse: "No",
    someoneElseName: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const toggleIn = (k, v) => () =>
    setForm((f) => {
      const s = new Set(f[k]);
      s.has(v) ? s.delete(v) : s.add(v);
      return { ...f, [k]: Array.from(s) };
    });

  const update = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const updateNum = (k, min = 0) => (e) =>
    setForm((f) => ({ ...f, [k]: Math.max(min, parseInt(e.target.value || "0", 10)) }));

  const valid =
    form.pickupLocation.trim() &&
    form.returnLocation.trim() &&
    form.pickupDateTime &&
    form.returnDateTime &&
    new Date(form.returnDateTime) > new Date(form.pickupDateTime) &&
    form.carType &&
    form.driverName.trim() &&
    Number(form.driverAge) > 0;

  // keep return after pickup
  useEffect(() => {
    if (form.pickupDateTime && form.returnDateTime && form.returnDateTime <= form.pickupDateTime) {
      setForm((f) => ({ ...f, returnDateTime: "" }));
    }
  }, [form.pickupDateTime]); // eslint-disable-line

  // portal root
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
        pickupLocation: form.pickupLocation.trim(),
        pickupDateTime: new Date(form.pickupDateTime).toISOString(),

        returnLocation: form.returnLocation.trim(),
        returnDateTime: new Date(form.returnDateTime).toISOString(),

        driverName: form.driverName.trim(),
        driverAge: Number(form.driverAge),

        addlDriver: form.addlDriver,
        addlDriverName: form.addlDriver === "Yes" ? form.addlDriverName.trim() : "",
        addlDriverAge: form.addlDriver === "Yes" ? Number(form.addlDriverAge || 0) : 0,

        carType: form.carType,
        safetySeats: form.safetySeats, // array

        flightInfo: form.flightInfo.trim(),
        specialRequests: (form.specialRequests || "").slice(0, 1000),
        planType: form.planType,
        planTypeOther: form.planType === "Other" ? form.planTypeOther : "",

        gps: form.gps,
        insurance: form.insurance, // array

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
      {/* Local gold styles */}
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

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" />

      {/* Panel */}
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
                <img src={imageUrl} alt="Car Rental" className="h-full w-full object-cover opacity-70" />
                <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/55 to-black/80" />
                <div className="absolute -bottom-24 left-1/2 -translate-x-1/2 w-[140%] h-48 blur-2xl bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.25),transparent_60%)] pointer-events-none" />
              </div>
              <div className="relative px-5 sm:px-8 md:px-10 pb-6 md:pb-10">
                <div className="text-[#e9cd76] text-[11px] md:text-xs uppercase tracking-[0.25em] mb-2 p-3">Clare Premium</div>
                <h2 className="text-2xl sm:text-3xl font-semibold text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.45)]">{title}</h2>
                <p className="text-white/85 mt-1 md:mt-2 text-sm md:text-base">{subtitle}</p>
                <ul className="hidden md:mt-6 md:space-y-2 md:text-white/85 md:text-sm md:block">
                  {info.map((line, i) => (
                    <li key={i} className="flex gap-2">
                      <span className="mt-1 h-1.5 w-1.5 rounded-full bg-[#d4af37]" />
                      <span>{line}</span>
                    </li>
                  ))}
                </ul>
                <div className="hidden md:block mt-6 text-xs text-white/70">Tell us your preferences — we’ll handle the details.</div>
              </div>
            </div>

            {/* Right: form / success */}
            <div className="p-5 sm:p-6 md:p-7 overflow-y-auto max-h-[54vh] md:max-h-[90vh]">
              {done ? (
                <Success onClose={onClose} />
              ) : (
                <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
                  {error && (
                    <div className="rounded-lg border border-red-500/30 bg-red-500/10 text-red-200 px-3 py-2 text-sm">
                      {error}
                    </div>
                  )}

                  {/* Pickup / Return */}
                  <div>
                    <label className="block text-sm text-white/85 mb-1">
                      Pick up Location<span className="text-[#ffd369]">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="City / State / Country / Airport name"
                      className="w-full rounded-lg bg-white/5 border border-[#b69333]/30 px-3 py-2 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#ffd369]/60"
                      value={form.pickupLocation}
                      onChange={update("pickupLocation")}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-white/85 mb-1">
                      Pick up Date & Time<span className="text-[#ffd369]">*</span>
                    </label>
                    <input
                      type="datetime-local"
                      className="w-full rounded-lg bg-white/5 border border-[#b69333]/30 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#ffd369]/60"
                      value={form.pickupDateTime}
                      onChange={update("pickupDateTime")}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-white/85 mb-1">
                      Return Location<span className="text-[#ffd369]">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="City / State / Country / Airport name"
                      className="w-full rounded-lg bg-white/5 border border-[#b69333]/30 px-3 py-2 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#ffd369]/60"
                      value={form.returnLocation}
                      onChange={update("returnLocation")}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-white/85 mb-1">
                      Return Date & Time<span className="text-[#ffd369]">*</span>
                    </label>
                    <input
                      type="datetime-local"
                      className="w-full rounded-lg bg-white/5 border border-[#b69333]/30 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#ffd369]/60"
                      value={form.returnDateTime}
                      onChange={update("returnDateTime")}
                      required
                    />
                  </div>

                  {/* Drivers */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm text-white/85 mb-1">
                        Driver’s name<span className="text-[#ffd369]">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="Full name"
                        className="w-full rounded-lg bg-white/5 border border-[#b69333]/30 px-3 py-2 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#ffd369]/60"
                        value={form.driverName}
                        onChange={update("driverName")}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-white/85 mb-1">
                        Driver’s age<span className="text-[#ffd369]">*</span>
                      </label>
                      <input
                        type="number"
                        min={1}
                        className="w-full rounded-lg bg-white/5 border border-[#b69333]/30 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#ffd369]/60"
                        value={form.driverAge}
                        onChange={updateNum("driverAge", 1)}
                        required
                      />
                    </div>
                  </div>

                  <YesNo label="Additional driver?" value={form.addlDriver} onChange={update("addlDriver")} />
                  {form.addlDriver === "Yes" && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm text-white/85 mb-1">Additional driver name</label>
                        <input
                          type="text"
                          placeholder="Full name"
                          className="w-full rounded-lg bg-white/5 border border-[#b69333]/30 px-3 py-2 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#ffd369]/60"
                          value={form.addlDriverName}
                          onChange={update("addlDriverName")}
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-white/85 mb-1">Additional driver age</label>
                        <input
                          type="number"
                          min={1}
                          className="w-full rounded-lg bg-white/5 border border-[#b69333]/30 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#ffd369]/60"
                          value={form.addlDriverAge}
                          onChange={updateNum("addlDriverAge", 1)}
                        />
                      </div>
                    </div>
                  )}

                  {/* Car Type */}
                  <div>
                    <label className="block text-sm text-white/85 mb-1">
                      Type of car<span className="text-[#ffd369]">*</span>
                    </label>
                    <div className="grid grid-cols-2 gap-2 text-sm text-white">
                      {CAR_TYPES.map((opt) => (
                        <label
                          key={opt}
                          className={`flex items-center gap-2 rounded-lg border px-3 py-2 cursor-pointer transition ${
                            form.carType === opt
                              ? "border-[#d4af37] bg-[#d4af37]/10"
                              : "border-[#b69333]/30 bg-white/5 hover:bg-white/10"
                          }`}
                        >
                          <input
                            type="radio"
                            name="carType"
                            className="accent-[#d4af37]"
                            checked={form.carType === opt}
                            onChange={() => setForm((f) => ({ ...f, carType: opt }))}
                          />
                          {opt}
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Safety seats */}
                  <div>
                    <label className="block text-sm text-white/85 mb-2">Safety options</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-white">
                      {SAFETY_SEATS.map((opt) => (
                        <label
                          key={opt}
                          className={`flex items-center gap-2 rounded-lg border px-3 py-2 cursor-pointer transition ${
                            form.safetySeats.includes(opt)
                              ? "border-[#d4af37] bg-[#d4af37]/10"
                              : "border-[#b69333]/30 bg-white/5 hover:bg-white/10"
                          }`}
                        >
                          <input
                            type="checkbox"
                            className="accent-[#d4af37]"
                            checked={form.safetySeats.includes(opt)}
                            onChange={toggleIn("safetySeats", opt)}
                          />
                          {opt}
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Flight info */}
                  <div>
                    <label className="block text-sm text-white/85 mb-1">Flight information</label>
                    <input
                      type="text"
                      placeholder="Airline / Flight number / ETA"
                      className="w-full rounded-lg bg-white/5 border border-[#b69333]/30 px-3 py-2 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#ffd369]/60"
                      value={form.flightInfo}
                      onChange={update("flightInfo")}
                    />
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
                    {form.planType === "Other" && (
                      <input
                        type="text"
                        placeholder="Tell us more"
                        className="mt-2 w-full rounded-lg bg-white/5 border border-[#b69333]/30 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#ffd369]/60"
                        value={form.planTypeOther}
                        onChange={update("planTypeOther")}
                      />
                    )}
                  </div>

                  {/* Toggles */}
                  <YesNo label="GPS" value={form.gps} onChange={update("gps")} />

                  {/* Insurance */}
                  <div>
                    <label className="block text-sm text-white/85 mb-2">Insurance full coverage (select any)</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-white">
                      {INSURANCE.map((opt) => (
                        <label
                          key={opt}
                          className={`flex items-center gap-2 rounded-lg border px-3 py-2 cursor-pointer transition ${
                            form.insurance.includes(opt)
                              ? "border-[#d4af37] bg-[#d4af37]/10"
                              : "border-[#b69333]/30 bg-white/5 hover:bg-white/10"
                          }`}
                        >
                          <input
                            type="checkbox"
                            className="accent-[#d4af37]"
                            checked={form.insurance.includes(opt)}
                            onChange={toggleIn("insurance", opt)}
                          />
                          {opt}
                        </label>
                      ))}
                    </div>
                  </div>

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
                      placeholder="Pickup curbside? After-hours return? Child seats counts? Accessibility?"
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
                          : "bg-white/10 text-white/60 cursor-not-allowed",
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
              className={`px-4 py-2 text-sm transition ${active ? "text-black bg-gradient-to-r from-[#d4af37] via-[#ffe08a] to-[#d4af37]" : "bg-white/5 text-white/85 hover:bg-white/10"} ${i === 0 ? "border-r border-[#b69333]/30" : ""}`}
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

function Success({ onClose }) {
  return (
    <div className="text-center py-10">
      <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-gradient-to-r from-[#d4af37] via-[#ffe08a] to-[#d4af37] shadow-[0_0_32px_rgba(212,175,55,0.45)]" />
      <h3 className="text-xl font-semibold text-white">Thank you!</h3>
      <p className="text-white/80 mt-1">Your car rental enquiry has been submitted. We’ll be in touch soon.</p>
      <button
        onClick={onClose}
        className="mt-6 rounded-lg px-5 py-2 text-sm font-semibold text-black bg-gradient-to-r from-[#d4af37] via-[#ffe08a] to-[#d4af37] bg-[length:200%_auto] animate-shimmer hover:brightness-110"
      >
        Close
      </button>
    </div>
  );
}
