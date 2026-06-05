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
// Precios y límites son la fuente de verdad de Paddle (captura 2026-05-26).
// ─────────────────────────────────────────────────────────────────────────

export const planes = [
  {
    nombre: 'Professional',
    sub: 'Para profesionales independientes',
    precio: 'USD $7,99/mes',
    resaltado: false,
    cta: 'Probar 15 días',
    limites: {
      tokens: 'Hasta 300.000 tokens al mes',
      vectores: 'Hasta 2.500 documentos vectorizados',
    },
    features: [
      'Chat ilimitado con tus documentos',
      'Búsqueda semántica vectorial',
      'Procesamiento PDF, Word, Excel',
      'Historial de conversaciones',
    ],
  },
  {
    nombre: 'Team',
    sub: 'Para equipos colaborativos',
    precio: 'USD $49,99/mes',
    resaltado: false,
    cta: 'Probar 15 días',
    limites: {
      tokens: 'Hasta 3.000.000 tokens al mes',
      vectores: 'Hasta 15.000 documentos vectorizados',
    },
    features: [
      'Todo lo del plan Professional',
      'Control de acceso por área o perfil',
      'Cada miembro ve sólo su área',
      'Administrador del equipo',
      'Auditoría de accesos',
    ],
  },
  {
    nombre: 'Business',
    sub: 'Control estricto y privacidad',
    precio: 'USD $199/mes',
    resaltado: true,
    cta: 'Regístrate y prueba',
    limites: {
      tokens: 'Hasta 15.000.000 tokens al mes',
      vectores: 'Hasta 60.000 documentos vectorizados',
    },
    features: [
      'Todo lo del plan Team',
      'RAGfly Desktop: la indexación no sale de tu red',
      'Elección de IA: Claude, GPT, Gemini, open source',
      'Permisos granulares por rol, función y perfil',
      'Branding propio (color, logo, nombre)',
      'API de integración con sistemas internos',
      'Soporte prioritario',
    ],
  },
  {
    nombre: 'Enterprise',
    sub: 'Gran volumen y máxima escala',
    precio: 'USD $1.990/mes',
    resaltado: false,
    cta: 'Hablar con ventas',
    limites: {
      tokens: 'Hasta 150.000.000 tokens al mes',
      vectores: 'Hasta 600.000 documentos vectorizados',
    },
    features: [
      'Todo lo del plan Business',
      'Multi-entidad para holdings',
      'Administración centralizada',
      'Espacio de BD propio (BYO infrastructure)',
      'Soporte dedicado y SLA garantizado',
    ],
  },
  {
    nombre: 'Corporate',
    sub: 'Corporaciones y holdings — a medida',
    precio: 'A medida',
    resaltado: false,
    cta: 'Hablar con ventas',
    limites: {
      tokens: 'Tokens y capacidad a medida',
      vectores: 'Volumen de documentos sin límite definido',
    },
    features: [
      'Todo lo del plan Enterprise',
      'Arquitectura y despliegue a medida',
      'Integraciones y modelos a pedido',
      'Acuerdo comercial y SLA personalizados',
    ],
  },
]
