import type { MockAlbum, MockVideo } from "@/types";

const now = Date.now();
const HOUR = 60 * 60 * 1000;

export const MOCK_ALBUMS: MockAlbum[] = [
  {
    id: "alb-inbox",
    name: "Inbox",
    slug: "inbox",
    description: "Unsorted videos. Move them to an album when you have time.",
  },
  {
    id: "alb-daily",
    name: "Daily Vlog",
    slug: "daily-vlog",
    description: "Day-to-day moments worth keeping.",
  },
  {
    id: "alb-travel",
    name: "Travel",
    slug: "travel",
    description: "Trips, road trips, and adventures.",
  },
  {
    id: "alb-family",
    name: "Family",
    slug: "family",
    description: "Family gatherings, birthdays, and milestones.",
  },
  {
    id: "alb-dji",
    name: "DJI Aerial",
    slug: "dji-aerial",
    description: "Drone shots and aerial footage.",
  },
];

const albumBySlug = (slug: string) =>
  MOCK_ALBUMS.find((a) => a.slug === slug) ?? MOCK_ALBUMS[0];

export const MOCK_VIDEOS: MockVideo[] = [
  {
    id: "v-001",
    title: "Tokyo Tower at Night",
    uploaderName: "Leon",
    createdAt: new Date(now - 2 * HOUR),
    album: albumBySlug("travel"),
  },
  {
    id: "v-002",
    title: "Drone over Gold Coast Beach",
    uploaderName: "Leon",
    createdAt: new Date(now - 5 * HOUR),
    album: albumBySlug("dji-aerial"),
  },
  {
    id: "v-003",
    title: "Sunday Morning Coffee Routine",
    uploaderName: "Ayana",
    createdAt: new Date(now - 14 * HOUR),
    album: albumBySlug("daily-vlog"),
  },
  {
    id: "v-004",
    title: "Mom's 60th Birthday Dinner",
    uploaderName: "Ayana",
    createdAt: new Date(now - 26 * HOUR),
    album: albumBySlug("family"),
  },
  {
    id: "v-005",
    title: "Quick test clip — please ignore",
    uploaderName: "Leon",
    createdAt: new Date(now - 30 * HOUR),
    album: albumBySlug("inbox"),
  },
  {
    id: "v-006",
    title: "Kyoto Bamboo Forest Walk",
    uploaderName: "Ayana",
    createdAt: new Date(now - 2 * 24 * HOUR),
    album: albumBySlug("travel"),
  },
  {
    id: "v-007",
    title: "Drone — Sunrise over Brisbane",
    uploaderName: "Leon",
    createdAt: new Date(now - 3 * 24 * HOUR),
    album: albumBySlug("dji-aerial"),
  },
  {
    id: "v-008",
    title: "Cooking Gyoza Together",
    uploaderName: "Ayana",
    createdAt: new Date(now - 4 * 24 * HOUR),
    album: albumBySlug("family"),
  },
  {
    id: "v-009",
    title: "Saturday Park Picnic",
    uploaderName: "Leon",
    createdAt: new Date(now - 6 * 24 * HOUR),
    album: albumBySlug("daily-vlog"),
  },
  {
    id: "v-010",
    title: "Shanghai Skyline at Dusk",
    uploaderName: "Leon",
    createdAt: new Date(now - 8 * 24 * HOUR),
    album: albumBySlug("travel"),
  },
  {
    id: "v-011",
    title: "Dad's New Garden Setup",
    uploaderName: "Ayana",
    createdAt: new Date(now - 10 * 24 * HOUR),
    album: albumBySlug("family"),
  },
  {
    id: "v-012",
    title: "Drone — Coastline at Byron Bay",
    uploaderName: "Leon",
    createdAt: new Date(now - 14 * 24 * HOUR),
    album: albumBySlug("dji-aerial"),
  },
];

export function getAlbumBySlug(slug: string): MockAlbum | undefined {
  return MOCK_ALBUMS.find((a) => a.slug === slug);
}

export function getVideosByAlbumSlug(slug: string): MockVideo[] {
  return MOCK_VIDEOS.filter((v) => v.album.slug === slug).sort(
    (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
  );
}

export function getLatestVideos(): MockVideo[] {
  return [...MOCK_VIDEOS].sort(
    (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
  );
}

export function countVideosInAlbum(albumId: string): number {
  return MOCK_VIDEOS.filter((v) => v.album.id === albumId).length;
}
