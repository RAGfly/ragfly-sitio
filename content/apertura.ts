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
/* no medidas. Sin FAQ, sin precios, sin línea de proveedores ni       */
/* diferencias de privacidad por plan (todos en carril A).             */
/* ------------------------------------------------------------------ */

import type { Locale } from '../i18n/config'

/**
 * Mientras sea `false`, las páginas responden 404 en producción
 * (VERCEL_ENV=production) y se ven en previews y en local.
 */
export const PUBLICADA = true

export type Dolor = 'context' | 'memory'

type TextosDolor = {
  /** Gancho del aviso: el mismo título que la persona vio en el aviso. */
  gancho: string
  /**
   * Ganchos del par de Reddit Ads que llegan a esta misma página (?h=c1).
   * Dentro de un par solo cambia el título (plan §6).
   */
  ganchosAlternos: Record<string, string>
  /** Bajada vigente del dolor (MENSAJE-CANONICO §7.3). */
  bajada: string
  /** Primera frase del video 1 (abre con el dolor). */
  aperturaVideo: string
  metaDescripcion: string
}

export type PaginaDolor = {
  idGancho: string
  video: {
    id: string
    /** URL del video publicado; vacío = no se muestra. */
    src: string
    poster?: string
  }
  textos: Record<Locale, TextosDolor>
}

export const PAGINAS: Record<Dolor, PaginaDolor> = {
  context: {
    idGancho: 'C4',
    video: { id: '1A', src: '' },
    textos: {
      en: {
        gancho: 'Is your second brain burning too many tokens?',
        ganchosAlternos: { c1: 'Still pasting the same files into every new session?' },
        bajada: "Your agent doesn't need to load everything. It asks for what the task needs, with the source.",
        aperturaVideo: 'Your agent read the whole folder. Then it lost track of what you asked.',
        metaDescripcion:
          'RAGfly is a RAG service for your agents. Your documents are indexed once; the agent asks for what the task needs, with the source.',
      },
      es: {
        gancho: '¿Tu segundo cerebro está gastando demasiados tokens?',
        ganchosAlternos: { c1: '¿Sigues pegando los mismos archivos en cada sesión nueva?' },
        bajada: 'Tu agente no necesita cargarlo todo. Consulta solo lo que la tarea pide, con la cita.',
        aperturaVideo: 'Tu agente leyó la carpeta entera. Y después perdió el hilo de lo que le pediste.',
        metaDescripcion:
          'RAGfly es un servicio de RAG para tus agentes. Tus documentos se indexan una vez; el agente consulta lo que la tarea pide, con la cita.',
      },
      pt: {
        gancho: 'Seu segundo cérebro está gastando tokens demais?',
        ganchosAlternos: { c1: 'Ainda colando os mesmos arquivos em cada nova sessão?' },
        bajada: 'Seu agente não precisa carregar tudo. Ele consulta só o que a tarefa pede, com a fonte.',
        aperturaVideo: 'Seu agente leu a pasta inteira. Depois perdeu o fio do que você pediu.',
        metaDescripcion:
          'O RAGfly é um serviço de RAG para seus agentes. Seus documentos são indexados uma vez; o agente consulta o que a tarefa pede, com a fonte.',
      },
      fr: {
        gancho: 'Votre second cerveau brûle-t-il trop de tokens ?',
        ganchosAlternos: { c1: 'Vous collez encore les mêmes fichiers à chaque nouvelle session ?' },
        bajada: "Votre agent n'a pas besoin de tout charger. Il demande ce dont la tâche a besoin, avec la source.",
        aperturaVideo: "Votre agent a lu tout le dossier. Puis il a perdu le fil de votre demande.",
        metaDescripcion:
          "RAGfly est un service de RAG pour vos agents. Vos documents sont indexés une fois ; l'agent demande ce dont la tâche a besoin, avec la source.",
      },
      de: {
        gancho: 'Verbrennt dein zweites Gehirn zu viele Tokens?',
        ganchosAlternos: { c1: 'Fügst du immer noch in jede neue Sitzung dieselben Dateien ein?' },
        bajada: 'Dein Agent muss nicht alles laden. Er fragt nur ab, was die Aufgabe braucht, mit Quelle.',
        aperturaVideo: 'Dein Agent hat den ganzen Ordner gelesen. Dann hat er den Faden verloren.',
        metaDescripcion:
          'RAGfly ist ein RAG-Dienst für deine Agenten. Deine Dokumente werden einmal indexiert; der Agent fragt ab, was die Aufgabe braucht, mit Quelle.',
      },
    },
  },
  memory: {
    idGancho: 'M4',
    video: { id: '1B', src: '' },
    textos: {
      en: {
        gancho: 'When your second brain outgrows its links.',
        ganchosAlternos: { m1: 'Every new session, your agent starts from zero.' },
        bajada:
          'A memory your agent queries, not a file that grows out of control. One workspace for each part of your life.',
        aperturaVideo: "Your agent's memory folder started with a few notes. Now it mixes every project you have.",
        metaDescripcion: "Turn your agent's documentation into memory it queries, split into workspaces you define.",
      },
      es: {
        gancho: 'Cuando tu segundo cerebro ya no cabe en sus enlaces.',
        ganchosAlternos: { m1: 'En cada sesión nueva, tu agente parte de cero.' },
        bajada:
          'Una memoria que tu agente consulta, no un archivo que crece sin control. Un workspace para cada parte de tu vida.',
        aperturaVideo: 'La carpeta de memoria de tu agente empezó con unas pocas notas. Hoy mezcla todos tus proyectos.',
        metaDescripcion:
          'Convierte la documentación de tu agente en una memoria que consulta, separada en los workspaces que tú defines.',
      },
      pt: {
        gancho: 'Quando seu segundo cérebro não cabe mais nos seus links.',
        ganchosAlternos: { m1: 'A cada nova sessão, seu agente começa do zero.' },
        bajada:
          'Uma memória que seu agente consulta, não um arquivo que cresce sem controle. Um workspace para cada parte da sua vida.',
        aperturaVideo: 'A pasta de memória do seu agente começou com poucas notas. Hoje mistura todos os seus projetos.',
        metaDescripcion:
          'Transforme a documentação do seu agente em uma memória que ele consulta, separada nos workspaces que você define.',
      },
      fr: {
        gancho: 'Quand votre second cerveau déborde de ses liens.',
        ganchosAlternos: { m1: 'À chaque nouvelle session, votre agent repart de zéro.' },
        bajada:
          "Une mémoire que votre agent interroge, pas un fichier qui grossit sans contrôle. Un workspace pour chaque partie de votre vie.",
        aperturaVideo:
          "Le dossier mémoire de votre agent a commencé avec quelques notes. Aujourd'hui, il mélange tous vos projets.",
        metaDescripcion:
          "Transformez la documentation de votre agent en une mémoire qu'il interroge, répartie dans les workspaces que vous définissez.",
      },
      de: {
        gancho: 'Wenn dein zweites Gehirn über seine Links hinauswächst.',
        ganchosAlternos: { m1: 'Bei jeder neuen Sitzung fängt dein Agent bei null an.' },
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
  videoPasos: string
  pasos: { titulo: string; detalle: string }[]
  despuesPasos: string
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
    entrar: string
  }
  pie: { guiaMcp: string; privacidad: string; terminos: string }
}

/* Video del Quickstart en YouTube (Víctor, 15-oct), el mismo en todos los
   idiomas. Sin el parámetro `si` del enlace compartido. */
export const URL_VIDEO_PASOS = 'https://youtu.be/EfhvUpb80FI'

export const COMUN: Record<Locale, TextosComunes> = {
  en: {
    etiqueta: 'RAG service for agents',
    eslogan: 'Simple, private, and precise. Access by workspace, area, role and agent.',
    empezar: 'Start free',
    pasosEtiqueta: 'How it starts',
    pasosTitulo: 'Three steps. Then your agent takes it from there.',
    videoPasos: 'Watch the video',
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
          "We don't store your documents. With RAGfly Desktop, they never leave your network. Your document data is encrypted. We only use models from providers whose terms exclude training on your data.",
      },
      {
        nombre: 'Precise',
        texto: 'We enrich your content and refine retrieval to deliver the most relevant results.',
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
      entrar: 'Log in',
    },
    pie: { guiaMcp: 'MCP guide', privacidad: 'Privacy', terminos: 'Terms' },
  },
  es: {
    etiqueta: 'Servicio de RAG para agentes',
    eslogan: 'Simple, privado y preciso. Acceso por workspace, área, rol y agente.',
    empezar: 'Empieza gratis',
    pasosEtiqueta: 'Cómo empieza',
    pasosTitulo: 'Tres pasos. Desde ahí sigue tu agente.',
    videoPasos: 'Ver el video',
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
    pilares: [
      {
        nombre: 'Simple',
        texto:
          'Conéctate por MCP, REST, SDK o CLI. Tu agente puede ayudarte con la configuración. Elige una ubicación, carga su contenido y RAGfly se encarga del resto.',
      },
      {
        nombre: 'Privado',
        texto:
          'No guardamos tus documentos. Con RAGfly Desktop, nunca salen de tu red. Los datos de tus documentos van cifrados. Solo usamos modelos de proveedores cuyos términos excluyen entrenar con tus datos.',
      },
      {
        nombre: 'Preciso',
        texto: 'Enriquecemos tu contenido y afinamos la recuperación para entregar los resultados más relevantes.',
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
      entrar: 'Inicia sesión',
    },
    pie: { guiaMcp: 'Guía MCP', privacidad: 'Privacidad', terminos: 'Términos' },
  },
  pt: {
    etiqueta: 'Serviço de RAG para agentes',
    eslogan: 'Simples, privado e preciso. Acesso por workspace, área, papel e agente.',
    empezar: 'Comece grátis',
    pasosEtiqueta: 'Como começa',
    pasosTitulo: 'Três passos. Depois, seu agente segue sozinho.',
    videoPasos: 'Ver o vídeo',
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
    pilares: [
      {
        nombre: 'Simples',
        texto:
          'Conecte por MCP, REST, SDK ou CLI. Seu agente pode ajudar na configuração. Escolha um local, carregue o conteúdo e o RAGfly cuida do resto.',
      },
      {
        nombre: 'Privado',
        texto:
          'Não armazenamos seus documentos. Com o RAGfly Desktop, eles nunca saem da sua rede. Os dados dos seus documentos são criptografados. Só usamos modelos de provedores cujos termos excluem o treinamento com seus dados.',
      },
      {
        nombre: 'Preciso',
        texto: 'Enriquecemos seu conteúdo e refinamos a recuperação para entregar os resultados mais relevantes.',
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
      entrar: 'Entrar',
    },
    pie: { guiaMcp: 'Guia MCP', privacidad: 'Privacidade', terminos: 'Termos' },
  },
  fr: {
    etiqueta: 'Service de RAG pour agents',
    eslogan: 'Simple, privé et précis. Accès par workspace, zone, rôle et agent.',
    empezar: 'Commencer gratuitement',
    pasosEtiqueta: 'Comment ça commence',
    pasosTitulo: 'Trois étapes. Ensuite, votre agent prend le relais.',
    videoPasos: 'Voir la vidéo',
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
    pilares: [
      {
        nombre: 'Simple',
        texto:
          "Connectez-vous via MCP, REST, SDK ou CLI. Votre agent peut vous aider à la configuration. Choisissez un emplacement, chargez son contenu, et RAGfly s'occupe du reste.",
      },
      {
        nombre: 'Privé',
        texto:
          "Nous ne stockons pas vos documents. Avec RAGfly Desktop, ils ne quittent jamais votre réseau. Les données de vos documents sont chiffrées. Nous n'utilisons que des modèles de fournisseurs dont les conditions excluent l'entraînement sur vos données.",
      },
      {
        nombre: 'Précis',
        texto: 'Nous enrichissons votre contenu et affinons la recherche pour fournir les résultats les plus pertinents.',
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
      entrar: 'Se connecter',
    },
    pie: { guiaMcp: 'Guide MCP', privacidad: 'Confidentialité', terminos: 'Conditions' },
  },
  de: {
    etiqueta: 'RAG-Dienst für Agenten',
    eslogan: 'Einfach, privat und präzise. Zugriff nach Workspace, Bereich, Rolle und Agent.',
    empezar: 'Kostenlos starten',
    pasosEtiqueta: 'So geht es los',
    pasosTitulo: 'Drei Schritte. Danach übernimmt dein Agent.',
    videoPasos: 'Video ansehen',
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
    pilares: [
      {
        nombre: 'Einfach',
        texto:
          'Verbinde dich über MCP, REST, SDK oder CLI. Dein Agent kann bei der Einrichtung helfen. Wähle einen Speicherort, lade seinen Inhalt, und RAGfly erledigt den Rest.',
      },
      {
        nombre: 'Privat',
        texto:
          'Wir speichern deine Dokumente nicht. Mit RAGfly Desktop verlassen sie nie dein Netzwerk. Die Daten deiner Dokumente sind verschlüsselt. Wir nutzen nur Modelle von Anbietern, deren Bedingungen das Training mit deinen Daten ausschließen.',
      },
      {
        nombre: 'Präzise',
        texto: 'Wir reichern deine Inhalte an und verfeinern die Suche, um die relevantesten Ergebnisse zu liefern.',
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
      entrar: 'Anmelden',
    },
    pie: { guiaMcp: 'MCP-Leitfaden', privacidad: 'Datenschutz', terminos: 'AGB' },
  },
}

/* El registro y el login viven en la app (el sitio solo vuelca al Login,
   decisión de Víctor del 15-oct). `?registro=1` abre directo el formulario de
   alta en app.ragfly.ai/login; las utm_* que reenvía BotonEmpezar las guarda la
   app y viajan con el alta (pendiente 413943, en PROD desde el 15-oct). */
export const URL_REGISTRO = 'https://app.ragfly.ai/login?registro=1'
export const URL_LOGIN = 'https://app.ragfly.ai/login'
export const URL_GUIA_MCP = '/build/mcp'
