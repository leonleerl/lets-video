"use client";

import { useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import {
  cancelInvitationAction,
  removeMemberAction,
} from "@/lib/family/actions";

type CancelInvitationButtonProps = {
  familyId: string;
  invitationId: string;
};

export function CancelInvitationButton({
  familyId,
  invitationId,
}: CancelInvitationButtonProps) {
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();

  return (
    <div className="flex flex-col items-end gap-1">
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={pending}
        onClick={() => {
          setError("");
          startTransition(async () => {
            const result = await cancelInvitationAction(familyId, invitationId);
            if (!result.ok) {
              setError(result.error);
            }
          });
        }}
      >
        {pending ? "Cancelling…" : "Cancel"}
      </Button>
      {error ? (
        <p className="text-xs text-destructive" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

type RemoveMemberButtonProps = {
  familyId: string;
  memberId: string;
};

export function RemoveMemberButton({
  familyId,
  memberId,
}: RemoveMemberButtonProps) {
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();

  return (
    <div className="flex flex-col items-end gap-1">
      <Button
        type="button"
        variant="destructive"
        size="sm"
        disabled={pending}
        onClick={() => {
          setError("");
          startTransition(async () => {
            const result = await removeMemberAction(familyId, memberId);
            if (!result.ok) {
              setError(result.error);
            }
          });
        }}
      >
        {pending ? "Removing…" : "Remove"}
      </Button>
      {error ? (
        <p className="text-xs text-destructive" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
