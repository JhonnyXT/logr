# /arrancar

Instala dependencias y lanza el entorno de desarrollo completo de Logr.

## Objective

Verificar que el entorno está listo y arrancar el servidor de desarrollo.

## Steps

1. Verificar que `node_modules/` existe. Si no, ejecutar `npm install`.
2. Verificar que `.env.local` existe y contiene las variables necesarias:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
3. Si `.env.local` no existe, avisar al usuario con la lista de variables requeridas.
4. Ejecutar `npm run dev` para lanzar el servidor de desarrollo.
5. Confirmar que el servidor está corriendo en http://localhost:3000.

## Output

- Servidor de desarrollo corriendo en http://localhost:3000
- Si hay errores de dependencias o variables de entorno, reportarlos claramente
