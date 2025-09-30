import React from "react";

export const Input = React.forwardRef(function Input(
  { className = "", ...props },
  ref
) {
  return (
    <input
      ref={ref}
      className={
        "w-full rounded-xl bg-white/10 text-white placeholder-white/60 " +
        "px-4 py-3 ring-1 ring-white/15 outline-none " +
        "focus:ring-2 focus:ring-white/30 " +
        className
      }
      {...props}
    />
  );
});
