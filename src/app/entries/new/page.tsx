import { redirect } from "next/navigation";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Timestamp } from "next/dist/server/lib/cache-handlers/types";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

async function createEntry(formData: FormData) {
  "use server";

  const entry = await prisma.entry.create({
    data: {
      dateTried: formData.get("dateTried")
        ? new Date(formData.get("dateTried") as string)
        : null,
      beanName: formData.get("beanName") as string || null,
      process: formData.get("process") as string || null,
      varietal: formData.get("varietal") as string || null,
      originRegion: formData.get("originRegion") as string || null,
      originCountry: formData.get("originCountry") as string || null,
      cafeName: formData.get("cafeName") as string || null,
      city: formData.get("city") as string || null,
      tastingNotesRaw: (formData.get("tastingNotesRaw") as string) || null,
      personalTastingNote: formData.get("personalTastingNote") as string || null,
      whatLingered: formData.get("whatLingered") as string || null,
      roomNote: formData.get("roomNote") as string || null,
      memoryNote: formData.get("memoryNote") as string || null,
    },
  });

  redirect(`/entries/${entry.id}`);
}

export default function NewEntryPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <h1 className="mb-6 text-3xl font-semibold">New entry</h1>

      <form action={createEntry} className="space-y-6">
        <input name="dateTried" placeholder="Date tried" type="date"  className="w-full rounded border p-3" />
        <input name="beanName" placeholder="Bean name" className="w-full rounded border p-3" />
        <input name="process" placeholder="Process" className="w-full rounded border p-3" />
        <input name="varietal" placeholder="Varietal" className="w-full rounded border p-3" />
        <input name="originRegion" placeholder="Region" className="w-full rounded border p-3" />
        <input name="originCountry" placeholder="Country" className="w-full rounded border p-3" />
        <textarea name="tastingNotesRaw" placeholder="Roaster notes" className="w-full rounded border p-3"/>
        <input name="cafeName" placeholder="Cafe name" className="w-full rounded border p-3" />
        <input name="city" placeholder="City" className="w-full rounded border p-3" />
        <textarea name="personalTastingNote" placeholder="Personal tasting note" className="w-full rounded border p-3" />
        <textarea name="whatLingered" placeholder="What lingered" className="w-full rounded border p-3" />
        <textarea name="roomNote" placeholder="Room note" className="w-full rounded border p-3" />
        <textarea name="memoryNote" placeholder="Memory note" className="w-full rounded border p-3" />

        <button className="rounded bg-black px-4 py-2 text-white">
          Save entry
        </button>
      </form>
    </main>
  );
}