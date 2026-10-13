import { prisma } from "@/lib/prisma";
import { getApprovalViews } from "@/lib/approvals";
import { getManagerOrgIds, getSalesmanOrgIds } from "@/lib/scoping";
import { isOwnerRole } from "@/lib/roles";
import { CreditRequestPanel } from "@/components/approvals/CreditRequestPanel";

/** Credit Agreement status for a client, its latest request with the approval log, and the request form. */
export async function CreditAgreementCard({ clientId, user }: { clientId: number; user: { id: number; role_id: number } }) {
  const [client, latest] = await Promise.all([
    prisma.client.findUnique({
      where: { id: clientId },
      select: {
        name: true,
        department: true,
        org_id: true,
        cr_no: true,
        cr_expiry_date: true,
        credit_approved: true,
        credit_days_approved: true,
        credit_approved_at: true,
        parent: { select: { cr_no: true, cr_expiry_date: true } },
        assignedSalesman: { select: { name: true } },
      },
    }),
    getApprovalViews({ client_id: clientId, type: "credit_agreement" }, 1),
  ]);
  if (!client) return null;

  const canRequest = isOwnerRole(user.role_id) || user.role_id === 2 || user.role_id === 3;
  const orgIds = !canRequest ? [] : isOwnerRole(user.role_id) ? null : user.role_id === 3 ? await getSalesmanOrgIds(user.id) : await getManagerOrgIds(user.id);
  const companies = canRequest
    ? await prisma.organization.findMany({ where: orgIds ? { id: { in: orgIds } } : {}, select: { id: true, name: true }, orderBy: { name: "asc" } })
    : [];
  const crExpiry = client.cr_expiry_date ?? client.parent?.cr_expiry_date ?? null;

  return (
    <CreditRequestPanel
      clientId={clientId}
      credit={{ approved: client.credit_approved, days: client.credit_days_approved, at: client.credit_approved_at?.toISOString() ?? null }}
      latest={latest[0] ?? null}
      canRequest={canRequest}
      companies={companies}
      defaults={{
        org_id: companies.some((c) => c.id === client.org_id) ? client.org_id : (companies[0]?.id ?? null),
        salesperson: client.assignedSalesman.name,
        customer_name: client.department ? `${client.name} · ${client.department}` : client.name,
        cr_no: client.cr_no ?? client.parent?.cr_no ?? null,
        cr_expiry: crExpiry ? crExpiry.toISOString().slice(0, 10) : null,
      }}
    />
  );
}
