# /nuevo-componente

Crea un nuevo componente UI o de módulo siguiendo el sistema de diseño de Logr.

## Objective

Generar un componente completo con tipos, estilos y traducciones.

## Requirements

Pregunta al usuario:
1. ¿Nombre del componente?
2. ¿Es un componente UI base (components/ui/) o de módulo (components/[modulo]/)?
3. ¿Qué funcionalidad tiene? (formulario, tarjeta, lista, modal, etc.)

## Steps

1. Leer la skill `add-ui-component` o `add-dashboard-module` según corresponda.
2. Crear el archivo del componente con el patrón correcto:
   - UI base: `forwardRef` + variantes + `cn()`
   - Módulo: `"use client"` + `useLocale()` + hook de datos
3. Usar los tokens de color del tema de Logr (`globals.css`).
4. Agregar traducciones en `messages/es.ts` y `messages/en.ts` si hay texto visible.
5. Verificar con `npx tsc --noEmit`.

## Output

- Archivo(s) del componente creado(s)
- Traducciones actualizadas si aplica
- Sin errores de TypeScript
