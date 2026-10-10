"use client";

import { useState } from "react";
import { Pagination } from "@/components/ui/Pagination";
import { ClientPicker } from "@/components/clients/ClientPicker";
import { useDebouncedParam, useUrlFilters } from "@/hooks/useUrlFilters";
import type { TasksPage } from "@/lib/tasks-list";
import { useRouter } from "next/navigation";
import { Plus, X, Loader2, Search, Trash2 } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Toast } from "@/components/ui/Toast";
import { cn } from "@/lib/utils";
import type { TaskKind } from "@/types/task";
import { TaskActions, TaskStatusPill, isGuidedTask } from "@/components/tasks/TaskActions";
import { ClientChip, DueDate, KindBadge, StatusSelect, hasInlineActions } from "@/components/tasks/TaskRowParts";

import { buttonVariants } from "@/components/ui/Button";
type UnifiedTask = {
  id: number;
  description: string;
  due_date: Date | string;
  status: string;
  assignedTo?: { name: string | null } | null;
  createdBy?: { name: string | null } | null;
  created_by_id?: number;
  isClientTask: boolean;
  clientId?: number | null;
  clientName?: string | null;
  kind?: TaskKind;
  enquiry?: { id: number; status: string; prefix?: string | null } | null;
  outcome?: string | null;
};

type SalesmanItem = {
  id: number;
  name: string;
};

interface ManagerTasksListProps {
  /** One server-filtered page of tasks (general + client tasks merged). */
  data: TasksPage;
  salesmen: SalesmanItem[];
}

export function ManagerTasksList({ data, salesmen }: ManagerTasksListProps) {
  const router = useRouter();

  // Optimistic edits layered over the server page until router.refresh() delivers fresh rows.
  const [localTasks, setLocalTasks] = useState<UnifiedTask[]>(data.rows);
  const [syncedRows, setSyncedRows] = useState(data.rows);
  if (data.rows !== syncedRows) {
    setSyncedRows(data.rows);
    setLocalTasks(data.rows);
  }

  // Filters and search live in the URL and are applied by the server.
  const { get, set, isPending: isNavigating } = useUrlFilters();
  const [searchQuery, setSearchQuery] = useDebouncedParam("q", set, get("q"));
  const statusFilter = get("status", "all");
  const salesmanFilter = get("salesman", "all");
  const typeFilter = (get("type") || "all") as "all" | "general" | "client";
  const [pickedClient, setPickedClient] = useState<{ id: number; name: string } | null>(null);

  // Modals state
  const [isAddOpen, setIsAddOpen] = useState(false);

  // Form states
  const [addTaskForm, setAddTaskForm] = useState({
    title: "",
    description: "",
    type: "Call",
    due_date: "",
    assigned_to_id: "",
    client_id: "",
    notification: true, // Default to true (on)
  });

  // Action / loading states
  const [isSaving, setIsSaving] = useState(false);
  const [updatingTaskId, setUpdatingTaskId] = useState<number | null>(null);
  const [deletingTaskId, setDeletingTaskId] = useState<number | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const filteredTasks = localTasks;
  // Fixed per mount so due-date colours are stable across re-renders
  const [now] = useState(() => Date.now());

  // Submit task handler
  async function handleAddSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg(null);
    setIsSaving(true);

    const isClientLinked = pickedClient !== null;
    const selectedClientId = pickedClient?.id ?? 0;
    const assignedSalesmanId = Number(addTaskForm.assigned_to_id);

    if (isNaN(assignedSalesmanId)) {
      setErrorMsg("Please select a salesman to assign the task.");
      setIsSaving(false);
      return;
    }

    // Format task description: e.g. [Call] Follow up with prospect - note details
    const combinedDesc = `[${addTaskForm.type}] ${addTaskForm.title}${
      addTaskForm.description ? ` — ${addTaskForm.description}` : ""
    }`;

    try {
      const url = isClientLinked
        ? `/api/clients/${selectedClientId}/tasks`
        : `/api/tasks`;

      const bodyData = isClientLinked
        ? {
            description: combinedDesc,
            due_date: addTaskForm.due_date,
            assigned_to_id: assignedSalesmanId,
            status: "pending",
          }
        : {
            description: combinedDesc,
            due_date: addTaskForm.due_date,
            assigned_to_id: assignedSalesmanId,
            status: "pending",
            notification: addTaskForm.notification,
          };

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyData),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to create task");
      }

      triggerToast("Task assigned successfully!");
      setAddTaskForm({
        title: "",
        description: "",
        type: "Call",
        due_date: "",
        assigned_to_id: "",
        client_id: "",
        notification: true,
      });
      setPickedClient(null);
      setIsAddOpen(false);

      // Append new task to local view
      if (data.task) {
        const newTask: UnifiedTask = {
          ...data.task,
          isClientTask: isClientLinked,
          clientId: isClientLinked ? selectedClientId : null,
          clientName: isClientLinked ? pickedClient?.name ?? null : null,
          assignedTo: {
            name: salesmen.find((s) => s.id === assignedSalesmanId)?.name || null,
          },
        };
        setLocalTasks((prev) => [newTask, ...prev]);
      }

      router.refresh();
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setIsSaving(false);
    }
  }

  // Update status handler
  async function handleStatusChange(
    taskId: number,
    newStatus: string,
    isClientTask: boolean,
    clientId?: number | null
  ) {
    setUpdatingTaskId(taskId);

    try {
      const url = isClientTask
        ? `/api/clients/${clientId}/tasks/${taskId}`
        : `/api/tasks/${taskId}`;

      const res = await fetch(url, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to update status");
      }

      triggerToast("Task status updated!");
      setLocalTasks((prev) =>
        prev.map((t) => (t.id === taskId && t.isClientTask === isClientTask ? { ...t, status: newStatus } : t))
      );
      router.refresh();
    } catch (err: any) {
      triggerToast(err.message);
    } finally {
      setUpdatingTaskId(null);
    }
  }

  // Delete task handler
  async function handleDeleteTask(taskId: number, isClientTask: boolean, clientId?: number | null) {
    if (!confirm("Are you sure you want to delete this task?")) return;
    setDeletingTaskId(taskId);

    try {
      const url = isClientTask
        ? `/api/clients/${clientId}/tasks/${taskId}`
        : `/api/tasks/${taskId}`;

      const res = await fetch(url, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to delete task");
      }

      triggerToast("Task deleted successfully");
      setLocalTasks((prev) => prev.filter((t) => !(t.id === taskId && t.isClientTask === isClientTask)));
      router.refresh();
    } catch (err: any) {
      triggerToast(err.message);
    } finally {
      setDeletingTaskId(null);
    }
  }

  const statusCell = (task: UnifiedTask) =>
    isGuidedTask(task) ? (
      <TaskStatusPill task={task} />
    ) : (
      <StatusSelect task={task} updating={updatingTaskId === task.id} onChange={(status) => handleStatusChange(task.id, status, task.isClientTask, task.clientId)} />
    );

  const deleteButton = (task: UnifiedTask) => (
    <button
      onClick={() => handleDeleteTask(task.id, task.isClientTask, task.clientId)}
      disabled={deletingTaskId === task.id}
      aria-label={`Delete task: ${task.description}`}
      title="Delete task"
      className={cn(buttonVariants({ variant: "ghost", size: "icon-sm" }), "text-muted-foreground hover:bg-danger-soft hover:text-danger-foreground")}
    >
      {deletingTaskId === task.id ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
    </button>
  );

  return (
    <div className="space-y-6">
      {/* Search and Filters panel */}
      <div className="bg-card p-5 rounded-card border border-border/80 shadow-card space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h2 className="text-sm font-semibold text-foreground tracking-tight">
              Task Management
            </h2>
            <p className="text-xs text-muted-foreground font-medium mt-0.5">
              Monitor, assign, and manage tasks for your salesmen.
            </p>
          </div>
          <button
            onClick={() => {
              setErrorMsg(null);
              setIsAddOpen(true);
            }}
            className={buttonVariants({ size: "sm" })}
          >
            <Plus size={14} />
            <span>Assign Task</span>
          </button>
        </div>

        <div className="grid gap-3 grid-cols-1 sm:grid-cols-3">
          {/* Search bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/80" size={14} />
            <input
              type="text"
              placeholder="Search description, salesman, client..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search tasks"
              className="w-full rounded-control border border-input bg-card px-3 text-sm text-foreground shadow-xs outline-none transition-[border-color,box-shadow] duration-150 placeholder:text-muted-foreground/70 hover:border-border-strong focus:border-ring focus:ring-3 focus:ring-ring/15 disabled:cursor-not-allowed disabled:bg-muted disabled:opacity-70 w-full h-10 pl-9 pr-4"
            />
          </div>

          {/* Salesman filter */}
          <div>
            <select
              value={salesmanFilter}
              onChange={(e) => set({ salesman: e.target.value })}
              aria-label="Filter by salesman"
              className="w-full rounded-control border border-input bg-card px-3 text-sm text-foreground shadow-xs outline-none transition-[border-color,box-shadow] duration-150 placeholder:text-muted-foreground/70 hover:border-border-strong focus:border-ring focus:ring-3 focus:ring-ring/15 disabled:cursor-not-allowed disabled:bg-muted disabled:opacity-70 w-full h-10 cursor-pointer"
            >
              <option value="all">All Salesmen</option>
              {salesmen.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          {/* Status filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => set({ status: e.target.value })}
              aria-label="Filter by status"
              className="w-full rounded-control border border-input bg-card px-3 text-sm text-foreground shadow-xs outline-none transition-[border-color,box-shadow] duration-150 placeholder:text-muted-foreground/70 hover:border-border-strong focus:border-ring focus:ring-3 focus:ring-ring/15 disabled:cursor-not-allowed disabled:bg-muted disabled:opacity-70 w-full h-10 cursor-pointer"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="in_process">In Process</option>
              <option value="achieved">Completed / Achieved</option>
              <option value="unsuccessful">Unsuccessful</option>
            </select>
          </div>
        </div>
      </div>

      {/* Task List */}
      <div className="w-full space-y-4">
        {/* Type filter tabs */}
        <div className="flex items-center gap-1.5 bg-muted p-1 rounded-xl w-fit">
          {([
            { key: "all" as const, label: "All Tasks" },
            { key: "general" as const, label: "General" },
            { key: "client" as const, label: "Client Tasks" },
          ]).map((tab) => (
            <button
              key={tab.key}
              onClick={() => set({ type: tab.key, view: null })}
              className={cn(
                "px-3 py-1.5 text-xs font-semibold rounded-lg transition cursor-pointer",
                typeFilter === tab.key && get("view") !== "lead"
                  ? "bg-card text-foreground shadow-sm ring-1 ring-border/60"
                  : "text-muted-foreground hover:text-foreground/85 hover:bg-muted"
              )}
            >
              {tab.label}
            </button>
          ))}
          <button
            onClick={() => set({ view: "lead", type: null })}
            className={cn(
              "px-3 py-1.5 text-xs font-semibold rounded-lg transition cursor-pointer",
              get("view") === "lead" ? "bg-card text-foreground shadow-sm ring-1 ring-border/60" : "text-muted-foreground hover:text-foreground/85 hover:bg-muted"
            )}
          >
            Open leads <span className="tabular-nums text-muted-foreground">{data.viewCounts.lead.toLocaleString()}</span>
          </button>
        </div>

        <div className={cn("space-y-1 transition-opacity", isNavigating && "opacity-60")} aria-busy={isNavigating}>
        {filteredTasks.length === 0 ? (
          <div className="rounded-card border border-dashed border-border bg-card p-12 text-center text-sm text-muted-foreground">
            {searchQuery ? `No tasks match “${searchQuery}”.` : "No tasks found matching current filters."}
          </div>
        ) : (
          <>
            <div className="hidden overflow-hidden rounded-card border border-border bg-card shadow-card md:block">
              <table className="w-full table-fixed text-left text-sm">
                <thead className="border-b border-border bg-subtle text-xs text-muted-foreground">
                  <tr>
                    <th scope="col" className="px-4 py-3 font-medium">Task</th>
                    <th scope="col" className="hidden w-[16%] px-4 py-3 font-medium lg:table-cell">Assigned to</th>
                    <th scope="col" className="w-[130px] px-4 py-3 font-medium">Due</th>
                    <th scope="col" className="w-[130px] px-4 py-3 font-medium">Status</th>
                    <th scope="col" className={cn("px-4 py-3 text-right font-medium", hasInlineActions(filteredTasks) ? "w-[340px]" : "w-[110px]")}><span className="sr-only">Actions</span></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredTasks.map((task) => (
                    <tr key={`${task.isClientTask ? "client" : "regular"}-${task.id}`} className="align-middle transition-colors hover:bg-subtle">
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <KindBadge task={task} />
                          <ClientChip task={task} clientsPath="/dashboard/manager/clients" />
                        </div>
                        <p className="mt-1 line-clamp-2 text-foreground" title={task.description}>{task.description}</p>
                      </td>
                      <td className="hidden px-4 py-3 text-muted-foreground lg:table-cell">
                        <span className="block truncate">{task.assignedTo?.name || "Unassigned"}</span>
                      </td>
                      <td className="px-4 py-3">
                        <DueDate task={task} now={now} />
                      </td>
                      <td className="px-4 py-3">{statusCell(task)}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <TaskActions task={task} enquiriesPath="/dashboard/manager/enquiries" />
                          {deleteButton(task)}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <ul className="divide-y divide-border overflow-hidden rounded-card border border-border bg-card shadow-card md:hidden">
              {filteredTasks.map((task) => (
                <li key={`${task.isClientTask ? "client" : "regular"}-${task.id}`} className="space-y-2 p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex min-w-0 flex-wrap items-center gap-1.5">
                      <KindBadge task={task} />
                      <ClientChip task={task} clientsPath="/dashboard/manager/clients" />
                    </div>
                    {statusCell(task)}
                  </div>
                  <p className="text-sm text-foreground">{task.description}</p>
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
                    <span className="flex items-center gap-2">
                      <DueDate task={task} now={now} />
                      <span aria-hidden>·</span>
                      {task.assignedTo?.name || "Unassigned"}
                    </span>
                    <div className="flex items-center gap-1">
                      <TaskActions task={task} enquiriesPath="/dashboard/manager/enquiries" />
                      {deleteButton(task)}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </>
        )}
        <Pagination page={data.page} pageSize={data.pageSize} total={data.total} pending={isNavigating} noun="tasks" onPage={(p) => set({ page: p })} />
        </div>
      </div>

      {/* Assign Task Modal */}
      <Modal onClose={() => setIsAddOpen(false)} open={isAddOpen}>
        <div className="relative">
          <button aria-label="Close"
            onClick={() => setIsAddOpen(false)}
            className={cn(buttonVariants({ variant: "ghost", size: "icon-sm" }), "absolute -top-1.5 -right-1.5")}
          >
            <X size={16} />
          </button>

          <div className="mb-4">
            <h3 className="text-base font-semibold text-foreground">New Task</h3>
            <p className="text-xs text-muted-foreground">Assign a task to a member of your sales team.</p>
          </div>

          {errorMsg && (
            <div className="mb-4 p-2.5 bg-danger-soft border border-danger/30 rounded-lg text-xs text-danger-foreground font-medium">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleAddSubmit} className="space-y-4">
            {/* Title / Task Header */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-foreground/85" htmlFor="task-title">
                Title *
              </label>
              <input
                id="task-title"
                type="text"
                required
                value={addTaskForm.title}
                onChange={(e) => setAddTaskForm({ ...addTaskForm, title: e.target.value })}
                placeholder="e.g. Schedule call with decision maker"
                className="w-full rounded-control border border-input bg-card px-3 text-sm text-foreground shadow-xs outline-none transition-[border-color,box-shadow] duration-150 placeholder:text-muted-foreground/70 hover:border-border-strong focus:border-ring focus:ring-3 focus:ring-ring/15 disabled:cursor-not-allowed disabled:bg-muted disabled:opacity-70 w-full h-10"
              />
            </div>

            {/* Description Textarea */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-foreground/85" htmlFor="task-desc">
                Description
              </label>
              <textarea
                id="task-desc"
                value={addTaskForm.description}
                onChange={(e) => setAddTaskForm({ ...addTaskForm, description: e.target.value })}
                placeholder="Specify task instructions, agenda, or background details..."
                rows={3}
                className="w-full rounded-control border border-input bg-card px-3 text-sm text-foreground shadow-xs outline-none transition-[border-color,box-shadow] duration-150 placeholder:text-muted-foreground/70 hover:border-border-strong focus:border-ring focus:ring-3 focus:ring-ring/15 disabled:cursor-not-allowed disabled:bg-muted disabled:opacity-70 w-full py-2.5"
              />
            </div>

            {/* Row: Type and Due Date */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-foreground/85" htmlFor="task-type">
                  Type
                </label>
                <select
                  id="task-type"
                  value={addTaskForm.type}
                  onChange={(e) => setAddTaskForm({ ...addTaskForm, type: e.target.value })}
                  className="w-full rounded-control border border-input bg-card px-3 text-sm text-foreground shadow-xs outline-none transition-[border-color,box-shadow] duration-150 placeholder:text-muted-foreground/70 hover:border-border-strong focus:border-ring focus:ring-3 focus:ring-ring/15 disabled:cursor-not-allowed disabled:bg-muted disabled:opacity-70 h-10 cursor-pointer"
                >
                  <option value="Call">Call</option>
                  <option value="Email">Email</option>
                  <option value="Meeting">Meeting</option>
                  <option value="Presentation">Presentation</option>
                  <option value="Follow-up">Follow-up</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-foreground/85" htmlFor="task-due">
                  Due Date *
                </label>
                <input
                  id="task-due"
                  type="date"
                  required
                  value={addTaskForm.due_date}
                  onChange={(e) => setAddTaskForm({ ...addTaskForm, due_date: e.target.value })}
                  className="w-full rounded-control border border-input bg-card px-3 text-sm text-foreground shadow-xs outline-none transition-[border-color,box-shadow] duration-150 placeholder:text-muted-foreground/70 hover:border-border-strong focus:border-ring focus:ring-3 focus:ring-ring/15 disabled:cursor-not-allowed disabled:bg-muted disabled:opacity-70 w-full h-10"
                />
              </div>
            </div>

            {/* Row: Assign To (Salesman) and Client (Optional) */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-foreground/85" htmlFor="task-assignee">
                  Assign To *
                </label>
                <select
                  id="task-assignee"
                  required
                  value={addTaskForm.assigned_to_id}
                  onChange={(e) => setAddTaskForm({ ...addTaskForm, assigned_to_id: e.target.value })}
                  className="w-full rounded-control border border-input bg-card px-3 text-sm text-foreground shadow-xs outline-none transition-[border-color,box-shadow] duration-150 placeholder:text-muted-foreground/70 hover:border-border-strong focus:border-ring focus:ring-3 focus:ring-ring/15 disabled:cursor-not-allowed disabled:bg-muted disabled:opacity-70 h-10 cursor-pointer"
                >
                  <option value="">Select salesman...</option>
                  {salesmen.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-foreground/85" htmlFor="task-client">
                  Client (Optional)
                </label>
                <ClientPicker id="task-client" value={pickedClient} onChange={setPickedClient} inputClassName="text-xs" />
              </div>
            </div>

            {/* Notification alert toggle (Default on) */}
            <div className="flex items-center gap-2 py-1.5 border-t border-border">
              <input
                id="task-notif-switch"
                type="checkbox"
                checked={addTaskForm.notification}
                onChange={(e) => setAddTaskForm({ ...addTaskForm, notification: e.target.checked })}
                className="h-4 w-4 text-primary focus:ring-ring/20 border-border-strong rounded cursor-pointer"
              />
              <label className="text-xs font-medium text-foreground/85 cursor-pointer select-none" htmlFor="task-notif-switch">
                Send alert notification to salesman (default is On)
              </label>
            </div>

            {/* Submit buttons */}
            <div className="flex items-center justify-end gap-2.5 pt-3.5 border-t border-border">
              <button
                type="button"
                onClick={() => setIsAddOpen(false)}
                disabled={isSaving}
                className="px-4 py-2 text-xs font-semibold border border-border hover:bg-subtle text-foreground/70 rounded-lg transition disabled:opacity-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className={buttonVariants({ size: "sm" })}
              >
                {isSaving && <Loader2 size={12} className="animate-spin" />}
                <span>Create Task</span>
              </button>
            </div>
          </form>
        </div>
      </Modal>

      <Toast message={toastMsg || undefined} />
    </div>
  );
}
