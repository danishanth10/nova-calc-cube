import { useCallback, useEffect, useMemo, useRef, useState, type PointerEvent, type TouchEvent } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Delete } from "lucide-react";
import { Key, type KeyVariant } from "./Key";
import { useCalc } from "@/lib/calc-store";
import { tryEvaluate } from "@/lib/calc";
import { cn } from "@/lib/utils";

type KeyDef = { label: string; insert?: string; action?: string; variant?: KeyVariant; aria?: string };

const BASIC: KeyDef[] = [
  { label: "AC", action: "clear", variant: "clr", aria: "Clear" },
  { label: "⌫", action: "back", variant: "fn", aria: "Delete" },
  { label: "%", insert: "%", variant: "fn" },
  { label: "÷", insert: "÷", variant: "op", aria: "Divide" },
  { label: "7" }, { label: "8" }, { label: "9" },
  { label: "×", insert: "×", variant: "op", aria: "Multiply" },
  { label: "4" }, { label: "5" }, { label: "6" },
  { label: "−", insert: "−", variant: "op", aria: "Subtract" },
  { label: "1" }, { label: "2" }, { label: "3" },
  { label: "+", insert: "+", variant: "op", aria: "Add" },
  { label: "+/−", action: "negate", variant: "fn", aria: "Toggle sign" },
  { label: "0" }, { label: "." , aria: "Decimal point" },
  { label: "=", action: "equals", variant: "eq", aria: "Equals" },
];

const SCI: KeyDef[] = [
  { label: "sin", insert: "sin(" }, { label: "cos", insert: "cos(" }, { label: "tan", insert: "tan(" },
  { label: "(", insert: "(" }, { label: ")", insert: ")" },
  { label: "log", insert: "log(" }, { label: "ln", insert: "ln(" }, { label: "√", insert: "√(", aria: "Square root" },
  { label: "x²", insert: "^2", aria: "Square" }, { label: "xʸ", insert: "^", aria: "Power" },
  { label: "π", insert: "π", aria: "Pi" }, { label: "e", insert: "e", aria: "Euler's number" },
  { label: "x!", insert: "!", aria: "Factorial" }, { label: "Ans", action: "ans", aria: "Last answer" },
  { label: "DEG", action: "angle", aria: "Toggle degrees or radians" },
];

const BIN_OPS = ["+", "−", "×", "÷", "^"];

export function Calculator({ mode }: { mode: "basic" | "scientific" }) {
  const { expression, setExpression, addHistory, history, settings, updateSettings, feedback } = useCalc();
  const [justEvaluated, setJustEvaluated] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const scrollRef = useRef<HTMLDivElement>(null);
  const touchX = useRef<number | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    scrollRef.current?.scrollTo({ left: scrollRef.current.scrollWidth, behavior: "smooth" });
  }, [expression]);

  const preview = useMemo(() => {
    if (!expression || justEvaluated) return null;
    const r = tryEvaluate(expression, settings.angle);
    return r.ok && r.value !== expression ? r.value : null;
  }, [expression, justEvaluated, settings.angle]);

  const press = useCallback(
    (k: KeyDef) => {
      feedback();
      setError(null);
      const ins = k.insert ?? (k.action ? undefined : k.label);
      const e = expression;
      if (ins !== undefined) {
        const isBin = BIN_OPS.includes(ins);
        const isPostfix = ins === "%" || ins === "!" || ins === "^2";
        let base = e;
        if (justEvaluated && !isBin && !isPostfix) base = ""; // fresh number after "="
        if (e === "Error") base = "";
        const last = base.slice(-1);
        if (isBin && BIN_OPS.includes(last)) {
          // replace operator, but allow "×−" style negatives
          if (ins === "−" && last !== "−" && last !== "+") base = base + ins;
          else base = base.slice(0, -1) + ins;
        } else if (isBin && base === "" && ins !== "−") {
          base = "0" + ins;
        } else if (ins === ".") {
          const num = base.match(/[\d.]*$/)?.[0] ?? "";
          if (num.includes(".")) return;
          base = base + (num === "" ? "0." : ".");
        } else base = base + ins;
        if (base.length > 200) return setError("Expression is too long");
        setExpression(base);
        setJustEvaluated(false);
        return;
      }
      switch (k.action) {
        case "clear":
          setExpression("");
          setJustEvaluated(false);
          return;
        case "back": {
          if (justEvaluated) { setExpression(""); setJustEvaluated(false); return; }
          const m = e.match(/(sin\(|cos\(|tan\(|log\(|ln\(|√\()$/);
          setExpression(m ? e.slice(0, -m[0].length) : e.slice(0, -1));
          return;
        }
        case "negate": {
          const m = e.match(/(\(−)?(\d*\.?\d+(e[+-]?\d+)?)$/);
          if (!m) { setExpression(e + "(−"); setJustEvaluated(false); return; }
          const start = e.length - m[0].length;
          setExpression(e.slice(0, start) + (m[1] ? m[2] : `(−${m[2]}`));
          setJustEvaluated(false);
          return;
        }
        case "ans": {
          const last = history[0]?.result;
          if (!last) return setError("No previous answer yet");
          setExpression((justEvaluated ? "" : e) + last);
          setJustEvaluated(false);
          return;
        }
        case "angle":
          updateSettings({ angle: settings.angle === "deg" ? "rad" : "deg" });
          return;
        case "equals": {
          if (!e) return setError("Enter an expression first");
          if (justEvaluated) return;
          const r = tryEvaluate(e, settings.angle);
          if (!r.ok) return setError(r.error);
          addHistory(e, r.value);
          setExpression(r.value.replace(/^-/, "−"));
          setJustEvaluated(true);
          return;
        }
      }
    },
    [expression, justEvaluated, feedback, setExpression, addHistory, history, settings.angle, updateSettings],
  );

  // keyboard support
  useEffect(() => {
    const map: Record<string, KeyDef> = {
      Enter: { label: "=", action: "equals" }, "=": { label: "=", action: "equals" },
      Backspace: { label: "⌫", action: "back" }, Escape: { label: "AC", action: "clear" },
      "*": { label: "×", insert: "×" }, "/": { label: "÷", insert: "÷" }, "-": { label: "−", insert: "−" },
      "+": { label: "+", insert: "+" }, "%": { label: "%", insert: "%" }, "^": { label: "^", insert: "^" },
      "(": { label: "(", insert: "(" }, ")": { label: ")", insert: ")" }, "!": { label: "!", insert: "!" }, ".": { label: "." },
    };
    const h = (ev: KeyboardEvent) => {
      if (/^\d$/.test(ev.key)) press({ label: ev.key });
      else if (map[ev.key]) { ev.preventDefault(); press(map[ev.key]); }
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [press]);

  const onPointerMove = (ev: PointerEvent<HTMLDivElement>) => {
    if (ev.pointerType !== "mouse") return;
    const r = ev.currentTarget.getBoundingClientRect();
    setTilt({ x: ((ev.clientY - r.top) / r.height - 0.5) * -4, y: ((ev.clientX - r.left) / r.width - 0.5) * 4 });
  };
  const onTouchStart = (ev: TouchEvent) => { touchX.current = ev.touches[0].clientX; };
  const onTouchEnd = (ev: TouchEvent) => {
    if (touchX.current === null) return;
    const dx = ev.changedTouches[0].clientX - touchX.current;
    touchX.current = null;
    if (dx < -70 && mode === "basic") navigate({ to: "/scientific" });
    if (dx > 70 && mode === "scientific") navigate({ to: "/" });
  };

  const sci = mode === "scientific";

  return (
    <div className="tilt-stage flex flex-1 flex-col" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
      <div
        className="tilt-body glass flex flex-1 flex-col gap-4 rounded-[2rem] p-4"
        style={{ transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)` }}
        onPointerMove={onPointerMove}
        onPointerLeave={() => setTilt({ x: 0, y: 0 })}
      >
        <div className="flex items-center justify-between">
          <div className="flex rounded-full bg-muted p-1 text-xs font-medium" role="tablist">
            <Link to="/" className={cn("rounded-full px-3 py-1.5 transition-colors", !sci ? "bg-primary text-primary-foreground" : "text-muted-foreground")}>Basic</Link>
            <Link to="/scientific" className={cn("rounded-full px-3 py-1.5 transition-colors", sci ? "bg-primary text-primary-foreground" : "text-muted-foreground")}>Scientific</Link>
          </div>
          <span className="font-mono text-[11px] tracking-widest text-muted-foreground">{settings.angle.toUpperCase()}</span>
        </div>

        <div className="display-screen flex min-h-36 flex-col justify-end gap-1 rounded-3xl px-5 py-4" style={{ transform: "translateZ(20px)" }}>
          <div ref={scrollRef} className="no-scrollbar overflow-x-auto whitespace-nowrap text-right" aria-live="polite">
            <span className={cn("font-mono transition-all", justEvaluated ? "text-5xl font-medium" : expression.length > 14 ? "text-2xl" : "text-4xl")}>
              {expression || "0"}
            </span>
          </div>
          <div className="h-6 text-right font-mono text-lg">
            {error ? (
              <span className="fade-up text-destructive">{error}</span>
            ) : preview ? (
              <span className="text-muted-foreground">= {preview}</span>
            ) : null}
          </div>
        </div>

        {sci && (
          <div className="fade-up grid grid-cols-5 gap-2.5">
            {SCI.map((k) => (
              <Key key={k.label} variant="fn" ariaLabel={k.aria}
                label={k.action === "angle" ? settings.angle.toUpperCase() : k.label}
                onPress={() => press(k)} className="h-11 text-sm" />
            ))}
          </div>
        )}

        <div className={cn("mt-auto grid grid-cols-4", sci ? "gap-2.5" : "gap-3.5")}>
          {BASIC.map((k) => (
            <Key key={k.label} variant={k.variant} ariaLabel={k.aria}
              label={k.action === "back" ? <Delete className="size-5" /> : k.label}
              onPress={() => press(k)}
              className={cn("text-2xl", sci ? "h-14" : "h-[4.5rem]", k.label === "AC" && "text-lg")} />
          ))}
        </div>
      </div>
    </div>
  );
}
