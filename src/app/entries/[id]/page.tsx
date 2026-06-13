import { notFound } from "next/navigation";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

function getDisplayTitle(entry: {
  beanName: string | null;
  title: string | null;
  drinkLabel: string | null;
}) {
  return entry.beanName || entry.title || entry.drinkLabel || "Untitled entry";
}

function formatDate(date: Date | null) {
  if (!date) return null;

  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
  }).format(date);
}

function DetailRow({
  label,
  value,
}: {
  label: string;
  value: string | null | undefined;
}) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wide text-gray-400">{label}</p>
      <p className="mt-1 text-gray-800">{value || "—"}</p>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border bg-white p-6 shadow-sm">
      <h2 className="mb-5 text-sm font-semibold uppercase tracking-wide text-gray-500">
        {title}
      </h2>
      {children}
    </section>
  );
}

export default async function EntryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const entry = await prisma.entry.findUnique({
    where: { id },
  });

  if (!entry) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <div className="space-y-8">
        <header className="rounded-xl border bg-white p-6 shadow-sm">
          <p className="text-xs uppercase tracking-wide text-gray-400">
            {entry.entryNumber ? `#${entry.entryNumber}` : "Draft"}
          </p>

          <h1 className="mt-2 text-4xl font-semibold text-gray-900">
            {getDisplayTitle(entry)}
          </h1>

          <p className="mt-2 text-gray-600">
            {[entry.cafeName, entry.city, entry.countryWhereDrank]
              .filter(Boolean)
              .join(" · ")}
          </p>

          {entry.dateTried && (
            <p className="mt-1 text-sm text-gray-500">
              {formatDate(entry.dateTried)}
            </p>
          )}
        </header>

        <Section title="Coffee Details">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <DetailRow label="Roaster" value={entry.roasterName} />
            <DetailRow label="Origin Country" value={entry.originCountry} />
            <DetailRow label="Origin Region" value={entry.originRegion} />
            <DetailRow label="Producer" value={entry.producer} />
            <DetailRow label="Farm" value={entry.farm} />
            <DetailRow label="Varietal" value={entry.varietal} />
            <DetailRow label="Process" value={entry.process} />
            <DetailRow label="Drink Label" value={entry.drinkLabel} />
            <DetailRow
              label="Served Style"
              value={entry.servedStyle?.toLowerCase()}
            />
          </div>
        </Section>

        <Section title="Roaster Notes">
          <p className="leading-7 text-gray-800">
            {entry.tastingNotesRaw || "—"}
          </p>
        </Section>

        <Section title="Observe">
          <div className="space-y-5">
            <DetailRow
              label="Personal Tasting Note"
              value={entry.personalTastingNote}
            />
            <DetailRow label="What Lingered" value={entry.whatLingered} />
          </div>
        </Section>

        <Section title="Contextualize">
          <div className="space-y-5">
            <DetailRow label="Room Note" value={entry.roomNote} />
            <DetailRow
              label="Selection Source"
              value={entry.selectionSource?.toLowerCase()}
            />
            <DetailRow label="Curation Note" value={entry.curationNote} />
          </div>
        </Section>

        <Section title="Reflect">
          <div className="space-y-5">
            <DetailRow label="Memory Note" value={entry.memoryNote} />

            <div>
              <p className="text-xs uppercase tracking-wide text-gray-400">
                Archive Flags
              </p>

              <div className="mt-2 flex flex-wrap gap-2">
                {entry.memoryTrip && (
                  <span className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700">
                    Memory Trip
                  </span>
                )}

                {entry.turningPoint && (
                  <span className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700">
                    Turning Point
                  </span>
                )}

                {entry.quietFavorite && (
                  <span className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700">
                    Quiet Favorite
                  </span>
                )}

                {entry.wouldRevisit && (
                  <span className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700">
                    Would Revisit
                  </span>
                )}

                {!entry.memoryTrip &&
                  !entry.turningPoint &&
                  !entry.quietFavorite &&
                  !entry.wouldRevisit && (
                    <p className="text-gray-500">—</p>
                  )}
              </div>
            </div>
          </div>
        </Section>

        <Section title="Workflow">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <DetailRow label="Post Status" value={entry.postStatus} />
            <DetailRow label="Photo Readiness" value={entry.photoReadiness} />
            <DetailRow label="Source Type" value={entry.sourceType} />
            <DetailRow label="Confidence" value={entry.confidence} />
          </div>
        </Section>
      </div>
    </main>
  );
}