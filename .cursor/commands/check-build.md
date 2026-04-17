# /check-build

Verifica que el build de producción compila sin errores.

## Objective

Asegurar que el proyecto Logr puede compilar correctamente para producción.

## Steps

1. Ejecutar `npx tsc --noEmit` para verificar tipos primero (más rápido).
2. Si hay errores de tipos, listarlos y sugerir correcciones. No continuar.
3. Si los tipos están bien, ejecutar `npm run build`.
4. Si el build falla, analizar los errores:
   - Errores de importación (módulos no encontrados)
   - Errores de server/client boundary (use client faltante)
   - Errores de metadata o generateStaticParams
5. Sugerir correcciones específicas para cada error.

## Output

- Resultado del build (éxito o errores)
- Si hay errores, correcciones sugeridas
- Si éxito, confirmar que está listo para deploy
