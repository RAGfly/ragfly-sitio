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
      logo: "https://ragfly.ai/ragfly_logo.png",
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
        "Infraestructura RAG multi-tenant: conversa con tus documentos en lenguaje natural y entrega a tus agentes de IA el contexto documental exacto, filtrado por RBAC, vía MCP, CLI y API REST.",
      featureList: [
        "Búsqueda semántica vectorial con citas a la fuente",
        "Indexación y vectorización automáticas del directorio de documentos",
        "Servidor MCP remoto y CLI para agentes de IA",
        "Multi-tenant con RBAC granular por grupo, entidad, rol y función",
        "Configurable en lenguaje natural (prompts), sin programar",
      ],
      offers: {
        "@type": "AggregateOffer",
        priceCurrency: "USD",
        lowPrice: "7.99",
        highPrice: "1990",
        offerCount: "5",
      },
    },
    {
      "@type": "OfferCatalog",
      "@id": "https://ragfly.ai/#planes",
      name: "Planes de RAGfly",
      itemListElement: [
        { "@type": "Offer", name: "Professional", price: "7.99", priceCurrency: "USD", description: "Para profesionales independientes." },
        { "@type": "Offer", name: "Team", price: "49.99", priceCurrency: "USD", description: "Para equipos colaborativos." },
        { "@type": "Offer", name: "Business", price: "199", priceCurrency: "USD", description: "Control estricto y privacidad." },
        { "@type": "Offer", name: "Enterprise", price: "1990", priceCurrency: "USD", description: "Gran volumen y máxima escala." },
        { "@type": "Offer", name: "Corporate", description: "Corporaciones y holdings — a medida." },
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
            text: "Infraestructura RAG multi-tenant lista para usar: permite conversar con tus documentos en lenguaje natural y entrega a cualquier agente de IA el contexto documental exacto que necesita, filtrado por RBAC.",
          },
        },
        {
          "@type": "Question",
          name: "¿Para quién es?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Para profesionales, equipos, empresas y holdings que trabajan con grandes volúmenes de documentos; y para desarrolladores o integradores que construyen agentes de IA y necesitan contexto documental resuelto.",
          },
        },
        {
          "@type": "Question",
          name: "¿Cuánto cuesta?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Professional USD $7,99/mes, Team USD $49,99/mes, Business USD $199/mes, Enterprise USD $1.990/mes y Corporate a medida. Prueba gratis de 15 días sin método de pago.",
          },
        },
        {
          "@type": "Question",
          name: "¿Cómo funciona?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Apuntas RAGfly al directorio de tus documentos; el sistema los escanea, vectoriza e indexa automáticamente. Luego consultas por significado en lenguaje natural y obtienes respuestas con citas a la fuente, en el chat o servidas a tus agentes.",
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
      </head>
      <body className="min-h-full flex flex-col">
        <NextIntlClientProvider locale={locale} messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
