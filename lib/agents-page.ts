import { prisma } from "@/lib/prisma";
import type { AgentRow } from "@/components/agents/AgentsClient";

/** Agents with how many rate requests each has had. */
export async function getAgentRows(): Promise<AgentRow[]> {
  const agents = await prisma.agent.findMany({
    orderBy: [{ is_top: "desc" }, { name: "asc" }],
    select: { id: true, name: true, contact_person: true, email: true, extra_emails: true, phone: true, extra_phones: true, country: true, network: true, code: true, modes: true, locked: true, is_top: true, _count: { select: { requests: true } } },
  });
  return agents.map(({ _count, ...a }) => ({ ...a, requests: _count.requests }));
}
