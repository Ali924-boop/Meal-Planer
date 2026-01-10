import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import Overview from "./components/Overview";

export default async function Home() {
  const session = await getServerSession(authOptions);

  // Agar user logged in hai → Overview bhejo
  if (session) {
    redirect("/dashboard");
  }

  // Agar logged in nahi → Dashboard show karo
  return <Overview />;
}
