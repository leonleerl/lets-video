import Link from "next/link";
import { Button } from "@/components/ui";

export default function AlbumNotFound() {
  return (
    <div className="container mx-auto flex flex-col items-center justify-center gap-4 px-4 py-24 text-center">
      <h1 className="text-2xl font-bold">Album not found</h1>
      <p className="max-w-md text-sm text-muted-foreground">
        The album you are looking for does not exist or has been removed.
      </p>
      <Button asChild variant="outline">
        <Link href="/albums">Browse all albums</Link>
      </Button>
    </div>
  );
}
