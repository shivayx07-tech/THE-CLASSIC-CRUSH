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

- Menu, delivery slabs, zones and limits live in the database and are edited from /admin; never hard-code them in UI (spec requirement).
- Pricing rules live in src/lib/pricing.ts and are re-run server-side in placeOrder, so the client cannot set totals.
- Customers order as guests; orders are looked up by tracking token stored on the device.
