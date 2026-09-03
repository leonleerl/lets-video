import Link from "next/link";
import { Clapperboard } from "lucide-react";

import { LogoutButton } from "@/components/auth/logout-button";
import { FamilySwitcher } from "@/components/family/family-switcher";
import type { FamilyMembership } from "@/lib/family/types";

type AppHeaderProps = {
  email: string;
  families?: FamilyMembership[];
  currentFamilyId?: string;
};

export function AppHeader({
  email,
  families = [],
  currentFamilyId,
}: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/85 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
        <div className="flex min-w-0 items-center gap-4">
          <Link href="/home" className="flex items-center gap-2">
            <span className="flex size-8 items-center justify-center rounded-lg bg-primary/15 text-primary">
              <Clapperboard className="size-5" />
            </span>
            <span className="text-lg font-semibold tracking-tight text-foreground">
              LetsVideo
            </span>
          </Link>
          <FamilySwitcher
            families={families}
            currentFamilyId={currentFamilyId}
          />
        </div>
        <div className="flex min-w-0 items-center gap-3">
          <p className="max-w-40 truncate text-xs text-muted-foreground sm:max-w-56 sm:text-sm">
            {email}
          </p>
          <LogoutButton />
        </div>
      </div>
    </header>
  );
}
