// src/App.jsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import ClarePremiumServices from "./components/ClarePremiumServices";
import Member from "./pages/Member";
import RequireAuth from "./auth/RequireAuth";

export default function App() {
  const IMAGES = {
    lifestyle: "/imgs/lifestyle.jpg",
    business: "/imgs/business.jpg",
    concierge: "/imgs/concierge.jpg",
    travel: "/imgs/travel.jpg",
    cruises: "/imgs/cruises.jpg",
    shopping: "/imgs/shopping.jpg",
  };

  return (
    <Routes>
      <Route
        path="/"
        element={<ClarePremiumServices logoUrl="/logo.png" images={IMAGES} />}
      />
      <Route
        path="/member"
        element={
          <RequireAuth>
            <Member />
          </RequireAuth>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
