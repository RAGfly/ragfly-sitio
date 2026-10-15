/* ------------------------------------------------------------------ */
/* Apertura controlada — textos de las páginas de destino              */
/*                                                                     */
/* Fuente: versión B aprobada (Víctor, 14-oct-2026) y Plan de Apertura */
/* Controlada v2.5 (§1, §4, §5.1). Captación SOLO en inglés: estas     */
/* páginas no pasan por next-intl a propósito.                         */
/*                                                                     */
/* Regla de las piezas: gancho arriba, eslogan EN literal abajo, nada  */
/* en 🔴 del semáforo ni cifras no medidas. Sin FAQ, sin precios y sin */
/* listas de proveedores (Víctor, 14-oct: asustan y no venden). Los    */
/* cambios de gancho se hacen acá y en MENSAJE-CANONICO §7.3.          */
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

/* Texto común de la versión B (eslogan: MENSAJE-CANONICO §6, §6.bis — literal). */
export const COMUN = {
  eslogan: 'Simple, private, and precise. Access by workspace, area, role and agent.',
  bajadaProducto: 'Augmented retrieval for your agents.',
  pasosTitulo: 'Three steps. Then your agent takes it from there.',
  pasos: [
    'Create a free account with Google, Microsoft or your email.',
    "Choose the folders RAGfly should index, with the desktop app. Only you can do this: your agent doesn't get that permission.",
    'Connect your agent over MCP. In Claude or ChatGPT, add a custom connector and paste the RAGfly URL.',
  ],
  despuesPasos: 'From there, your agent works with your documents on its own.',
  /* Opcionales pero recomendados para una operación óptima; no son pasos
     (Víctor, 14-oct). */
  recomendado:
    "Recommended: set up your workspace and your organization's details, so your searches return the most relevant results.",
  conQueFunciona:
    'Works with the agents you already use — over MCP — and with the ones you build.',
  interfaces:
    'Connect over MCP, REST, the SDK or the CLI — and use it with agents like Claude or GPT.',
  workspaceTitulo: 'You draw the line. Nothing crosses it.',
  workspace:
    'A workspace is whatever you decide must never mix: your personal life and your business inside the same agent, or each client of your accounting practice.',
  granular: 'Behind each workspace, you get granular security by area, role and agent.',
  privadoTitulo:
    'We never store your documents. And with RAGfly Desktop, they never leave your network.',
  /* Asume Free en Clase A: condición para publicar (ver PUBLICADA). */
  privado: "The models that touch your documents don't train on your data.",
} as const

export const URL_APP = 'https://app.ragfly.ai'
export const URL_GUIA_MCP = '/build/mcp'
