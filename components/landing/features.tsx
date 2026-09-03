import { Clock, Play, Users } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const coreFeatures = [
  {
    icon: Users,
    title: "Family Spaces",
    description:
      "Create a private family space and invite your loved ones. Each family has its own dedicated video library.",
    points: ["Lee Family", "Tanaka Family", "Smith Family"],
  },
  {
    icon: Play,
    title: "Video Sharing",
    description:
      "Family members can upload, browse, watch, search, and organise videos together — every moment within reach.",
    points: ["Upload & Browse", "Watch Together", "Search & Organise"],
  },
  {
    icon: Clock,
    title: "Memory Timeline",
    description:
      "Memories are organised by year, month, event, and family member, helping you revisit important moments.",
    points: ["By Year", "By Event", "By Member"],
  },
];

export function LandingFeatures() {
  return (
    <section id="features" className="py-16 sm:py-24">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            Core Features
          </h2>
          <p className="mt-3 text-base leading-relaxed text-muted-foreground">
            A space dedicated to family memories, making sharing and preserving
            simple and natural.
          </p>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {coreFeatures.map((feature) => (
            <Card key={feature.title} className="h-full">
              <CardHeader>
                <span className="flex size-10 items-center justify-center rounded-lg bg-primary/12 text-primary">
                  <feature.icon className="size-5" />
                </span>
                <CardTitle className="mt-3 text-lg">{feature.title}</CardTitle>
                <CardDescription className="leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {feature.points.map((point) => (
                    <Badge
                      key={point}
                      variant="secondary"
                      className="font-normal text-secondary-foreground"
                    >
                      {point}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
