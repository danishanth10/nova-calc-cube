# 3D Calculator App

A phone-first web calculator with 3D glass-style keys, Basic and Scientific modes, calculation history and settings.

## Features
- Correct operator precedence (`2 + 5 × 3 = 17`), brackets, `%`, `+/-`
- Scientific: sin, cos, tan, log, ln, √, x², xʸ, π, e, factorial; degree/radian mode
- Friendly errors (division by zero, invalid input, overflow)
- History (stored on the device): reuse, delete, clear all
- Settings: dark/light theme, haptics, sound, angle mode

## Tech stack
React 19, TanStack Start / Router, Vite 7, Tailwind CSS v4, Vitest. No backend — state is saved in the browser's localStorage.

## Getting started
```sh
bun install      # or npm install
bun run dev      # start dev server
bun run build    # production build
bunx vitest run  # run tests
```

## Structure
- `src/lib/calc.ts` — expression parser/evaluator
- `src/lib/calc-store.tsx` — app state and persistence
- `src/components/calc/` — calculator UI components
- `src/routes/` — pages (calculator, scientific, history, settings)
- `src/test/` — tests
