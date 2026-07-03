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
// MODELO (jun-2026): cobro por PÁGINA procesada + uso de recuperación, en
// páginas y dólares (no créditos). Superficies MCP/REST/CLI/SDK en todos los
// planes. Margen vive en la recuperación (valor); storage/infra a costo.
// Fuente de cifras: la BD (tablas `caracteristicas_plan` + `planes`) — canónica.
// El xlsx comercial y este archivo DERIVAN de ella; ante discrepancia manda la BD.
// ─────────────────────────────────────────────────────────────────────────

export const planes = [
  {
    nombre: 'Free',
    sub: 'Para probar',
    precio: 'USD $0/mes',
    resaltado: false,
    cta: 'Empezar gratis',
    limites: {
      tokens: '~1.000 páginas procesadas incluidas',
      vectores: '2 entidades aisladas',
    },
    features: [
      'Multi-tenant: un corpus aislado por cliente',
      'MCP, REST, CLI y SDK',
      'Recuperación con citas',
      'Página adicional Fast $0,02 / Hi-res $0,05',
    ],
  },
  {
    nombre: 'Starter',
    sub: 'Para un dev en solitario',
    precio: 'USD $19/mes',
    resaltado: false,
    cta: 'Empezar',
    limites: {
      tokens: '~4.000 páginas procesadas incluidas',
      vectores: '5 entidades aisladas',
    },
    features: [
      'Todo lo de Free',
      'MCP, REST, CLI y SDK',
      'Recuperación con citas',
      'Soporte por comunidad',
    ],
  },
  {
    nombre: 'Team',
    sub: 'Para quienes sirven a varios clientes',
    precio: 'USD $95/mes',
    resaltado: true,
    cta: 'Empezar',
    limites: {
      tokens: '~10.000 páginas procesadas incluidas',
      vectores: 'Hasta 25 entidades aisladas',
    },
    features: [
      'Todo lo de Starter',
      'Control por Área y perfil',
      'Panel único para todas las entidades',
    ],
  },
  {
    nombre: 'Scale',
    sub: 'Para producción a escala',
    precio: 'USD $490/mes',
    resaltado: false,
    cta: 'Empezar',
    limites: {
      tokens: '~60.000 páginas procesadas incluidas',
      vectores: 'Hasta 150 entidades aisladas',
    },
    features: [
      'Todo lo de Team',
      'Client LM / on-prem opcional',
      'BYO base vectorial + BYO LLM',
      'Storage a costo (sin markup de valor)',
    ],
  },
  {
    nombre: 'Enterprise',
    sub: 'Regulado, soberano o gran volumen',
    precio: 'Inbound',
    resaltado: false,
    cta: 'Hablar con nosotros',
    limites: {
      tokens: 'Páginas a definir · entidades ilimitadas',
      vectores: 'Despliegue managed u on-prem/soberano',
    },
    features: [
      'Todo lo de Scale',
      'Client LM / on-prem garantizado',
      'Seguridad, compliance y DPA',
      'SLA y soporte dedicado',
    ],
  },
]

// Nota al pie de la tabla de planes (se traduce con /ragfly-idiomas-sitio).
export const notaPlanes =
  'El cobro es por página procesada más uso de recuperación, en dólares — sin créditos que caduquen. Las páginas extra se cobran por uso (Fast $0,02 / Hi-res $0,05). Opcional en los planes pagos: RAG Agéntico, un agente gestionado por RAGfly que se adquiere por turno ($0,135), para quienes aún no tienen su propio agente.'
