# Repository Guidelines

## Project Structure & Module Organization

This is a Next.js App Router project. Application routes live in `src/app`, grouped by route segments such as `(auth)` and `(dashboard)`. Feature-specific code belongs in `src/features/<feature>`, with local `components`, `hooks`, `schemas`, `services`, and `types` files where needed. Shared UI primitives are in `src/components/ui`, shared reusable components in `src/components/shared`, layout components in `src/components/layout`, global contexts in `src/context`, Zustand stores in `src/store`, and common helpers/types in `src/lib`. Static assets belong in `public`.

Use the `@/*` TypeScript path alias for imports from `src`, for example `@/features/spaces/components/SpacesPageClient`.

## Build, Test, and Development Commands

- `npm run dev`: starts the local Next.js development server at `http://localhost:3000`.
- `npm run build`: creates a production build and validates Next.js compile-time checks.
- `npm run start`: serves the production build locally after `npm run build`.
- `npm run lint`: runs ESLint using Next.js core web vitals and TypeScript rules.

Install dependencies with `npm install`; keep `package-lock.json` committed when dependencies change.

## Coding Style & Naming Conventions

Write TypeScript and React components in `.ts` and `.tsx` files. Keep components PascalCase, hooks camelCase with a `use` prefix, and feature folders lowercase. Prefer colocating feature code under `src/features` instead of adding broad shared abstractions too early.

Follow the existing shadcn/Radix component style. Use `cn` from `@/lib/utils` for conditional class names, lucide icons where icons are needed, and Tailwind CSS classes defined through `src/app/globals.css`. ESLint is the source of truth for formatting and code-quality checks.

## Testing Guidelines

No test framework or test scripts are currently configured. Until one is added, verify changes with `npm run lint` and `npm run build`, and manually exercise affected routes in the dev server. When adding tests, place them near the code they cover using names such as `Component.test.tsx` or `<feature>.test.ts`.

## Commit & Pull Request Guidelines

Recent commits use short, imperative, lowercase summaries, for example `update dependencies` and `refactor for sidebar,layout and add breadcrumb`. Keep commits focused on one concern.

Pull requests should include a concise description, affected routes or features, verification commands run, and screenshots or recordings for UI changes. Link related issues when available and call out any schema, dependency, or configuration changes.

## Security & Configuration Tips

Do not commit secrets or environment-specific values. Keep generated folders such as `.next` and `node_modules` out of commits. Review changes to `next.config.ts`, `eslint.config.mjs`, `tsconfig.json`, and `components.json` carefully because they affect the whole app.
