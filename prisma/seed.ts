import "dotenv/config";
import { PrismaClient, ThemeCategory } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

const themes = [
  ["Purple Fruit", "SENSORY"],
  ["Stone Fruit", "SENSORY"],
  ["Red Fruit / Strawberry", "SENSORY"],
  ["Watermelon Juice", "SENSORY"],
  ["Tea & Florals", "SENSORY"],
  ["Candy Fruit", "SENSORY"],

  ["Slow Reveals", "EXPERIENCE"],
  ["Quiet Cups", "EXPERIENCE"],
  ["Comfort Cups", "EXPERIENCE"],
  ["Observation", "EXPERIENCE"],

  ["Memory Trips", "PERSONAL_ARCHIVE"],
  ["Turning Points", "PERSONAL_ARCHIVE"],
  ["Gateway Funky", "PERSONAL_ARCHIVE"],
  ["Coffees I’d Revisit", "PERSONAL_ARCHIVE"],
  ["Quiet Favorite", "PERSONAL_ARCHIVE"],
  ["Place-Linked Cup", "PERSONAL_ARCHIVE"],
] as const;

async function main() {
  for (const [name, category] of themes) {
    await prisma.theme.upsert({
      where: { name },
      update: {},
      create: {
        name,
        category: category as ThemeCategory,
      },
    });
  }

  console.log(`Seeded ${themes.length} themes`);
}

main()
  .then(async () => prisma.$disconnect())
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });