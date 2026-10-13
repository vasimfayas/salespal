"use client";

import { Mail, Phone } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { buttonVariants } from "@/components/ui/Button";
import { formatPhoneNumber } from "@/lib/utils";

type Contact = { name: string; phone: string | null; email: string | null };
type Option = { label: string; value: string };

/** Distinct values, labelled by who they belong to: the client's own number / mail first, then its contacts. */
function options(main: string | null | undefined, mainLabel: string, contacts: Contact[], key: "phone" | "email"): Option[] {
  const all: Option[] = [{ label: mainLabel, value: main?.trim() ?? "" }, ...contacts.map((c) => ({ label: c.name, value: c[key]?.trim() ?? "" }))];
  const seen = new Set<string>();
  return all.filter((o) => o.value && !seen.has(o.value.toLowerCase()) && seen.add(o.value.toLowerCase()));
}

function Action({ icon: Icon, label, items, href }: { icon: typeof Phone; label: string; items: Option[]; href: (v: string) => string }) {
  if (items.length === 0) return null;
  const cls = buttonVariants({ variant: "secondary", size: "icon-sm" });
  if (items.length === 1) {
    return (
      <a href={href(items[0].value)} aria-label={`${label} ${items[0].label}`} title={items[0].value} className={cls} onClick={(e) => e.stopPropagation()}>
        <Icon size={14} />
      </a>
    );
  }
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button type="button" aria-label={`${label} — choose a contact`} className={cls} onClick={(e) => e.stopPropagation()}>
          <Icon size={14} />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="z-50 max-h-[300px] w-60 overflow-y-auto rounded-card border border-border/80 bg-card p-1 shadow-2xl">
        {items.map((o) => (
          <DropdownMenuItem key={o.value} asChild>
            <a href={href(o.value)} onClick={(e) => e.stopPropagation()} className="flex min-w-0 flex-col gap-0 rounded-control px-2.5 py-1.5">
              <span className="truncate text-sm font-medium text-foreground">{o.label}</span>
              <span className="truncate text-xs text-muted-foreground">{href("x").startsWith("tel") ? formatPhoneNumber(o.value) : o.value}</span>
            </a>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/** Call / mail buttons — only for what the client has. Several numbers or addresses open a picker. */
export function ClientReach({ client, className }: { client: { contact_no?: string | null; mail_id?: string | null; contact_person_name?: string | null; contacts?: Contact[] }; className?: string }) {
  const contacts = client.contacts ?? [];
  const label = client.contact_person_name || "Main contact";
  const phones = options(client.contact_no, label, contacts, "phone");
  const emails = options(client.mail_id, label, contacts, "email");
  if (phones.length === 0 && emails.length === 0) return null;
  return (
    <span className={`mt-1 flex items-center gap-1.5 ${className ?? ""}`}>
      <Action icon={Phone} label="Call" items={phones} href={(v) => `tel:${v.replace(/[^\d+]/g, "")}`} />
      <Action icon={Mail} label="Email" items={emails} href={(v) => `mailto:${v}`} />
    </span>
  );
}
