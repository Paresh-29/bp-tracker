import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { ReadingForm } from "@/components/reading/AddReadingForm";
import { ReadingsList } from "@/components/reading/ReadingList";

export default async function Dashboard() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/api/auth/signin");
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="space-y-8">
        {/* Welcome Section */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">
            Welcome back, {session.user.name?.split(" ")[0] || "there"}!
          </h1>
          <p className="text-muted-foreground">
            Track your blood pressure readings and monitor your health.
          </p>
        </div>

        {/* Add Reading Form */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Add New Reading</h2>
          <ReadingForm />
        </div>

        {/* Readings List */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Your Readings</h2>
          <ReadingsList />
        </div>
      </div>
    </div>
  );
}
