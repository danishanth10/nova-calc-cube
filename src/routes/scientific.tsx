import { createFileRoute } from "@tanstack/react-router";
import { Calculator } from "@/components/calc/Calculator";

export const Route = createFileRoute("/scientific")({
  head: () => ({
    meta: [
      { title: "Scientific Mode — Nova Calculator" },
      { name: "description", content: "Trigonometry, logarithms, powers, roots and factorials on tactile 3D keys." },
      { property: "og:title", content: "Scientific Mode — Nova Calculator" },
      { property: "og:description", content: "Trigonometry, logarithms, powers, roots and factorials on tactile 3D keys." },
    ],
  }),
  component: () => <Calculator mode="scientific" />,
});
