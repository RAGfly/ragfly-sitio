import type { FragmentoMarketing } from '../../lib/mensajes-marketing'

export function TituloMarketing({ fragmentos }: { fragmentos: FragmentoMarketing[] }) {
  return fragmentos.map((f, i) => f.estilo === 'enfasis'
    ? <em key={i} className="marketing-enfasis">{f.texto}</em>
    : <span key={i}>{f.texto}</span>)
}
