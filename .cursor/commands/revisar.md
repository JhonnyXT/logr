# /revisar

Ejecuta lint y verificación de tipos y reporta todos los errores encontrados.

## Objective

Verificar la calidad del código del proyecto Logr ejecutando ESLint y TypeScript.

## Steps

1. Ejecutar `npx tsc --noEmit` para verificar tipos TypeScript.
2. Ejecutar `npm run lint` para verificar reglas ESLint.
3. Recopilar todos los errores.
4. Clasificar por categoría:
   - Errores de tipos (TS)
   - Errores de lint (ESLint)
   - Warnings
5. Para cada error, sugerir la corrección específica.

## Output

- Lista de errores agrupados por archivo
- Sugerencias de corrección para cada error
- Si no hay errores, confirmar que el código está limpio
