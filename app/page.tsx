import {
  ArrowRight,
  BookOpen,
  Calendar,
  Clapperboard,
  Clock,
  FolderTree,
  Globe,
  Heart,
  Play,
  Search,
  Shield,
  Sparkles,
  Upload,
  Users,
} from "lucide-react";

import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

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
      "Memories are automatically organised by year, month, event, and family member, helping you revisit important moments.",
    points: ["By Year", "By Event", "By Member"],
  },
];

const problems = [
  "Videos scattered across WeChat, LINE, WhatsApp, and more",
  "Important memories become difficult to find",
  "Family history becomes fragmented",
  "Valuable moments are often forgotten",
];

const aiAgents = [
  {
    icon: Sparkles,
    title: "Memory Understanding Agent",
    description:
      "When a video is uploaded, the agent understands its content, generates memory descriptions, identifies key events, and creates searchable tags.",
  },
  {
    icon: FolderTree,
    title: "Memory Organisation Agent",
    description:
      "Automatically categorises memories into Travel, Birthday, School, Holiday, Family Gathering, and Wedding — no manual work required.",
  },
  {
    icon: Search,
    title: "Memory Search Agent",
    description:
      "Ask questions in natural language, such as “Show me all birthday videos from 2025,” and get relevant memories in return.",
  },
  {
    icon: BookOpen,
    title: "Family Story Agent",
    description:
      "Generates annual family reviews, growth stories, and memory summaries, weaving scattered clips into complete stories.",
  },
];

const timelineGroups = [
  { label: "By Year", icon: Calendar, sample: "2024 · 2025 · 2026" },
  { label: "By Month", icon: Clock, sample: "Jan · Jun · Dec" },
  { label: "By Event", icon: Heart, sample: "Birthday · Travel · Graduation" },
  { label: "By Member", icon: Users, sample: "Dad · Mom · Tom" },
];

export default function Home() {
  return (
    <>
      <SiteHeader />

      <main className="flex-1">
        {/* Hero */}
        <section className="mx-auto w-full max-w-6xl px-4 pt-16 pb-20 sm:px-6 sm:pt-24">
          <div className="mx-auto max-w-3xl text-center">
            <Badge
              variant="secondary"
              className="mb-6 gap-1.5 px-3 py-1 text-primary"
            >
              <Sparkles className="size-3.5" />
              AI-Powered Family Memory Platform
            </Badge>
            <h1 className="text-balance text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
              Preserve Family Memories{" "}
              <span className="text-primary">Across Borders</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
              LetsVideo is a private family video platform designed for families
              living across different countries and regions. Here, loved ones can
              securely upload, share, preserve, and rediscover precious memories.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button size="lg" className="h-11 px-6 text-sm">
                Create Family Space
                <ArrowRight className="size-4" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="h-11 px-6 text-sm"
              >
                <Play className="size-4" />
                See How It Works
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

        {/* Problem */}
        <section className="bg-secondary/40 py-16 sm:py-20">
          <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
            <div className="grid items-center gap-10 md:grid-cols-2">
              <div>
                <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                  Modern Families Are Spread Across the World
                </h2>
                <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                  A typical family may use WeChat, LINE, WhatsApp, Google Photos,
                  and iCloud all at once. Videos get scattered across different
                  apps, making family memories hard to organise, search, and revisit.
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

        {/* Core Features */}
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
                    <CardTitle className="mt-3 text-lg">
                      {feature.title}
                    </CardTitle>
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

        {/* Timeline */}
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
                  LetsVideo automatically organises your memories by year, month,
                  event, and family member, helping your family walk back through
                  the moments that matter most.
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
                        <p className="text-sm font-medium text-foreground">
                          {group.label}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {group.sample}
                        </p>
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
                  {[
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
                  ].map((item) => (
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
                        <p className="truncate text-xs text-muted-foreground">
                          {item.meta}
                        </p>
                      </div>
                      <Play className="ml-auto size-4 text-muted-foreground" />
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* AI Roadmap */}
        <section id="ai" className="py-16 sm:py-24">
          <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
            <div className="mx-auto max-w-2xl text-center">
              <Badge variant="secondary" className="mb-4 gap-1.5 text-primary">
                <Sparkles className="size-3.5" />
                AI Agent Roadmap
              </Badge>
              <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                Not Just Storing Videos, but Telling Their Stories
              </h2>
              <p className="mt-3 text-base leading-relaxed text-muted-foreground">
                The long-term goal of LetsVideo is to become an AI memory agent that
                understands, organises, and tells your family&apos;s stories.
              </p>
            </div>

            <div className="mt-12 grid gap-6 md:grid-cols-2">
              {aiAgents.map((agent) => (
                <Card key={agent.title} className="h-full">
                  <CardHeader>
                    <div className="flex items-start gap-4">
                      <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/12 text-primary">
                        <agent.icon className="size-5" />
                      </span>
                      <div>
                        <CardTitle className="text-lg">{agent.title}</CardTitle>
                        <CardDescription className="mt-1.5 leading-relaxed">
                          {agent.description}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>

            <Card className="mt-6 bg-secondary/50">
              <CardContent className="flex flex-col gap-4 py-2 sm:flex-row sm:items-center">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary">
                  <Sparkles className="size-5" />
                </span>
                <div>
                  <p className="text-sm font-medium text-foreground">
                    Example: upload “Birthday Party.mp4”
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                    Generated memory: “Tom celebrated her 5th birthday with her
                    family at Hong Kong Disneyland.”
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* CTA */}
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
                  The first milestone focuses on family spaces, video upload, video
                  playback, and video sharing. AI-powered memory understanding and
                  search will arrive in future releases.
                </p>
                <div className="flex flex-col items-center gap-3 sm:flex-row">
                  <Button size="lg" className="h-11 px-6 text-sm">
                    Create Family Space
                    <ArrowRight className="size-4" />
                  </Button>
                  <Button variant="outline" size="lg" className="h-11 px-6 text-sm">
                    <Clapperboard className="size-4" />
                    View Demo
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
      </main>

      <SiteFooter />
    </>
  );
}
