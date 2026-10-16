import type { Metadata } from "next";
import { Inter, Zalando_Sans, Zalando_Sans_Expanded, Montserrat_Alternates } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages, getTranslations } from "next-intl/server";
import "./globals.css";
import { bajadaPlan, cargarCatalogo, cuposPlan, type Catalogo } from "../lib/catalogo-planes";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const zalando = Zalando_Sans_Expanded({
  variable: "--font-dato",
  subsets: ["latin"],
});

const zalandoMarketing = Zalando_Sans({
  variable: "--font-marketing-enfasis", subsets: ["latin"], style: ["italic"], weight: ["600"],
});

const montserrat = Montserrat_Alternates({
  variable: "--font-interfaz",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("metadata");
  return {
    metadataBase: new URL("https://ragfly.ai"),
    // Verificación de propiedad en Google Search Console (necesaria para la
    // verificación OAuth del conector de Google Drive: dominio autorizado).
    verification: {
      google: "jr4AtHP1EE0jv8mk9SF30S1AAarBbP_Fsh_qCNg7tQU",
    },
    title: t("title"),
    description: t("description"),
    keywords: t.raw("keywords") as string[],
    alternates: {
      canonical: "/",
      languages: {
        es: "/",
        en: "/",
        pt: "/",
        fr: "/",
        de: "/",
        "x-default": "/",
      },
    },
    openGraph: {
      type: "website",
      siteName: "RAGfly",
      url: "https://ragfly.ai",
      title: t("title"),
      description: t("description"),
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("description"),
    },
  };
}

// JSON-LD: señales estructuradas para agentes y buscadores de IA.
// Mantener en español (mercado primario); los agentes lo parsean igual.
// Precios y cupos = GET /pagos/catalogo-publico (BD), vía lib/catalogo-planes.ts:
// las ofertas del JSON-LD se arman del catálogo vivo, no se escriben a mano.
// FAQ: fuente única en comercial/comercial-operativo/RAGfly_FAQ.md (bloque A).
// Vive en i18n (namespace `faq`, claves q0/a0…qN/aN + `total`) en los 5 idiomas,
// para que el FAQPage estructurado hable el mismo idioma que la página.
type FaqEntry = { q: string; a: string };

// Planes: catálogo vivo en el idioma de la página, con la misma bajada y los mismos
// cupos que la grilla (PricingSection), para que el OfferCatalog no quede en español.
type TextosPlanes = { titulo: string; aMedida: string; porMesCorto: string; otrosLimites: string; sub: (codigo: string) => string };

const buildJsonLd = (faq: FaqEntry[], catalogo: Catalogo, locale: string, tp: TextosPlanes) => {
  const precios = catalogo.planes
    .map((plan) => plan.precio_mensual_usd)
    .filter((precio): precio is number => precio != null);
  return ({
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://ragfly.ai/#organization",
      name: "RAGfly",
      url: "https://ragfly.ai",
      logo: "https://ragfly.ai/logo_4_3c.png",
    },
    {
      "@type": "SoftwareApplication",
      "@id": "https://ragfly.ai/#software",
      name: "RAGfly",
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web, macOS, Windows",
      url: "https://ragfly.ai",
      publisher: { "@id": "https://ragfly.ai/#organization" },
      description:
        "Servicio de RAG para agentes de IA: convierte cualquier corpus de documentos en una base de recuperación segura, con acceso por workspace, área, rol y agente, y lista para producción. Cloud no conserva el archivo original; Desktop lo procesa localmente; en planes soberanos la base de datos es del cliente.",
      featureList: [
        "De cero a producción apuntando a un directorio (ingesta, vectorización e indexado automáticos)",
        "Workspaces aislados de fábrica: un corpus aislado por workspace (Organización → Workspaces → Áreas), con acceso por área, rol y agente",
        "Privacidad por modo: original no conservado en Cloud, procesamiento local en Desktop y BD propia en planes soberanos",
        "Recuperación con citas y permisos (RBAC para personas y para agentes vía perfiles)",
        "DB-agnóstico y BYO: trae tu propia base vectorial y tu propio LLM",
        "Superficies MCP, REST, CLI y SDK en todos los planes",
      ],
      offers: {
        "@type": "AggregateOffer",
        priceCurrency: "USD",
        lowPrice: String(Math.min(...precios)),
        highPrice: String(Math.max(...precios)),
        offerCount: String(catalogo.planes.length),
      },
    },
    {
      "@type": "OfferCatalog",
      "@id": "https://ragfly.ai/#planes",
      name: `RAGfly — ${tp.titulo}`,
      itemListElement: catalogo.planes.map((plan) => {
        const bajada = bajadaPlan(plan, locale, tp.sub(plan.codigo_plan));
        if (plan.precio_mensual_usd == null)
          return { "@type": "Offer", name: plan.nombre, url: "https://ragfly.ai/#planes", description: bajada };
        const { principales, secundarios } = cuposPlan(catalogo, plan.codigo_plan, locale, tp);
        return { "@type": "Offer", name: plan.nombre, price: String(plan.precio_mensual_usd), priceCurrency: "USD", url: "https://ragfly.ai/#planes", description: `${bajada.replace(/\.?$/, ".")} ${principales.join(", ")}. ${tp.otrosLimites}: ${secundarios}.` };
      }),
    },
    {
      "@type": "FAQPage",
      "@id": "https://ragfly.ai/#faq",
      mainEntity: faq.map((item) => ({
        "@type": "Question",
        name: item.q,
        acceptedAnswer: { "@type": "Answer", text: item.a },
      })),
    },
  ],
  });
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const messages = await getMessages();
  const tFaq = await getTranslations("faq");
  const tPlanes = await getTranslations("planes");
  const jsonLd = buildJsonLd(
    Array.from({ length: Number(tFaq("total")) }, (_, i) => ({
      q: tFaq(`q${i}` as Parameters<typeof tFaq>[0]),
      a: tFaq(`a${i}` as Parameters<typeof tFaq>[0]),
    })),
    await cargarCatalogo(locale),
    locale,
    {
      titulo: tPlanes("eyebrow"),
      aMedida: tPlanes("aMedida"),
      porMesCorto: tPlanes("porMesCorto"),
      otrosLimites: tPlanes("limitesSecundarios"),
      sub: (codigo) => tPlanes(`sub${codigo}` as Parameters<typeof tPlanes>[0]),
    },
  );

  return (
    <html lang={locale} className={`${inter.variable} ${zalando.variable} ${montserrat.variable} ${zalandoMarketing.variable} h-full antialiased`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {/* llmstxt.org: anuncia el catálogo para crawlers de IA */}
        <link rel="alternate" type="text/plain" title="LLMs.txt" href="https://ragfly.ai/llms.txt" />
        <link rel="alternate" type="text/plain" title="LLMs-full.txt" href="https://ragfly.ai/llms-full.txt" />
        <link rel="alternate" type="application/json" title="AI Agent Catalog" href="https://ragfly.ai/agents.json" />
      </head>
      <body className="min-h-full flex flex-col">
        <NextIntlClientProvider locale={locale} messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
