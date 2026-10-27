# Home documentos primero — Implementation Plan

**Goal:** Implementar la tarea de Víctor del 27-oct-2026: documentos → prueba en chat → agentes, conservando el diseño del sitio.

**Architecture:** Reutilizar los componentes de la home y sus tokens; nuevo componente `ComoFuncionaSection`, acordeón nativo para precisión y bloques técnicos dentro de desarrolladores. Textos en next-intl; precios y cupos siguen en el catálogo existente.

**Tech Stack:** Next.js 16, React 19, next-intl, Tailwind CSS.

## Restricciones

- Rama `home/documentos-primero` desde `github/main`; entregar preview Vercel; no publicar en main.
- No modificar `app/start`, `components/apertura`, `content/apertura.ts`, precios, cupos ni catálogo de planes.
- ES y EN literales según la tarea; mantener claves disponibles en PT/FR/DE para que los componentes compartidos sigan funcionando.
- Desktop incluido desde Free; corregir copy en todas las superficies del sitio sin modificar producto/BD.
- Ante la contradicción entre el título técnico que abre por MCP y la regla global que lo prohíbe, priorizar la regla global: el título empieza por el uso y nombra las interfaces después.

## Tareas

- [x] Actualizar `messages/{es,en,pt,fr,de}.json`: hero, navegación, pasos, privacidad, FAQ, cierre, metadata y Desktop. Conservar FAQ no reescritas y ordenar sus 16 entradas.
- [x] Actualizar `app/page.tsx` y `components/sections/*`: insertar tres pasos, mover perfiles/configuración, BYOK/lock-in y aplicar acordeón; conservar Preflight y citas.
- [x] Alinear Desktop en `/download`, documentos públicos y sus fuentes. Actualizar OG/Twitter con texto e imagen localizada; preservar contratos y precios.
- [x] Ejecutar lint, TypeScript, build y verificación de navegador en ES/EN a 390 px y escritorio; comprobar anclas, FAQ, metadata, ausencia de textos retirados y diff de rutas protegidas.

## Entrega

Commit y push solo de la rama; consultar deployment/check de GitHub/Vercel y entregar URL de preview con informe corto.
