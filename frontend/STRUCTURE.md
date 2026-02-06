# Frontend Structure (Next.js App Router)

This structure keeps route code inside `app/` and all shared, reusable code outside it.

## Top-level
- `app/` Route segments, layouts, pages, and route-level assets.
- `components/` Reusable components shared across routes.
- `components/ui/` Design-system primitives (buttons, inputs, dialogs).
- `components/layout/` Layout building blocks (header, footer, nav).
- `components/icons/` SVG/icon components.
- `lib/` Utilities and platform code.
- `lib/api/` API client setup and request helpers.
- `lib/config/` Runtime config, env parsing, feature flags.
- `lib/utils/` General utilities.
- `lib/seo/` Metadata helpers.
- `hooks/` Reusable React hooks.
- `styles/` Global and shared styles.
- `types/` Shared TypeScript types.
- `constants/` App-wide constants.
- `services/` Business/domain services.
- `public/` Static assets served at `/`.

## Route groups
- `app/(routes)/` Main site routes (marketing/public pages).
- `app/(auth)/` Authentication routes.
- `app/(dashboard)/` Authenticated app routes.

## Route-local folders
Use these inside a route segment when code should stay local to that route.
- `_components/` Route-specific components.
- `_lib/` Route-specific utilities.
- `_data/` Route-specific data or mocks.
- `_actions/` Route-specific server actions.

## Notes
- Keep `app/layout.tsx`, `app/page.tsx`, and `app/globals.css` at the root of `app/`.
- Use route groups `(…)` to keep URLs clean while organizing code by area.
