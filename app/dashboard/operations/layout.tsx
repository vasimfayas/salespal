import { redirect } from "next/navigation";
import { getSalesPalSession } from "@/lib/auth";

export default async function OperationsLayout({ children }: { children: React.ReactNode }) {
  const session = await getSalesPalSession();
  if (!session) redirect("/login");
  if (session.user.role_id !== 5) redirect("/dashboard");
  return children;
}
