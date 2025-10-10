// /src/components/travel/TransfersModal.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

export default function TransfersModal({
  open,
  onClose,
  onSubmit,
  title = "Transfers",
  subtitle = "Airport & city transfers with premium touches",
  imageUrl = "/media/transfers.png",
  info = [
    "Meet & greet at arrivals and smooth exit.",
    "Immaculate cars with optional refreshments & Wi-Fi.",
    "Reliable, punctual, and tracked in real time.",
  ],
}) {
  const [form, setForm] = useState({
    transferType: "Standard",        // "Standard" | "Business" | "Other"
    transferTypeOther: "",
    tripType: "One-Way",             // "One-Way" | "Round-Trip"
    pickUpLocation: "",
    dropOffLocation: "",
    arrivalInfo: "",                 // Airline / Flight Number
    date: "",                        // YYYY-MM-DD
    time: "",                        // HH:MM
    returnDate: "",
    returnTime: "",
    passengers: 1,
    meetAndGreet: "Yes",
    facialTowels: "No",
    welcomeDrinks: "No",
    wifi: "No",
    forSomeoneElse: "No",
    someoneElseName: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const needReturn = form.tripType === "Round-Trip";
  const valid =
    form.pickUpLocation.trim() &&
    form.dropOffLocation.trim() &&
    form.date &&
    form.time &&
    Number(form.passengers) > 0 &&
    (!needReturn || (form.returnDate && form.returnTime));

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
    const onKey = (e) => open && e.key === "Escape" && onClose?.();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (open) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => (document.body.style.overflow = prev);
    }
  }, [open]);

  const update = (name) => (e) => setForm((f) => ({ ...f, [name]: e.target.value }));
  const updateNum = (name, min = 0) => (e) => {
    const v = Math.max(min, parseInt(e.target.value || "0", 10));
    setForm((f) => ({ ...f, [name]: v }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!valid) return;
    setSubmitting(true);
    try {
      // Prefer sending ISO datetime to backend; it can also accept date/time pairs.
      const payload = {
        transferType: form.transferType,
        transferTypeOther: form.transferType === "Other" ? form.transferTypeOther : "",
        tripType: form.tripType,
        pickUpLocation: form.pickUpLocation.trim(),
        dropOffLocation: form.dropOffLocation.trim(),
        arrivalInfo: form.arrivalInfo.trim(),
        pickupDateTime: `${form.date}T${form.time}`,
        returnDateTime: needReturn ? `${form.returnDate}T${form.returnTime}` : null,
        passengers: Number(form.passengers),
        meetAndGreet: form.meetAndGreet,
        facialTowels: form.facialTowels,
        welcomeDrinks: form.welcomeDrinks,
        wifi: form.wifi,
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
      {/* Local styles: gold shimmer same as others */}
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
        @keyframes sweep {
          0% { transform: translateX(0); }
          50% { transform: translateX(380%); }
          100% { transform: translateX(380%); }
        }
      `}</style>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" />

      {/* Panel */}
      <div
        className={[
          "relative z-[101]",
          "w-screen h-screen md:w-[92vw] md:h-auto md:max-h-[90vh]",
          "p-[1.5px] rounded-none md:rounded-2xl",
          "bg-gradient-to-br from-[#8a6b2e] via-[#d4af37] to-[#8a6b2e]",
          "shadow-[0_20px_80px_-20px_rgba(0,0,0,0.65),0_0_60px_-12px_rgba(212,175,55,0.35)]",
          "overflow-hidden",
        ].join(" ")}
      >
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
                <img src={imageUrl} alt="Transfers" className="h-full w-full object-cover opacity-70" />
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
                  <p className="text-white/80 mt-1">
                    Your transfer enquiry has been submitted. Our team will reach out shortly.
                  </p>
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

                  {/* Transfer Type */}
                  <div>
                    <label className="block text-sm text-white/85 mb-1">Transfer Type</label>
                    <div className="grid grid-cols-3 gap-2 text-sm text-white">
                      {["Standard", "Business", "Other"].map((opt) => (
                        <label
                          key={opt}
                          className={`flex items-center gap-2 rounded-lg border px-3 py-2 cursor-pointer transition ${
                            form.transferType === opt
                              ? "border-[#d4af37] bg-[#d4af37]/10"
                              : "border-[#b69333]/30 bg-white/5 hover:bg-white/10"
                          }`}
                        >
                          <input
                            type="radio"
                            name="transferType"
                            className="accent-[#d4af37]"
                            checked={form.transferType === opt}
                            onChange={() => setForm((f) => ({ ...f, transferType: opt }))}
                          />
                          {opt}
                        </label>
                      ))}
                    </div>
                    {form.transferType === "Other" && (
                      <input
                        type="text"
                        placeholder="Tell us more"
                        className="mt-2 w-full rounded-lg bg-white/5 border border-[#b69333]/30 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#ffd369]/60"
                        value={form.transferTypeOther}
                        onChange={update("transferTypeOther")}
                      />
                    )}
                  </div>

                  {/* Trip type */}
                  <div>
                    <div className="block text-sm text-white/85 mb-1">Trip</div>
                    <div className="inline-flex rounded-lg overflow-hidden border border-[#b69333]/30">
                      {["One-Way", "Round-Trip"].map((opt, i) => {
                        const active = form.tripType === opt;
                        return (
                          <button
                            key={opt}
                            type="button"
                            className={`px-4 py-2 text-sm transition ${
                              active
                                ? "text-black bg-gradient-to-r from-[#d4af37] via-[#ffe08a] to-[#d4af37]"
                                : "bg-white/5 text-white/85 hover:bg-white/10"
                            } ${i === 0 ? "border-right border-[#b69333]/30" : ""}`}
                            onClick={() => setForm((f) => ({ ...f, tripType: opt }))}
                          >
                            {opt}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Locations */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm text-white/85 mb-1">
                        Pick up location<span className="text-[#ffd369]">*</span>
                      </label>
                      <input
                        type="text"
                        className="w-full rounded-lg bg-white/5 border border-[#b69333]/30 px-3 py-2 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#ffd369]/60"
                        placeholder="Airport / Hotel / Address"
                        value={form.pickUpLocation}
                        onChange={update("pickUpLocation")}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-white/85 mb-1">
                        Drop off location<span className="text-[#ffd369]">*</span>
                      </label>
                      <input
                        type="text"
                        className="w-full rounded-lg bg-white/5 border border-[#b69333]/30 px-3 py-2 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#ffd369]/60"
                        placeholder="Airport / Hotel / Address"
                        value={form.dropOffLocation}
                        onChange={update("dropOffLocation")}
                        required
                      />
                    </div>
                  </div>

                  {/* Arrival info */}
                  <div>
                    <label className="block text-sm text-white/85 mb-1">Arrival Information</label>
                    <input
                      type="text"
                      placeholder="Airline / Flight Number"
                      className="w-full rounded-lg bg-white/5 border border-[#b69333]/30 px-3 py-2 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#ffd369]/60"
                      value={form.arrivalInfo}
                      onChange={update("arrivalInfo")}
                    />
                  </div>

                  {/* Date & Time */}
                  <div className="grid grid-cols-2 gap-3 ">
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

                  {/* Return leg */}
                  {needReturn && (
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm text-white/85 mb-1">
                          Return Date<span className="text-[#ffd369]">*</span>
                        </label>
                        <input
                          type="date"
                          className="w-full rounded-lg bg-white/5 border border-[#b69333]/30 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#ffd369]/60"
                          value={form.returnDate}
                          onChange={update("returnDate")}
                          required={needReturn}
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-white/85 mb-1">
                          Return Time<span className="text-[#ffd369]">*</span>
                        </label>
                        <input
                          type="time"
                          className="w-full rounded-lg bg-white/5 border border-[#b69333]/30 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#ffd369]/60"
                          value={form.returnTime}
                          onChange={update("returnTime")}
                          required={needReturn}
                        />
                      </div>
                    </div>
                  )}

                  {/* Passengers */}
                  <div>
                    <label className="block text-sm text-white/85 mb-1">
                      Number of Passengers<span className="text-[#ffd369]">*</span>
                    </label>
                    <input
                      type="number"
                      min="1"
                      inputMode="numeric"
                      className="w-full rounded-lg bg-white/5 border border-[#b69333]/30 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#ffd369]/60"
                      value={form.passengers}
                      onChange={updateNum("passengers", 1)}
                      required
                    />
                  </div>

                  {/* Yes/No toggles */}
                  <YesNo label="Meet & Greet service" value={form.meetAndGreet} onChange={update("meetAndGreet")} />
                  <YesNo label="Refreshing facial towels" value={form.facialTowels} onChange={update("facialTowels")} />
                  <YesNo label="Welcome drinks on board" value={form.welcomeDrinks} onChange={update("welcomeDrinks")} />
                  <YesNo label="WiFi on route" value={form.wifi} onChange={update("wifi")} />
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
