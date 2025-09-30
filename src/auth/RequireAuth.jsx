// src/auth/RequireAuth.jsx
import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function RequireAuth({ children }) {
  const ctx = useAuth(); // could be null if the provider isn't mounted
  const location = useLocation();

  // If provider is missing, fall back to localStorage token
  if (!ctx) {
    const hasToken = !!localStorage.getItem("access_token");
    return hasToken ? children : <Navigate to="/" replace state={{ from: location }} />;
  }

  const { isAuthenticated, refresh } = ctx;

  // If we already have a token in storage (e.g., just set by login),
  // treat as authed immediately to prevent redirect flashes.
  const hasToken = !!localStorage.getItem("access_token");

  const [status, setStatus] = useState(
    isAuthenticated || hasToken ? "authed" : "checking"
  );

  useEffect(() => {
    let cancelled = false;

    (async () => {
      if (cancelled) return;

      // Context says authed → good
      if (isAuthenticated) {
        if (!cancelled) setStatus("authed");
        return;
      }

      // Token exists in storage (may be set this tick by login)
      if (hasToken) {
        if (!cancelled) setStatus("authed");
        return;
      }

      // No token yet → try to mint one via refresh endpoint (cookie-based)
      try {
        const ok = await refresh();
        if (!cancelled) setStatus(ok ? "authed" : "guest");
      } catch {
        if (!cancelled) setStatus("guest");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, refresh, hasToken]);

  // Optional: render nothing (or a tiny loader) while checking
  if (status === "checking") return null;

  if (status !== "authed") {
    // Not authenticated → send home, but keep attempted location
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  return children;
}
