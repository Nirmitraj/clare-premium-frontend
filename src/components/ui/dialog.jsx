import React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";

export const Dialog = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;
export const DialogClose = DialogPrimitive.Close;

export function DialogContent({ className = "", children, ...props }) {
  return (
    <DialogPrimitive.Portal>
      {/* Overlay sits below the panel */}
      <DialogPrimitive.Overlay className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-[2px]" />
      <DialogPrimitive.Content
        className={
          // Panel must be ABOVE overlay
          "fixed left-1/2 top-8 -translate-x-1/2 w-[92%] max-w-2xl z-[101] " +
          "rounded-2xl bg-[#101012] text-white ring-1 ring-white/10 " +
          "shadow-[0_20px_80px_-20px_rgba(0,0,0,0.6)] focus:outline-none " +
          className
        }
        // prevent autofocus jump on open (optional)
        onOpenAutoFocus={(e) => e.preventDefault()}
        {...props}
      >
        {/* Close button */}
        <DialogPrimitive.Close
          aria-label="Close"
          className="absolute right-4 top-4 rounded-md p-1.5 text-white/70 hover:text-white focus:outline-none focus:ring-2 focus:ring-white/30"
        >
          ✕
        </DialogPrimitive.Close>

        {/* Scrollable content area */}
        <div className="p-6 max-h-[80vh] overflow-y-auto">
          {children}
        </div>
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
}

export function DialogHeader({ children }) {
  return <div className="mb-4 space-y-1.5">{children}</div>;
}

export function DialogTitle(props) {
  return <DialogPrimitive.Title className="text-xl font-semibold" {...props} />;
}

export function DialogDescription(props) {
  return <DialogPrimitive.Description className="text-sm text-white/70" {...props} />;
}
