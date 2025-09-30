import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

export default function RegisterModal({
  open,
  onOpenChange,
  handleRegister,
  regLoading,
  regError,
  setShowLogin,
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Create your account</DialogTitle>
          <DialogDescription>
            Register to access Clare Premium services.
          </DialogDescription>
        </DialogHeader>

        <form className="space-y-4" onSubmit={handleRegister}>
          {/* NEW: First & Last name (required) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-2">
              <label className="text-sm text-white/80" htmlFor="first_name">
                First name
              </label>
              <Input
                id="first_name"
                name="first_name"
                type="text"
                placeholder="Jane"
                required
                maxLength={80}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-white/80" htmlFor="last_name">
                Last name
              </label>
              <Input
                id="last_name"
                name="last_name"
                type="text"
                placeholder="Doe"
                required
                maxLength={80}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm text-white/80" htmlFor="reg_email">
              Email
            </label>
            <Input
              id="reg_email"
              name="email"
              type="email"
              placeholder="you@example.com"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm text-white/80" htmlFor="reg_password">
              Password
            </label>
            <Input
              id="reg_password"
              name="password"
              type="password"
              placeholder="••••••••"
              required
              maxLength={256}
            />
          </div>

          {regError && <p className="text-sm text-red-400">{regError}</p>}

          <div className="flex items-center justify-between pt-2">
            <Button type="submit" className="rounded-xl" disabled={regLoading}>
              {regLoading ? "Creating..." : "Create account"}
            </Button>
            <button
              type="button"
              onClick={() => {
                onOpenChange(false);
                setShowLogin(true);
              }}
              className="text-sm text-white/70 hover:text-white underline"
            >
              Already have an account? Sign in
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
