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
