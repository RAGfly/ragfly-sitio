import { ImageResponse } from "next/og";

// Imagen social (Open Graph / Twitter) generada en build.
// Paleta de marca: dark #0F1729, gradiente #1E4A82 → #4089CD → #7AB4DD.
export const alt = "RAGfly — RAG framework multi-tenant para agentes de IA";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#0F1729",
          padding: "72px 80px",
          fontFamily: "sans-serif",
        }}
      >
        {/* Barra de acento (gradiente de marca) */}
        <div
          style={{
            display: "flex",
            width: 220,
            height: 12,
            borderRadius: 8,
            background: "linear-gradient(90deg, #1E4A82 0%, #4089CD 50%, #7AB4DD 100%)",
          }}
        />

        {/* Bloque central */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              fontSize: 96,
              fontWeight: 800,
              color: "#FFFFFF",
              letterSpacing: "-0.03em",
            }}
          >
            RAGfly
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 24,
              fontSize: 44,
              fontWeight: 600,
              lineHeight: 1.2,
              color: "#7AB4DD",
            }}
          >
            RAG framework multi-tenant
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 12,
              fontSize: 34,
              fontWeight: 400,
              lineHeight: 1.3,
              color: "#B4B3B3",
              maxWidth: 980,
            }}
          >
            Recuperación aumentada para tus agentes de IA, aislada por cliente y con privacidad verificable.
          </div>
        </div>

        {/* Pie */}
        <div
          style={{
            display: "flex",
            fontSize: 28,
            fontWeight: 500,
            color: "#646363",
            letterSpacing: "0.02em",
          }}
        >
          ragfly.ai · MCP · REST · CLI · SDK
        </div>
      </div>
    ),
    { ...size },
  );
}
