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

> [!NOTE]
> `vite.config.ts` is a plain TanStack Start / Vite config — it no longer uses
> `@lovable.dev/vite-tanstack-config`. A Lovable resync may try to reintroduce the
> wrapper and the `vite-tsconfig-paths` dependency; keep the standard config.
