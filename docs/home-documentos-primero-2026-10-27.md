# Home: documentos primero

Implementación de la tarea de Víctor del 27-oct-2026, sobre `github/main` (`122f09e`) en la rama `home/documentos-primero`.

## Cambios

- Hero centrado en documentos; tres pasos: carpetas → prueba en chat → agentes.
- Nuevo orden de secciones, navegación y pie; citas visibles y mecanismo técnico en acordeón nativo.
- BYOK y Sin lock-in dentro de desarrolladores; FAQ reordenada y cuatro primeras respuestas reescritas en ES/EN.
- Metadata e imágenes sociales localizadas. Las URLs de las imágenes incluyen el idioma para que no dependan de cookies del crawler.
- Desktop incluido desde Free en copy de los cinco idiomas, descarga, legales, catálogo para agentes y llms. Los generados salen de su script; los cambios legales solo corrigen la disponibilidad de Desktop.
- Ilustraciones con rótulos en inglés y ajustes de contraste y menú para móvil/tablet; mismos tokens y composición visual.

La tarea contiene una contradicción: pide un título técnico que empieza por MCP y prohíbe hacerlo en toda la home. Se priorizó la regla global: el título empieza por el uso y cita Claude/ChatGPT antes de MCP. No quedan títulos que abran por MCP.

## Conservado

Sin cambios en precios, cupos, planes operativos, `/start/*`, sus componentes ni `content/apertura.ts`. Sin cambios de producto ni BD. El archivo heredado `content/planes.mjs` solo corrige la mención de Desktop; no se ejecuta su generador ni se cambian sus límites.

El catálogo público de PROD consultado el 27-oct-2026 confirma `FREE.ENTIDADES.cantidad_incluida = 5` y `RAGFLY_DESKTOP.incluido = true` para los seis planes. No queda una decisión pendiente de habilitación de Desktop en ese catálogo.

## Validación

- `npm run lint`, `npx tsc --noEmit`, `npm run build`: pasan. El build conserva dos avisos de métricas de fallback de fuentes Zalando.
- Tests existentes: 8/8 pasan.
- Playwright contra build de producción: ES/EN a 390, 1024 y 1440 px; sin desborde ni errores de JavaScript. Menú adaptable, anclas válidas, orden de secciones, 16 FAQ, BYOK/lock-in, acordeón de precisión y metadata correctos.
- OG y Twitter: PNG 200 en ES/EN; `/start/context`, `/start/memory`, `/download`, `/build/mcp`: 200.
- Paridad de claves en cinco idiomas y smoke PT/FR/DE sin mensajes faltantes.
- Verificación de diff: precios, límites, dependencias y rutas de apertura intactos. La publicación se limita al preview de la rama; no se promueve a main.
