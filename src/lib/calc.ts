// Pure expression evaluator: recursive descent with correct precedence.
export class CalcError extends Error {}

export type AngleMode = "deg" | "rad";

type Tok =
  | { t: "num"; v: number }
  | { t: "op"; v: string }
  | { t: "fn"; v: string }
  | { t: "lp" }
  | { t: "rp" };

const FNS = ["sin", "cos", "tan", "log", "ln", "√"];

function tokenize(src: string): Tok[] {
  const s = src.replace(/\s+/g, "");
  const out: Tok[] = [];
  let i = 0;
  while (i < s.length) {
    const c = s.charAt(i);
    if (/[0-9.]/.test(c)) {
      let j = i;
      while (j < s.length && /[0-9.]/.test(s.charAt(j))) j++;
      // scientific notation from formatted results, e.g. 1.2e+21
      if (s[j] === "e" && /[+\-]?\d/.test(s.slice(j + 1, j + 3))) {
        j++;
        if (s[j] === "+" || s[j] === "-") j++;
        while (j < s.length && /\d/.test(s.charAt(j))) j++;
      }
      const raw = s.slice(i, j);
      if ((raw.match(/\./g) || []).length > 1 && !raw.includes("e")) throw new CalcError("Invalid number");
      const v = Number(raw);
      if (Number.isNaN(v)) throw new CalcError("Invalid number");
      out.push({ t: "num", v });
      i = j;
      continue;
    }
    const fn = FNS.find((f) => s.startsWith(f, i));
    if (fn) {
      out.push({ t: "fn", v: fn });
      i += fn.length;
      continue;
    }
    if (c === "π") { out.push({ t: "num", v: Math.PI }); i++; continue; }
    if (c === "e") { out.push({ t: "num", v: Math.E }); i++; continue; }
    if (c === "(") { out.push({ t: "lp" }); i++; continue; }
    if (c === ")") { out.push({ t: "rp" }); i++; continue; }
    const map: Record<string, string> = { "+": "+", "-": "-", "−": "-", "×": "*", "*": "*", "÷": "/", "/": "/", "^": "^", "%": "%", "!": "!" };
    const mapped = map[c];
    if (mapped) { out.push({ t: "op", v: mapped }); i++; continue; }
    throw new CalcError(`Unexpected "${c}"`);
  }
  return out;
}

function factorial(n: number): number {
  if (n < 0 || !Number.isInteger(n)) throw new CalcError("Factorial needs a whole number ≥ 0");
  if (n > 170) throw new CalcError("Number too large");
  let r = 1;
  for (let k = 2; k <= n; k++) r *= k;
  return r;
}

export function evaluate(expr: string, angle: AngleMode = "deg"): number {
  if (!expr.trim()) throw new CalcError("Enter an expression");
  // auto-close open brackets
  const open = (expr.match(/\(/g) || []).length - (expr.match(/\)/g) || []).length;
  if (open < 0) throw new CalcError("Unbalanced brackets");
  const toks = tokenize(expr + ")".repeat(open));
  let p = 0;
  const peek = () => toks[p];
  const toRad = (x: number) => (angle === "deg" ? (x * Math.PI) / 180 : x);

  const startsPrimary = (t?: Tok) => !!t && (t.t === "num" || t.t === "fn" || t.t === "lp");

  function parseExpr(): number {
    let v = parseTerm();
    for (;;) {
      const t = peek();
      if (t?.t === "op" && (t.v === "+" || t.v === "-")) {
        p++;
        const r = parseTerm();
        v = t.v === "+" ? v + r : v - r;
      } else return v;
    }
  }
  function parseTerm(): number {
    let v = parseUnary();
    for (;;) {
      const t = peek();
      if (t?.t === "op" && (t.v === "*" || t.v === "/")) {
        p++;
        const r = parseUnary();
        if (t.v === "/") {
          if (r === 0) throw new CalcError("Cannot divide by zero");
          v = v / r;
        } else v = v * r;
      } else if (startsPrimary(t)) {
        v = v * parseUnary(); // implicit multiplication: 2π, 3(4)
      } else return v;
    }
  }
  function parseUnary(): number {
    const t = peek();
    if (t?.t === "op" && (t.v === "-" || t.v === "+")) {
      p++;
      const v = parseUnary();
      return t.v === "-" ? -v : v;
    }
    return parsePower();
  }
  function parsePower(): number {
    const base = parsePostfix();
    const t = peek();
    if (t?.t === "op" && t.v === "^") {
      p++;
      const exp = parseUnary(); // right associative
      const r = Math.pow(base, exp);
      if (Number.isNaN(r)) throw new CalcError("Invalid power");
      return r;
    }
    return base;
  }
  function parsePostfix(): number {
    let v = parsePrimary();
    for (;;) {
      const t = peek();
      if (t?.t === "op" && t.v === "!") { p++; v = factorial(v); }
      else if (t?.t === "op" && t.v === "%") { p++; v = v / 100; }
      else return v;
    }
  }
  function parsePrimary(): number {
    const t = toks[p++];
    if (!t) throw new CalcError("Incomplete expression");
    if (t.t === "num") return t.v;
    if (t.t === "lp") {
      const v = parseExpr();
      if (toks[p++]?.t !== "rp") throw new CalcError("Unbalanced brackets");
      return v;
    }
    if (t.t === "fn") {
      const x = parsePower();
      switch (t.v) {
        case "sin": return clean(Math.sin(toRad(x)));
        case "cos": return clean(Math.cos(toRad(x)));
        case "tan": {
          if (Math.abs(clean(Math.cos(toRad(x)))) === 0) throw new CalcError("tan is undefined here");
          return clean(Math.tan(toRad(x)));
        }
        case "log": if (x <= 0) throw new CalcError("log needs a positive number"); return Math.log10(x);
        case "ln": if (x <= 0) throw new CalcError("ln needs a positive number"); return Math.log(x);
        case "√": if (x < 0) throw new CalcError("Can't take √ of a negative"); return Math.sqrt(x);
      }
    }
    throw new CalcError("Invalid expression");
  }

  const v = parseExpr();
  if (p < toks.length) throw new CalcError("Invalid expression");
  if (!Number.isFinite(v)) throw new CalcError("Number too large");
  return v;
}

function clean(x: number) {
  return Math.abs(x) < 1e-12 ? 0 : x;
}

export function formatNumber(n: number): string {
  if (Object.is(n, -0) || n === 0) return "0";
  const abs = Math.abs(n);
  if (abs >= 1e15 || abs < 1e-9) return n.toExponential(8).replace(/\.?0+e/, "e");
  return String(Number(n.toPrecision(12)));
}

export function tryEvaluate(expr: string, angle: AngleMode) {
  try {
    return { ok: true as const, value: formatNumber(evaluate(expr, angle)) };
  } catch (e) {
    return { ok: false as const, error: e instanceof CalcError ? e.message : "Invalid expression" };
  }
}
