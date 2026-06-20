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
const jsonLd = {
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
        "Infraestructura RAG multi-tenant para agentes de IA: convierte cualquier corpus de documentos en una base de recuperación segura, aislada por cliente y lista para producción, apuntando a un directorio. El dato no sale de tu red. Vía MCP, REST y CLI.",
      featureList: [
        "De cero a producción apuntando a un directorio (ingesta, vectorización e indexado automáticos)",
        "Multi-tenant de fábrica: un corpus aislado por cliente (Grupos → Entidades → Áreas)",
        "El documento nunca sale de la red: vectorización «en el aire», Client LM opcional",
        "Recuperación con citas y permisos (RBAC para personas y para agentes vía perfiles)",
        "DB-agnóstico y BYO: trae tu propia base vectorial y tu propio LLM",
        "Superficies MCP, REST y CLI en todos los planes",
      ],
      offers: {
        "@type": "AggregateOffer",
        priceCurrency: "USD",
        lowPrice: "0",
        highPrice: "490",
        offerCount: "5",
      },
    },
    {
      "@type": "OfferCatalog",
      "@id": "https://ragfly.ai/#planes",
      name: "Planes de RAGfly",
      itemListElement: [
        { "@type": "Offer", name: "Free", price: "0", priceCurrency: "USD", description: "Para probar — ~1.000 páginas procesadas, 1 entidad." },
        { "@type": "Offer", name: "Starter", price: "19", priceCurrency: "USD", description: "Para un dev en solitario — ~4.000 páginas, 1 entidad." },
        { "@type": "Offer", name: "Team", price: "95", priceCurrency: "USD", description: "Multi-tenant para consultoras — ~10.000 páginas, hasta 3 entidades aisladas." },
        { "@type": "Offer", name: "Scale", price: "490", priceCurrency: "USD", description: "Producción a escala — ~60.000 páginas, hasta 15 entidades, Client LM/on-prem y BYO." },
        { "@type": "Offer", name: "Enterprise", description: "Regulado, soberano o gran volumen — inbound; despliegue managed u on-prem/soberano." },
      ],
    },
    {
      "@type": "FAQPage",
      "@id": "https://ragfly.ai/#faq",
      mainEntity: [
        {
          "@type": "Question",
          name: "¿Qué es RAGfly?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "La capa de contexto documental para agentes de IA: convierte cualquier corpus de documentos —miles o decenas de miles, incluidos escaneados— en una base de recuperación segura, multi-tenant y lista para producción, sin construir ni mantener un pipeline RAG.",
          },
        },
        {
          "@type": "Question",
          name: "¿Para quién es?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Para desarrolladores, consultoras e integradores que construyen agentes de IA sobre documentos privados —a veces de muchos clientes distintos— y no quieren ser dueños de la infraestructura RAG a escala.",
          },
        },
        {
          "@type": "Question",
          name: "¿Cuánto cuesta?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Cobro por página procesada, en páginas y dólares: Free $0 (~1.000 páginas), Starter $19 (~4.000), Team $95 (~10.000, multi-tenant), Scale $490 (~60.000) y Enterprise inbound. Página adicional Fast $0,02 / Hi-res $0,05. Superficies MCP/REST/CLI en todos los planes.",
          },
        },
        {
          "@type": "Question",
          name: "¿Cómo funciona?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Apuntas RAGfly al directorio de tus documentos; el sistema los escanea, vectoriza e indexa automáticamente. Luego tu agente recupera por significado y obtiene respuestas con citas a la fuente vía MCP, REST o CLI — aislado por cliente y dentro de tu red.",
          },
        },
        {
          "@type": "Question",
          name: "¿Cómo consume un agente de IA a RAGfly?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Vía un servidor MCP remoto (SSE o HTTP) o la CLI de RAGfly Desktop, autenticándose con JWT o API Key. El catálogo de operaciones está publicado en https://ragfly.ai/agents.json y https://ragfly.ai/llms-full.txt.",
          },
        },
        {
          "@type": "Question",
          name: "¿Mis documentos salen a la nube?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "No. La indexación y vectorización se realizan «en el aire» y los datos quedan encriptados. Con RAGfly Desktop la indexación no sale de la red interna del cliente.",
          },
        },
      ],
    },
  ],
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const messages = await getMessages();

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
