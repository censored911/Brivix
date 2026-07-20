import { CONTACT_EMAIL } from "@/lib/contact";

/**
 * Source of truth for the two legal pages. Both documents share one shape so
 * `LegalContent` can render either without branching — the only difference
 * between /privacy and /terms is the object passed in.
 *
 * NOTE FOR THE OWNER: this is professionally drafted boilerplate tailored to a
 * Cairo-based design agency, not legal advice. Before launch, confirm the
 * registered entity name, address, and any sector rules with a lawyer, and
 * update `ENTITY`/`ADDRESS` below.
 */

const ENTITY = "Brivix";
const ADDRESS = "Cairo, Egypt";
const UPDATED = "19 July 2026";

export type LegalSection = {
  title: string;
  /** Rendered as body paragraphs, in order, above any bullets. */
  paragraphs?: string[];
  bullets?: string[];
  /**
   * Elevated, labelled clauses. When present, `LegalContent` renders a numbered
   * definition list (bold lead-in term + body) instead of a plain bullet list —
   * used for dense, scannable sections such as Fees & payment.
   */
  items?: { label: string; body: string }[];
};

export type LegalDoc = {
  /** Mono kicker above the title. */
  kicker: string;
  title: string;
  updated: string;
  /** Lead paragraphs shown before the numbered sections. */
  intro: string[];
  sections: LegalSection[];
};

export const PRIVACY: LegalDoc = {
  kicker: "Legal / Privacy",
  title: "Privacy Policy",
  updated: UPDATED,
  intro: [
    `${ENTITY} ("we", "us", "our") is a web design and digital experience agency based in ${ADDRESS}. This policy explains what personal data we collect when you visit our website or work with us, why we collect it, how long we keep it, and the rights you have over it.`,
    "We collect as little as we can, we do not sell your data, and we do not use it for anything you would not expect from an agency you contacted.",
  ],
  sections: [
    {
      title: "Who we are",
      paragraphs: [
        `${ENTITY} is the data controller for the personal data described in this policy. You can reach us at any time at ${CONTACT_EMAIL}.`,
      ],
    },
    {
      title: "What we collect",
      paragraphs: [
        "We only collect data in two situations: when you contact us, and when you browse the site.",
      ],
      bullets: [
        "Information you send us. When you email us or use a contact link, we receive your name, email address, and whatever you choose to tell us about your business, project, timeline, and budget.",
        "Client and project information. If we work together, we hold the details needed to deliver and invoice the work — contact details, billing information, brand assets, and any content or credentials you share with us.",
        "Technical and usage information. Our hosting provider and analytics record standard technical data such as IP address, browser and device type, referring page, pages viewed, and time on page. We use this in aggregate to understand how the site performs.",
      ],
    },
    {
      title: "Why we use it",
      bullets: [
        "To reply to your enquiry and prepare a proposal.",
        "To deliver, support, and invoice the services we have agreed.",
        "To keep the website secure, fast, and free of abuse.",
        "To understand which pages are useful and improve them.",
        "To meet our accounting, tax, and other legal obligations.",
      ],
    },
    {
      title: "Our lawful basis",
      paragraphs: [
        "Where the GDPR or Egypt's Personal Data Protection Law No. 151 of 2020 applies, we rely on: your consent (for non-essential analytics), the performance of a contract (to deliver work you have commissioned), our legitimate interests (to respond to enquiries, secure the site, and improve it), and legal obligation (to retain financial records).",
        "Where we rely on consent, you can withdraw it at any time without affecting anything we did before you withdrew it.",
      ],
    },
    {
      title: "Cookies and analytics",
      paragraphs: [
        "The site uses only the cookies and local storage needed to function, plus privacy-respecting analytics that tell us how many people visit and which pages they read. We do not run advertising trackers or build profiles for marketing.",
        "You can block or delete cookies in your browser settings. Essential functionality may degrade if you do.",
      ],
    },
    {
      title: "Who we share it with",
      paragraphs: [
        "We do not sell, rent, or trade personal data. We share it only with service providers who help us operate — hosting, email, analytics, and payment processing — and only to the extent they need it to perform that service on our instructions.",
        "We may also disclose data where the law requires it, or to establish or defend a legal claim.",
      ],
    },
    {
      title: "International transfers",
      paragraphs: [
        "Some of our providers operate outside Egypt. Where personal data is transferred abroad, we take reasonable steps to ensure it is protected by appropriate safeguards, such as standard contractual clauses or a provider located in a jurisdiction recognised as offering adequate protection.",
      ],
    },
    {
      title: "How long we keep it",
      bullets: [
        "Enquiries that do not become projects: up to 24 months, then deleted.",
        "Client and project records: for the life of the engagement and up to 5 years afterwards, so we can support past work and answer questions.",
        "Financial records: as long as Egyptian tax and accounting law requires.",
        "Analytics: in aggregated form, which no longer identifies you.",
      ],
    },
    {
      title: "How we protect it",
      paragraphs: [
        "We use encrypted connections, access controls, and reputable providers, and we limit access to the people who need it. No system is perfectly secure, but we take the protection of your data seriously and will notify you and the relevant authority of a qualifying breach as the law requires.",
      ],
    },
    {
      title: "Your rights",
      paragraphs: [
        `Subject to applicable law, you can ask us to give you a copy of your data, correct it, delete it, restrict or object to how we use it, or transfer it elsewhere. Write to ${CONTACT_EMAIL} and we will respond within 30 days. You also have the right to complain to your local data protection authority.`,
      ],
    },
    {
      title: "Children",
      paragraphs: [
        "Our services are directed at businesses. We do not knowingly collect data from anyone under 18. If you believe a child has sent us personal data, contact us and we will delete it.",
      ],
    },
    {
      title: "Changes to this policy",
      paragraphs: [
        "We may update this policy as our services or the law change. The date at the top always reflects the current version, and material changes will be highlighted on this page.",
      ],
    },
    {
      title: "Contact",
      paragraphs: [
        `Questions about this policy or your data: ${CONTACT_EMAIL}. ${ENTITY}, ${ADDRESS}.`,
      ],
    },
  ],
};

export const TERMS: LegalDoc = {
  kicker: "Legal / Terms",
  title: "Terms & Conditions",
  updated: UPDATED,
  intro: [
    `These terms govern your use of the ${ENTITY} website and, unless we sign a separate agreement that says otherwise, the services we provide to you. By using this site or commissioning work from us, you agree to them.`,
    "They are written to be read, not to be hidden behind. If anything here is unclear, ask us before you sign.",
  ],
  sections: [
    {
      title: "Using this website",
      paragraphs: [
        "You may view and share this site for lawful purposes. You may not copy its design, code, or content for commercial use, disrupt it or gain unauthorised access to it, or scrape it at a scale that degrades service for others.",
        "The site is provided for information only. Nothing on it is an offer capable of acceptance, or legal, financial, or technical advice for your specific situation.",
      ],
    },
    {
      title: "Our services",
      paragraphs: [
        "We provide web design, web development, ecommerce optimisation, brand identity, and digital marketing services. The scope, deliverables, timeline, and fees for your project are set out in the proposal or statement of work we agree with you.",
        "Where a proposal conflicts with these terms, the proposal governs for that project.",
      ],
    },
    {
      title: "Proposals and acceptance",
      paragraphs: [
        "A proposal is valid for 30 days from the date we send it, unless it states otherwise. Work begins once you have accepted the proposal in writing and paid any deposit it specifies.",
      ],
    },
    {
      title: "Your responsibilities",
      paragraphs: [
        "A project moves at the speed of its slowest input. To keep yours on schedule, you agree to provide content, brand assets, access, and feedback promptly, and to nominate one person empowered to approve work on your behalf.",
        "You confirm that any material you give us — text, images, logos, fonts, data — is yours to use, and you accept responsibility for its accuracy and legality.",
      ],
    },
    {
      title: "Revisions and scope",
      paragraphs: [
        "Each project includes the revision rounds stated in the proposal. Requests that exceed the agreed scope, or revisit work you have already approved, are quoted and agreed separately before we act on them.",
      ],
    },
    {
      title: "Timelines",
      paragraphs: [
        "The dates we give are good-faith estimates based on the agreed scope and prompt feedback. We are not liable for delays caused by late input, scope changes, third-party providers, or events outside our reasonable control.",
      ],
    },
    {
      title: "Intellectual property",
      bullets: [
        "You keep ownership of everything you supply to us.",
        "On full payment, we assign you ownership of the final deliverables produced specifically for your project.",
        "We retain ownership of our pre-existing tools, frameworks, libraries, and know-how, along with any concepts and drafts not selected for the final work, and grant you a licence to use them as embedded in the deliverables.",
        "Third-party assets such as fonts, plugins, and stock media remain under their own licences, which you are responsible for maintaining.",
      ],
    },
    {
      title: "Portfolio and credit",
      paragraphs: [
        "Unless you ask us in writing not to, we may feature the work in our portfolio, on social media, and in award or press submissions once it is live, and describe our role in it. We will never publish confidential information or results you have asked us to keep private.",
      ],
    },
    {
      title: "Confidentiality",
      paragraphs: [
        "Each of us agrees to keep the other's non-public business information confidential and to use it only for the project. This obligation continues for three years after the engagement ends, and indefinitely for anything that qualifies as a trade secret.",
      ],
    },
    {
      title: "Third-party services",
      paragraphs: [
        "Deliverables may rely on services we do not control, such as hosting, payment gateways, analytics, and plugins. Their availability, pricing, and terms are set by them, not us, and we are not liable for their failure or discontinuation.",
      ],
    },
    {
      title: "Warranties and disclaimers",
      paragraphs: [
        "We perform our services with reasonable skill and care, in line with professional standards, and will correct any reproducible defect in our implementation reported within 8 days of delivery at no extra cost.",
        "This warranty does not cover new features, design revisions, content changes, issues arising from third-party services, browsers, plugins, or hosting providers, or any modification to the deliverables made by anyone other than us.",
        "Beyond that, and to the fullest extent permitted by law, our services and this website are provided without further warranties of any kind. We do not guarantee specific commercial outcomes such as traffic, rankings, conversions, or revenue, as these depend on factors outside our control.",
      ],
    },
    {
      title: "Limitation of liability",
      paragraphs: [
        "To the fullest extent permitted by law, neither party is liable for indirect, incidental, or consequential loss, including lost profits, revenue, or data. Our total liability arising from a project is limited to the fees you paid us for that project in the 12 months before the claim arose.",
        "Nothing in these terms excludes liability that cannot lawfully be excluded, including for fraud or for death or personal injury caused by negligence.",
      ],
    },
    {
      title: "Termination",
      paragraphs: [
        "Either party may end an engagement with 14 days' written notice. On termination, you pay for all work completed and any non-cancellable third-party costs committed on your behalf, and we hand over the deliverables covered by that payment.",
        "We may terminate immediately if payment is significantly overdue or if these terms are materially breached.",
      ],
    },
    {
      title: "Governing law",
      paragraphs: [
        `These terms are governed by the laws of the Arab Republic of Egypt, and the courts of ${ADDRESS} have exclusive jurisdiction. Before starting proceedings, both parties agree to attempt to resolve the dispute in good faith.`,
      ],
    },
    {
      title: "Changes to these terms",
      paragraphs: [
        "We may update these terms from time to time. The version in force for your project is the one published when you accepted your proposal. Continued use of the website means you accept the current version.",
      ],
    },
    {
      title: "Fees and payment",
      items: [
        {
          label: "Deposit & fees",
          body: "Fees, currency, and the payment schedule are set out in the proposal. A deposit is due before work begins and is credited toward the total project fee.",
        },
        {
          label: "Invoicing",
          body: "Invoices are due within 14 days of issue.",
        },
        {
          label: "Third-party costs",
          body: "Fees exclude third-party costs — hosting, domains, licences, fonts, stock media, and paid ad spend — which are billed at cost or paid by you directly.",
        },
        {
          label: "Transfer charges",
          body: "You are responsible for all bank charges, currency conversion fees, and transfer costs on your payments; these may not be deducted from the amounts due.",
        },
        {
          label: "Out-of-scope work",
          body: "Work outside the agreed scope is quoted and approved separately before it begins.",
        },
        {
          label: "Overdue payment",
          body: "If payment falls overdue, we may pause work after written notice and resume once it clears. Timelines and delivery dates shift accordingly, and we are not responsible for delays caused by late payment.",
        },
        {
          label: "Refunds",
          body: "Fees for work already performed, including the deposit once work has commenced, are non-refundable.",
        },
        {
          label: "Ownership transfer",
          body: "Ownership of the deliverables transfers only after all outstanding invoices are paid in full.",
        },
      ],
    },
    {
      title: "Contact",
      paragraphs: [
        `Questions about these terms: ${CONTACT_EMAIL}. ${ENTITY}, ${ADDRESS}.`,
      ],
    },
  ],
};
