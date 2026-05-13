import { prisma } from "@/lib/prisma";
import slugify from "slugify";

const DEFAULT_ALBUMS = [
  {
    name: "Inbox",
    description: "Unsorted videos. Move them to an album when you have time.",
  },
  {
    name: "Daily Vlog",
    description: "Day-to-day moments worth keeping.",
  },
  {
    name: "Travel",
    description: "Trips, road trips, and adventures.",
  },
  {
    name: "Family",
    description: "Family gatherings, birthdays, and milestones.",
  },
  {
    name: "DJI Aerial",
    description: "Drone shots and aerial footage.",
  },
] as const;

async function main() {
  for (const album of DEFAULT_ALBUMS) {
    const slug = slugify(album.name, { lower: true, strict: true });
    await prisma.category.upsert({
      where: { slug },
      update: {},
      create: {
        name: album.name,
        slug,
        description: album.description,
      },
    });
    console.log(`✓ Seeded album: ${album.name} (/${slug})`);
  }
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
