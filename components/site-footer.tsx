import Link from "next/link";
import { Clapperboard } from "lucide-react";

import { Separator } from "@/components/ui/separator";

const footerGroups = [
  {
    title: "Product",
    links: [
      { label: "Family Spaces", href: "#features" },
      { label: "Video Sharing", href: "#features" },
      { label: "Memory Timeline", href: "#timeline" },
    ],
  },
  {
    title: "Get started",
    links: [
      { label: "Sign in", href: "/login" },
      { label: "Create a space", href: "/signup" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-secondary/40">
      <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-10 md:grid-cols-[1.4fr_repeat(2,1fr)]">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="flex size-8 items-center justify-center rounded-lg bg-primary/15 text-primary">
                <Clapperboard className="size-5" />
              </span>
              <span className="text-lg font-semibold tracking-tight text-foreground">
                LetsVideo
              </span>
            </div>
            <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
              Preserve family memories across borders. A private video space for
              families living around the world.
            </p>
          </div>

          {footerGroups.map((group) => (
            <div key={group.title} className="space-y-3">
              <p className="text-sm font-medium text-foreground">{group.title}</p>
              <ul className="space-y-2">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col items-center justify-between gap-3 text-sm text-muted-foreground sm:flex-row">
          <p>© {new Date().getFullYear()} LetsVideo · Private family video platform</p>
          <p>Preserving every moment worth remembering.</p>
        </div>
      </div>
    </footer>
  );
}
