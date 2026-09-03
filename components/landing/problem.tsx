import { Card, CardContent } from "@/components/ui/card";

const problems = [
  "Videos scattered across WeChat, LINE, WhatsApp, and more",
  "Important memories become difficult to find",
  "Family history becomes fragmented",
  "Valuable moments are often forgotten",
];

export function LandingProblem() {
  return (
    <section className="bg-secondary/40 py-16 sm:py-20">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <div className="grid items-center gap-10 md:grid-cols-2">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              Modern Families Are Spread Across the World
            </h2>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground">
              A typical family may use WeChat, LINE, WhatsApp, Google Photos, and
              iCloud all at once. Videos get scattered across different apps,
              making family memories hard to organise, search, and revisit.
            </p>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground">
              LetsVideo provides a centralised and private space dedicated to
              preserving the memories that belong to your family.
            </p>
          </div>
          <Card className="bg-card">
            <CardContent className="space-y-3 py-2">
              {problems.map((problem) => (
                <div
                  key={problem}
                  className="flex items-start gap-3 rounded-lg bg-muted/60 px-4 py-3"
                >
                  <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" />
                  <span className="text-sm text-foreground">{problem}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
