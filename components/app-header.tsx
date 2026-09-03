import Link from "next/link";
import { Clapperboard } from "lucide-react";

import { LogoutButton } from "@/components/auth/logout-button";

type AppHeaderProps = {
  email: string;
};

export function AppHeader({ email }: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/85 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/home" className="flex items-center gap-2">
          <span className="flex size-8 items-center justify-center rounded-lg bg-primary/15 text-primary">
            <Clapperboard className="size-5" />
          </span>
          <span className="text-lg font-semibold tracking-tight text-foreground">
            LetsVideo
          </span>
        </Link>
        <div className="flex items-center gap-3">
          <p className="hidden max-w-56 truncate text-sm text-muted-foreground sm:block">
            {email}
          </p>
          <LogoutButton />
        </div>
      </div>
    </header>
  );
}
