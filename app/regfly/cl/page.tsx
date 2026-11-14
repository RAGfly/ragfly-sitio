import { headers } from 'next/headers'
import { notFound } from 'next/navigation'
import { RegflyLanding } from '../../../components/regfly/RegflyLanding'
import { esHostRegfly } from '../../../lib/host'
import '../regfly.css'

// La ruta interna /regfly/cl solo existe para el host de REGfly: en ragfly.ai responde 404.
export default async function PaginaRegflyChile() {
  if (!esHostRegfly((await headers()).get('host'))) notFound()
  return <RegflyLanding />
}
