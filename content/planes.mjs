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
//   - "featuresIniciales" se muestran primero; luego "limites"; luego "features".
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
      '*',
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
      'Pack adicional: +250 Verified Answers por $25',
      'RAGfly Desktop',
      'Agentic Retrieval add-on',
      '**',
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
    featuresIniciales: ['Todo lo de Starter'],
    features: [
      '25.000 Retrievals/mes',
      '1.500 Verified Answers/mes',
      'Pack adicional: +1.500 Verified Answers por $120',
      'Control por Área y BYOK',
      'Agentic Retrieval add-on',
      '***',
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
    featuresIniciales: ['Todo lo de Growth'],
    features: [
      '100.000 Retrievals/mes',
      '5.000 Verified Answers/mes',
      'Pack adicional: +10.000 Verified Answers por $700',
      'BYO base vectorial + BYO LLM',
      'Agentic Retrieval add-on',
      '****',
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
    featuresIniciales: ['Todo lo de Scale'],
    features: [
      'Retrievals custom',
      'Verified Answers custom',
      'BYOK + BYO vectorial/LLM',
      'DPA/SLA',
      'Despliegue dedicado si aplica',
      '*****',
    ],
  },
]

// Nota al pie de la tabla de planes (se traduce con /ragfly-idiomas-sitio).
export const notaPlanes =
  '* Free es POC con límites totales, no un plan productivo.\n** Overage se factura solo cuando el uso supera el cupo incluido del plan.\n*** Control por Área/BYOK queda sujeto a configuración inicial del grupo.\n**** BYO requiere revisión técnica de la base vectorial y del LLM elegido.\n***** Enterprise/Soberano es sales-assisted: contrato anual, DPA/SLA y despliegue dedicado si aplica.'
