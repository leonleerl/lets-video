import { LandingCta } from "@/components/landing/cta";
import { LandingFeatures } from "@/components/landing/features";
import { LandingHero } from "@/components/landing/hero";
import { LandingProblem } from "@/components/landing/problem";
import { LandingTimeline } from "@/components/landing/timeline";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export default function MarketingPage() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <LandingHero />
        <LandingProblem />
        <LandingFeatures />
        <LandingTimeline />
        <LandingCta />
      </main>
      <SiteFooter />
    </>
  );
}
