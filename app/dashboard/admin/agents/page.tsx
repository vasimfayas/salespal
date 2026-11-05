import { PageHeader } from "@/components/layout/PageHeader";
import { AgentsClient } from "@/components/agents/AgentsClient";
import { getAgentRows } from "@/lib/agents-page";
import { getCachedAdminOrgs } from "@/lib/cached-queries";

/** Agents enquiries are sent to for rates ("Send to agent"). */
export default async function AgentsPage() {
  return (
    <>
      <PageHeader title="Agents" subtitle="Freight agents you ask for rates. Send them an enquiry and they reply with their cost." />
      <AgentsClient agents={await getAgentRows()} companies={await getCachedAdminOrgs()} />
    </>
  );
}
