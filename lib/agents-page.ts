import { prisma } from "@/lib/prisma";
import type { AgentRow } from "@/components/agents/AgentsClient";

/** Agents with how many rate requests each has had. */
export async function getAgentRows(): Promise<AgentRow[]> {
  const agents = await prisma.agent.findMany({
    orderBy: { name: "asc" },
    select: { id: true, name: true, contact_person: true, email: true, phone: true, _count: { select: { requests: true } } },
  });
  return agents.map(({ _count, ...a }) => ({ ...a, requests: _count.requests }));
}
