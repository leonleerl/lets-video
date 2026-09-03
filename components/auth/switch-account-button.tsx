"use client";

import { useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { signOutToLogin } from "@/lib/auth/actions";

type SwitchAccountButtonProps = {
  nextPath: string;
  emailHint: string;
};

export function SwitchAccountButton({
  nextPath,
  emailHint,
}: SwitchAccountButtonProps) {
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();

  return (
    <div className="space-y-2">
      <Button
        type="button"
        className="h-10"
        disabled={pending}
        onClick={() => {
          setError("");
          startTransition(async () => {
            try {
              await signOutToLogin(nextPath, emailHint);
            } catch (caught) {
              setError(
                caught instanceof Error
                  ? caught.message
                  : "Could not switch accounts. Try again.",
              );
            }
          });
        }}
      >
        {pending ? "Switching…" : `Sign out and continue as ${emailHint}`}
      </Button>
      {error ? (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
