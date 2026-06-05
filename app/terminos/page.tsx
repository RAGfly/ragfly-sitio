import type { Metadata } from 'next'
import LegalPage, { type LegalContent } from '../../components/LegalPage'

export const metadata: Metadata = {
  title: 'Terms of Service — RAGfly',
  description: 'Terms of Service governing access to and use of the RAGfly platform.',
  alternates: { canonical: '/terminos' },
  robots: { index: true, follow: true },
}

const b = (t: string) => <strong className="font-semibold text-slm-dark">{t}</strong>

const content: LegalContent = {
  title: 'Terms of Service',
  updated: '29/05/2026',
  version: '1.0',
  intro: [
    {
      kind: 'p',
      text: (
        <>
          These Terms of Service (this {b('“Agreement”')}) are a binding contract between you ({b('“Customer,” “you,” or “your”')})
          and {b('[Provider legal name]')} ({b('“RAGfly,” “we,” “us,” or “our”')}). This Agreement governs your access to and use
          of the RAGfly platform, websites, applications, APIs, and related services (collectively, the {b('“Service”')}).
        </>
      ),
    },
    {
      kind: 'p',
      text: (
        <>
          {b(
            'By signing in, creating an account, accessing, or using the Service — including by signing in with a Microsoft or other third-party identity provider — you acknowledge that you have read, understood, and agree to be bound by this Agreement.'
          )}{' '}
          If you do not agree, do not access or use the Service. If you accept this Agreement on behalf of a company or other
          organization, you represent that you have authority to bind that entity, and “you” refers to that entity.
        </>
      ),
    },
  ],
  sections: [
    {
      id: 'service',
      heading: '1. The Service',
      blocks: [
        {
          kind: 'p',
          text: 'RAGfly is a retrieval-augmented generation (RAG) infrastructure that lets individuals and organizations converse with their own documents in natural language and provide precise document context to AI agents. The Service includes, depending on the plan you select, document processing, vectorization and indexing, semantic search, role-based access control, multi-organization administration, and related features described in our documentation. We may modify, improve, or discontinue features of the Service, and will give reasonable notice of material changes.',
        },
      ],
    },
    {
      id: 'accounts',
      heading: '2. Eligibility and Accounts',
      blocks: [
        {
          kind: 'p',
          text: 'You must be at least 18 years old (or the age of majority in your jurisdiction) and capable of forming a binding contract to use the Service. To use most features you must create an account or authenticate through a supported identity provider. You agree to provide accurate, complete, and current information and to keep it updated.',
        },
        {
          kind: 'p',
          text: 'You are responsible for safeguarding your credentials and for all activity that occurs under your account. Notify us promptly of any unauthorized use or suspected security breach. We may suspend or terminate accounts that violate this Agreement or that present fraudulent or security risks.',
        },
      ],
    },
    {
      id: 'authentication',
      heading: '3. Authentication and Third-Party Identity Providers',
      blocks: [
        {
          kind: 'p',
          text: 'The Service supports sign-in through third-party identity providers, including Microsoft (Microsoft Entra ID / Azure Active Directory), Google, GitHub, and Supabase. When you authenticate this way, we receive a limited set of profile information (such as your name, email address, and a unique identifier) solely to create and secure your account and to provide the Service. We do not receive your password. Your use of the identity provider remains subject to that provider’s own terms and privacy policy. You may revoke the connection at any time through your identity provider or your account settings.',
        },
      ],
    },
    {
      id: 'fees',
      heading: '4. Plans, Fees, and Payment',
      blocks: [
        { kind: 'p', text: 'Access is offered under different plans whose features and prices are published by us or agreed in a specific contract. Unless otherwise agreed:' },
        {
          kind: 'list',
          items: [
            'Fees are billed in advance according to the plan’s billing cycle (monthly or annual).',
            'Prices may change; we will give reasonable advance notice, and changes take effect at the next billing cycle.',
            'Late or failed payment may result in suspension of the Service after notice.',
            'Except where required by applicable law, fees are non-refundable for periods already started.',
          ],
        },
      ],
    },
    {
      id: 'customer-data',
      heading: '5. Customer Data and Ownership',
      blocks: [
        {
          kind: 'p',
          text: (
            <>
              {b('You own and retain all right, title, and interest in and to your Customer Data, at all times.')} “Customer Data”
              means all documents, files, text, metadata, configurations, indexes, vectors, prompts, and other content that you
              upload, connect, process, or generate through the Service. This is a foundational principle of the Service and
              prevails over any conflicting interpretation.
            </>
          ),
        },
        { kind: 'p', text: 'In particular:' },
        {
          kind: 'olist',
          items: [
            (<><strong className="font-semibold text-slm-dark">Ownership.</strong> You retain ownership of your Customer Data, including original documents and the indexes, vectors, and derived content generated from them. We acquire no ownership rights in your Customer Data.</>),
            (<><strong className="font-semibold text-slm-dark">Limited license to us.</strong> You grant us a limited, non-exclusive, revocable license to host, process, transmit, index, and display your Customer Data solely to provide and maintain the Service for you. This license authorizes no other use.</>),
            (<><strong className="font-semibold text-slm-dark">No use for training or secondary purposes.</strong> We do not sell, rent, or disclose your Customer Data, and we do not use it to train our own or any third party’s artificial-intelligence models, or for advertising or any purpose other than providing the Service to you.</>),
            (<><strong className="font-semibold text-slm-dark">Isolation.</strong> Customer Data is structurally isolated from that of other customers. No group, entity, or customer can access another’s data.</>),
            (<><strong className="font-semibold text-slm-dark">Portability and return.</strong> You may export or request the return of your Customer Data at any time during the term and during the post-termination grace period described in Section 12.</>),
            (<><strong className="font-semibold text-slm-dark">Deletion.</strong> Upon your request, or after termination and the applicable grace period, we will delete your Customer Data from our systems, except where retention is required by law.</>),
            (<><strong className="font-semibold text-slm-dark">Optional local processing.</strong> On plans that support it, RAGfly Desktop lets you keep document indexing within your own network so that the documents do not leave your infrastructure.</>),
          ],
        },
        { kind: 'p', text: 'You are solely responsible for the lawfulness of your Customer Data and for having the rights necessary to process it through the Service.' },
      ],
    },
    {
      id: 'acceptable-use',
      heading: '6. Acceptable Use',
      blocks: [
        { kind: 'p', text: 'You agree not to use the Service to:' },
        {
          kind: 'list',
          items: [
            'Upload or process content that is unlawful, infringing, or that you do not have the right to process.',
            'Compromise the security or integrity of the Service, or attempt to access another customer’s data.',
            'Reverse engineer, decompile, or extract the source code of the Service, except as permitted by law.',
            'Resell or sublicense the Service without authorization beyond the uses contemplated by your plan.',
            'Overload the infrastructure through abusive or unauthorized automated use.',
            'Violate any applicable law or the rights of any third party.',
          ],
        },
      ],
    },
    {
      id: 'ai',
      heading: '7. AI Providers and AI-Generated Output',
      blocks: [
        {
          kind: 'p',
          text: 'The Service may integrate with third-party AI models (for example, Anthropic, OpenAI, Google) or with proprietary models, depending on your plan and configuration. When you select a third-party model, the corresponding processing is also subject to that provider’s terms. AI-generated responses may contain inaccuracies; you are responsible for verifying information before relying on it. The Service does not constitute legal, financial, medical, or other professional advice.',
        },
      ],
    },
    {
      id: 'ip',
      heading: '8. Intellectual Property in the Service',
      blocks: [
        {
          kind: 'p',
          text: 'The Service, including its software, code, design, trademarks (including “RAGfly” and “RAGfly Desktop”), logos, and documentation, is owned by us or our licensors and is protected by intellectual-property laws. This Agreement grants you no rights in those elements other than the limited right to use the Service as agreed. Configurations, prompts, and business rules you create within the Service are Customer Data and belong to you, without prejudice to our rights in the underlying platform.',
        },
      ],
    },
    {
      id: 'privacy-security',
      heading: '9. Privacy and Security',
      blocks: [
        {
          kind: 'p',
          text: (
            <>
              Our collection and use of personal information is described in our{' '}
              <a href="/privacidad" className="text-slm-brand-dark underline underline-offset-2 hover:text-slm-brand">Privacy Policy</a>.
              We apply reasonable technical and organizational measures to protect Customer Data, including encryption of document
              data at rest, encrypted communications (HTTPS), role-based access control (RBAC), multi-factor authentication,
              structural data isolation, and audit logging. No system is completely secure; we do not guarantee absolute security,
              but we will notify you without undue delay of any security breach affecting your Customer Data.
            </>
          ),
        },
      ],
    },
    {
      id: 'availability',
      heading: '10. Service Availability',
      blocks: [
        {
          kind: 'p',
          text: 'We will use commercially reasonable efforts to keep the Service available, but we do not guarantee uninterrupted or error-free operation. Interruptions may occur due to scheduled maintenance, third-party failures, or force majeure. Specific availability commitments (SLA) and support, where offered, are set out in a separate annex or agreement.',
        },
      ],
    },
    {
      id: 'liability',
      heading: '11. Disclaimers and Limitation of Liability',
      blocks: [
        { kind: 'p', text: 'THE SERVICE IS PROVIDED “AS IS” AND “AS AVAILABLE.” TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, WE DISCLAIM ALL IMPLIED WARRANTIES, INCLUDING MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.' },
        { kind: 'p', text: 'TO THE MAXIMUM EXTENT PERMITTED BY LAW, OUR TOTAL LIABILITY ARISING OUT OF OR RELATING TO THE SERVICE WILL NOT EXCEED THE AMOUNTS YOU ACTUALLY PAID FOR THE SERVICE IN THE TWELVE (12) MONTHS BEFORE THE EVENT GIVING RISE TO THE CLAIM. WE WILL NOT BE LIABLE FOR INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR FOR LOST PROFITS OR DATA.' },
        { kind: 'p', text: 'Nothing in this Agreement excludes or limits liability that cannot be excluded or limited under applicable law.' },
      ],
    },
    {
      id: 'termination',
      heading: '12. Term, Termination, and Data Return',
      blocks: [
        {
          kind: 'p',
          text: 'This Agreement applies for as long as you maintain an account or use the Service. Either party may terminate: you, by closing your account or not renewing your plan; we, for your uncured material breach after notice. After termination, you will have a reasonable grace period (no less than thirty (30) days, unless legally prevented) to export your Customer Data, after which we may delete it, subject to legal retention obligations. Sections that by their nature should survive (including data ownership, confidentiality, disclaimers, limitation of liability, and governing law) survive termination.',
        },
      ],
    },
    {
      id: 'indemnification',
      heading: '13. Indemnification',
      blocks: [
        { kind: 'p', text: 'You will defend and indemnify us against third-party claims arising from your misuse of the Service, your breach of this Agreement, or the unlawfulness of your Customer Data.' },
      ],
    },
    {
      id: 'changes',
      heading: '14. Changes to this Agreement',
      blocks: [
        { kind: 'p', text: 'We may update this Agreement. We will give reasonable advance notice of material changes. Continued use of the Service after changes take effect constitutes acceptance. If you do not accept the changes, you may terminate your use of the Service under Section 12.' },
      ],
    },
    {
      id: 'law',
      heading: '15. Governing Law and Disputes',
      blocks: [
        { kind: 'p', text: 'This Agreement is governed by the laws of [governing law to be defined], without regard to conflict-of-laws rules. The parties will attempt to resolve disputes in good faith; any unresolved dispute will be submitted to the courts or arbitration venue of [venue to be defined], without prejudice to any mandatory rights granted to you as a consumer under applicable law.' },
      ],
    },
    {
      id: 'general',
      heading: '16. General',
      blocks: [
        {
          kind: 'list',
          items: [
            (<><strong className="font-semibold text-slm-dark">Assignment.</strong> You may not assign this Agreement without our consent. We may assign it in connection with a reorganization or transfer of our business, preserving the protections agreed here.</>),
            (<><strong className="font-semibold text-slm-dark">Severability.</strong> If any provision is held invalid, the remaining provisions remain in effect.</>),
            (<><strong className="font-semibold text-slm-dark">Entire agreement.</strong> This Agreement, together with the Privacy Policy and applicable annexes, is the entire agreement between the parties regarding the Service.</>),
            (<><strong className="font-semibold text-slm-dark">Notices.</strong> Communications will be sent to the contact addresses on file.</>),
            (<><strong className="font-semibold text-slm-dark">No waiver.</strong> Failure to exercise a right is not a waiver of it.</>),
          ],
        },
      ],
    },
    {
      id: 'contact',
      heading: '17. Contact',
      blocks: [
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
    'This document is a general-purpose template and does not constitute legal advice. Have it reviewed by a lawyer before publication, in particular to complete the bracketed fields and adapt the clauses to the applicable jurisdiction and regulatory framework.',
}

export default function TerminosPage() {
  return <LegalPage content={content} />
}
