/**
 * REGfly (regfly.ai) comparte el despliegue `ragfly-sitio` con ragfly.ai.
 * Lo que distingue un sitio del otro es el host de la solicitud.
 */
export function hostSinPuerto(host: string | null | undefined): string {
  return (host ?? '').toLowerCase().split(':')[0]
}

export function esHostRegfly(host: string | null | undefined): boolean {
  const h = hostSinPuerto(host)
  return h === 'regfly.ai' || h.endsWith('.regfly.ai') || h === 'regfly.localhost' || h.endsWith('.regfly.localhost')
}

export const URL_REGFLY = 'https://www.regfly.ai'
/** La aplicación de REGfly (cuenta RAGfly). El de pruebas es test.regfly.ai y el corporativo corp.regfly.ai. */
export const URL_APP_REGFLY = 'https://app.regfly.ai'
/* Igual que ragfly.ai: el registro y el login viven en la app; el sitio solo vuelca al Login.
   En app.regfly.ai el login reconoce el dominio y da la entrada de Regulación del país. */
export const URL_LOGIN_REGFLY = `${URL_APP_REGFLY}/login`
export const URL_REGISTRO_REGFLY = `${URL_APP_REGFLY}/login?registro=1`
