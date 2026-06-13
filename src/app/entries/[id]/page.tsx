import { notFound } from "next/navigation";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

export default async function EntryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const entry = await prisma.entry.findUnique({
    where: {
      id,
    },
  });

  if (!entry) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-4xl px-6 py-10">
      <div className="space-y-8">
        <header>
          <h1 className="text-4xl font-semibold">
            {entry.beanName || "Untitled Entry"}
          </h1>

          <p className="mt-2 text-gray-600">
            {[entry.cafeName, entry.city]
              .filter(Boolean)
              .join(" · ")}
          </p>
        </header>

        <section className="space-y-2">
          <h2 className="text-lg font-semibold">Observe</h2>

          <div>
            <p className="text-sm text-gray-500">
              Personal tasting note
            </p>
            <p>{entry.personalTastingNote || "—"}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">
              What lingered
            </p>
            <p>{entry.whatLingered || "—"}</p>
          </div>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-semibold">Contextualize</h2>

          <div>
            <p className="text-sm text-gray-500">
              Room note
            </p>
            <p>{entry.roomNote || "—"}</p>
          </div>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-semibold">Reflect</h2>

          <div>
            <p className="text-sm text-gray-500">
              Memory note
            </p>
            <p>{entry.memoryNote || "—"}</p>
          </div>
        </section>
      </div>
    </main>
  );
}