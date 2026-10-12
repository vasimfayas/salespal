/** Role ids that need special handling. Client-safe (no server imports). */
export const SUPER_ADMIN_ROLE = 6;

/** Password new logins start with (shown to whoever creates them). */
export const DEFAULT_PASSWORD = "salespal123";

/** Roles in the order they're listed, with what each one does. */
export const ROLES: { id: number; name: string; hint: string }[] = [
  { id: 6, name: "Super Admin", hint: "Every screen and every action across all companies." },
  { id: 1, name: "Owner", hint: "Sees every company: dashboards, reports, companies and users." },
  { id: 2, name: "Manager", hint: "Runs a team. Assign their companies on the Companies page." },
  { id: 3, name: "Salesman", hint: "Works clients and enquiries. Put them on a manager's team on the Companies page." },
  { id: 4, name: "Accountant", hint: "Orders, payments and receivables. Assign their companies on the Companies page." },
  { id: 5, name: "Operations", hint: "Quotes enquiries. Assign their companies on the Companies page." },
];

/** Owner (1) or super admin (6): sees every company and everything the owner sees. */
export function isOwnerRole(roleId: number | null | undefined) {
  return roleId === 1 || roleId === SUPER_ADMIN_ROLE;
}
