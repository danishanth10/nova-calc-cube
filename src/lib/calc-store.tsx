import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { AngleMode } from "./calc";

export type HistoryItem = { id: string; expression: string; result: string; createdAt: string };
export type Settings = { theme: "dark" | "light"; haptics: boolean; sound: boolean; angle: AngleMode };

const DEFAULTS: Settings = { theme: "dark", haptics: true, sound: true, angle: "deg" };
const HKEY = "nova-calc-history";
const SKEY = "nova-calc-settings";

type Ctx = {
  expression: string;
  setExpression: (s: string) => void;
  history: HistoryItem[];
  addHistory: (expression: string, result: string) => void;
  removeHistory: (id: string) => void;
  clearHistory: () => void;
  settings: Settings;
  updateSettings: (p: Partial<Settings>) => void;
  feedback: () => void;
};

const CalcCtx = createContext<Ctx | null>(null);

let audio: AudioContext | null = null;
function click() {
  try {
    audio ??= new AudioContext();
    const o = audio.createOscillator();
    const g = audio.createGain();
    o.frequency.value = 520;
    o.type = "triangle";
    g.gain.setValueAtTime(0.05, audio.currentTime);
    g.gain.exponentialRampToValueAtTime(0.0001, audio.currentTime + 0.06);
    o.connect(g).connect(audio.destination);
    o.start();
    o.stop(audio.currentTime + 0.07);
  } catch {
    /* audio unavailable */
  }
}

export function CalcProvider({ children }: { children: ReactNode }) {
  const [expression, setExpression] = useState("");
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [settings, setSettings] = useState<Settings>(DEFAULTS);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const h = localStorage.getItem(HKEY);
      const s = localStorage.getItem(SKEY);
      if (h) setHistory(JSON.parse(h));
      if (s) setSettings({ ...DEFAULTS, ...JSON.parse(s) });
    } catch {
      /* corrupted storage: start fresh */
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) localStorage.setItem(HKEY, JSON.stringify(history));
  }, [history, loaded]);
  useEffect(() => {
    if (loaded) localStorage.setItem(SKEY, JSON.stringify(settings));
    document.documentElement.classList.toggle("dark", settings.theme === "dark");
  }, [settings, loaded]);

  const addHistory = useCallback((expression: string, result: string) => {
    setHistory((h) =>
      [{ id: `${Date.now()}-${h.length}`, expression, result, createdAt: new Date().toISOString() }, ...h].slice(0, 200),
    );
  }, []);
  const removeHistory = useCallback((id: string) => setHistory((h) => h.filter((x) => x.id !== id)), []);
  const clearHistory = useCallback(() => setHistory([]), []);
  const updateSettings = useCallback((p: Partial<Settings>) => setSettings((s) => ({ ...s, ...p })), []);
  const feedback = useCallback(() => {
    if (settings.haptics && "vibrate" in navigator) navigator.vibrate?.(8);
    if (settings.sound) click();
  }, [settings.haptics, settings.sound]);

  const value = useMemo(
    () => ({ expression, setExpression, history, addHistory, removeHistory, clearHistory, settings, updateSettings, feedback }),
    [expression, history, addHistory, removeHistory, clearHistory, settings, updateSettings, feedback],
  );
  return <CalcCtx.Provider value={value}>{children}</CalcCtx.Provider>;
}

export function useCalc() {
  const c = useContext(CalcCtx);
  if (!c) throw new Error("useCalc outside CalcProvider");
  return c;
}
