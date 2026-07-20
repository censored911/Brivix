export interface ServiceItem { title: string; body: string; related: string[]; }
export interface ServiceGroup { category: string; items: ServiceItem[]; }
export interface NervesBlock { heading: string; paragraphs: string[]; image: string; alt: string; }

export const serviceGroups: ServiceGroup[] = [
  {
    "category": "Experimental",
    "items": [
      {
        "title": "Website Transformation",
        "body": "Most websites don’t fail because of the product — they fail because they look and feel outdated. We take your existing website and rebuild it into a modern, visually striking experience that captures attention in seconds, builds trust, and guides visitors toward action. Same brand, completely new energy.",
        "related": [
          "Website Audits",
          "Redesign Strategy",
          "Visual Refresh",
          "Layout Modernization",
          "Content Hierarchy",
          "Conversion-Focused Restructuring",
          "Mobile Optimization",
          "Performance Tuning"
        ]
      },
      {
        "title": "Ecommerce Optimization",
        "body": "A generic store leaves sales on the table. We turn ordinary ecommerce sites into high-converting stores through smarter UX, sharper UI, and careful conversion optimization. From the first product page to the final checkout click, we remove friction at every step so more visitors become customers.",
        "related": [
          "Store Audits",
          "UX / UI Redesign",
          "Conversion Rate Optimization",
          "Product Page Design",
          "Checkout Optimization",
          "Performance Optimization",
          "A/B Testing",
          "Analytics Setup"
        ]
      },
      {
        "title": "Motion & Animation",
        "body": "Movement is what makes a website feel alive. We design animations and interactions with purpose — smooth, intentional, and never distracting. From subtle hover states to full scroll experiences, motion guides attention, adds polish, and makes your brand memorable.",
        "related": [
          "Scroll Experiences",
          "Micro-interactions",
          "Page Transitions",
          "Hover States",
          "Loading Sequences",
          "Web Animation",
          "Motion Guidelines"
        ]
      },
      {
        "title": "3D Experiences",
        "body": "When a project calls for something extraordinary, we bring in the third dimension. Interactive 3D scenes and immersive elements give your website a presence flat design can’t match. We use them carefully — where they add impact, not noise — and optimize everything so it runs smoothly on every device.",
        "related": [
          "Interactive 3D Scenes",
          "Product Visualization",
          "WebGL Development",
          "3D Modelling",
          "Texturing & Optimization",
          "Immersive Landing Pages"
        ]
      }
    ]
  },
  {
    "category": "Digital",
    "items": [
      {
        "title": "Strategy & Planning",
        "body": "Every great website starts before the first pixel. We map out your goals, your audience, and the structure of your site so every decision that follows has a clear purpose. You get a plan you can actually understand — and a roadmap we follow together from kickoff to launch.",
        "related": [
          "Discovery Workshops",
          "Sitemap & Structure",
          "User Journeys",
          "Wireframing",
          "Content Planning",
          "Technical Scoping"
        ]
      },
      {
        "title": "User Experience / Interface",
        "body": "We design websites people enjoy using. Every layout, color system, and interaction is crafted from scratch around your brand and your users — no templates, no shortcuts. The result is an interface that feels effortless to navigate and looks unmistakably yours.",
        "related": [
          "UI / UX Design",
          "Wireframing",
          "Prototyping",
          "Design Systems",
          "Color Systems",
          "Typography",
          "Responsive Design",
          "Accessibility"
        ]
      },
      {
        "title": "Development",
        "body": "Beautiful design deserves flawless execution. We build fast, reliable, and scalable websites using modern technology, tested across browsers and devices before launch. What we design is exactly what you get — pixel-perfect, quick to load, and built to perform.",
        "related": [
          "Front-End Development",
          "CMS Integration",
          "E-Commerce Development",
          "WebGL",
          "Performance Optimization",
          "SEO Foundations",
          "Deployment & Hosting",
          "Ongoing Support"
        ]
      },
      {
        "title": "Sound Engineering",
        "body": "Our agency has professional sound engineers with hands-on experience since 2015, bringing deep expertise in audio design to the creative and media industries. We craft soundscapes that elevate your digital presence and leave a lasting impression.",
        "related": [
          "Music Production",
          "Audio Design",
          "Sonic Branding",
          "Sound Mixing & Mastering",
          "Post-Production Audio",
          "Immersive Sound Design",
          "Podcast Production"
        ]
      }
    ]
  },
  {
    "category": "Branding",
    "items": [
      {
        "title": "Brand & Campaign Strategy",
        "body": "Strong brands don’t happen by accident. We help you define who you are, who you’re talking to, and what makes you different — then turn that into a marketing strategy with clear goals and measurable results. No vague brand talk, just direction you can act on.",
        "related": [
          "Brand Positioning",
          "Audience Research",
          "Messaging & Copywriting",
          "Marketing Strategy",
          "Campaign Planning",
          "Content Strategy"
        ]
      },
      {
        "title": "Identity",
        "body": "Your identity is the first handshake with the world. We create identities that are consistent, memorable, and built to last — logos, color systems, typography, and clear guidelines that keep your brand sharp everywhere it appears, from your website to your social feeds.",
        "related": [
          "Logo Design",
          "Visual Systems",
          "Color Palettes",
          "Typography",
          "Brand Guidelines",
          "Social Media Kits"
        ]
      },
      {
        "title": "Digital Marketing",
        "body": "A great website deserves an audience. We plan and run digital marketing that brings the right people to your door — content, social, email, and search working together. And we tie everything back to the numbers, so you always know what’s working and what’s next.",
        "related": [
          "Marketing Strategy",
          "Social Media",
          "Content Marketing",
          "Email Marketing",
          "SEO",
          "Analytics & Reporting"
        ]
      },
      {
        "title": "Media Buying (Coming Soon)",
        "body": "Paid media, planned and managed by Brivix. We’re building a media buying service to help you get the most from every advertising dollar across search and social platforms — the same conversion-focused thinking we bring to websites, applied to your ad spend. Launching soon. Want early access? Reach out and we’ll keep you posted.",
        "related": [
          "Paid Search",
          "Paid Social",
          "Campaign Management",
          "Budget Planning",
          "Performance Reporting"
        ]
      }
    ]
  }
];

export const nervesBlocks: NervesBlock[] = [
  {
    "heading": "There’s a better way.",
    "paragraphs": [
      "Too many businesses settle for websites that look fine but do nothing. Since 2024, Brivix has been proving there’s a better way.",
      "We believe design and results belong together. A website should be beautiful and it should convert — attention, trust, and action, all in one experience.",
      "Clear communication, honest advice, and work that speaks for itself — it’s what to expect when working with Brivix."
    ],
    "image": "/images/nerves-1.webp",
    "alt": "Laptop on a stone desk showing a premium website design"
  },
  {
    "heading": "Small Teams, Big Ideas.",
    "paragraphs": [
      "We keep our teams small on purpose. Designers, developers, and strategists who care about the details work directly on your project. No bloat. No busywork. Just the right people doing their best work.",
      "Whether we’re transforming an existing website, rebuilding a store, or creating something entirely new — your project gets our full attention from the first call to launch, and beyond."
    ],
    "image": "/images/nerves-2.webp",
    "alt": "A small team collaborating around a sunlit studio table"
  }
];

/**
 * The sectors we build for.
 *
 * This replaced a marquee of borrowed brand logos (Adidas, Google, Meta, …)
 * that were never Brivix clients. Naming the *kind* of business we work with
 * is a truthful positioning statement; showing someone else's trademark as a
 * client is not. Rows feed three marquee tracks, so keep them roughly even.
 */
export const sectorRows: string[][] = [
  ['Ecommerce', 'Hospitality', 'Fintech', 'Local Services'],
  ['Retail', 'Creative Studios', 'Health & Wellness', 'Real Estate'],
  ['Food & Beverage', 'Education', 'Professional Services', 'CSR'],
];

/**
 * How we work — commitments about our own practice, which we can make freely.
 * Deliberately non-numeric: the block these replaced counted up fabricated
 * award totals, and swapping invented awards for invented metrics would have
 * changed nothing. Edit the copy to match how the team actually talks.
 */
export interface Principle { index: string; title: string; body: string; }
export const principles: Principle[] = [
  {
    index: '01',
    title: 'Small teams',
    body: 'One seamless process. From strategy and design to development and launch.',
  },
  {
    index: '02',
    title: 'Built to convert',
    body: 'Every decision traces back to the outcome it moves — not to what looks good in a case study.',
  },
  {
    index: '03',
    title: 'Fast by default',
    body: 'Performance is budgeted from the first commit, never patched on at the end.',
  },
  {
    index: '04',
    title: 'Yours to keep',
    body: 'Clean, documented handover on your own infrastructure. No lock-in, no hostage licences.',
  },
];
