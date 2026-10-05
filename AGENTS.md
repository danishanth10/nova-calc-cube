<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Calculator math lives in src/lib/calc.ts as a pure parser with tests in src/test/calc.test.ts — keeps evaluation verifiable and UI-independent.
- App state (expression, history, settings) lives in src/lib/calc-store.tsx and is saved on the device — no backend is needed for history.
