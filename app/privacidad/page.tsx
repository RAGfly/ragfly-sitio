import type { Metadata } from 'next'
import LegalPage, { type LegalContent } from '../../components/LegalPage'

export const metadata: Metadata = {
  title: 'Privacy Policy — RAGfly',
  description: 'How RAGfly collects, uses, discloses, and protects personal information.',
  alternates: { canonical: '/privacidad' },
  robots: { index: true, follow: true },
}

const b = (t: string) => <strong className="font-semibold text-slm-dark">{t}</strong>

const content: LegalContent = {
  title: 'Privacy Policy',
  updated: '29/05/2026',
  version: '1.0',
  intro: [
    {
      kind: 'p',
      text: (
        <>
          This Privacy Policy explains how {b('RAGfly')} (“RAGfly,” “we,” “us,” or “our”) collects, uses, discloses, and
          protects personal information in connection with the RAGfly platform, websites, applications, APIs, and related
          services (the “Service”). It applies to visitors, account holders, and end users who sign in to the Service, including
          through third-party identity providers such as Microsoft (Microsoft Entra ID / Azure Active Directory), Google, GitHub,
          and Supabase.
        </>
      ),
    },
    {
      kind: 'p',
      text: (
        <>
          This policy works together with our{' '}
          <a href="/terminos" className="text-slm-brand-dark underline underline-offset-2 hover:text-slm-brand">Terms of Service</a>.
        </>
      ),
    },
  ],
  sections: [
    {
      id: 'roles',
      heading: '1. Roles: Who Controls the Data',
      blocks: [
        { kind: 'p', text: 'Two different kinds of data are involved, and our role differs for each:' },
        {
          kind: 'list',
          items: [
            (<><strong className="font-semibold text-slm-dark">Account and authentication data</strong> (described in Section 2). For this data we act as a <strong className="font-semibold text-slm-dark">data controller</strong>: we decide how and why it is processed to operate the Service.</>),
            (<><strong className="font-semibold text-slm-dark">Customer Data</strong> — the documents and content you upload, connect, or process through the Service. For this data we act as a <strong className="font-semibold text-slm-dark">data processor (or “encargado”)</strong> on your behalf. You (or your organization) are the controller. We process Customer Data only on your instructions and as described in the Terms of Service, and <strong className="font-semibold text-slm-dark">you own it at all times</strong>. We do not use Customer Data to train AI models or for any purpose other than providing the Service to you.</>),
          ],
        },
      ],
    },
    {
      id: 'collect',
      heading: '2. Information We Collect',
      blocks: [
        { kind: 'p', text: (<><strong className="font-semibold text-slm-dark">Account and profile information.</strong> When you create an account or sign in through an identity provider, we collect identifiers such as your name, email address, and a unique user identifier. When you sign in with Microsoft, Google, GitHub, or Supabase, we receive this limited profile information from that provider to create and secure your account. We do not receive or store your identity-provider password.</>) },
        { kind: 'p', text: (<><strong className="font-semibold text-slm-dark">Usage and device information.</strong> We collect technical data such as IP address, browser/device type, log data, timestamps, and actions taken within the Service (audit logs), to operate, secure, and improve the Service.</>) },
        { kind: 'p', text: (<><strong className="font-semibold text-slm-dark">Customer Data.</strong> The documents and content you process through the Service. We handle this as a processor on your behalf (see Section 1). It may incidentally contain personal information that you choose to include; you are responsible for the lawfulness of that content.</>) },
        { kind: 'p', text: (<><strong className="font-semibold text-slm-dark">Billing information.</strong> If you purchase a paid plan, payment is handled by Paddle; we receive limited transaction data, not full card numbers.</>) },
      ],
    },
    {
      id: 'use',
      heading: '3. How We Use Information',
      blocks: [
        { kind: 'p', text: 'We use personal information to:' },
        {
          kind: 'list',
          items: [
            'Create, authenticate, and secure your account.',
            'Provide, maintain, and improve the Service.',
            'Communicate with you about the Service, including security and service notices.',
            'Process payments and manage subscriptions.',
            'Detect, prevent, and address fraud, abuse, and security incidents.',
            'Comply with legal obligations.',
          ],
        },
        { kind: 'p', text: (<>We do <strong className="font-semibold text-slm-dark">not</strong> sell personal information, and we do <strong className="font-semibold text-slm-dark">not</strong> use Customer Data to train AI models or for advertising.</>) },
      ],
    },
    {
      id: 'legal-bases',
      heading: '4. Legal Bases',
      blocks: [
        { kind: 'p', text: 'Where required by applicable data-protection law, we rely on the following legal bases: performance of a contract (to provide the Service), our legitimate interests (to secure and improve the Service), your consent (where requested, e.g., certain cookies), and compliance with legal obligations.' },
      ],
    },
    {
      id: 'sharing',
      heading: '5. Sharing and Disclosure',
      blocks: [
        { kind: 'p', text: 'We share personal information only as needed to operate the Service:' },
        {
          kind: 'list',
          items: [
            (<><strong className="font-semibold text-slm-dark">Subprocessors and service providers</strong> — such as cloud hosting, database, and infrastructure providers — bound by confidentiality and data-protection obligations.</>),
            (<><strong className="font-semibold text-slm-dark">AI model providers</strong> — when you select a third-party model (for example, Anthropic, OpenAI, Google), the relevant content is processed by that provider subject to its terms; on supported plans you may choose the model or keep processing local via RAGfly Desktop.</>),
            (<><strong className="font-semibold text-slm-dark">Identity providers</strong> — to authenticate your sign-in (for example, Microsoft Entra ID).</>),
            (<><strong className="font-semibold text-slm-dark">Legal and safety</strong> — when required by law or to protect rights, safety, and the integrity of the Service.</>),
            (<><strong className="font-semibold text-slm-dark">Business transfers</strong> — in connection with a merger, acquisition, or reorganization, with the protections of this policy preserved.</>),
          ],
        },
        { kind: 'p', text: 'A current list of subprocessors is available on request at admin@ragfly.ai.' },
      ],
    },
    {
      id: 'transfers',
      heading: '6. International Transfers',
      blocks: [
        { kind: 'p', text: 'The Service may process data in countries other than yours. Where applicable law requires, we use appropriate safeguards (such as standard contractual clauses) for cross-border transfers. On supported plans, you may restrict processing to your own infrastructure via RAGfly Desktop.' },
      ],
    },
    {
      id: 'retention',
      heading: '7. Data Retention',
      blocks: [
        { kind: 'p', text: 'We retain account and usage data for as long as your account is active and as needed to provide the Service, then for the period required by law or for legitimate business purposes. Customer Data is retained according to your instructions and the Terms of Service: after termination you have a grace period to export it, after which we delete it, subject to legal retention obligations.' },
      ],
    },
    {
      id: 'security',
      heading: '8. Security',
      blocks: [
        { kind: 'p', text: 'We apply reasonable technical and organizational measures, including encryption of document data at rest, encrypted communications (HTTPS), role-based access control (RBAC) with granular permissions, multi-factor authentication, structural isolation between organizations, and audit logging. No system is completely secure, but we will notify you without undue delay of any breach affecting your personal information or Customer Data, as required by law.' },
      ],
    },
    {
      id: 'rights',
      heading: '9. Your Rights',
      blocks: [
        { kind: 'p', text: 'Depending on your jurisdiction, you may have rights to access, correct, delete, port, or restrict the processing of your personal information, and to object to certain processing or withdraw consent. To exercise these rights, contact us at admin@ragfly.ai. If your personal information is contained in Customer Data controlled by an organization, please direct your request to that organization; we will assist them as their processor.' },
      ],
    },
    {
      id: 'cookies',
      heading: '10. Cookies',
      blocks: [
        { kind: 'p', text: 'The Service uses cookies and similar technologies that are necessary for authentication and security, and, where applicable, optional analytics cookies subject to your consent. You can manage cookies through your browser settings.' },
      ],
    },
    {
      id: 'children',
      heading: '11. Children',
      blocks: [
        { kind: 'p', text: 'The Service is not directed to children under 18 (or the age of majority in your jurisdiction), and we do not knowingly collect their personal information.' },
      ],
    },
    {
      id: 'changes',
      heading: '12. Changes to this Policy',
      blocks: [
        { kind: 'p', text: 'We may update this Privacy Policy. We will post the updated version with a new “Last updated” date and, for material changes, provide reasonable notice.' },
      ],
    },
    {
      id: 'contact',
      heading: '13. Contact',
      blocks: [
        { kind: 'p', text: 'For privacy questions or to exercise your rights:' },
        {
          kind: 'p',
          text: (
            <>
              {b('[Provider legal name]')}
              <br />
              Website: ragfly.ai
              <br />
              Email: <a href="mailto:admin@ragfly.ai" className="text-slm-brand-dark underline underline-offset-2 hover:text-slm-brand">admin@ragfly.ai</a>
            </>
          ),
        },
      ],
    },
  ],
  disclaimer:
    'This document is a general-purpose template and does not constitute legal advice. Have it reviewed by a lawyer before publication, in particular to complete the bracketed fields and adapt it to the applicable data-protection framework (e.g., GDPR, CCPA, or local law).',
}

export default function PrivacidadPage() {
  return <LegalPage content={content} />
}
