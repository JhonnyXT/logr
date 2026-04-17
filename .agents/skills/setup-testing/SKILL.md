---
name: setup-testing
description: |
  Configura Vitest para testing unitario y de componentes en el proyecto Logr.
  El proyecto actualmente no tiene framework de testing. Esta skill instala Vitest,
  configura jsdom, crea primer test basado en funciones reales del proyecto.
  Usar cuando se pida agregar tests, configurar testing, o resolver la deuda técnica de tests.
license: MIT
metadata:
  project: logr
  stack: nextjs-vitest
---

## When to Use
- El usuario pide agregar tests al proyecto
- Se quiere verificar la lógica de gamificación (XP, niveles, rangos)
- Se necesita testing unitario para funciones de utilidad
- Se quiere resolver la deuda técnica de "sin testing"

## Gotchas
- El proyecto usa Next.js 16 con Turbopack — Vitest es más compatible que Jest
- `supabase/functions/` está excluido de tsconfig (usa Deno) — no testear esos archivos
- Las funciones de gamificación (`xp-engine.ts`, `rank-config.ts`) son puras — ideales para tests unitarios
- Los hooks usan Supabase client — necesitarían mocks para testing

## Instructions

### Paso 1 — Instalar dependencias

```bash
npm install -D vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/jest-dom
```

### Paso 2 — Crear `vitest.config.ts` en la raíz

```typescript
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./tests/setup.ts"],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "."),
    },
  },
});
```

### Paso 3 — Crear `tests/setup.ts`

```typescript
import "@testing-library/jest-dom/vitest";
```

### Paso 4 — Agregar script en `package.json`

```json
"scripts": {
  "test": "vitest",
  "test:run": "vitest run"
}
```

### Paso 5 — Crear primer test: `tests/lib/xp-engine.test.ts`

```typescript
import { describe, it, expect } from "vitest";
import { xpForLevel, levelFromXp, xpProgress } from "@/lib/gamification/xp-engine";

describe("xpForLevel", () => {
  it("level 1 returns 0 XP", () => {
    expect(xpForLevel(1)).toBe(0);
  });

  it("level 2 returns positive XP", () => {
    expect(xpForLevel(2)).toBeGreaterThan(0);
  });

  it("higher levels require more XP", () => {
    expect(xpForLevel(10)).toBeGreaterThan(xpForLevel(5));
  });
});

describe("levelFromXp", () => {
  it("0 XP is level 1", () => {
    expect(levelFromXp(0)).toBe(1);
  });

  it("negative XP is level 1", () => {
    expect(levelFromXp(-100)).toBe(1);
  });
});

describe("xpProgress", () => {
  it("returns correct structure", () => {
    const result = xpProgress(500);
    expect(result).toHaveProperty("currentLevel");
    expect(result).toHaveProperty("xpInLevel");
    expect(result).toHaveProperty("xpNeeded");
    expect(result).toHaveProperty("percent");
    expect(result.xpInLevel).toBeGreaterThanOrEqual(0);
  });
});
```

### Paso 6 — Crear segundo test: `tests/lib/rank-config.test.ts`

```typescript
import { describe, it, expect } from "vitest";
import { getRankForLevel, getRankName, RANK_TIERS } from "@/lib/gamification/rank-config";

describe("getRankForLevel", () => {
  it("level 1 is Novato", () => {
    expect(getRankName(1)).toBe("Novato");
  });

  it("level 99 is Apex", () => {
    expect(getRankName(99)).toBe("Apex");
  });

  it("all levels have a rank", () => {
    for (let i = 1; i <= 100; i++) {
      const rank = getRankForLevel(i);
      expect(rank.name).toBeTruthy();
      expect(rank.color).toMatch(/^#/);
    }
  });
});
```

### Verificación

```bash
npm run test:run
# Debería mostrar todos los tests pasando
```
