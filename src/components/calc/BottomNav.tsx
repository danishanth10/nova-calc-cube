import { Link } from "@tanstack/react-router";
import { Calculator, FlaskConical, History, Settings } from "lucide-react";

const ITEMS = [
  { to: "/", label: "Calculator", Icon: Calculator },
  { to: "/scientific", label: "Scientific", Icon: FlaskConical },
  { to: "/history", label: "History", Icon: History },
  { to: "/settings", label: "Settings", Icon: Settings },
] as const;

export function BottomNav() {
  return (
    <nav className="glass sticky bottom-3 z-10 mx-auto mt-3 grid w-full grid-cols-4 rounded-3xl p-1.5">
      {ITEMS.map(({ to, label, Icon }) => (
        <Link
          key={to}
          to={to}
          activeOptions={{ exact: true }}
          className="flex flex-col items-center gap-0.5 rounded-2xl py-2 text-[11px] text-muted-foreground transition-colors"
          activeProps={{ className: "bg-primary/15 text-primary" }}
        >
          <Icon className="size-5" />
          {label}
        </Link>
      ))}
    </nav>
  );
}
