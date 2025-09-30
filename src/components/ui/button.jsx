import React from "react";

export function Button({ className = "", ...props }) {
  return (
    <button
      className={
        "inline-flex items-center justify-center rounded-xl px-4 py-2 " +
        "bg-white/90 text-black hover:bg-white transition " +
        "disabled:opacity-50 disabled:pointer-events-none " +
        className
      }
      {...props}
    />
  );
}
