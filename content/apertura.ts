/* ------------------------------------------------------------------ */
/* Apertura controlada — textos de las páginas de destino              */
/*                                                                     */
/* Fuente: estructura vigente del Plan de Apertura Controlada v2.8 §11 */
/* (Víctor, 14 y 15-oct-2026). Captación SOLO en inglés: estas         */
/* páginas no pasan por next-intl a propósito.                         */
/*                                                                     */
/* Regla de las piezas: gancho arriba, eslogan EN literal abajo, nada  */
/* en 🔴 del semáforo ni cifras no medidas. Sin FAQ, sin precios, sin  */
/* línea de proveedores ni diferencias de privacidad por plan (todos   */
/* en carril A). Los cambios de gancho van acá y en MENSAJE-CANONICO   */
/* §7.3.                                                               */
/* ------------------------------------------------------------------ */

/**
 * Mientras sea `false`, las páginas responden 404 en producción
 * (VERCEL_ENV=production) y se ven en previews y en local. Pasar a `true`
 * solo con las condiciones de la tarea cumplidas: Free en Clase A (la
 * frase de privacidad lo asume), videos 1A/1B grabados con la sonda de
 * onboarding en verde, utm_* llegando a la cuenta y los 3 pasos probados.
 */
export const PUBLICADA = true

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
      apertura:
        "Your agent's memory folder started with a few notes. Now it mixes every project you have.",
      src: '',
    },
    metaDescripcion:
      "Turn your agent's documentation into memory it queries, split into workspaces you define.",
  },
}

/* Texto común (estructura vigente 14-oct, Plan de Apertura §11). El eslogan
   es literal de MENSAJE-CANONICO §6 / §6.bis; los pilares, del plan §11. */
export const COMUN = {
  eslogan: 'Simple, private, and precise. Access by workspace, area, role and agent.',
  bajadaProducto: 'Augmented retrieval for your agents.',
  pasosTitulo: 'Three steps. Then your agent takes it from there.',
  pasos: [
    { titulo: 'Create a free account.', detalle: 'With Google, Microsoft or your email.' },
    {
      titulo: 'Choose a location and load its content.',
      detalle:
        "A folder on your computer with RAGfly Desktop, or your Google Drive or Dropbox. Only you can do this: your agent doesn't get that permission.",
    },
    {
      titulo: 'Connect your agent over MCP.',
      detalle:
        'In Claude or ChatGPT, add a custom connector with the RAGfly URL and sign in. Other agents use an API key. Your agent can help with setup.',
    },
  ],
  despuesPasos: 'From there, your agent works with your documents on its own.',
  pilares: [
    {
      nombre: 'Simple',
      texto:
        'Connect through MCP, REST, SDK or CLI. Your agent can help with setup. Choose a location, load its content, and let RAGfly handle the rest.',
    },
    {
      nombre: 'Private',
      texto:
        "We don't store your documents. With RAGfly Desktop, they never leave your network. Your document data is encrypted.",
    },
    {
      nombre: 'Precise',
      texto: 'We enrich your content and refine retrieval to deliver the most relevant results.',
    },
    {
      nombre: 'Workspaces',
      texto: 'Personal, professional, family: each workspace stays isolated from the others.',
    },
    { nombre: 'Granular security', texto: 'Access by workspace, area, role and agent.' },
  ],
  cierre: 'Try RAGfly with the Free plan.',
  yaTienesCuenta: 'Already have an account?',
} as const

/* El registro y el login viven en la app (el sitio solo vuelca al Login,
   decisión de Víctor del 15-oct). `?registro=1` abre directo el formulario de
   alta en app.ragfly.ai/login; las utm_* que reenvía BotonEmpezar las guarda la
   app y viajan con el alta (pendiente 413943, en PROD desde el 15-oct). */
export const URL_REGISTRO = 'https://app.ragfly.ai/login?registro=1'
export const URL_LOGIN = 'https://app.ragfly.ai/login'
export const URL_GUIA_MCP = '/build/mcp'
