"use client";

import { useRouter } from "next/navigation";

import type { FamilyMembership } from "@/lib/family/types";

type FamilySwitcherProps = {
  families: FamilyMembership[];
  currentFamilyId?: string;
};

export function FamilySwitcher({
  families,
  currentFamilyId,
}: FamilySwitcherProps) {
  const router = useRouter();

  if (families.length === 0) {
    return null;
  }

  return (
    <label className="flex items-center gap-2 text-sm text-muted-foreground">
      <span className="hidden sm:inline">Family</span>
      <select
        className="h-9 max-w-48 rounded-lg border border-input bg-background px-2 text-sm text-foreground"
        value={currentFamilyId ?? ""}
        onChange={(event) => {
          const familyId = event.target.value;
          if (familyId) {
            router.push(`/family/${familyId}`);
          }
        }}
      >
        {!currentFamilyId ? <option value="">Select family</option> : null}
        {families.map((membership) => (
          <option key={membership.family.id} value={membership.family.id}>
            {membership.family.name}
          </option>
        ))}
      </select>
    </label>
  );
}
