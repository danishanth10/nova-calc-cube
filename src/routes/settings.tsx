import { createFileRoute } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { Switch } from "@/components/ui/switch";
import { useCalc } from "@/lib/calc-store";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — Nova Calculator" },
      { name: "description", content: "Theme, haptics, sound and history preferences for Nova Calculator." },
      { property: "og:title", content: "Settings — Nova Calculator" },
      { property: "og:description", content: "Theme, haptics, sound and history preferences for Nova Calculator." },
    ],
  }),
  component: SettingsPage,
});

function Row({ title, hint, children }: { title: string; hint?: string; children: ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 py-3.5">
      <div>
        <div className="font-medium">{title}</div>
        {hint && <div className="text-xs text-muted-foreground">{hint}</div>}
      </div>
      {children}
    </div>
  );
}

function SettingsPage() {
  const { settings, updateSettings, clearHistory, history } = useCalc();
  return (
    <div className="glass flex flex-1 flex-col gap-4 rounded-[2rem] p-4">
      <h1 className="text-2xl font-semibold">Settings</h1>
      <section className="display-screen divide-y divide-border rounded-2xl px-4">
        <Row title="Dark theme"><Switch checked={settings.theme === "dark"} onCheckedChange={(v) => updateSettings({ theme: v ? "dark" : "light" })} /></Row>
        <Row title="Haptic feedback" hint="Vibrates on supported phones"><Switch checked={settings.haptics} onCheckedChange={(v) => updateSettings({ haptics: v })} /></Row>
        <Row title="Key sounds"><Switch checked={settings.sound} onCheckedChange={(v) => updateSettings({ sound: v })} /></Row>
        <Row title="Angles in degrees" hint="Off uses radians"><Switch checked={settings.angle === "deg"} onCheckedChange={(v) => updateSettings({ angle: v ? "deg" : "rad" })} /></Row>
      </section>
      <section className="display-screen rounded-2xl px-4">
        <Row title="Calculation history" hint={`${history.length} saved`}>
          <button disabled={!history.length} onClick={() => { if (confirm("Clear all history?")) clearHistory(); }} className="key key-clr h-9 px-4 text-sm disabled:opacity-40">Clear</button>
        </Row>
      </section>
      <section className="display-screen rounded-2xl p-4 text-sm">
        <div className="font-medium">About Nova</div>
        <p className="mt-1 text-muted-foreground">A tactile 3D calculator with basic and scientific modes and correct order of operations.</p>
        <div className="mt-3 font-mono text-xs text-muted-foreground">Version 1.0.0</div>
      </section>
    </div>
  );
}
