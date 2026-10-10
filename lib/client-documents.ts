import { prisma } from "@/lib/prisma";
import { clientScopeWhere, type ScopedToken } from "@/lib/scoping";
import type { ClientDocumentItem } from "@/types/client";

/**
 * Client attachments. Anyone who can see the client can view its documents;
 * salesmen, managers and the owner can add / edit them; the uploader, managers and the owner can delete.
 */
export const CLIENT_DOCUMENT_EDITOR_ROLES = [1, 2, 3];
export const MAX_CLIENT_DOCUMENTS_PER_UPLOAD = 10;

/**
 * Documents are company-wide: they live on the company's main client row and every department sees them.
 * Reads also include anything attached to the department row itself.
 */
export function documentClientIds(client: { id: number; parent_client_id: number | null }) {
  return client.parent_client_id ? [client.parent_client_id, client.id] : [client.id];
}

/** The client (if the user can see it), where its new documents go, and which rows' documents it shows. */
export async function findScopedClient(token: ScopedToken, clientId: number) {
  if (!Number.isInteger(clientId)) return null;
  const client = await prisma.client.findFirst({
    where: { AND: [{ id: clientId }, await clientScopeWhere(token)] },
    select: { id: true, parent_client_id: true },
  });
  return client && { id: client.id, documentOwnerId: client.parent_client_id ?? client.id, documentClientIds: documentClientIds(client) };
}

export function canDeleteClientDocument(user: { id: number; role_id: number }, doc: { uploaded_by_id: number }) {
  return user.role_id === 1 || user.role_id === 2 || doc.uploaded_by_id === user.id;
}

export function serializeClientDocument(doc: {
  id: number;
  description: string;
  expiry_date: Date | null;
  file_name: string;
  mime_type: string;
  size_bytes: number;
  uploaded_by_id: number;
  created_at: Date;
  uploadedBy: { name: string };
}): ClientDocumentItem {
  return {
    id: doc.id,
    description: doc.description,
    expiry_date: doc.expiry_date ? doc.expiry_date.toISOString().slice(0, 10) : null,
    file_name: doc.file_name,
    mime_type: doc.mime_type,
    size_bytes: doc.size_bytes,
    uploaded_by_id: doc.uploaded_by_id,
    uploaded_by: doc.uploadedBy.name,
    created_at: doc.created_at.toISOString(),
  };
}

/** Newest first, for the rows from documentClientIds(). The caller has already checked access to the client. */
export async function getClientDocuments(clientIds: number[]) {
  const docs = await prisma.clientDocument.findMany({
    where: { client_id: { in: clientIds } },
    include: { uploadedBy: { select: { name: true } } },
    orderBy: [{ created_at: "desc" }, { id: "desc" }],
  });
  return docs.map(serializeClientDocument);
}
