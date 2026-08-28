# Laxiriir Expert Web

The web application uses TanStack Start, React, TanStack Router, Query and Form,
Tailwind CSS v4, and shadcn/ui. It talks to the Fastify API through
`VITE_API_BASE_URL` and shares contracts and HTTP clients from the monorepo.

## Local development

```bash
pnpm --filter web dev
pnpm --filter web test
pnpm --filter web build
```

## Adding components

To add components to your app, run the following command:

```bash
pnpm --filter web exec shadcn add <component>
```

This generates components under `src/components/ui` using `components.json`.

## Using components

To use the components in your app, import them as follows:

```tsx
import { Button } from "@/components/ui/button";
```
