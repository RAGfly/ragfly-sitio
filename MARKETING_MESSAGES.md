Mensajes Marketing — lado del sitio

Fuente: CORP, tabla `mensajes_marketing` (desde 2026-10-26; antes `parametros_generales`, ya
retirado). Contrato del endpoint, idiomas y estados: `docs/operativos/MENSAJES_MARKETING.md` en
RAGfly/ragfly-corp. Cómo se trabaja una campaña y dónde vive cada dato: manual
`comercial/publicidad/README.md` en la carpeta RAGfly de Dropbox. No duplicar esas reglas aquí.

Lo propio del sitio:

- `/start/marketing?utm_content=<código>` (también `/start/memory` y `/start/context`, por avisos
  ya publicados) lee el mensaje en el servidor con `lib/mensajes-marketing.ts`:
  `GET https://ragfly-corp-production.up.railway.app/parametros/mensajes-marketing/<código>?locale=<idioma>`,
  caché de 60 s y tope de 3 s.
- El código acepta letras, dígitos y guiones (≤ 30). El idioma es el del visitante (en, es, pt,
  fr, de); el sitio nunca impone otro.
- Si no hay mensaje (código desconocido, pieza en BORRADOR, traducción incompleta o CORP caído), la
  landing muestra su texto localizado de respaldo.
- Orden del hero con mensaje: título (énfasis en Zalando Sans italic 600 vía next/font), bajada,
  cuerpo en gris, eslogan. Los textos se escapan como React children; el catálogo nunca trae HTML.
- Los `utm_*` del enlace se conservan hasta la solicitud de correo y el alta (atribución en el
  servidor).

Verificación: `tests/mensajes-marketing.test.mjs` (validación del contrato, errores de red, IDs
inválidos) y build de Next.js.
