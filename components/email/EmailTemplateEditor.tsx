"use client";

import { useMemo, useRef, useState } from "react";
import { Eye, Pencil } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { labelClass } from "@/components/ui/field-styles";
import { emailTemplateMeta, renderEmail, type EmailTemplateKey, type EmailVars } from "@/lib/email-templates";
import { cn } from "@/lib/utils";

/**
 * Preview / Edit for one email: the subject and message with {{placeholders}}, rendered with `vars` in the preview.
 * The preview is an isolated iframe, so template HTML can't touch the page.
 */
export function EmailTemplateEditor({
  templateKey,
  subject,
  body,
  onChange,
  vars,
  startEditing = false,
}: {
  templateKey: EmailTemplateKey;
  subject: string;
  body: string;
  onChange: (next: { subject: string; body: string }) => void;
  vars: EmailVars;
  startEditing?: boolean;
}) {
  const [editing, setEditing] = useState(startEditing);
  const area = useRef<HTMLTextAreaElement>(null);
  const mail = useMemo(() => renderEmail(templateKey, { subject, body }, vars), [templateKey, subject, body, vars]);

  function insert(token: string) {
    const el = area.current;
    const at = el ? [el.selectionStart, el.selectionEnd] : [body.length, body.length];
    onChange({ subject, body: `${body.slice(0, at[0])}{{${token}}}${body.slice(at[1])}` });
    requestAnimationFrame(() => el?.focus());
  }

  const tab = (on: boolean) =>
    cn("inline-flex cursor-pointer items-center gap-1.5 rounded-control px-3 py-1.5 text-sm font-medium transition-colors", on ? "bg-card text-foreground shadow-xs" : "text-muted-foreground hover:text-foreground");

  return (
    <div className="space-y-3">
      <div role="tablist" aria-label="Email view" className="inline-flex rounded-control bg-muted p-1">
        <button type="button" role="tab" aria-selected={!editing} onClick={() => setEditing(false)} className={tab(!editing)}>
          <Eye size={14} aria-hidden /> Preview
        </button>
        <button type="button" role="tab" aria-selected={editing} onClick={() => setEditing(true)} className={tab(editing)}>
          <Pencil size={14} aria-hidden /> Edit
        </button>
      </div>

      {editing && (
        <div className="space-y-3">
          <Input label="Subject" value={subject} onChange={(e) => onChange({ subject: e.target.value, body })} />
          <div>
            <label htmlFor={`${templateKey}-body`} className={labelClass}>
              Message
            </label>
            <textarea
              ref={area}
              id={`${templateKey}-body`}
              value={body}
              onChange={(e) => onChange({ subject, body: e.target.value })}
              rows={12}
              spellCheck
              className="w-full rounded-control border border-input bg-card px-3 py-2.5 font-mono text-[13px] leading-relaxed text-foreground outline-none focus:border-primary focus:ring-3 focus:ring-primary/15"
            />
            <p className="mt-1 text-xs text-muted-foreground">A blank line starts a new paragraph. Click a placeholder to insert it where the cursor is.</p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {emailTemplateMeta[templateKey].placeholders.map((p) => (
                <button
                  key={p.token}
                  type="button"
                  title={p.hint}
                  onClick={() => insert(p.token)}
                  className="cursor-pointer rounded-full bg-primary-soft px-2.5 py-0.5 font-mono text-xs text-primary-soft-foreground hover:bg-primary-soft/70"
                >
                  {`{{${p.token}}}`}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="overflow-hidden rounded-control border border-border">
        <p className="border-b border-border bg-subtle px-3 py-2 text-sm">
          <span className="text-muted-foreground">Subject: </span>
          <span className="font-medium text-foreground">{mail.subject}</span>
        </p>
        <iframe title="Email preview" sandbox="" srcDoc={`<body style="margin:16px">${mail.html}</body>`} className="h-72 w-full bg-white" />
      </div>
    </div>
  );
}
