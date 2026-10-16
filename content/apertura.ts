/* ------------------------------------------------------------------ */
/* Apertura controlada — textos de las páginas de destino              */
/*                                                                     */
/* Fuente: estructura vigente del Plan de Apertura Controlada §11      */
/* (Víctor, 14 y 15-oct-2026). Multilingüe desde el 15-oct (Víctor):   */
/* la captación sigue en inglés, pero estas páginas marcan el estándar */
/* para las campañas en otros idiomas. El idioma sale de la misma      */
/* cadena que el resto del sitio (proxy.ts e i18n/request.ts):         */
/* elección del selector → navegador → país → inglés.                  */
/*                                                                     */
/* Eslogan, descriptor y bajadas: literales de MENSAJE-CANONICO §6 y   */
/* §7.3 en cada idioma. FR, PT y DE están pendientes de validación     */
/* nativa, igual que en el canónico. Nada en 🔴 del semáforo ni cifras */
/* no medidas. FAQ cerrada y luego la grilla de planes (catálogo vivo, */
/* Víctor 16-oct); sin proveedores ni diferencias de privacidad por    */
/* plan (todos en carril A).                                           */
/* ------------------------------------------------------------------ */

import type { Locale } from '../i18n/config'

/**
 * Mientras sea `false`, las páginas responden 404 en producción
 * (VERCEL_ENV=production) y se ven en previews y en local.
 */
export const PUBLICADA = true

export type Dolor = 'context' | 'memory'

type TextosDolor = {
  /** Titular fijo de la página (Víctor, 15-oct): no depende del aviso. */
  titulo: string
  /** Bajada vigente del dolor (MENSAJE-CANONICO §7.3). */
  bajada: string
  /** Primera frase del video 1 (abre con el dolor). */
  aperturaVideo: string
  metaDescripcion: string
}

export type PaginaDolor = {
  textos: Record<Locale, TextosDolor>
}

export const PAGINAS: Record<Dolor, PaginaDolor> = {
  context: {
    textos: {
      en: {
        titulo: "Optimize your agent's context.",
        bajada: "Your agent doesn't need to load everything. It asks for what the task needs, with the source.",
        aperturaVideo: 'Your agent read the whole folder. Then it lost track of what you asked.',
        metaDescripcion:
          'RAGfly is a RAG service for your agents. Your documents are indexed once; the agent asks for what the task needs, with the source.',
      },
      es: {
        titulo: "Optimiza el contexto de tu agente.",
        bajada: 'Tu agente no necesita cargarlo todo. Consulta solo lo que la tarea pide, con la cita.',
        aperturaVideo: 'Tu agente leyó la carpeta entera. Y después perdió el hilo de lo que le pediste.',
        metaDescripcion:
          'RAGfly es un servicio de RAG para tus agentes. Tus documentos se indexan una vez; el agente consulta lo que la tarea pide, con la cita.',
      },
      pt: {
        titulo: "Otimize o contexto do seu agente.",
        bajada: 'Seu agente não precisa carregar tudo. Ele consulta só o que a tarefa pede, com a fonte.',
        aperturaVideo: 'Seu agente leu a pasta inteira. Depois perdeu o fio do que você pediu.',
        metaDescripcion:
          'O RAGfly é um serviço de RAG para seus agentes. Seus documentos são indexados uma vez; o agente consulta o que a tarefa pede, com a fonte.',
      },
      fr: {
        titulo: "Optimisez le contexte de votre agent.",
        bajada: "Votre agent n'a pas besoin de tout charger. Il demande ce dont la tâche a besoin, avec la source.",
        aperturaVideo: "Votre agent a lu tout le dossier. Puis il a perdu le fil de votre demande.",
        metaDescripcion:
          "RAGfly est un service de RAG pour vos agents. Vos documents sont indexés une fois ; l'agent demande ce dont la tâche a besoin, avec la source.",
      },
      de: {
        titulo: "Optimiere den Kontext deines Agenten.",
        bajada: 'Dein Agent muss nicht alles laden. Er fragt nur ab, was die Aufgabe braucht, mit Quelle.',
        aperturaVideo: 'Dein Agent hat den ganzen Ordner gelesen. Dann hat er den Faden verloren.',
        metaDescripcion:
          'RAGfly ist ein RAG-Dienst für deine Agenten. Deine Dokumente werden einmal indexiert; der Agent fragt ab, was die Aufgabe braucht, mit Quelle.',
      },
    },
  },
  memory: {
    textos: {
      en: {
        titulo: "Optimize your second brain.",
        bajada:
          'A memory your agent queries, not a file that grows out of control. One workspace for each part of your life.',
        aperturaVideo: "Your agent's memory folder started with a few notes. Now it mixes every project you have.",
        metaDescripcion: "Turn your agent's documentation into memory it queries, split into workspaces you define.",
      },
      es: {
        titulo: "Optimiza tu segundo cerebro.",
        bajada:
          'Una memoria que tu agente consulta, no un archivo que crece sin control. Un workspace para cada parte de tu vida.',
        aperturaVideo: 'La carpeta de memoria de tu agente empezó con unas pocas notas. Hoy mezcla todos tus proyectos.',
        metaDescripcion:
          'Convierte la documentación de tu agente en una memoria que consulta, separada en los workspaces que tú defines.',
      },
      pt: {
        titulo: "Otimize seu segundo cérebro.",
        bajada:
          'Uma memória que seu agente consulta, não um arquivo que cresce sem controle. Um workspace para cada parte da sua vida.',
        aperturaVideo: 'A pasta de memória do seu agente começou com poucas notas. Hoje mistura todos os seus projetos.',
        metaDescripcion:
          'Transforme a documentação do seu agente em uma memória que ele consulta, separada nos workspaces que você define.',
      },
      fr: {
        titulo: "Optimisez votre second cerveau.",
        bajada:
          "Une mémoire que votre agent interroge, pas un fichier qui grossit sans contrôle. Un workspace pour chaque partie de votre vie.",
        aperturaVideo:
          "Le dossier mémoire de votre agent a commencé avec quelques notes. Aujourd'hui, il mélange tous vos projets.",
        metaDescripcion:
          "Transformez la documentation de votre agent en une mémoire qu'il interroge, répartie dans les workspaces que vous définissez.",
      },
      de: {
        titulo: "Optimiere dein zweites Gehirn.",
        bajada:
          'Ein Gedächtnis, das dein Agent abfragt, keine Datei, die unkontrolliert wächst. Ein Workspace für jeden Teil deines Lebens.',
        aperturaVideo: 'Der Gedächtnisordner deines Agenten begann mit ein paar Notizen. Heute mischt er all deine Projekte.',
        metaDescripcion:
          'Mach die Dokumentation deines Agenten zu einem Gedächtnis, das er abfragt, aufgeteilt in Workspaces, die du festlegst.',
      },
    },
  },
}

export type TextosComunes = {
  etiqueta: string
  eslogan: string
  empezar: string
  pasosEtiqueta: string
  pasosTitulo: string
  reproducirVideo: string
  pasos: { titulo: string; detalle: string }[]
  despuesPasos: string
  /* Qué es un RAG, antes de los pilares (Víctor, 15-oct). */
  queEsRag: { titulo: string; texto: string }
  pilares: { nombre: string; texto: string }[]
  cierre: string
  yaTienesCuenta: string
  alta: {
    google: string
    microsoft: string
    o: string
    correo: string
    crear: string
    nota: string
    /* Enlace a la grilla de planes al final de la página (Víctor, 16-oct). */
    verPrecios: string
    entrar: string
  }
  pie: { guiaMcp: string; privacidad: string; terminos: string }
  /* Preguntas frecuentes al final de la página, cerradas: la persona abre la
     que quiera (Víctor, 15-oct). Sin precios ni proveedores por plan, y sin
     decir que los fragmentos van cifrados: embeddings_chunks.texto se guarda
     en claro por decisión (ARQ-14), para la búsqueda por palabras. */
  faq: {
    titulo: string
    /* `tabla` opcional: comparación dentro de la respuesta (RAG frente a un
       sistema de archivos, Víctor, 15-oct). */
    preguntas: { q: string; a: string; tabla?: { columnas: string[]; filas: string[][] } }[]
  }
}

/* Video del Quickstart en YouTube (Víctor, 15-oct), el mismo en las dos
   páginas y en todos los idiomas. Va incrustado bajo el hero; el iframe se
   carga al hacer clic (components/apertura/VideoYouTube.tsx). */
export const VIDEO_YOUTUBE_ID = 'EfhvUpb80FI'

export const COMUN: Record<Locale, TextosComunes> = {
  en: {
    etiqueta: 'RAG service for agents',
    eslogan: 'Simple, private, and precise. Access by workspace, area, role and agent.',
    empezar: 'Start free',
    pasosEtiqueta: 'How it starts',
    pasosTitulo: 'Three steps. Then your agent takes it from there.',
    reproducirVideo: 'Play video',
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
    queEsRag: {
      titulo: "What is RAG?",
      texto: "RAG stands for retrieval-augmented generation. A vector database holds a representation of your documents; before answering, your agent searches it for the passages it needs and answers from them, citing the source.",
    },
    pilares: [
      {
        nombre: 'Simple',
        texto:
          'Connect through MCP, REST, SDK or CLI. Your agent can help with setup. Choose a location, load its content, and let RAGfly handle the rest.',
      },
      {
        nombre: 'Private',
        texto:
          "We don't store your documents. With RAGfly Desktop, they never leave your network. We only use models from providers whose terms exclude training on your data.",
      },
      {
        nombre: 'Precise',
        texto: 'We enrich your content and refine retrieval to deliver the most relevant results. We combine search by meaning and by keywords (hybrid), rerank the results, and when RAGfly answers, it checks each claim against your documents.',
      },
      {
        nombre: 'Workspaces',
        texto:
          'One workspace for your personal life, one for your business, one per client or company. Each stays isolated from the others.',
      },
      { nombre: 'Granular security', texto: 'Access by workspace, area, role and agent.' },
    ],
    cierre: 'Try RAGfly with the Free plan.',
    yaTienesCuenta: 'Already have an account?',
    alta: {
      google: 'Continue with Google',
      microsoft: 'Continue with Microsoft',
      o: 'or',
      correo: 'Work or personal email',
      crear: 'Create free account',
      nota: 'Free plan. No credit card.',
      verPrecios: 'See pricing',
      entrar: 'Log in',
    },
    pie: { guiaMcp: 'MCP guide', privacidad: 'Privacy', terminos: 'Terms' },
    faq: {
      titulo: "Frequently asked questions",
      preguntas: [
        {
          q: "Why does RAG answer better than searching your files?",
          a: "Because it works with fragments, not whole files. A file system searches names, paths or exact text and hands back entire files that your agent has to read in full. A RAG splits your documents into fragments (chunks) and searches them by meaning: it understands questions in natural language, finds the relevant fragments very quickly, and gives your agent only what it needs, with the source.",
          tabla: {
            columnas: ["", "File system", "RAG"],
            filas: [
            ["Searches by", "File names, paths and exact text", "Meaning, context and intent"],
            ["Retrieves", "Whole files", "Specific fragments (chunks)"],
            ["Returns", "Paths to documents", "The relevant passages, with their source"],
            ["Natural language", "Low: needs exact keywords", "High: understands conversational questions"],
            ],
          },
        },
        { q: "Do you store my documents?", a: "We don't keep your original files. To answer your agent, RAGfly stores what search needs: text fragments, their embeddings and the document's metadata. With RAGfly Desktop, the original file never leaves your network." },
        { q: "Who processes my documents?", a: "Models from providers whose terms exclude training on your data, on every plan, Free included. RAGfly doesn't use your documents to train models of its own." },
        { q: "Can other people or agents see my documents?", a: "Only the workspaces, areas, roles and agents you allow. Each workspace is isolated: a search in one never returns documents from another." },
        { q: "Do I need to build an agent to use RAGfly?", a: "No. Connect the agent you already use, like Claude or GPT, over MCP, or use REST, the SDK or the CLI. Your agent can help with setup." },
        { q: "What's the difference between Free and paid plans?", a: "Limits and capacity. Privacy is the same on every plan. Free is permanent, with monthly limits, and needs no credit card." },
      ],
    },
  },
  es: {
    etiqueta: 'Servicio de RAG para agentes',
    eslogan: 'Simple, privado y preciso. Acceso por workspace, área, rol y agente.',
    empezar: 'Empieza gratis',
    pasosEtiqueta: 'Cómo empieza',
    pasosTitulo: 'Tres pasos. Desde ahí sigue tu agente.',
    reproducirVideo: 'Reproducir video',
    pasos: [
      { titulo: 'Crea una cuenta gratis.', detalle: 'Con Google, Microsoft o tu correo.' },
      {
        titulo: 'Elige una ubicación y carga su contenido.',
        detalle:
          'Una carpeta de tu computador con RAGfly Desktop, o tu Google Drive o Dropbox. Solo tú puedes hacerlo: tu agente no tiene ese permiso.',
      },
      {
        titulo: 'Conecta tu agente por MCP.',
        detalle:
          'En Claude o ChatGPT, agrega un conector personalizado con la URL de RAGfly e inicia sesión. Otros agentes usan una API key. Tu agente puede ayudarte con la configuración.',
      },
    ],
    despuesPasos: 'Desde ahí, tu agente trabaja solo con tus documentos.',
    queEsRag: {
      titulo: "¿Qué es un RAG?",
      texto: "RAG significa recuperación aumentada. Una base de datos vectorial guarda una representación de tus documentos; antes de responder, tu agente busca ahí los pasajes que necesita y responde con ellos, citando la fuente.",
    },
    pilares: [
      {
        nombre: 'Simple',
        texto:
          'Conéctate por MCP, REST, SDK o CLI. Tu agente puede ayudarte con la configuración. Elige una ubicación, carga su contenido y RAGfly se encarga del resto.',
      },
      {
        nombre: 'Privado',
        texto:
          'No guardamos tus documentos. Con RAGfly Desktop, nunca salen de tu red. Solo usamos modelos de proveedores cuyos términos excluyen entrenar con tus datos.',
      },
      {
        nombre: 'Preciso',
        texto: 'Enriquecemos tu contenido y afinamos la recuperación para entregar los resultados más relevantes. Combinamos búsqueda por significado y por palabras clave (híbrida), reordenamos los resultados y, cuando RAGfly responde, verifica cada afirmación contra tus documentos.',
      },
      {
        nombre: 'Workspaces',
        texto:
          'Un workspace para tu vida personal, otro para tu negocio, uno por cliente o empresa. Cada uno queda aislado de los demás.',
      },
      { nombre: 'Seguridad granular', texto: 'Acceso por workspace, área, rol y agente.' },
    ],
    cierre: 'Prueba RAGfly con el plan Free.',
    yaTienesCuenta: '¿Ya tienes una cuenta?',
    alta: {
      google: 'Continuar con Google',
      microsoft: 'Continuar con Microsoft',
      o: 'o',
      correo: 'Correo personal o de trabajo',
      crear: 'Crear cuenta gratis',
      nota: 'Plan Free. Sin tarjeta de crédito.',
      verPrecios: 'Ver precios',
      entrar: 'Inicia sesión',
    },
    pie: { guiaMcp: 'Guía MCP', privacidad: 'Privacidad', terminos: 'Términos' },
    faq: {
      titulo: "Preguntas frecuentes",
      preguntas: [
        {
          q: "¿Por qué un RAG responde mejor que buscar en tus archivos?",
          a: "Porque trabaja con fragmentos, no con archivos completos. Un sistema de archivos busca por nombre, ruta o texto exacto y entrega archivos enteros que tu agente tiene que leer completos. Un RAG divide tus documentos en fragmentos (chunks) y los busca por significado: entiende preguntas en lenguaje natural, encuentra muy rápido los fragmentos pertinentes, y le entrega a tu agente solo lo que necesita, con la fuente.",
          tabla: {
            columnas: ["", "Sistema de archivos", "RAG"],
            filas: [
            ["Busca por", "Nombres de archivo, rutas y texto exacto", "Significado, contexto e intención"],
            ["Recupera", "Archivos completos", "Fragmentos específicos (chunks)"],
            ["Entrega", "Rutas a documentos", "Los pasajes pertinentes, con su fuente"],
            ["Lenguaje natural", "Bajo: pide palabras clave exactas", "Alto: entiende preguntas conversacionales"],
            ],
          },
        },
        { q: "¿Guardan mis documentos?", a: "No guardamos tus archivos originales. Para responderle a tu agente, RAGfly guarda lo que la búsqueda necesita: fragmentos del texto, sus embeddings y los metadatos del documento. Con RAGfly Desktop, el archivo original nunca sale de tu red." },
        { q: "¿Quién procesa mis documentos?", a: "Modelos de proveedores cuyos términos excluyen entrenar con tus datos, en todos los planes, también en Free. RAGfly no usa tus documentos para entrenar modelos propios." },
        { q: "¿Otras personas o agentes pueden ver mis documentos?", a: "Solo los workspaces, áreas, roles y agentes que tú autorizas. Cada workspace queda aislado: una búsqueda en uno nunca devuelve documentos de otro." },
        { q: "¿Tengo que construir un agente para usar RAGfly?", a: "No. Conecta el agente que ya usas, como Claude o GPT, por MCP, o usa REST, el SDK o la CLI. Tu agente puede ayudarte con la configuración." },
        { q: "¿Qué cambia entre Free y los planes pagados?", a: "Los límites y la capacidad. La privacidad es la misma en todos los planes. Free es permanente, con límites mensuales, y no pide tarjeta de crédito." },
      ],
    },
  },
  pt: {
    etiqueta: 'Serviço de RAG para agentes',
    eslogan: 'Simples, privado e preciso. Acesso por workspace, área, papel e agente.',
    empezar: 'Comece grátis',
    pasosEtiqueta: 'Como começa',
    pasosTitulo: 'Três passos. Depois, seu agente segue sozinho.',
    reproducirVideo: 'Reproduzir vídeo',
    pasos: [
      { titulo: 'Crie uma conta gratuita.', detalle: 'Com Google, Microsoft ou seu e-mail.' },
      {
        titulo: 'Escolha um local e carregue o conteúdo.',
        detalle:
          'Uma pasta no seu computador com o RAGfly Desktop, ou seu Google Drive ou Dropbox. Só você pode fazer isso: seu agente não tem essa permissão.',
      },
      {
        titulo: 'Conecte seu agente por MCP.',
        detalle:
          'No Claude ou no ChatGPT, adicione um conector personalizado com a URL do RAGfly e faça login. Outros agentes usam uma API key. Seu agente pode ajudar na configuração.',
      },
    ],
    despuesPasos: 'A partir daí, seu agente trabalha com seus documentos por conta própria.',
    queEsRag: {
      titulo: "O que é RAG?",
      texto: "RAG significa geração aumentada por recuperação. Um banco de dados vetorial guarda uma representação dos seus documentos; antes de responder, seu agente busca ali os trechos de que precisa e responde com base neles, citando a fonte.",
    },
    pilares: [
      {
        nombre: 'Simples',
        texto:
          'Conecte por MCP, REST, SDK ou CLI. Seu agente pode ajudar na configuração. Escolha um local, carregue o conteúdo e o RAGfly cuida do resto.',
      },
      {
        nombre: 'Privado',
        texto:
          'Não armazenamos seus documentos. Com o RAGfly Desktop, eles nunca saem da sua rede. Só usamos modelos de provedores cujos termos excluem o treinamento com seus dados.',
      },
      {
        nombre: 'Preciso',
        texto: 'Enriquecemos seu conteúdo e refinamos a recuperação para entregar os resultados mais relevantes. Combinamos busca por significado e por palavras-chave (híbrida), reordenamos os resultados e, quando o RAGfly responde, ele verifica cada afirmação contra seus documentos.',
      },
      {
        nombre: 'Workspaces',
        texto:
          'Um workspace para sua vida pessoal, outro para seu negócio, um por cliente ou empresa. Cada um fica isolado dos demais.',
      },
      { nombre: 'Segurança granular', texto: 'Acesso por workspace, área, papel e agente.' },
    ],
    cierre: 'Experimente o RAGfly com o plano Free.',
    yaTienesCuenta: 'Já tem uma conta?',
    alta: {
      google: 'Continuar com Google',
      microsoft: 'Continuar com Microsoft',
      o: 'ou',
      correo: 'E-mail pessoal ou de trabalho',
      crear: 'Criar conta grátis',
      nota: 'Plano Free. Sem cartão de crédito.',
      verPrecios: 'Ver preços',
      entrar: 'Entrar',
    },
    pie: { guiaMcp: 'Guia MCP', privacidad: 'Privacidade', terminos: 'Termos' },
    faq: {
      titulo: "Perguntas frequentes",
      preguntas: [
        {
          q: "Por que um RAG responde melhor do que buscar nos seus arquivos?",
          a: "Porque trabalha com fragmentos, não com arquivos inteiros. Um sistema de arquivos busca por nome, caminho ou texto exato e devolve arquivos inteiros que seu agente precisa ler por completo. Um RAG divide seus documentos em fragmentos (chunks) e os busca pelo significado: entende perguntas em linguagem natural, encontra muito rápido os fragmentos pertinentes, e entrega ao seu agente só o que ele precisa, com a fonte.",
          tabla: {
            columnas: ["", "Sistema de arquivos", "RAG"],
            filas: [
            ["Busca por", "Nomes de arquivo, caminhos e texto exato", "Significado, contexto e intenção"],
            ["Recupera", "Arquivos inteiros", "Fragmentos específicos (chunks)"],
            ["Entrega", "Caminhos para documentos", "Os trechos pertinentes, com a fonte"],
            ["Linguagem natural", "Baixa: exige palavras-chave exatas", "Alta: entende perguntas conversacionais"],
            ],
          },
        },
        { q: "Vocês armazenam meus documentos?", a: "Não guardamos seus arquivos originais. Para responder ao seu agente, o RAGfly guarda o que a busca precisa: fragmentos do texto, seus embeddings e os metadados do documento. Com o RAGfly Desktop, o arquivo original nunca sai da sua rede." },
        { q: "Quem processa meus documentos?", a: "Modelos de provedores cujos termos excluem o treinamento com seus dados, em todos os planos, inclusive no Free. O RAGfly não usa seus documentos para treinar modelos próprios." },
        { q: "Outras pessoas ou agentes podem ver meus documentos?", a: "Só os workspaces, áreas, papéis e agentes que você autoriza. Cada workspace fica isolado: uma busca em um nunca traz documentos de outro." },
        { q: "Preciso construir um agente para usar o RAGfly?", a: "Não. Conecte o agente que você já usa, como Claude ou GPT, por MCP, ou use REST, o SDK ou a CLI. Seu agente pode ajudar na configuração." },
        { q: "O que muda entre o Free e os planos pagos?", a: "Os limites e a capacidade. A privacidade é a mesma em todos os planos. O Free é permanente, com limites mensais, e não pede cartão de crédito." },
      ],
    },
  },
  fr: {
    etiqueta: 'Service de RAG pour agents',
    eslogan: 'Simple, privé et précis. Accès par workspace, zone, rôle et agent.',
    empezar: 'Commencer gratuitement',
    pasosEtiqueta: 'Comment ça commence',
    pasosTitulo: 'Trois étapes. Ensuite, votre agent prend le relais.',
    reproducirVideo: 'Lire la vidéo',
    pasos: [
      { titulo: 'Créez un compte gratuit.', detalle: 'Avec Google, Microsoft ou votre e-mail.' },
      {
        titulo: 'Choisissez un emplacement et chargez son contenu.',
        detalle:
          "Un dossier sur votre ordinateur avec RAGfly Desktop, ou votre Google Drive ou Dropbox. Vous seul pouvez le faire : votre agent n'a pas cette autorisation.",
      },
      {
        titulo: 'Connectez votre agent via MCP.',
        detalle:
          "Dans Claude ou ChatGPT, ajoutez un connecteur personnalisé avec l'URL de RAGfly et connectez-vous. Les autres agents utilisent une clé API. Votre agent peut vous aider à la configuration.",
      },
    ],
    despuesPasos: 'Ensuite, votre agent travaille seul avec vos documents.',
    queEsRag: {
      titulo: "Qu'est-ce que le RAG ?",
      texto: "RAG signifie génération augmentée par la recherche. Une base de données vectorielle conserve une représentation de vos documents ; avant de répondre, votre agent y cherche les passages dont il a besoin et répond à partir d'eux, en citant la source.",
    },
    pilares: [
      {
        nombre: 'Simple',
        texto:
          "Connectez-vous via MCP, REST, SDK ou CLI. Votre agent peut vous aider à la configuration. Choisissez un emplacement, chargez son contenu, et RAGfly s'occupe du reste.",
      },
      {
        nombre: 'Privé',
        texto:
          "Nous ne stockons pas vos documents. Avec RAGfly Desktop, ils ne quittent jamais votre réseau. Nous n'utilisons que des modèles de fournisseurs dont les conditions excluent l'entraînement sur vos données.",
      },
      {
        nombre: 'Précis',
        texto: 'Nous enrichissons votre contenu et affinons la recherche pour fournir les résultats les plus pertinents. Nous combinons la recherche par le sens et par mots-clés (hybride), réordonnons les résultats et, quand RAGfly répond, il vérifie chaque affirmation dans vos documents.',
      },
      {
        nombre: 'Workspaces',
        texto:
          'Un workspace pour votre vie personnelle, un pour votre activité, un par client ou entreprise. Chacun reste isolé des autres.',
      },
      { nombre: 'Sécurité granulaire', texto: 'Accès par workspace, zone, rôle et agent.' },
    ],
    cierre: 'Essayez RAGfly avec le plan Free.',
    yaTienesCuenta: 'Vous avez déjà un compte ?',
    alta: {
      google: 'Continuer avec Google',
      microsoft: 'Continuer avec Microsoft',
      o: 'ou',
      correo: 'E-mail personnel ou professionnel',
      crear: 'Créer un compte gratuit',
      nota: 'Plan Free. Sans carte bancaire.',
      verPrecios: 'Voir les tarifs',
      entrar: 'Se connecter',
    },
    pie: { guiaMcp: 'Guide MCP', privacidad: 'Confidentialité', terminos: 'Conditions' },
    faq: {
      titulo: "Questions fréquentes",
      preguntas: [
        {
          q: "Pourquoi un RAG répond-il mieux qu'une recherche dans vos fichiers ?",
          a: "Parce qu'il travaille avec des fragments, pas avec des fichiers entiers. Un système de fichiers cherche par nom, chemin ou texte exact et renvoie des fichiers entiers que votre agent doit lire en entier. Un RAG découpe vos documents en fragments (chunks) et les cherche par le sens : il comprend les questions en langage naturel, trouve très vite les fragments pertinents, et ne donne à votre agent que ce dont il a besoin, avec la source.",
          tabla: {
            columnas: ["", "Système de fichiers", "RAG"],
            filas: [
            ["Recherche par", "Noms de fichiers, chemins et texte exact", "Sens, contexte et intention"],
            ["Récupère", "Des fichiers entiers", "Des fragments précis (chunks)"],
            ["Renvoie", "Des chemins vers les documents", "Les passages pertinents, avec leur source"],
            ["Langage naturel", "Faible : exige des mots-clés exacts", "Élevée : comprend les questions conversationnelles"],
            ],
          },
        },
        { q: "Stockez-vous mes documents ?", a: "Nous ne conservons pas vos fichiers originaux. Pour répondre à votre agent, RAGfly garde ce dont la recherche a besoin : des fragments du texte, leurs embeddings et les métadonnées du document. Avec RAGfly Desktop, le fichier original ne quitte jamais votre réseau." },
        { q: "Qui traite mes documents ?", a: "Des modèles de fournisseurs dont les conditions excluent l'entraînement sur vos données, sur tous les plans, Free compris. RAGfly n'utilise pas vos documents pour entraîner ses propres modèles." },
        { q: "D'autres personnes ou agents peuvent-ils voir mes documents ?", a: "Seulement les workspaces, zones, rôles et agents que vous autorisez. Chaque workspace est isolé : une recherche dans l'un ne renvoie jamais de documents d'un autre." },
        { q: "Dois-je créer un agent pour utiliser RAGfly ?", a: "Non. Connectez l'agent que vous utilisez déjà, comme Claude ou GPT, via MCP, ou utilisez REST, le SDK ou la CLI. Votre agent peut vous aider à la configuration." },
        { q: "Qu'est-ce qui change entre Free et les plans payants ?", a: "Les limites et la capacité. La confidentialité est la même sur tous les plans. Free est permanent, avec des limites mensuelles, et ne demande pas de carte bancaire." },
      ],
    },
  },
  de: {
    etiqueta: 'RAG-Dienst für Agenten',
    eslogan: 'Einfach, privat und präzise. Zugriff nach Workspace, Bereich, Rolle und Agent.',
    empezar: 'Kostenlos starten',
    pasosEtiqueta: 'So geht es los',
    pasosTitulo: 'Drei Schritte. Danach übernimmt dein Agent.',
    reproducirVideo: 'Video abspielen',
    pasos: [
      { titulo: 'Erstelle ein kostenloses Konto.', detalle: 'Mit Google, Microsoft oder deiner E-Mail.' },
      {
        titulo: 'Wähle einen Speicherort und lade seinen Inhalt.',
        detalle:
          'Ein Ordner auf deinem Computer mit RAGfly Desktop oder dein Google Drive oder Dropbox. Nur du kannst das tun: Dein Agent hat diese Berechtigung nicht.',
      },
      {
        titulo: 'Verbinde deinen Agenten über MCP.',
        detalle:
          'Füge in Claude oder ChatGPT einen benutzerdefinierten Connector mit der RAGfly-URL hinzu und melde dich an. Andere Agenten nutzen einen API-Key. Dein Agent kann bei der Einrichtung helfen.',
      },
    ],
    despuesPasos: 'Ab dann arbeitet dein Agent selbstständig mit deinen Dokumenten.',
    queEsRag: {
      titulo: "Was ist RAG?",
      texto: "RAG steht für Retrieval-Augmented Generation. Eine Vektordatenbank speichert eine Darstellung deiner Dokumente; bevor dein Agent antwortet, sucht er dort die Passagen, die er braucht, und antwortet darauf gestützt, mit Quellenangabe.",
    },
    pilares: [
      {
        nombre: 'Einfach',
        texto:
          'Verbinde dich über MCP, REST, SDK oder CLI. Dein Agent kann bei der Einrichtung helfen. Wähle einen Speicherort, lade seinen Inhalt, und RAGfly erledigt den Rest.',
      },
      {
        nombre: 'Privat',
        texto:
          'Wir speichern deine Dokumente nicht. Mit RAGfly Desktop verlassen sie nie dein Netzwerk. Wir nutzen nur Modelle von Anbietern, deren Bedingungen das Training mit deinen Daten ausschließen.',
      },
      {
        nombre: 'Präzise',
        texto: 'Wir reichern deine Inhalte an und verfeinern die Suche, um die relevantesten Ergebnisse zu liefern. Wir kombinieren Suche nach Bedeutung und nach Schlüsselwörtern (hybrid), ordnen die Ergebnisse neu, und wenn RAGfly antwortet, prüft es jede Aussage an deinen Dokumenten.',
      },
      {
        nombre: 'Workspaces',
        texto:
          'Ein Workspace für dein Privatleben, einer für dein Business, einer pro Kunde oder Unternehmen. Jeder bleibt von den anderen isoliert.',
      },
      { nombre: 'Granulare Sicherheit', texto: 'Zugriff nach Workspace, Bereich, Rolle und Agent.' },
    ],
    cierre: 'Teste RAGfly mit dem Free-Plan.',
    yaTienesCuenta: 'Du hast schon ein Konto?',
    alta: {
      google: 'Weiter mit Google',
      microsoft: 'Weiter mit Microsoft',
      o: 'oder',
      correo: 'Private oder geschäftliche E-Mail',
      crear: 'Kostenloses Konto erstellen',
      nota: 'Free-Plan. Keine Kreditkarte.',
      verPrecios: 'Preise ansehen',
      entrar: 'Anmelden',
    },
    pie: { guiaMcp: 'MCP-Leitfaden', privacidad: 'Datenschutz', terminos: 'AGB' },
    faq: {
      titulo: "Häufige Fragen",
      preguntas: [
        {
          q: "Warum antwortet ein RAG besser als eine Suche in deinen Dateien?",
          a: "Weil es mit Fragmenten arbeitet, nicht mit ganzen Dateien. Ein Dateisystem sucht nach Namen, Pfaden oder exaktem Text und liefert ganze Dateien, die dein Agent vollständig lesen muss. Ein RAG zerlegt deine Dokumente in Fragmente (Chunks) und durchsucht sie nach Bedeutung: Es versteht Fragen in natürlicher Sprache, findet die passenden Fragmente sehr schnell, und gibt deinem Agenten nur, was er braucht, mit Quelle.",
          tabla: {
            columnas: ["", "Dateisystem", "RAG"],
            filas: [
            ["Sucht nach", "Dateinamen, Pfaden und exaktem Text", "Bedeutung, Kontext und Absicht"],
            ["Liefert", "Ganze Dateien", "Gezielte Fragmente (Chunks)"],
            ["Ergebnis", "Pfade zu Dokumenten", "Die passenden Passagen, mit Quelle"],
            ["Natürliche Sprache", "Gering: braucht exakte Schlüsselwörter", "Hoch: versteht Fragen im Gesprächston"],
            ],
          },
        },
        { q: "Speichert ihr meine Dokumente?", a: "Deine Originaldateien bewahren wir nicht auf. Um deinem Agenten zu antworten, speichert RAGfly, was die Suche braucht: Textfragmente, ihre Embeddings und die Metadaten des Dokuments. Mit RAGfly Desktop verlässt die Originaldatei nie dein Netzwerk." },
        { q: "Wer verarbeitet meine Dokumente?", a: "Modelle von Anbietern, deren Bedingungen das Training mit deinen Daten ausschließen, in allen Plänen, auch im Free-Plan. RAGfly nutzt deine Dokumente nicht, um eigene Modelle zu trainieren." },
        { q: "Können andere Personen oder Agenten meine Dokumente sehen?", a: "Nur die Workspaces, Bereiche, Rollen und Agenten, die du freigibst. Jeder Workspace ist isoliert: Eine Suche in einem liefert nie Dokumente aus einem anderen." },
        { q: "Muss ich einen Agenten bauen, um RAGfly zu nutzen?", a: "Nein. Verbinde den Agenten, den du schon nutzt, etwa Claude oder GPT, über MCP, oder nutze REST, das SDK oder die CLI. Dein Agent kann bei der Einrichtung helfen." },
        { q: "Was ist der Unterschied zwischen Free und den bezahlten Plänen?", a: "Limits und Kapazität. Der Datenschutz ist in allen Plänen gleich. Der Free-Plan ist dauerhaft, mit monatlichen Limits, und braucht keine Kreditkarte." },
      ],
    },
  },
}

/* El registro y el login viven en la app (el sitio solo vuelca al Login,
   decisión de Víctor del 15-oct). `?registro=1` abre directo el formulario de
   alta en app.ragfly.ai/login; las utm_* que reenvía BotonEmpezar las guarda la
   app y viajan con el alta (pendiente 413943, en PROD desde el 15-oct). */
export const URL_REGISTRO = 'https://app.ragfly.ai/login?registro=1'
export const URL_LOGIN = 'https://app.ragfly.ai/login'
export const URL_GUIA_MCP = '/build/mcp'
