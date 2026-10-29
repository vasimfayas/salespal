export const roleHome: Record<number, string> = {
  1: "/dashboard/admin",
  2: "/dashboard/manager",
  3: "/dashboard/salesman/dashboard-org",
  4: "/dashboard/accountant",
  5: "/dashboard/operations/enquiries",
  6: "/dashboard/admin",
};

type NavLink = { label: string; href: string };

export const navConfig: Record<number, NavLink[]> = {
  1: [
    { label: "Overview", href: "/dashboard/admin" },
    { label: "Companies", href: "/dashboard/admin/companies" },
    { label: "Users", href: "/dashboard/admin/users" },
    { label: "Salesmen", href: "/dashboard/admin/salesmen" },
    { label: "Clients", href: "/dashboard/admin/clients" },
    { label: "Premium Clients", href: "/dashboard/admin/clients?category=premium" },
    { label: "Blacklist", href: "/dashboard/admin/clients?status=blacklisted" },
    { label: "Enquiries", href: "/dashboard/admin/enquiries" },
    { label: "Agents", href: "/dashboard/admin/agents" },
    { label: "Locations", href: "/dashboard/admin/locations" },
    { label: "Email templates", href: "/dashboard/admin/email-templates" },
    { label: "Approvals", href: "/dashboard/admin/approvals" },
    { label: "Accounts", href: "/dashboard/admin/accounts" },
    { label: "Reports", href: "/dashboard/admin/reports" },
  ],
  2: [
    { label: "Team Overview", href: "/dashboard/manager" },
    { label: "My Overview", href: "/dashboard/manager/my-overview" },
    { label: "Team", href: "/dashboard/manager/team" },
    { label: "Tasks", href: "/dashboard/manager/tasks" },
    { label: "My Clients", href: "/dashboard/manager/my-clients" },
    { label: "Clients", href: "/dashboard/manager/clients" },
    { label: "Premium Clients", href: "/dashboard/manager/clients?category=premium" },
    { label: "Blacklist", href: "/dashboard/manager/clients?status=blacklisted" },
    { label: "Enquiries", href: "/dashboard/manager/enquiries" },
    { label: "Orders", href: "/dashboard/manager/orders" },
    { label: "Shipping Rates", href: "/dashboard/manager/shipping-rates" },
    { label: "Agents", href: "/dashboard/manager/agents" },
    { label: "Approvals", href: "/dashboard/manager/approvals" },
    { label: "Reports", href: "/dashboard/manager/reports" },
  ],
  3: [
    { label: "Dashboard", href: "/dashboard/salesman/dashboard-org" },
    { label: "Overview", href: "/dashboard/salesman" },
    { label: "Tasks", href: "/dashboard/salesman/tasks" },
    { label: "Clients", href: "/dashboard/salesman/clients" },
    { label: "Premium Clients", href: "/dashboard/salesman/clients?category=premium" },
    { label: "Blacklist", href: "/dashboard/salesman/clients?status=blacklisted" },
    { label: "Enquiries", href: "/dashboard/salesman/enquiries" },
    { label: "Orders", href: "/dashboard/salesman/orders" },
  ],
  4: [
    { label: "Dashboard", href: "/dashboard/accountant" },
    { label: "Enquiries", href: "/dashboard/accountant/enquiries" },
    { label: "Orders", href: "/dashboard/accountant/orders" },
    { label: "Shipping Rates", href: "/dashboard/accountant/shipping-rates" },
    { label: "Agents", href: "/dashboard/accountant/agents" },
    { label: "Approvals", href: "/dashboard/accountant/approvals" },
  ],
  5: [
    { label: "Enquiries", href: "/dashboard/operations/enquiries" },
    { label: "Shipping Rates", href: "/dashboard/operations/shipping-rates" },
  ],
};

/** Super admin: the owner's menu plus the operational screens only it has (orders, rates, tasks). */
navConfig[6] = [
  ...navConfig[1].slice(0, 8),
  { label: "Orders", href: "/dashboard/admin/orders" },
  { label: "Tasks", href: "/dashboard/admin/tasks" },
  { label: "Shipping Rates", href: "/dashboard/admin/shipping-rates" },
  ...navConfig[1].slice(8),
  { label: "Control Panel", href: "/dashboard/admin/control-panel" },
];
