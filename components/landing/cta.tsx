import Link from "next/link";
import { ArrowRight, Upload } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export function LandingCta() {
  return (
    <section className="py-16 sm:py-24">
      <div className="mx-auto w-full max-w-4xl px-4 sm:px-6">
        <Card className="bg-card">
          <CardContent className="flex flex-col items-center gap-6 px-6 py-10 text-center sm:px-10">
            <Badge variant="secondary" className="gap-1.5 text-primary">
              <Upload className="size-3.5" />
              Early Development
            </Badge>
            <h2 className="max-w-xl text-balance text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              Start Building Your Family&apos;s First Memory Space
            </h2>
            <p className="max-w-xl text-pretty text-base leading-relaxed text-muted-foreground">
              The first milestone focuses on family spaces, private video upload,
              playback, and sharing. Create an account to get started.
            </p>
            <div className="flex flex-col items-center gap-3 sm:flex-row">
              <Button size="lg" className="h-11 px-6 text-sm" asChild>
                <Link href="/signup">
                  Create Family Space
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="h-11 px-6 text-sm" asChild>
                <Link href="/login">Sign in</Link>
              </Button>
            </div>
            <Separator className="mt-2" />
            <p className="text-sm text-muted-foreground">
              Private · Secure · Built for families across borders
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
