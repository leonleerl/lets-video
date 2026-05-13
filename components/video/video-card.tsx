import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { Badge } from "@/components/ui";
import type { MockVideo } from "@/types";

function VideoCard({ video }: { video: MockVideo }) {
  return (
    <article className="group flex flex-col gap-3">
      <Link
        href={`/v/${video.id}`}
        className="block aspect-video w-full overflow-hidden rounded-lg bg-muted transition-opacity group-hover:opacity-90"
        aria-label={video.title}
      />

      <div className="flex flex-col gap-1.5">
        <div>
          <Link href={`/albums/${video.album.slug}`} className="inline-block">
            <Badge variant="secondary" className="hover:bg-secondary/80">
              {video.album.name}
            </Badge>
          </Link>
        </div>

        <Link href={`/v/${video.id}`} className="hover:underline">
          <h3 className="line-clamp-2 text-base font-semibold leading-snug">
            {video.title}
          </h3>
        </Link>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>{video.uploaderName}</span>
          <span aria-hidden>·</span>
          <span>{formatDistanceToNow(video.createdAt, { addSuffix: true })}</span>
        </div>
      </div>
    </article>
  );
}

export { VideoCard };
