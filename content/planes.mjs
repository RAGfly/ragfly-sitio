// ─────────────────────────────────────────────────────────────────────────
// ARTEFACTO LEGADO — la fuente viva es GET /pagos/catalogo-publico (BD)
// ─────────────────────────────────────────────────────────────────────────
//
// No participa del runtime ni es el fallback operativo. Se conserva como snapshot
// histórico legible; el fallback vigente vive en PricingSection.tsx. No ejecutar
// build:planes para publicar la oferta.
//
// REGLAS:
//   - "nombre" NO se traduce (es nombre comercial / coincide con Paddle).
//   - "precio", "sub", "cta" y cada "feature" SÍ se traducen.
//   - El nº de features de cada plan se calcula solo: agrega o quita líneas
//     libremente, no hay que tocar código.
//   - "resaltado: true" marca el plan recomendado (solo uno).
//   - "featuresIniciales" se muestran primero; luego "limites"; luego "features".
//
// MODELO (ago-2026): corpus activo, Retrieval simple, RAG Aumentado y RAG
// Agéntico, con adicionales explícitos y sin overage automático.
// Superficies MCP/REST/CLI/SDK en todos los planes. Margen vive en la
// recuperación/generación verificada (valor); storage/infra a costo.
// Fuente de cifras: la BD (tablas `caracteristicas_plan` + `planes`) — canónica.
// El xlsx comercial y este archivo DERIVAN de ella; ante discrepancia manda la BD.
// ─────────────────────────────────────────────────────────────────────────

export const planes = [
  {
    nombre: 'Free',
    sub: 'Para probar el valor completo',
    precio: 'USD $0/mes',
    resaltado: false,
    cta: 'Empezar gratis',
    limites: {
      tokens: '1.000 páginas de corpus activo',
      vectores: '2 entidades (entornos aislados)',
    },
    features: [
      '1.500 Retrieval simple/mes',
      '30 RAG Aumentado/mes',
      '5 RAG Agéntico/mes',
      '4 áreas · 5 Espacios de Trabajo · síntesis de hasta 1.500 páginas',
    ],
  },
  {
    nombre: 'Starter',
    sub: 'Para empezar en producción',
    precio: 'USD $39/mes',
    resaltado: false,
    cta: 'Empezar',
    limites: {
      tokens: '10.000 páginas de corpus activo',
      vectores: '5 entidades (entornos aislados)',
    },
    features: [
      '5.000 Retrieval simple/mes',
      '300 RAG Aumentado/mes',
      '50 RAG Agéntico/mes',
      'Adicionales: corpus +10.000/$10 mes · RAG Aumentado +500/$35 · RAG Agéntico +50/$59',
      'RAGfly Desktop',
      '12 áreas · 10 Espacios de Trabajo · síntesis de hasta 10.000 páginas',
    ],
  },
  {
    nombre: 'Growth',
    sub: 'Para equipos con control por área',
    precio: 'USD $149/mes',
    resaltado: true,
    cta: 'Empezar',
    limites: {
      tokens: '50.000 páginas de corpus activo',
      vectores: '25 entidades (entornos aislados)',
    },
    featuresIniciales: ['Todo lo de Starter'],
    features: [
      '25.000 Retrieval simple/mes',
      '1.500 RAG Aumentado/mes',
      '150 RAG Agéntico/mes',
      'Adicionales: corpus +10.000/$10 mes · RAG Aumentado +500/$35 · RAG Agéntico +50/$59',
      'Operaciones entre Espacios · parsing-BYOK · embedding-BYOK · agentic-BYOK',
      '50 áreas · 50 Espacios de Trabajo · síntesis de hasta 50.000 páginas',
    ],
  },
  {
    nombre: 'Scale',
    sub: 'Para producción a escala',
    precio: 'USD $590/mes',
    resaltado: false,
    cta: 'Empezar',
    limites: {
      tokens: '250.000 páginas de corpus activo',
      vectores: '150 entidades (entornos aislados)',
    },
    featuresIniciales: ['Todo lo de Growth'],
    features: [
      '100.000 Retrieval simple/mes',
      '5.000 RAG Aumentado/mes',
      '500 RAG Agéntico/mes',
      'Adicionales: corpus +10.000/$10 mes · RAG Aumentado +500/$35 · RAG Agéntico +50/$59',
      'Proyecto Supabase vectorial propio',
      '200 áreas · 200 Espacios de Trabajo · síntesis de hasta 200.000 páginas',
    ],
  },
  {
    nombre: 'Enterprise / Soberano',
    sub: 'Soberanía y condiciones a medida',
    precio: 'Custom',
    resaltado: false,
    cta: 'Hablar con nosotros',
    limites: {
      tokens: 'Pages custom',
      vectores: 'Entities custom',
    },
    featuresIniciales: ['Todo lo de Scale'],
    features: [
      'Retrieval simple, RAG Aumentado y RAG Agéntico a convenir',
      'BYO LLM + bases vectoriales soportadas',
      'parsing-BYOK · embedding-BYOK · agentic-BYOK',
      'DPA/SLA',
      'Despliegue dedicado si aplica',
    ],
  },
]

// Nota al pie de la tabla de planes (se traduce con /ragfly-idiomas-sitio).
export const notaPlanes =
  'Free es permanente, sin tarjeta y con cupos mensuales. Los planes pagados permiten packs manuales y capacidad recurrente de corpus; no existe sobreconsumo automático. El procesamiento incluido está sujeto a uso razonable.'
