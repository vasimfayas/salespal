import { prisma } from "@/lib/prisma";
import { getSalesPalSession } from "@/lib/auth";
import { SUPER_ADMIN_ROLE } from "@/lib/roles";
import { PageHeader } from "@/components/layout/PageHeader";
import { UsersClient } from "./UsersClient";

export default async function UsersPage() {
  const [session, users] = await Promise.all([
    getSalesPalSession(),
    prisma.user.findMany({ select: { id: true, name: true, email: true, phone: true, role_id: true }, orderBy: [{ role_id: "asc" }, { name: "asc" }] }),
  ]);
  return (
    <>
      <PageHeader title="Users" subtitle="Add, edit and remove logins for every role." />
      <UsersClient users={users} currentUserId={Number(session!.user.id)} isSuper={session!.user.role_id === SUPER_ADMIN_ROLE} />
    </>
  );
}
