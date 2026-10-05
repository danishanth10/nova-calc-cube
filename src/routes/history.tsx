import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Trash2, History as HistoryIcon } from "lucide-react";
import { useCalc } from "@/lib/calc-store";

export const Route = createFileRoute("/history")({
  head: () => ({
    meta: [
      { title: "History — Nova Calculator" },
      { name: "description", content: "Review, reuse and manage your past calculations." },
      { property: "og:title", content: "History — Nova Calculator" },
      { property: "og:description", content: "Review, reuse and manage your past calculations." },
    ],
  }),
  component: HistoryPage,
});

function HistoryPage() {
  const { history, removeHistory, clearHistory, setExpression, feedback } = useCalc();
  const navigate = useNavigate();

  return (
    <div className="glass flex flex-1 flex-col rounded-[2rem] p-4">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">History</h1>
        {history.length > 0 && (
          <button
            onClick={() => { if (confirm("Clear all history?")) clearHistory(); }}
            className="key key-clr h-9 px-4 text-sm"
          >
            Clear all
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-3 text-muted-foreground">
          <HistoryIcon className="size-10 opacity-50" />
          <p>No calculations yet</p>
        </div>
      ) : (
        <ul className="flex flex-col gap-3">
          {history.map((h) => (
            <li key={h.id} className="fade-up display-screen flex items-center gap-2 rounded-2xl p-3">
              <button
                className="min-w-0 flex-1 text-right"
                onClick={() => { feedback(); setExpression(h.expression); navigate({ to: "/" }); }}
                aria-label={`Reuse ${h.expression}`}
              >
                <div className="truncate font-mono text-sm text-muted-foreground">{h.expression}</div>
                <div className="truncate font-mono text-2xl">= {h.result}</div>
                <div className="text-[11px] text-muted-foreground">{new Date(h.createdAt).toLocaleString()}</div>
              </button>
              <button onClick={() => removeHistory(h.id)} aria-label="Delete calculation" className="rounded-full p-2 text-muted-foreground transition-colors hover:text-destructive">
                <Trash2 className="size-4" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
