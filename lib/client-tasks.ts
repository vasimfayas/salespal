import type { Prisma } from "@prisma/client";
import { taskCategories } from "@/types/task";

/**
 * The tasks listed on a client's page: linked to the client, user-made (general or a user-chosen type).
 * Lead and revision tasks close through their own outcomes, so they stay out of this list.
 */
export const clientTasksWhere = (clientId: number): Prisma.TaskWhereInput => ({
  client_id: clientId,
  enquiry_id: null,
  OR: [{ category: null }, { category: { in: [...taskCategories] } }],
});
