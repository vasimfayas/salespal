import { PageHeader } from "@/components/layout/PageHeader";
import { AgentsClient } from "@/components/agents/AgentsClient";
import { getAgentRows } from "@/lib/agents-page";
import { getCachedAdminOrgs } from "@/lib/cached-queries";

/** Accounts lock / unlock agents; managers add and edit them. */
export default async function AgentsPage() {
  return (
    <>
      <PageHeader title="Agents" subtitle="Lock an agent to stop enquiries being sent to them. Unlock to allow it again." />
      <AgentsClient agents={await getAgentRows()} companies={await getCachedAdminOrgs()} canEdit={false} />
    </>
  );
}
