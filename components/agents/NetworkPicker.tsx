"use client";

import { useEffect, useId, useRef, useState } from "react";
import { ChevronDown, Plus, X } from "lucide-react";
import { controlBase, controlHeight, hintClass, labelClass } from "@/components/ui/field-styles";
import { networkSuggestions, typedNetwork } from "@/lib/agents";
import { cn } from "@/lib/utils";

/**
 * The networks an agent is a member of: pick from the networks already on other agents, or type a new one.
 * The list opens in the page flow so the scrolling dialog doesn't clip it (as LocationPicker's `inline`).
 */
export function NetworkPicker({ known, values, onChange }: { known: string[]; values: string[]; onChange: (values: string[]) => void }) {
  const inputId = useId();
  const listId = `${inputId}-list`;
  const [typed, setTyped] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const listRef = useRef<HTMLDivElement>(null);
  const { matches, newName } = networkSuggestions(known, values, typed);
  const options = newName ? [...matches, newName] : matches;

  useEffect(() => {
    listRef.current?.querySelector(`[data-index="${active}"]`)?.scrollIntoView({ block: "nearest" });
  }, [active]);

  function add(name: string) {
    onChange([...values, name]);
    setTyped("");
    setActive(0);
  }

  return (
    <div>
      <label htmlFor={inputId} className={labelClass}>
        Networks (optional)
      </label>
      {values.length > 0 && (
        <ul className="mb-2 flex flex-wrap gap-1.5" aria-label="Selected networks">
          {values.map((n) => (
            <li key={n} className="inline-flex items-center gap-1 rounded-full bg-primary-soft py-0.5 pl-2.5 pr-1 text-xs font-medium text-primary-soft-foreground">
              {n}
              <button type="button" aria-label={`Remove ${n}`} onClick={() => onChange(values.filter((x) => x !== n))} className="cursor-pointer rounded-full p-0.5 hover:bg-primary/10">
                <X size={12} />
              </button>
            </li>
          ))}
        </ul>
      )}
      <div className="relative">
        <input
          id={inputId}
          type="text"
          role="combobox"
          aria-expanded={open}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={open && options[active] ? `${listId}-${active}` : undefined}
          autoComplete="off"
          value={typed}
          placeholder="Select a network or type a new one"
          onFocus={() => setOpen(true)}
          onClick={() => setOpen(true)}
          // Text left in the box still counts, so clicking Save right after typing doesn't lose it.
          onBlur={() => {
            const name = typedNetwork(known, values, typed);
            if (name) onChange([...values, name]);
            setTyped("");
            setOpen(false);
          }}
          onChange={(e) => {
            setTyped(e.target.value);
            setActive(0);
            setOpen(true);
          }}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") {
              e.preventDefault();
              setOpen(true);
              setActive((a) => Math.min(a + 1, options.length - 1));
            } else if (e.key === "ArrowUp") {
              e.preventDefault();
              setActive((a) => Math.max(a - 1, 0));
            } else if (e.key === "Enter" && (typed.trim() || (open && options[active]))) {
              e.preventDefault(); // add the network; don't submit the form
              if (options[active]) add(options[active]);
              else setTyped("");
            } else if (e.key === "Escape" && open) {
              e.stopPropagation(); // close the list, not the surrounding dialog
              setOpen(false);
            }
          }}
          className={cn(controlBase, controlHeight, "pr-9")}
        />
        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
      </div>
      {open && (
        <div ref={listRef} id={listId} role="listbox" aria-label="Networks" className="mt-1 max-h-48 overflow-y-auto rounded-control border border-border bg-popover p-1 text-sm shadow-pop">
          {options.map((name, i) => (
            <div
              key={name}
              id={`${listId}-${i}`}
              data-index={i}
              role="option"
              aria-selected={i === active}
              onMouseDown={(e) => e.preventDefault()} // keep focus in the box, so the blur above doesn't fire
              onClick={() => add(name)}
              onMouseEnter={() => setActive(i)}
              className={cn("flex cursor-pointer items-center gap-2 rounded-md px-2.5 py-1.5 text-foreground", i === active && "bg-muted")}
            >
              {name === newName ? (
                <>
                  <Plus size={14} className="shrink-0 text-muted-foreground" aria-hidden />
                  <span className="min-w-0 truncate">
                    Add new network <span className="font-medium">“{name}”</span>
                  </span>
                </>
              ) : (
                <span className="min-w-0 truncate">{name}</span>
              )}
            </div>
          ))}
          {options.length === 0 && (
            <p className="px-2.5 py-1.5 text-muted-foreground">{typed.trim() ? "Already added." : "No other networks yet. Type a name to add one."}</p>
          )}
        </div>
      )}
      <p className={hintClass}>Networks this agent is a member of.</p>
    </div>
  );
}
