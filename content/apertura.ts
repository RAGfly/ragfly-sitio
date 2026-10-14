/* ------------------------------------------------------------------ */
/* Apertura controlada — textos de las páginas de destino              */
/*                                                                     */
/* Fuente: doc «RAGfly — Piezas de la apertura controlada» y Plan de   */
/* Apertura Controlada v2.5 (§1, §4, §5.1). Captación SOLO en inglés:  */
/* estas páginas no pasan por next-intl a propósito.                   */
/*                                                                     */
/* Regla de las piezas: gancho arriba, eslogan EN literal abajo, nada  */
/* en 🔴 del semáforo ni cifras no medidas. Los cambios de gancho se    */
/* hacen acá y en MENSAJE-CANONICO §7.3, no en el componente.          */
/* ------------------------------------------------------------------ */

/**
 * Mientras sea `false`, las páginas responden 404 en producción
 * (VERCEL_ENV=production) y se ven en previews y en local. Pasar a `true`
 * solo con las condiciones de §4 del plan cumplidas y `PENDIENTES` vacío.
 */
export const PUBLICADA = false

/** Notas de revisión: se muestran fuera de producción, junto al texto afectado. */
export const PENDIENTES = {
  proveedores:
    'Validate both provider lists (Class A and Class B) against PROD on publishing day.',
  precioStarter: 'Confirm the Starter price in PROD on publishing day.',
  video1: 'Video 1 pending: record only with the onboarding probe green.',
  video2: 'Video 2 pending: clean take with Claude and Codex, case 382049 closed.',
} as const

export type Dolor = 'context' | 'memory'

export type PaginaDolor = {
  /** Gancho del aviso: el mismo título que la persona vio en Reddit. */
  gancho: string
  idGancho: string
  /**
   * Ganchos del par de Reddit Ads que llegan a esta misma página
   * (?h=c1). Dentro de un par solo cambia el título (plan §6), así que la
   * página repite el título del aviso por el que entró la persona.
   */
  ganchosAlternos: Record<string, string>
  /** Bajada vigente del dolor (MENSAJE-CANONICO §7.3). */
  bajada: string
  video: {
    id: string
    duracion: string
    /** Primera frase del video (abre con el dolor). */
    apertura: string
    /** URL del video publicado; vacío = marcador de posición. */
    src: string
    poster?: string
  }
  metaDescripcion: string
}

export const PAGINAS: Record<Dolor, PaginaDolor> = {
  context: {
    gancho: 'Is your second brain burning too many tokens?',
    idGancho: 'C4',
    ganchosAlternos: { c1: 'Still pasting the same files into every new session?' },
    bajada:
      "Your agent doesn't need to load everything. It asks for what the task needs, with the source.",
    video: {
      id: '1A',
      duracion: '~90 s',
      apertura: 'Your agent read the whole folder. Then it lost track of what you asked.',
      src: '',
    },
    metaDescripcion:
      'RAGfly is a RAG service for your agents. Your documents are indexed once; the agent asks for what the task needs, with the source.',
  },
  memory: {
    gancho: 'When your second brain outgrows its links.',
    idGancho: 'M4',
    ganchosAlternos: { m1: 'Every new session, your agent starts from zero.' },
    bajada:
      'A memory your agent queries, not a file that grows out of control. One workspace for each part of your life.',
    video: {
      id: '1B',
      duracion: '~100 s',
      apertura:
        "Your agent's memory folder started with a few notes. Now it mixes every project you have.",
      src: '',
    },
    metaDescripcion:
      "Turn your agent's documentation into memory it queries, split into workspaces you define.",
  },
}

/* Texto canónico común (MENSAJE-CANONICO §6, §6.bis, §7.1 — literal). */
export const COMUN = {
  eslogan: 'Simple, private, and precise. Access by workspace, area, role and agent.',
  bajadaProducto: 'Augmented retrieval for your agents.',
  conQueFunciona:
    'Works with the agents you already use — over MCP — and with the ones you build.',
  interfaces:
    'Connect over MCP, REST, the SDK or the CLI — and use it with agents like Claude or GPT.',
  workspace:
    'A workspace is whatever you decide must never mix: your personal life and your business inside the same agent, or each client of your accounting practice. You draw the line. Nothing crosses it. Inside each workspace, you decide who sees what by area, role and agent.',
  pasos: [
    { texto: 'Create a free account.', nota: '' },
    {
      texto: 'Review and accept the Free providers.',
      nota: 'Free processes nothing until you do. The list is right below, before you sign up.',
    },
    {
      texto: 'Ask your agent to connect RAGfly — it writes the setup itself.',
      nota: 'Claude connects with a sign-in, no key. Codex, Claude Code and other agents take an API key.',
    },
  ],
  /* Línea de Free y planes pagados (plan §4): visible SIN hacer clic,
     antes de la pantalla de consentimiento. */
  freeTitulo: 'Free is for trying RAGfly, not for sensitive documents.',
  freeTexto:
    'On Free, documents are processed on our economy lane by Alibaba, DeepSeek, Zhipu, Cohere, Jina and Voyage. You see that list and accept it before your first upload. From Starter, processing moves to our high-privacy lane. On every plan, we never store your document in the cloud.',
} as const

export type PreguntaFaq = {
  q: string
  a: string
  pendiente?: keyof typeof PENDIENTES
}

/* FAQ en inglés: Free y proveedores (cinco preguntas). */
export const FAQ: PreguntaFaq[] = [
  {
    q: 'Who processes my documents on Free?',
    a: 'On Free, documents are processed on our economy lane, by Class B providers. From Starter, processing moves to our high-privacy lane, with Class A providers only. The current lists are at the end of this FAQ.',
  },
  {
    q: 'Why do I have to accept providers before my first upload?',
    a: "Because we'd rather you decide before anything is processed. Free doesn't process a single document until an admin on your account accepts that list in My Account. If you skip it, uploads wait.",
  },
  {
    q: 'Do these providers train on my documents?',
    a: "RAGfly doesn't use your documents to train models of its own. On paid plans, every model that touches your documents comes from a Class A provider: its terms include a no-training clause. On Free, providers are Class B: we haven't verified that clause, so each provider's own policy applies. That's why Free is for trying RAGfly, not for sensitive documents.",
  },
  {
    q: 'What changes when I upgrade?',
    a: "From Starter (US$39/month), processing moves to our high-privacy lane. Free stays free and permanent, with small monthly limits. It's for trying RAGfly, not for sensitive documents.",
    pendiente: 'precioStarter',
  },
  {
    q: 'Do you store my documents?',
    a: 'We never store your document in the cloud. And if you want, the document never leaves your network. In the cloud, the original is processed and not kept; what persists are encrypted derivatives such as chunks, embeddings and metadata. With RAGfly Desktop, the original is processed inside your network.',
  },
]

/*
 * Proveedores por clase (Víctor, 14-oct), al final de la FAQ.
 * Clase A: cláusula de no entrenamiento conocida; todos los planes pagados.
 * Clase B: cláusula no verificada; solo Free (carril B).
 * Validar ambas listas contra la BD de PROD el día de publicar.
 *
 * Solo se listan proveedores cuyos modelos tocan el documento del cliente.
 * Los que se usan en tareas que no lo tocan (p. ej. JEV, Clase A) no van.
 * Cohere está en las dos clases a propósito: cada tarea usa dos modelos
 * por respaldo, y para ranking no hay cuatro modelos buenos.
 */
export const PROVEEDORES = {
  nota: 'These lists name only the providers whose models touch your documents. A provider can appear in both: each step runs two models, one as backup.',
  claseA: {
    titulo: 'Class A — no-training clause in their terms',
    uso: 'Paid plans',
    nombres: ['Anthropic', 'OpenAI', 'Google', 'Cohere'],
  },
  claseB: {
    titulo: 'Class B — no-training clause not verified',
    uso: 'Free',
    nombres: ['Alibaba', 'DeepSeek', 'Zhipu', 'Cohere', 'Jina', 'Voyage'],
  },
} as const

export const URL_APP = 'https://app.ragfly.ai'
export const URL_GUIA_MCP = '/build/mcp'
