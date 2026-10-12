/**
 * Creates the roles and one super admin login. Safe to re-run: it never deletes anything.
 *
 *   npm run seed:super-admin
 *   SUPER_ADMIN_EMAIL=me@company.com SUPER_ADMIN_PASSWORD='S3cret!pass' SUPER_ADMIN_NAME="Vasim" npm run seed:super-admin
 *
 * Defaults: superadmin@salespal.test / password123. If the email already exists the user is made super admin;
 * their password is only changed when SUPER_ADMIN_PASSWORD is given.
 */
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const ROLES = [
  { id: 1, name: "Admin" },
  { id: 2, name: "Manager" },
  { id: 3, name: "Salesman" },
  { id: 4, name: "Accountant" },
  { id: 5, name: "Operations" },
  { id: 6, name: "Super Admin" },
];

async function main() {
  const email = (process.env.SUPER_ADMIN_EMAIL ?? "superadmin@salespal.test").trim().toLowerCase();
  const name = process.env.SUPER_ADMIN_NAME?.trim() || "SalesPal Super Admin";
  const password = process.env.SUPER_ADMIN_PASSWORD;
  if (password !== undefined && password.length < 6) throw new Error("SUPER_ADMIN_PASSWORD must be at least 6 characters");
  if (process.env.NODE_ENV === "production" && !password) {
    throw new Error("Set SUPER_ADMIN_PASSWORD in production — the default password is public.");
  }

  for (const role of ROLES) {
    await prisma.role.upsert({ where: { id: role.id }, update: {}, create: role });
  }

  const existing = await prisma.user.findUnique({ where: { email }, select: { id: true } });
  if (existing) {
    await prisma.user.update({
      where: { email },
      data: { role_id: 6, ...(password ? { password: await bcrypt.hash(password, 10) } : {}) },
    });
    console.log(`✔ ${email} is now a super admin${password ? " (password updated)" : " (password unchanged)"}`);
  } else {
    await prisma.user.create({ data: { name, email, role_id: 6, password: await bcrypt.hash(password ?? "password123", 10) } });
    console.log(`✔ Created super admin ${email} / ${password ? "(the password you set)" : "password123"}`);
  }
}

main()
  .catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
