import type { LucideIcon } from "lucide-react";
import {
  Ban,
  BarChart3,
  Building2,
  ClipboardList,
  Globe,
  LayoutDashboard,
  LayoutGrid,
  ListTodo,
  Package,
  Ship,
  Star,
  Target,
  UserCheck,
  Users,
  UsersRound,
} from "lucide-react";
import { navConfig, roleHome } from "@/lib/nav-config";

/** Presentation-only metadata for the links defined in lib/nav-config.ts. */
const ICONS: Record<string, LucideIcon> = {
  Dashboard: LayoutDashboard,
  Overview: LayoutGrid,
  Companies: Building2,
  Users: Users,
  Clients: UserCheck,
  "Premium Clients": Star,
  Blacklist: Ban,
  Reports: BarChart3,
  Team: UsersRound,
  Salesmen: Target,
  Enquiries: ClipboardList,
  Tasks: ListTodo,
  Orders: Package,
  "Shipping Rates": Ship,
  Agents: Globe,
};

const GROUPS: Record<string, string> = {
  Dashboard: "Overview",
  Overview: "Overview",
  Team: "Team",
  Salesmen: "Team",
  Tasks: "Team",
  Clients: "Sales",
  "Premium Clients": "Sales",
  Blacklist: "Sales",
  Enquiries: "Sales",
  Orders: "Sales",
  "Shipping Rates": "Operations",
  Agents: "Operations",
  Companies: "Administration",
  Users: "Administration",
  Reports: "Reports",
};

export type NavItem = { label: string; href: string; icon: LucideIcon };
export type NavGroup = { label: string; items: NavItem[] };

export const ROLE_LABELS: Record<number, string> = {
  1: "Administrator",
  2: "Manager",
  3: "Sales Representative",
  4: "Accountant",
};

export function getNavItems(roleId: number): NavItem[] {
  return (navConfig[roleId] ?? []).map((link) => ({ ...link, icon: ICONS[link.label] ?? LayoutDashboard }));
}

/** Groups links in nav-config order; a group appears where its first link does. */
export function getNavGroups(roleId: number): NavGroup[] {
  const groups: NavGroup[] = [];
  for (const item of getNavItems(roleId)) {
    const label = GROUPS[item.label] ?? "General";
    const group = groups.find((g) => g.label === label);
    if (group) group.items.push(item);
    else groups.push({ label, items: [item] });
  }
  return groups;
}

/** True when the current URL is the filtered view a shortcut link points at (all of its query params match). */
function isShortcutActive(href: string, activePath: string) {
  const [hrefPath, hrefQuery] = href.split("?");
  const [path, query = ""] = activePath.split("?");
  const current = new URLSearchParams(query);
  return path === hrefPath && [...new URLSearchParams(hrefQuery)].every(([k, v]) => current.get(k) === v);
}

/** Same matching rules the sidebar has always used; `activePath` may carry a query string. */
export function isNavActive(href: string, activePath: string, roleId: number) {
  if (href.includes("?")) return isShortcutActive(href, activePath);
  // On a shortcut's filtered view (e.g. Blacklist) only the shortcut is highlighted, not its parent page.
  if (getNavItems(roleId).some((item) => item.href.includes("?") && isShortcutActive(item.href, activePath))) return false;
  const path = activePath.split("?")[0];
  const homePath = roleHome[roleId] ?? "/dashboard";
  if (href === homePath || href === "/dashboard/salesman" || href === "/dashboard/admin" || href === "/dashboard/manager") {
    return path === href;
  }
  return path === href || path.startsWith(`${href}/`);
}

/** Breadcrumb trail for the current path, built from the role's nav links. */
export function getBreadcrumbs(pathname: string, roleId: number): string[] {
  const items = getNavItems(roleId);
  const match = items
    .filter((item) => pathname === item.href || pathname.startsWith(`${item.href}/`))
    .sort((a, b) => b.href.length - a.href.length)[0];
  if (!match) return ["Dashboard"];
  const rest = pathname.slice(match.href.length).split("/").filter(Boolean);
  const crumbs = [GROUPS[match.label] ?? "Dashboard", match.label];
  if (rest.length) crumbs.push(rest[rest.length - 1] === "new" ? "New" : "Details");
  // Avoid "Overview › Overview"
  return crumbs.filter((c, i) => c !== crumbs[i - 1]);
}
