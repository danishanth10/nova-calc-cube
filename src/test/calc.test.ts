import { describe, expect, it } from "vitest";
import { tryEvaluate } from "@/lib/calc";

const ev = (s: string, a: "deg" | "rad" = "deg") => tryEvaluate(s, a);

describe("calculator engine", () => {
  it.each([
    ["2+5×3", "17"],
    ["(2+5)×3", "21"],
    ["10÷4", "2.5"],
    ["2^3^2", "512"],
    ["−2^2", "-4"],
    ["50%", "0.5"],
    ["5!", "120"],
    ["√(16)+3²".replace("²", "^2"), "13"],
    ["sin(30)", "0.5"],
    ["cos(90)", "0"],
    ["log(1000)", "3"],
    ["ln(e)", "1"],
    ["2π", String(Number((2 * Math.PI).toPrecision(12)))],
    ["(3+4", "7"],
    ["0.1+0.2", "0.3"],
  ])("%s = %s", (expr, out) => {
    expect(ev(expr)).toEqual({ ok: true, value: out });
  });

  it.each(["5÷0", "", "2++", "√(−1)", "tan(90)", "171!", "log(0)", "(-2.5)!", "1.2.3"])(
    "rejects %s",
    (expr) => expect(ev(expr).ok).toBe(false),
  );
});
