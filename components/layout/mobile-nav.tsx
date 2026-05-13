"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import { MenuIcon } from "lucide-react";
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui";

const emptySubscribe = () => () => {};

function useHasMountedClient() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
}

/**
 * Radix DropdownMenu uses ids that differ between RSC SSR and client in some setups.
 * Render an inert outline button until hydrated, then mount the dropdown.
 */
export function MobileNavMenu() {
  const mounted = useHasMountedClient();

  if (!mounted) {
    return (
      <div className="sm:hidden">
        <Button
          type="button"
          variant="outline"
          aria-hidden
          tabIndex={-1}
          className="pointer-events-none opacity-80"
          title="Loading menu..."
        >
          <MenuIcon className="size-4" aria-hidden />
        </Button>
      </div>
    );
  }

  return (
    <div className="sm:hidden">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button type="button" variant="outline" aria-label="Open navigation menu">
            <MenuIcon className="size-4" aria-hidden />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" sideOffset={4}>
          <DropdownMenuGroup>
            <DropdownMenuItem asChild className="cursor-pointer">
              <Link href="/">Latest</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="cursor-pointer">
              <Link href="/albums">Albums</Link>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
