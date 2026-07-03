import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import DownloadPage from '../../components/DownloadPage'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('download')
  return {
    title: `${t('titulo1')} ${t('tituloAccent')} — RAGfly`,
    description: t('descripcion'),
    alternates: { canonical: '/download' },
  }
}

export default function Page() {
  return <DownloadPage />
}
