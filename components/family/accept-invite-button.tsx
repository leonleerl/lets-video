"use client";

import { useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { acceptInvitationAction } from "@/lib/family/actions";

type AcceptInviteButtonProps = {
  token: string;
};

export function AcceptInviteButton({ token }: AcceptInviteButtonProps) {
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
            const result = await acceptInvitationAction(token);
            if (!result.ok) {
              setError(result.error);
            }
          });
        }}
      >
        {pending ? "Joining…" : "Accept invitation"}
      </Button>
      {error ? (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
