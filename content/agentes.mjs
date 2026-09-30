// ─────────────────────────────────────────────────────────────────────────
// Public agent catalog metadata and non-executable guidance resources.
// The MCP tool list is generated from the canonical Available tools table in
// producto/desarrollo/ragfly/docs/integradores/MCP.md. Manifest operations
// are discovered separately through GET /v1/operations.
// ─────────────────────────────────────────────────────────────────────────

const BACKEND = 'https://api.ragfly.ai'

export const mcp = {
  nombre: 'ragfly',
  // Transportes remotos: SSE y Streamable HTTP. Sin instalar nada local.
  endpointSSE: `${BACKEND}/mcp/sse`,
  endpointHTTP: `${BACKEND}/mcp-http/`,
  auth: 'OAuth 2.1 or Authorization: Bearer rf_xxxxxxxxxx (API Key issued from a human session)',
  scope: 'Every call is filtered by the key owner’s group, entity, area and role. Flexible entity focus is stored server-side.',
}

// Agent-facing MCP tools are sourced from the Available tools table in
// producto/desarrollo/ragfly/docs/integradores/MCP.md by build-agentes.mjs.
// Manifest operations are discovered independently through GET /v1/operations.

// Recursos de orientación que un agente puede consultar, pero no ejecutar.
// No pertenecen a la superficie MCP/CLI/REST/SDK y, por tanto, se publican
// separados de las capacidades para evitar que un integrador los confunda con
// una operación automatizable.
export const recursos = [
  {
    id: 'configurar_conectores_ingesta',
    tipo: 'GUIA_OPERATIVA',
    titulo: 'Configurar conectores de ingesta: Google Drive y Dropbox',
    descripcion: 'Cuando una persona necesite conectar Google Drive o Dropbox, acompáñala con estas guías. No es una tool MCP, un comando CLI, una operación REST ni una función del SDK: el administrador configura la aplicación y los parámetros del grupo directamente en RAGfly; cada usuario autoriza su propia cuenta y elige la carpeta en el navegador.',
    reglas_seguridad: [
      'Nunca pidas, recibas, almacenes ni repitas secretos de cliente, access tokens, refresh tokens, contraseñas, cookies o códigos OAuth.',
      'Indica al administrador que ingrese las credenciales de aplicación solo en Parámetros de Grupo de RAGfly; el agente solo describe los pasos y verifica requisitos no sensibles.',
      'No intentes completar la autorización OAuth ni seleccionar carpetas fuera del navegador y la sesión del usuario.',
    ],
    enlaces: [
      { titulo: 'Guía humana: Google Drive', url: 'https://ragfly.ai/build/google-drive' },
      { titulo: 'Guía humana: Dropbox', url: 'https://ragfly.ai/build/dropbox' },
      { titulo: 'Referencia técnica: Google Drive (Markdown)', url: 'https://ragfly.ai/integradores/GOOGLE_DRIVE.md' },
      { titulo: 'Referencia técnica: Dropbox (Markdown)', url: 'https://ragfly.ai/integradores/DROPBOX.md' },
    ],
  },
]
