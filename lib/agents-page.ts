import { prisma } from "@/lib/prisma";
import { agentNetworks } from "@/lib/agents";
import type { AgentRow } from "@/components/agents/AgentsClient";

/** Agents with how many rate requests each has had. */
export async function getAgentRows(): Promise<AgentRow[]> {
  const agents = await prisma.agent.findMany({
    orderBy: [{ is_top: "desc" }, { name: "asc" }],
    select: { id: true, name: true, contact_person: true, email: true, extra_emails: true, phone: true, extra_phones: true, country: true, network: true, extra_networks: true, modes: true, locked: true, is_top: true, orgs: { select: { org_id: true } }, _count: { select: { requests: true } } },
  });
  return agents.map(({ _count, network, extra_networks, orgs, ...a }) => ({
    ...a,
    networks: agentNetworks({ network, extra_networks }),
    org_ids: orgs.map((o) => o.org_id),
    requests: _count.requests,
  }));
}

/** Every id is an existing company (ids come from the agent form). */
export async function companiesExist(ids: number[]) {
  return (await prisma.organization.count({ where: { id: { in: ids } } })) === ids.length;
}
