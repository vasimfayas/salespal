"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Plus, Search, Trash2, Users } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Modal, ModalFooter, ModalHeader } from "@/components/ui/Modal";
import { Pagination } from "@/components/ui/Pagination";
import { createUser, deleteUser, updateUser } from "@/lib/actions/user-actions";
import { DEFAULT_PASSWORD, isOwnerRole, ROLES } from "@/lib/roles";
import { cn } from "@/lib/utils";

export type UserRow = { id: number; name: string; email: string; phone: string | null; role_id: number };

const PAGE = 25;
const EMPTY = { name: "", email: "", phone: "", role_id: 2, password: "" };
const roleName = (id: number) => ROLES.find((r) => r.id === id)?.name ?? `Role ${id}`;
const ROLE_TONE: Record<number, string> = {
  6: "bg-danger-soft text-danger-foreground",
  1: "bg-primary-soft text-primary-soft-foreground",
  2: "bg-info-soft text-info-foreground",
  3: "bg-success-soft text-success-foreground",
  4: "bg-warning-soft text-warning-foreground",
  5: "bg-muted text-foreground",
};

/** Users directory for the owner / super admin: add (any role they may manage), edit and delete. */
export function UsersClient({ users, currentUserId, isSuper }: { users: UserRow[]; currentUserId: number; isSuper: boolean }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [editing, setEditing] = useState<UserRow | "new" | null>(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Owners manage staff; owner and super admin accounts are managed by the super admin.
  const creatable = ROLES.filter((r) => isSuper || !isOwnerRole(r.id));
  const canManage = (u: UserRow) => isSuper || !isOwnerRole(u.role_id);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return users.filter(
      (u) =>
        (roleFilter === "all" || String(u.role_id) === roleFilter) &&
        (!q || u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || (u.phone ?? "").includes(q)),
    );
  }, [users, query, roleFilter]);
  const lastPage = Math.max(1, Math.ceil(filtered.length / PAGE));
  const current = Math.min(page, lastPage);
  const rows = filtered.slice((current - 1) * PAGE, current * PAGE);

  function open(user: UserRow | "new") {
    setEditing(user);
    setError(null);
    setForm(user === "new" ? EMPTY : { name: user.name, email: user.email, phone: user.phone ?? "", role_id: user.role_id, password: "" });
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const isNew = editing === "new";
      const res = isNew ? await createUser(form) : await updateUser((editing as UserRow).id, form);
      if (!res.success) throw new Error(res.error);
      toast.success(isNew ? `${roleName(form.role_id)} added — password: ${form.password || DEFAULT_PASSWORD}` : "User updated");
      setEditing(null);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't save the user");
    } finally {
      setSaving(false);
    }
  }

  async function remove(user: UserRow) {
    if (!confirm(`Delete ${user.name}? This can't be undone.`)) return;
    const res = await deleteUser(user.id);
    if (!res.success) return toast.error(res.error, { duration: 8000 });
    toast.success(`${user.name} deleted`);
    router.refresh();
  }

  const selectedRole = ROLES.find((r) => r.id === form.role_id);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 rounded-card border border-border bg-card p-3 shadow-card sm:flex-row sm:items-center sm:p-4">
        <div className="relative flex-1">
          <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" aria-hidden />
          <Input
            aria-label="Search users"
            placeholder="Search name, email or phone"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
            className="pl-9"
          />
        </div>
        <Select
          aria-label="Filter by role"
          value={roleFilter}
          onChange={(e) => {
            setRoleFilter(e.target.value);
            setPage(1);
          }}
          wrapperClassName="sm:w-44"
        >
          <option value="all">All roles</option>
          {ROLES.map((r) => (
            <option key={r.id} value={r.id}>
              {r.name}
            </option>
          ))}
        </Select>
        <Button onClick={() => open("new")}>
          <Plus /> Add user
        </Button>
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={Users} title={users.length ? "No users match" : "No users yet"} message={users.length ? "Try another search or role." : undefined} />
      ) : (
        <>
          <div className="overflow-x-auto rounded-card border border-border bg-card shadow-card">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="border-b border-border bg-subtle text-xs font-medium text-muted-foreground">
                <tr>
                  <th scope="col" className="px-4 py-2.5">Name</th>
                  <th scope="col" className="px-4 py-2.5">Role</th>
                  <th scope="col" className="px-4 py-2.5">Email</th>
                  <th scope="col" className="px-4 py-2.5">Phone</th>
                  <th scope="col" className="px-4 py-2.5 text-right">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {rows.map((u) => (
                  <tr key={u.id} className="hover:bg-muted/40">
                    <td className="px-4 py-3 font-medium text-foreground">
                      {u.name}
                      {u.id === currentUserId && <span className="ml-2 text-xs font-normal text-muted-foreground">(you)</span>}
                    </td>
                    <td className="px-4 py-3">
                      <span className={cn("inline-flex rounded-full px-2 py-0.5 text-xs font-semibold", ROLE_TONE[u.role_id] ?? "bg-muted text-foreground")}>
                        {roleName(u.role_id)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-foreground">{u.email}</td>
                    <td className="px-4 py-3 text-muted-foreground">{u.phone ?? "—"}</td>
                    <td className="px-4 py-2 text-right">
                      {(canManage(u) || u.id === currentUserId) && (
                        <div className="inline-flex">
                          <Button variant="ghost" size="icon-sm" onClick={() => open(u)} aria-label={`Edit ${u.name}`} title="Edit">
                            <Pencil />
                          </Button>
                          {canManage(u) && u.id !== currentUserId && (
                            <Button
                              variant="ghost"
                              size="icon-sm"
                              onClick={() => remove(u)}
                              aria-label={`Delete ${u.name}`}
                              title="Delete (only users with no clients, enquiries, orders or tasks)"
                              className="hover:bg-danger-soft hover:text-danger-foreground"
                            >
                              <Trash2 />
                            </Button>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination page={current} pageSize={PAGE} total={filtered.length} noun="users" onPage={setPage} />
        </>
      )}

      <Modal open={editing !== null} onClose={() => setEditing(null)}>
        <form onSubmit={save} className="space-y-4">
          <ModalHeader title={editing === "new" ? "Add user" : "Edit user"} onClose={() => setEditing(null)} />
          {error && (
            <p role="alert" className="rounded-control bg-danger-soft px-3 py-2 text-sm font-medium text-danger-foreground">
              {error}
            </p>
          )}
          {editing === "new" ? (
            <div>
              <Select id="user-role" label="Role" value={form.role_id} onChange={(e) => setForm({ ...form, role_id: Number(e.target.value) })}>
                {creatable.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name}
                  </option>
                ))}
              </Select>
              {selectedRole && <p className="mt-1 text-xs text-muted-foreground">{selectedRole.hint}</p>}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              Role: <span className="font-medium text-foreground">{roleName(form.role_id)}</span>
            </p>
          )}
          <Input label="Full name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <Input label="Email" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <Input label="Phone (optional)" type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          <Input
            label={editing === "new" ? "Password (optional)" : "New password (optional)"}
            type="password"
            autoComplete="new-password"
            minLength={6}
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            hint={editing === "new" ? `Leave empty to use the default: ${DEFAULT_PASSWORD}` : "Leave empty to keep the current password."}
          />
          <ModalFooter>
            <Button type="button" variant="secondary" onClick={() => setEditing(null)}>
              Cancel
            </Button>
            <Button type="submit" loading={saving}>
              {editing === "new" ? "Add user" : "Save"}
            </Button>
          </ModalFooter>
        </form>
      </Modal>
    </div>
  );
}
