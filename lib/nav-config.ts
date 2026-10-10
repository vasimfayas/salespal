export const roleHome: Record<number, string> = {
  1: "/dashboard/admin",
  2: "/dashboard/manager",
  3: "/dashboard/salesman/dashboard-org",
  4: "/dashboard/accountant",
};

export const navConfig: Record<number, { label: string; href: string }[]> = {
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
    { label: "Reports", href: "/dashboard/admin/reports" },
  ],
  2: [
    { label: "Overview", href: "/dashboard/manager" },
    { label: "Team", href: "/dashboard/manager/team" },
    { label: "Tasks", href: "/dashboard/manager/tasks" },
    { label: "Clients", href: "/dashboard/manager/clients" },
    { label: "Premium Clients", href: "/dashboard/manager/clients?category=premium" },
    { label: "Blacklist", href: "/dashboard/manager/clients?status=blacklisted" },
    { label: "Enquiries", href: "/dashboard/manager/enquiries" },
    { label: "Orders", href: "/dashboard/manager/orders" },
    { label: "Shipping Rates", href: "/dashboard/manager/shipping-rates" },
    { label: "Agents", href: "/dashboard/manager/agents" },
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
  ],
};
