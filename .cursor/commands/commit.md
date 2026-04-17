# /commit

Prepara y crea un commit siguiendo las convenciones del proyecto Logr.

## Objective

Crear un commit limpio con mensaje descriptivo en el formato del proyecto.

## Steps

1. Ejecutar `npx tsc --noEmit` para verificar que no hay errores de tipos.
2. Ejecutar `git status` para ver archivos modificados.
3. Ejecutar `git diff --stat` para ver un resumen de los cambios.
4. Analizar los cambios y proponer un mensaje de commit con formato:
   - `feat: ...` para funcionalidades nuevas
   - `fix: ...` para correcciones de bugs
   - `docs: ...` para documentación
   - `refactor: ...` para refactorizaciones
   - `style: ...` para cambios de estilo/formato
   - `chore: ...` para tareas de mantenimiento
5. Agregar los archivos relevantes con `git add`.
6. Crear el commit con el mensaje propuesto.
7. Verificar con `git status` que el commit fue exitoso.

## Output

- Mensaje de commit creado
- Confirmación de archivos incluidos
- Estado del repositorio después del commit
