import { PageHeader } from "@/components/layout/PageHeader";
import { AgentsClient } from "@/components/agents/AgentsClient";
import { getAgentRows } from "@/lib/agents-page";

/** Accounts lock / unlock agents; managers add and edit them. */
export default async function AgentsPage() {
  return (
    <>
      <PageHeader title="Agents" subtitle="Lock an agent to stop enquiries being sent to them. Unlock to allow it again." />
      <AgentsClient agents={await getAgentRows()} canEdit={false} />
    </>
  );
}
