"use client";

import { useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createFamilyAction } from "@/lib/family/actions";

export function CreateFamilyForm() {
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();

  return (
    <form
      className="space-y-4"
      onSubmit={(event) => {
        event.preventDefault();
        setError("");
        const formData = new FormData(event.currentTarget);
        startTransition(async () => {
          const result = await createFamilyAction(formData);
          if (!result.ok) {
            setError(result.error);
          }
        });
      }}
    >
      <div className="space-y-2">
        <Label htmlFor="name">Family name</Label>
        <Input
          id="name"
          name="name"
          required
          maxLength={80}
          placeholder="Lee Family"
          className="h-10"
        />
      </div>
      {error ? (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : null}
      <Button type="submit" className="h-10" disabled={pending}>
        {pending ? "Creating…" : "Create family space"}
      </Button>
    </form>
  );
}
