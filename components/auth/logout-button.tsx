"use client";

import { useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { signOut } from "@/lib/auth/actions";

export function LogoutButton() {
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();

  return (
    <div className="flex flex-col items-end gap-1">
      <Button
        type="button"
        variant="outline"
        disabled={pending}
        onClick={() => {
          setError("");
          startTransition(async () => {
            try {
              await signOut();
            } catch (caught) {
              setError(
                caught instanceof Error
                  ? caught.message
                  : "Could not sign out. Try again.",
              );
            }
          });
        }}
      >
        {pending ? "Signing out…" : "Sign out"}
      </Button>
      {error ? (
        <p className="text-xs text-destructive" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
