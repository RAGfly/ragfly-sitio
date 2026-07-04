import type { Metadata } from 'next'
import { getLocale } from 'next-intl/server'
import LegalPage, { type LegalContent } from '../../../components/LegalPage'
import { defaultLocale, type Locale } from '../../../i18n/config'

import en from '../../../content/legal/refund-policy.en.json'
import es from '../../../content/legal/refund-policy.es.json'
import fr from '../../../content/legal/refund-policy.fr.json'
import de from '../../../content/legal/refund-policy.de.json'
import pt from '../../../content/legal/refund-policy.pt.json'

const BY_LOCALE = { en, es, fr, de, pt } as unknown as Record<Locale, LegalContent>

const DESCRIPTION: Record<Locale, string> = {
  en: 'When and how refunds apply to RAGfly paid subscriptions and charges.',
  es: 'Cuándo y cómo aplican los reembolsos a las suscripciones y cargos de pago de RAGfly.',
  fr: 'Quand et comment les remboursements s\'appliquent aux abonnements et frais payants de RAGfly.',
  de: 'Wann und wie Rückerstattungen für kostenpflichtige RAGfly-Abonnements und Gebühren gelten.',
  pt: 'Quando e como os reembolsos se aplicam às assinaturas e cobranças pagas da RAGfly.',
}

async function resolveContent(): Promise<{ content: LegalContent; locale: Locale }> {
  const locale = (await getLocale()) as Locale
  const content = BY_LOCALE[locale] ?? BY_LOCALE[defaultLocale]
  return { content, locale }
}

export async function generateMetadata(): Promise<Metadata> {
  const { content, locale } = await resolveContent()
  return {
    title: `${content.title} — RAGfly`,
    description: DESCRIPTION[locale] ?? DESCRIPTION[defaultLocale],
    alternates: { canonical: '/legal/refund' },
    robots: { index: true, follow: true },
  }
}

export default async function RefundPage() {
  const { content } = await resolveContent()
  return <LegalPage content={content} />
}
