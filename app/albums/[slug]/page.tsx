import { notFound } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui";
import { VideoCard } from "@/components/video";
import { getAlbumBySlug, getVideosByAlbumSlug } from "@/lib/mock-data";

export default async function AlbumDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const album = getAlbumBySlug(slug);
  if (!album) notFound();

  const videos = getVideosByAlbumSlug(slug);

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumb className="mb-4">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/albums">Albums</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{album.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="mb-6 flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{album.name}</h1>
          {album.description ? (
            <p className="mt-1 text-sm text-muted-foreground">
              {album.description}
            </p>
          ) : null}
        </div>
        <p className="text-sm text-muted-foreground">
          {videos.length} {videos.length === 1 ? "video" : "videos"}
        </p>
      </div>

      {videos.length === 0 ? (
        <div className="rounded-lg border border-dashed p-12 text-center">
          <p className="text-sm text-muted-foreground">
            No videos in this album yet.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {videos.map((video) => (
            <VideoCard key={video.id} video={video} />
          ))}
        </div>
      )}
    </div>
  );
}
