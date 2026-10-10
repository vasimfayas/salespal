export const taskStatuses = ["pending", "in_process", "achieved", "unsuccessful"] as const;
export type TaskStatus = (typeof taskStatuses)[number];

export type TaskListItem = {
  id: number;
  description: string;
  due_date: string;
  notification: boolean;
  status: TaskStatus | string;
  assignedTo?: { name: string };
  createdBy?: { name: string };
};

/** Values users can pick for a task's type (stored in tasks.category; NULL = general). */
export const taskCategories = ["order_follow_up", "payment_follow_up"] as const;
export type TaskCategory = (typeof taskCategories)[number];

/** Category of the automatic task created when a manager assigns a lead to a salesman. */
export const LEAD_TASK_CATEGORY = "lead_follow_up";

/** Lead follow-up outcomes the salesman records (each updates the client). */
export const leadOutcomes = ["contacted", "follow_up", "rejected"] as const;
export type LeadOutcome = (typeof leadOutcomes)[number];
export const leadOutcomeLabels: Record<LeadOutcome, string> = { contacted: "Contacted", follow_up: "Follow-up", rejected: "Rejected" };

export const OPEN_TASK_STATUSES = ["pending", "in_process"] as const;
export const isOpenTask = (status: string) => (OPEN_TASK_STATUSES as readonly string[]).includes(status);

/** What a task is about — derived in SQL from enquiry_id / category (see lib/tasks-list.ts). */
export type TaskKind = "general" | "lead_follow_up" | "enquiry_follow_up" | "order_follow_up" | "payment_follow_up";

export const taskKindLabels: Record<TaskKind, string> = {
  general: "General",
  lead_follow_up: "Lead follow-up",
  enquiry_follow_up: "Enquiry follow-up",
  order_follow_up: "Order follow-up",
  payment_follow_up: "Payment follow-up",
};
