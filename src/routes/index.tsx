import { createFileRoute } from "@tanstack/react-router";
import { Calculator } from "@/components/calc/Calculator";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Nova — 3D Calculator" },
      { name: "description", content: "A premium 3D calculator with tactile keys, live results and saved history." },
      { property: "og:title", content: "Nova — 3D Calculator" },
      { property: "og:description", content: "A premium 3D calculator with tactile keys, live results and saved history." },
    ],
  }),
  component: () => <Calculator mode="basic" />,
});
