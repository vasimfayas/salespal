import { toast } from "sonner";

/** Shows a new login's generated password once, long enough to copy and pass on. */
export function showNewPassword(who: string, password: string) {
  toast.success(`${who} added. Password: ${password}`, {
    description: "Share it with them now; it isn't shown again. They can change it from their account menu.",
    duration: 30_000,
    action: { label: "Copy", onClick: () => void navigator.clipboard?.writeText(password) },
  });
}
