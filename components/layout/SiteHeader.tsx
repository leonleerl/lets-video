import Link from "next/link";
import { FilmIcon, UploadIcon } from "lucide-react";
import { Button, Avatar, AvatarFallback, AvatarImage } from "@/components/ui";
import { ThemeToggle } from "./ThemeToggle";
import { MobileNavMenu } from "./mobile-nav";

function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container mx-auto px-4 py-2">
        <div className="flex h-12 items-center justify-between gap-6">
          <Link href="/" className="flex items-center gap-2">
            <FilmIcon className="size-6" />
            <span className="text-lg font-bold">Let&apos;s Video</span>
          </Link>
          <MobileNavMenu />
          <nav className="hidden flex-1 items-center gap-6 sm:flex">
            <Link
              href="/"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Latest
            </Link>
            <Link
              href="/albums"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Albums
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            <Button variant="outline" asChild>
              <Link href="/upload">
                <UploadIcon className="size-4" />
                Upload
              </Link>
            </Button>
            <ThemeToggle />
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>
    </header>
  );
}

export { SiteHeader };
