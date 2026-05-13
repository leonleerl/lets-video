import Link from "next/link";
import { FolderIcon } from "lucide-react";
import { MOCK_ALBUMS, countVideosInAlbum } from "@/lib/mock-data";

export default function AlbumsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Albums</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Group your videos into albums — by trip, by year, by person.
          </p>
        </div>
        <p className="text-sm text-muted-foreground">
          {MOCK_ALBUMS.length} {MOCK_ALBUMS.length === 1 ? "album" : "albums"}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {MOCK_ALBUMS.map((album) => {
          const count = countVideosInAlbum(album.id);
          return (
            <Link
              key={album.id}
              href={`/albums/${album.slug}`}
              className="group flex flex-col gap-3 rounded-lg border bg-card p-4 transition-colors hover:bg-accent"
            >
              <div className="flex aspect-video w-full items-center justify-center rounded-md bg-muted">
                <FolderIcon className="size-10 text-muted-foreground/60 transition-transform group-hover:scale-105" />
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="text-base font-semibold leading-snug">
                  {album.name}
                </h3>
                {album.description ? (
                  <p className="line-clamp-2 text-sm text-muted-foreground">
                    {album.description}
                  </p>
                ) : null}
                <p className="text-xs text-muted-foreground">
                  {count} {count === 1 ? "video" : "videos"}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
