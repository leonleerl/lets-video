"use client";

import { useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { completeInviteAction } from "@/lib/family/actions";

type JoinInviteFormProps = {
  token: string;
  email: string;
};

export function JoinInviteForm({ token, email }: JoinInviteFormProps) {
  const [mode, setMode] = useState<"join" | "signin">("join");
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();

  return (
    <form
      className="space-y-4"
      onSubmit={(event) => {
        event.preventDefault();
        setError("");
        const formData = new FormData(event.currentTarget);
        formData.set("mode", mode);
        startTransition(async () => {
          const result = await completeInviteAction(token, formData);
          if (!result.ok) {
            setError(result.error);
          }
        });
      }}
    >
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          value={email}
          readOnly
          className="h-10 bg-muted/40"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">
          {mode === "join" ? "Create password" : "Password"}
        </Label>
        <Input
          id="password"
          name="password"
          type="password"
          required
          minLength={6}
          className="h-10"
          autoComplete={mode === "join" ? "new-password" : "current-password"}
        />
        <p className="text-xs text-muted-foreground">
          {mode === "join"
            ? "First time here? Set a password to create your LetsVideo account and join this family."
            : "Already set a password before? Sign in with it to join."}
        </p>
      </div>

      {error ? (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : null}

      <Button type="submit" className="h-10 w-full" disabled={pending}>
        {pending
          ? "Working…"
          : mode === "join"
            ? "Create password & join family"
            : "Sign in & join family"}
      </Button>

      <button
        type="button"
        className="w-full text-center text-sm text-muted-foreground underline-offset-4 hover:underline"
        onClick={() => {
          setError("");
          setMode((current) => (current === "join" ? "signin" : "join"));
        }}
      >
        {mode === "join"
          ? "Already have a password? Sign in instead"
          : "First time? Create a password instead"}
      </button>
    </form>
  );
}
