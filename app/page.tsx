import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Dashboard } from "@/components/reading/Dashboard";

export default async function HomePage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/api/auth/signin");
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Dashboard userName={session.user.name?.split(" ")[0] || "there"} />
    </div>
  );
}
