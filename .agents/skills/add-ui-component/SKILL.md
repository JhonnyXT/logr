---
name: add-ui-component
description: |
  Crea un nuevo componente UI base en components/ui/ siguiendo el sistema de diseño de Logr.
  Patrón forwardRef con variantes, cn() para clases, tokens de color del proyecto.
  Usar cuando se pida crear un nuevo componente reutilizable como input, select, textarea,
  tooltip, dropdown, tabs, avatar o similar.
license: MIT
metadata:
  project: logr
  stack: react-tailwind
---

## When to Use
- El usuario pide un componente UI reutilizable nuevo
- Se necesita un elemento de interfaz que no existe en `components/ui/`
- Se requiere un wrapper tipado sobre un elemento HTML nativo

## Gotchas
- El proyecto NO usa shadcn/ui — los componentes son propios y simples
- Usar SIEMPRE `cn()` de `@/lib/utils/cn` — nunca concatenar strings de clases manualmente
- Tokens de color del tema en `@/app/globals.css`: `background`, `surface`, `foreground`, `muted`, `border`, `accent`
- Solo agregar `"use client"` si el componente usa hooks o event handlers
- Exports nombrados (`export { Component }`) — no default exports
- Marcar con `forwardRef` y `displayName`

## Instructions

### Paso 1 — Crear archivo en `components/ui/[nombre].tsx`

Usar el patrón de `@/components/ui/button.tsx` como base:

```tsx
"use client";

import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

type NombreVariant = "default" | "outline";

interface NombreProps extends HTMLAttributes<HTMLDivElement> {
  variant?: NombreVariant;
}

const variantStyles: Record<NombreVariant, string> = {
  default: "bg-surface text-foreground border-border",
  outline: "bg-transparent border-border text-muted",
};

const Nombre = forwardRef<HTMLDivElement, NombreProps>(
  ({ className, variant = "default", ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "rounded-lg border text-sm",
        variantStyles[variant],
        className
      )}
      {...props}
    />
  )
);
Nombre.displayName = "Nombre";

export { Nombre, type NombreProps, type NombreVariant };
```

### Paso 2 — Revisar consistencia

- Bordes: `border border-border` (1px del color del tema)
- Border radius: `rounded-lg` (inputs), `rounded-xl` (cards)
- Focus visible: `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50`
- Disabled: `disabled:pointer-events-none disabled:opacity-50`
- Transiciones: `transition-colors duration-150`

### Verificación
1. `npx tsc --noEmit` sin errores
2. Importar en un componente existente y verificar que renderiza correctamente
