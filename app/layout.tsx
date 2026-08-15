import type { Metadata } from "next";
import { Inter, Lora, Manrope } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages, getTranslations } from "next-intl/server";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const lora = Lora({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
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
// Precios = fuente de verdad content/planes.mjs (sincronizar si cambian).
// FAQ: fuente única en comercial/comercial-operativo/RAGfly_FAQ.md (bloque A).
// Vive en i18n (namespace `faq`, claves q0/a0…qN/aN + `total`) en los 5 idiomas,
// para que el FAQPage estructurado hable el mismo idioma que la página.
type FaqEntry = { q: string; a: string };

const buildJsonLd = (faq: FaqEntry[]) => ({
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
        "Servicio de RAG multi-tenant para agentes de IA: convierte cualquier corpus de documentos en una base de recuperación segura, aislada por cliente y lista para producción. Cloud no conserva el archivo original; Desktop lo procesa localmente; en planes soberanos la base de datos es del cliente.",
      featureList: [
        "De cero a producción apuntando a un directorio (ingesta, vectorización e indexado automáticos)",
        "Multi-tenant de fábrica: un corpus aislado por contexto (Grupos → Entidades → Áreas)",
        "Privacidad por modo: original no conservado en Cloud, procesamiento local en Desktop y BD propia en planes soberanos",
        "Recuperación con citas y permisos (RBAC para personas y para agentes vía perfiles)",
        "DB-agnóstico y BYO: trae tu propia base vectorial y tu propio LLM",
        "Superficies MCP, REST, CLI y SDK en todos los planes",
      ],
      offers: {
        "@type": "AggregateOffer",
        priceCurrency: "USD",
        lowPrice: "0",
        highPrice: "590",
        offerCount: "5",
      },
    },
    {
      "@type": "OfferCatalog",
      "@id": "https://ragfly.ai/#planes",
      name: "Planes de RAGfly",
      itemListElement: [
        { "@type": "Offer", name: "Free", price: "0", priceCurrency: "USD", url: "https://ragfly.ai/#planes", description: "POC y evaluación — 2 Entities, 500 Pages totales, 25 Retrievals/día y 50 Verified Answers totales." },
        { "@type": "Offer", name: "Starter", price: "39", priceCurrency: "USD", url: "https://ragfly.ai/#planes", description: "Para empezar en producción — 5 Entities, 2.000 Pages/mes, 5.000 Retrievals/mes y 300 Verified Answers/mes." },
        { "@type": "Offer", name: "Growth", price: "149", priceCurrency: "USD", url: "https://ragfly.ai/#planes", description: "Para equipos con Control por Área · parsing-BYOK · embedding-BYOK — 10 Entities, 10.000 Pages/mes, 25.000 Retrievals/mes y 1.500 Verified Answers/mes." },
        { "@type": "Offer", name: "Scale", price: "590", priceCurrency: "USD", url: "https://ragfly.ai/#planes", description: "Producción a escala — 25 Entities, 40.000 Pages/mes, 100.000 Retrievals/mes, 5.000 Verified Answers/mes y BYO vectorial/LLM." },
        { "@type": "Offer", name: "Enterprise / Soberano", url: "https://ragfly.ai/#planes", description: "Plan custom sales-assisted con contrato anual, DPA/SLA y despliegue dedicado si aplica." },
      ],
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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const messages = await getMessages();
  const tFaq = await getTranslations("faq");
  const jsonLd = buildJsonLd(
    Array.from({ length: Number(tFaq("total")) }, (_, i) => ({
      q: tFaq(`q${i}` as Parameters<typeof tFaq>[0]),
      a: tFaq(`a${i}` as Parameters<typeof tFaq>[0]),
    })),
  );

  return (
    <html lang={locale} className={`${inter.variable} ${lora.variable} ${manrope.variable} h-full antialiased`}>
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
