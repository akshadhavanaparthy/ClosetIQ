import React from 'react';
import { SiteFooter } from './SiteFooter';

type LegalPageKind = 'privacy' | 'terms';

interface LegalPageProps {
  kind: LegalPageKind;
}

const legalContent: Record<LegalPageKind, { title: string; intro: string; sections: { title: string; text: string }[] }> = {
  privacy: {
    title: 'Privacy Policy',
    intro: 'This draft identifies the information that must be confirmed before publication. It does not describe verified company practices.',
    sections: [
      {
        title: 'Who is responsible',
        text: '[TODO: Add the legal business name, registered address, and privacy contact email.]',
      },
      {
        title: 'Information collected',
        text: '[TODO: List the account details, style preferences, measurements, wardrobe records, photos, and technical data actually collected by the live service.]',
      },
      {
        title: 'How information is used and shared',
        text: '[TODO: Describe each purpose, lawful basis where applicable, service provider, and any data sharing or international transfer.]',
      },
      {
        title: 'Retention, security, and your choices',
        text: '[TODO: State retention periods, security practices, available privacy rights, and how people can exercise them.]',
      },
      {
        title: 'Children and policy updates',
        text: '[TODO: Confirm whether the service is intended for children and explain how policy changes will be announced.]',
      },
    ],
  },
  terms: {
    title: 'Terms and Conditions',
    intro: 'This draft is incomplete. Do not publish it as final terms until each placeholder has been resolved.',
    sections: [
      {
        title: 'Provider and effective date',
        text: '[TODO: Add the legal business name, registered address, contact details, and effective date.]',
      },
      {
        title: 'Using the service',
        text: '[TODO: Define account eligibility, account responsibilities, permitted use, and any subscription or payment terms.]',
      },
      {
        title: 'Your content and recommendations',
        text: '[TODO: Explain rights in user-uploaded content, how it may be used, and the limits of wardrobe or outfit recommendations.]',
      },
      {
        title: 'Third-party services',
        text: '[TODO: Describe any merchant links, third-party terms, availability, and responsibility for purchases made elsewhere.]',
      },
      {
        title: 'Liability, termination, and disputes',
        text: '[TODO: Add terms reviewed for the applicable jurisdiction, including liability limits, termination, governing law, and dispute resolution.]',
      },
    ],
  },
};

export const LegalPage: React.FC<LegalPageProps> = ({ kind }) => {
  const content = legalContent[kind];

  return (
    <div className="legal-layout">
      <a className="skip-link" href="#legal-main">Skip to content</a>
      <header className="legal-header">
        <div className="container legal-header-content">
          <a className="legal-brand" href="/">ClosetIQ</a>
          <a className="legal-home-link" href="/">Back to studio</a>
        </div>
      </header>
      <main id="legal-main" className="container legal-main">
        <p className="editorial-caps text-terracotta">ClosetIQ policies</p>
        <h1 className="editorial-title legal-title">{content.title}</h1>
        <div className="legal-draft-notice" role="note">
          Draft for review. Replace every TODO and have a qualified lawyer review this page before launch.
        </div>
        <p className="legal-intro">{content.intro}</p>
        <p className="legal-effective-date">Effective date: [TODO: effective date]</p>
        {content.sections.map((section) => (
          <section className="legal-section" key={section.title}>
            <h2>{section.title}</h2>
            <p>{section.text}</p>
          </section>
        ))}
      </main>
      <SiteFooter />
    </div>
  );
};
