// ─────────────────────────────────────────────────────────────────────────
// FUENTE ÚNICA DE VERDAD — PLANES DE RAGFLY
// ─────────────────────────────────────────────────────────────────────────
//
// Editas SOLO este archivo (en español). Luego corres:
//
//     npm run build:planes
//
// Eso regenera el bloque "planes" de messages/es.json y los metadatos
// (resaltado + nº de features) que usa la landing. Para traducir a los
// otros idiomas (en/pt/fr/de) corre la skill:  /ragfly-idiomas-sitio
//
// REGLAS:
//   - "nombre" NO se traduce (es nombre comercial / coincide con Paddle).
//   - "precio", "sub", "cta" y cada "feature" SÍ se traducen.
//   - El nº de features de cada plan se calcula solo: agrega o quita líneas
//     libremente, no hay que tocar código.
//   - "resaltado: true" marca el plan recomendado (solo uno).
//   - "limites" se muestran como features al inicio de la tarjeta.
//
// MODELO (jul-2026): planes por Pages, Retrievals y Verified Answers, con
// add-ons explícitos para Pages, Agentic Retrieval y packs de Verified Answers.
// Superficies MCP/REST/CLI/SDK en todos los planes. Margen vive en la
// recuperación/generación verificada (valor); storage/infra a costo.
// Fuente de cifras: la BD (tablas `caracteristicas_plan` + `planes`) — canónica.
// El xlsx comercial y este archivo DERIVAN de ella; ante discrepancia manda la BD.
// ─────────────────────────────────────────────────────────────────────────

export const planes = [
  {
    nombre: 'Free',
    sub: 'POC y evaluación',
    precio: 'USD $0/mes',
    resaltado: false,
    cta: 'Empezar gratis',
    limites: {
      tokens: '500 Pages totales',
      vectores: '1 Entity',
    },
    features: [
      '25 Retrievals/día',
      '50 Verified Answers totales',
      'Playground incluido',
      'Comentarios *',
    ],
  },
  {
    nombre: 'Starter',
    sub: 'Para empezar en producción',
    precio: 'USD $39/mes',
    resaltado: false,
    cta: 'Empezar',
    limites: {
      tokens: '2.000 Pages/mes',
      vectores: '2 Entities',
    },
    features: [
      '5.000 Retrievals/mes',
      '300 Verified Answers/mes',
      'RAGfly Desktop',
      'Agentic Retrieval add-on',
      'Comentarios **',
    ],
  },
  {
    nombre: 'Growth',
    sub: 'Para equipos con control por área',
    precio: 'USD $149/mes',
    resaltado: true,
    cta: 'Empezar',
    limites: {
      tokens: '10.000 Pages/mes',
      vectores: '5 Entities',
    },
    features: [
      'Todo lo de Starter',
      '25.000 Retrievals/mes',
      '1.500 Verified Answers/mes',
      'Control por Área y BYOK',
      'Agentic Retrieval add-on',
      'Comentarios ***',
    ],
  },
  {
    nombre: 'Scale',
    sub: 'Para producción a escala',
    precio: 'USD $590/mes',
    resaltado: false,
    cta: 'Empezar',
    limites: {
      tokens: '40.000 Pages/mes',
      vectores: '15 Entities',
    },
    features: [
      'Todo lo de Growth',
      '100.000 Retrievals/mes',
      '5.000 Verified Answers/mes',
      'BYO base vectorial + BYO LLM',
      'Agentic Retrieval add-on',
      'Comentarios ****',
    ],
  },
  {
    nombre: 'Enterprise / Soberano',
    sub: 'Contrato anual y despliegue dedicado',
    precio: 'Custom',
    resaltado: false,
    cta: 'Hablar con nosotros',
    limites: {
      tokens: 'Pages custom',
      vectores: 'Entities custom',
    },
    features: [
      'Todo lo de Scale',
      'Retrievals custom',
      'Verified Answers custom',
      'DPA/SLA',
      'Despliegue dedicado si aplica',
      'Comentarios *****',
    ],
  },
]

// Nota al pie de la tabla de planes (se traduce con /ragfly-idiomas-sitio).
export const notaPlanes =
  'Add-ons: Pages Fast $0,02/page · Pages Hi-res/OCR $0,05/page · Agentic Retrieval $1,15/operation o pack 100 ops = $115. Packs de Verified Answers: Starter +250 por $25 · Growth +1.500 por $120 · Scale +10.000 por $700.\n* Free es POC con límites totales, no un plan productivo.\n** Starter incluye RAGfly Desktop y pack adicional de +250 Verified Answers por $25.\n*** Growth agrega Control por Área/BYOK y pack adicional de +1.500 Verified Answers por $120.\n**** Scale agrega BYO vectorial/LLM y pack adicional de +10.000 Verified Answers por $700.\n***** Enterprise/Soberano es sales-assisted: contrato anual, DPA/SLA y despliegue dedicado si aplica.'
