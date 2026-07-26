import prisma from "@/lib/prisma";

async function main() {
  const categories = [
    { name: "Concerts & Festivals", image: "music" },
    { name: "Tech & Innovation", image: "tech" },
    { name: "Business & Finance", image: "business" },
    { name: "Art & Culture", image: "art" },
    { name: "Health & Wellness", image: "wellness" },
    { name: "Food & Drink", image: "food" },
    { name: "Workshops & Education", image: "education" },
    { name: "Charity & Community", image: "community" },
  ];

  console.log("--- Seeding Categories ---");

  for (const category of categories) {
    const item = await prisma.category.upsert({
      where: { name: category.name },
      update: {}, // Do nothing if it exists
      create: category,
    });
    console.log(`Created/Verified category: ${item.name}`);
  }

  console.log("--- Seeding Complete ---");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
