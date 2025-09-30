import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

const API_BASE = import.meta?.env?.VITE_API_BASE || "http://localhost:8000";
const AuthContext = createContext(null);

function getCookie(name) {
  return document.cookie
    .split("; ")
    .find((row) => row.startsWith(name + "="))
    ?.split("=")[1];
}

export function AuthProvider({ children }) {
  const [accessToken, setAccessToken] = useState(() => localStorage.getItem("access_token") || null);
  const isAuthenticated = !!accessToken;

  // helper to call refresh using HttpOnly cookie + CSRF
  const refresh = async () => {
    const csrf = getCookie("csrf_token");
    const res = await fetch(`${API_BASE}/auth/refresh`, {
      method: "POST",
      credentials: "include",
      headers: { "X-CSRF-Token": csrf || "" },
    });
    if (!res.ok) return false;
    const data = await res.json();
    setAccessToken(data.access_token);
    localStorage.setItem("access_token", data.access_token);
    return true;
  };

  const login = async (email, password) => {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || "Login failed");
    }
    const data = await res.json();
    setAccessToken(data.access_token);
    localStorage.setItem("access_token", data.access_token);
    return true;
  };

  const logout = async () => {
    const csrf = getCookie("csrf_token");
    await fetch(`${API_BASE}/auth/logout`, {
      method: "POST",
      credentials: "include",
      headers: { "X-CSRF-Token": csrf || "" },
    }).catch(() => {});
    setAccessToken(null);
    localStorage.removeItem("access_token");
  };

  // fetch wrapper that auto-refreshes on 401
  const fetchWithAuth = async (url, options = {}) => {
    const res = await fetch(url, {
      ...options,
      headers: { ...(options.headers || {}), Authorization: `Bearer ${accessToken}` },
      credentials: options.credentials || "include",
    });
    if (res.status !== 401) return res;

    // try refresh once
    const ok = await refresh();
    if (!ok) return res; // original 401

    // retry original request
    return fetch(url, {
      ...options,
      headers: { ...(options.headers || {}), Authorization: `Bearer ${localStorage.getItem("access_token")}` },
      credentials: options.credentials || "include",
    });
  };

  const value = useMemo(() => ({ isAuthenticated, accessToken, login, logout, refresh, fetchWithAuth, API_BASE }), [isAuthenticated, accessToken]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
