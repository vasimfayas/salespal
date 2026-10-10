"use client";

import { useEffect, useRef, useState } from "react";
import { Eraser } from "lucide-react";
import { Button } from "@/components/ui/Button";

/** Draw-to-sign box (mouse, pen or finger). Reports a PNG data URL after each stroke, or null once cleared. */
export function SignaturePad({ onChange, labelledBy }: { onChange: (dataUrl: string | null) => void; labelledBy?: string }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);
  const [empty, setEmpty] = useState(true);

  // Match the backing store to the displayed size (and pixel ratio) so strokes are crisp and land under the pointer.
  useEffect(() => {
    const c = canvas.current!;
    const ratio = window.devicePixelRatio || 1;
    const { width, height } = c.getBoundingClientRect();
    c.width = Math.round(width * ratio);
    c.height = Math.round(height * ratio);
    const ctx = c.getContext("2d")!;
    ctx.scale(ratio, ratio);
    ctx.lineWidth = 2.2;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = "#111827";
  }, []);

  const point = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    return [e.clientX - r.left, e.clientY - r.top] as const;
  };

  function clear() {
    const c = canvas.current!;
    c.getContext("2d")!.clearRect(0, 0, c.width, c.height);
    setEmpty(true);
    onChange(null);
  }

  return (
    <div className="space-y-2">
      <div className="relative">
        <canvas
          ref={canvas}
          role="img"
          aria-labelledby={labelledBy}
          aria-label={labelledBy ? undefined : "Signature box"}
          className="h-40 w-full touch-none rounded-control border border-dashed border-border-strong bg-white"
          onPointerDown={(e) => {
            e.currentTarget.setPointerCapture(e.pointerId);
            drawing.current = true;
            const ctx = e.currentTarget.getContext("2d")!;
            const [x, y] = point(e);
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x + 0.01, y);
            ctx.stroke();
          }}
          onPointerMove={(e) => {
            if (!drawing.current) return;
            const ctx = e.currentTarget.getContext("2d")!;
            const [x, y] = point(e);
            ctx.lineTo(x, y);
            ctx.stroke();
          }}
          onPointerUp={(e) => {
            if (!drawing.current) return;
            drawing.current = false;
            setEmpty(false);
            onChange(e.currentTarget.toDataURL("image/png"));
          }}
          onPointerCancel={() => (drawing.current = false)}
        />
        {empty && (
          <span className="pointer-events-none absolute inset-0 flex items-center justify-center text-sm text-muted-foreground/70">Sign here</span>
        )}
      </div>
      <Button type="button" variant="ghost" size="sm" onClick={clear} disabled={empty}>
        <Eraser /> Clear signature
      </Button>
    </div>
  );
}
