import { BookOpen, Calendar, Clock, Globe, Heart, Play, Users } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const timelineGroups = [
  { label: "By Year", icon: Calendar, sample: "2024 · 2025 · 2026" },
  { label: "By Month", icon: Clock, sample: "Jan · Jun · Dec" },
  { label: "By Event", icon: Heart, sample: "Birthday · Travel · Graduation" },
  { label: "By Member", icon: Users, sample: "Dad · Mom · Tom" },
];

const sampleVideos = [
  {
    title: "Tom's 5th Birthday",
    meta: "Birthday · Hong Kong Disneyland",
    icon: Heart,
  },
  {
    title: "Family Trip to Seoul",
    meta: "Travel · March 2026",
    icon: Globe,
  },
  {
    title: "First Day of School",
    meta: "School · September 2026",
    icon: BookOpen,
  },
];

export function LandingTimeline() {
  return (
    <section id="timeline" className="bg-secondary/40 py-16 sm:py-24">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <div className="grid items-center gap-12 md:grid-cols-2">
          <div>
            <Badge variant="secondary" className="mb-4 text-primary">
              Memory Timeline
            </Badge>
            <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              Let Memories Unfold Through Time
            </h2>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground">
              LetsVideo organises your memories by year, month, event, and family
              member, helping your family walk back through the moments that
              matter most.
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {timelineGroups.map((group) => (
                <div
                  key={group.label}
                  className="flex items-center gap-3 rounded-lg border border-border bg-card px-4 py-3"
                >
                  <span className="flex size-9 items-center justify-center rounded-lg bg-primary/12 text-primary">
                    <group.icon className="size-4.5" />
                  </span>
                  <div>
                    <p className="text-sm font-medium text-foreground">{group.label}</p>
                    <p className="text-xs text-muted-foreground">{group.sample}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Lee Family · Memory Library</CardTitle>
              <CardDescription>Warm moments from 2026</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {sampleVideos.map((item) => (
                <div
                  key={item.title}
                  className="flex items-center gap-3 rounded-lg bg-muted/60 p-3"
                >
                  <span className="flex size-10 items-center justify-center rounded-lg bg-primary/15 text-primary">
                    <item.icon className="size-5" />
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-foreground">
                      {item.title}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">{item.meta}</p>
                  </div>
                  <Play className="ml-auto size-4 text-muted-foreground" />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
