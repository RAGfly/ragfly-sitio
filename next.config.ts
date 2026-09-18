import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // La guía de integración se movió de /quickstart al hub /build.
      { source: "/quickstart", destination: "/build", permanent: true },
      // Documentos legales reubicados al namespace /legal (ES -> EN).
      { source: "/terminos", destination: "/legal/terms", permanent: true },
      { source: "/privacidad", destination: "/legal/privacy", permanent: true },
      // La página de reembolsos es /legal/refund (singular); el plural se usó en docs.
      { source: "/legal/refunds", destination: "/legal/refund", permanent: true },
    ];
  },
};

export default withNextIntl(nextConfig);
