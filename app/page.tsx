import { VideoCard } from "@/components/video";
import { getLatestVideos } from "@/lib/mock-data";

export default function Home() {
  const videos = getLatestVideos();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex items-end justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Latest</h1>
        <p className="text-sm text-muted-foreground">
          {videos.length} {videos.length === 1 ? "video" : "videos"}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {videos.map((video) => (
          <VideoCard key={video.id} video={video} />
        ))}
      </div>
    </div>
  );
}
