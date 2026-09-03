"use client";

import { useRef, useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { inviteMemberAction } from "@/lib/family/actions";
import { INVITABLE_ROLES } from "@/lib/family/types";

type InviteMemberFormProps = {
  familyId: string;
};

export function InviteMemberForm({ familyId }: InviteMemberFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [acceptUrl, setAcceptUrl] = useState("");
  const [emailSent, setEmailSent] = useState<boolean | null>(null);
  const [copied, setCopied] = useState(false);
  const [pending, startTransition] = useTransition();

  return (
    <form
      ref={formRef}
      className="space-y-4"
      onSubmit={(event) => {
        event.preventDefault();
        setError("");
        setMessage("");
        setAcceptUrl("");
        setEmailSent(null);
        setCopied(false);
        const formData = new FormData(event.currentTarget);
        startTransition(async () => {
          const result = await inviteMemberAction(familyId, formData);
          if (!result.ok) {
            setError(result.error);
            return;
          }

          setMessage(result.message ?? "Invitation created.");
          setAcceptUrl(result.acceptUrl ?? "");
          setEmailSent(result.emailSent ?? null);
          formRef.current?.reset();
        });
      }}
    >
      <div className="grid gap-4 sm:grid-cols-[1.4fr_1fr_auto] sm:items-end">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            required
            className="h-10"
            placeholder="member@example.com"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="role">Role</Label>
          <select
            id="role"
            name="role"
            defaultValue="member"
            className="h-10 w-full rounded-lg border border-input bg-background px-2.5 text-sm"
          >
            {INVITABLE_ROLES.map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>
        </div>
        <Button type="submit" className="h-10" disabled={pending}>
          {pending ? "Sending…" : "Send invite"}
        </Button>
      </div>
      {error ? (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : null}
      {message ? (
        <div
          className={
            emailSent === false
              ? "rounded-lg border border-amber-500/40 bg-amber-500/10 px-3 py-3 text-sm text-foreground"
              : "rounded-lg border border-border bg-muted/40 px-3 py-3 text-sm text-foreground"
          }
          role="status"
        >
          <p className="font-medium">
            {emailSent === false
              ? "Invitation saved — no Invite email this time"
              : emailSent
                ? "Email requested"
                : "Invitation created"}
          </p>
          <p className="mt-1 text-muted-foreground">{message}</p>
        </div>
      ) : null}
      {acceptUrl ? (
        <div className="space-y-2 rounded-lg border border-border bg-card px-3 py-3">
          <p className="text-sm font-medium text-foreground">Accept link</p>
          <p className="break-all text-xs text-muted-foreground">{acceptUrl}</p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={async () => {
              await navigator.clipboard.writeText(acceptUrl);
              setCopied(true);
            }}
          >
            {copied ? "Copied" : "Copy accept link"}
          </Button>
        </div>
      ) : null}
    </form>
  );
}
