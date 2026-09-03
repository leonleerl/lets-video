import Link from "next/link";
import { ArrowRight, Globe, Heart, Play, Shield } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function LandingHero() {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 pt-16 pb-20 sm:px-6 sm:pt-24">
      <div className="mx-auto max-w-3xl text-center">
        <Badge variant="secondary" className="mb-6 gap-1.5 px-3 py-1 text-primary">
          Private Family Video Platform
        </Badge>
        <h1 className="text-balance text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
          Preserve Family Memories{" "}
          <span className="text-primary">Across Borders</span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
          LetsVideo is a private family video platform for families living across
          different countries. Upload, share, and revisit the moments that belong
          to your family — without relying on public social networks.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button size="lg" className="h-11 px-6 text-sm" asChild>
            <Link href="/signup">
              Create Family Space
              <ArrowRight className="size-4" />
            </Link>
          </Button>
          <Button variant="outline" size="lg" className="h-11 px-6 text-sm" asChild>
            <Link href="#features">
              <Play className="size-4" />
              See How It Works
            </Link>
          </Button>
        </div>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Shield className="size-4 text-primary" />
            Private & Secure
          </span>
          <span className="flex items-center gap-1.5">
            <Globe className="size-4 text-primary" />
            Cross-Region Sharing
          </span>
          <span className="flex items-center gap-1.5">
            <Heart className="size-4 text-primary" />
            Built for Family
          </span>
        </div>
      </div>
    </section>
  );
}
