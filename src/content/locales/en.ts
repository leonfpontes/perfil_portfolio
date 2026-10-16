import type { SiteContent } from '../types';

export const en: SiteContent = {
  locale: 'en',

  meta: {
    title: 'Leonardo Pontes · Product, Portfolio, Data & AI | Mentoring and Consulting',
    description:
      '1:1 mentoring and consulting in digital product, portfolio governance, PMO, data and AI — by Leonardo Pontes, USP MBA, creator of GiraHub and Portal PMO.',
  },

  nav: {
    items: [
      { id: 'mentoria', label: 'Mentoring' },
      { id: 'depoimentos', label: 'Testimonials' },
      { id: 'servicos', label: 'Services' },
      { id: 'sobre', label: 'About' },
      { id: 'produtos', label: 'Products' },
      { id: 'experiencia', label: 'Experience' },
      { id: 'contato', label: 'Contact' },
    ],
    cta: 'Book a call',
    toggleTheme: 'Toggle light/dark theme',
    toggleLanguage: 'Mudar para português',
    openMenu: 'Open menu',
    skipToContent: 'Skip to content',
  },

  hero: {
    badge: 'Founder mentoring · 5 spots open',
    greeting: "Hi, I'm Leonardo Pontes",
    title: 'Product, portfolio and AI that',
    titleHighlight: 'actually ship.',
    description:
      "8+ years leading digital products, PMOs and technology, data and AI teams, from the service desk to managing a portfolio with 40+ developers. Today I help professionals and companies implement what works in practice, not just what's in the course textbook.",
    primaryCta: 'Explore the mentoring',
    secondaryCta: 'Chat on WhatsApp',
    portraitAlt: 'Portrait of Leonardo Fonseca Pontes',
    availability: 'Open calendar for mentoring and diagnostics',
    stats: [
      { value: '8+', label: 'years in product and projects' },
      { value: '40+', label: 'devs in the managed portfolio' },
      { value: '30+', label: 'digital projects delivered' },
      { value: '2', label: 'SaaS products built from scratch' },
    ],
    trustLine: 'Experience built at',
    trustItems: ['ATRA', 'Educacross', 'Digi.ai', 'Conexia Educação', 'MBA USP'],
  },

  offer: {
    eyebrow: 'LP | Product & Portfolio',
    title: 'Mentoring and consulting for people who need results, not slides',
    description:
      'Hands-on, close support in portfolio governance, PMO and digital product management, using the methodology I developed and validated leading real teams.',
    founderNote:
      'Founder cohort: a special price for the first clients in exchange for an honest testimonial about the experience.',
    plans: [
      {
        id: 'mentoring',
        tag: 'For professionals',
        title: '1:1 Product & Portfolio Mentoring',
        description:
          'Ongoing support for POs, PMs, project managers and leaders who want to grow their careers and unblock real day-to-day challenges.',
        price: 'R$ 997',
        priceNote: '/month · 5 founder spots',
        regularPrice: 'Later: R$ 1,497/month',
        features: [
          '2 sessions per month (biweekly, 60 min)',
          'Asynchronous WhatsApp support between sessions (reply within 24–48 business hours)',
          'Individual development plan and deliverable reviews',
          'Governance, discovery and roadmap templates and frameworks',
          'Month-to-month subscription, no lock-in',
        ],
        cta: 'Claim a founder spot',
        highlighted: true,
        whatsappMessage:
          "Hi, Leonardo! I saw your website and I'd like to know more about the 1:1 Mentoring (founder spot).",
      },
      {
        id: 'diagnostic',
        tag: 'For companies',
        title: 'Maturity Diagnostic + Implementation',
        description:
          'For companies that need to structure portfolio governance, PMO or product processes, starting with a low-risk diagnostic before any implementation.',
        price: 'R$ 2,500',
        priceNote: 'diagnostic · 3 founder spots',
        regularPrice: 'Later: R$ 3,500',
        features: [
          '2–3 week diagnostic with interviews and process analysis',
          'Gate-by-gate maturity report and recommended roadmap',
          'Executive presentation for leadership',
          'Methodology and tooling implementation by proposal',
          '15–20% off implementation for founder clients',
        ],
        cta: 'Book a diagnostic',
        highlighted: false,
        whatsappMessage:
          "Hi, Leonardo! I saw your website and I'd like to talk about the Maturity Diagnostic for my company.",
      },
    ],
    journey: {
      title: 'How it works',
      steps: [
        {
          title: 'Intro call',
          description: 'A free 30-minute conversation to understand your context, your goals and whether we are a fit.',
        },
        {
          title: 'Diagnostic',
          description: 'We map your starting point: maturity, bottlenecks and priorities, backed by data.',
        },
        {
          title: 'Action plan',
          description: 'A clear roadmap, with rituals, artifacts and metrics adapted to your reality.',
        },
        {
          title: 'Guided execution',
          description: 'Recurring sessions, deliverable reviews and adjustments until it becomes routine.',
        },
      ],
    },
    isNot: {
      title: 'What this mentoring is not',
      items: [
        'A recorded course or generic info product',
        'An outsourced software factory',
        '"PowerPoint" consulting with no implementation',
      ],
    },
  },

  services: {
    eyebrow: 'Services',
    title: 'How I can create value for you or your company',
    description:
      'I work at the bridge between business, product and engineering. Choose the format that fits where you are right now.',
    cta: "Let's talk about a project",
    items: [
      {
        title: 'Career mentoring in Product & Projects',
        description:
          'For those who want to grow as a PO, PM, Product Designer, project manager or PMO leader.',
        deliverables: ['Career plan', 'Portfolio and resume review', 'Case and interview practice'],
        audience: 'Professionals',
      },
      {
        title: 'PMO & Portfolio Diagnostic',
        description:
          'Maturity assessment of project and product governance, with a report and a prioritized roadmap.',
        deliverables: ['Stakeholder interviews', 'Maturity score by gate', 'Evolution roadmap'],
        audience: 'Companies',
      },
      {
        title: 'Governance and methodology implementation',
        description:
          'Design and rollout of gates, agile rituals, metrics and tools, with no vendor lock-in.',
        deliverables: ['Intake and prioritization flow', 'Executive dashboards', 'Rituals and templates'],
        audience: 'Companies',
      },
      {
        title: 'Discovery & UX for digital products',
        description:
          'Usability assessment, user interviews and prototypes to decide what to build before you invest.',
        deliverables: ['Heuristic evaluation (Nielsen, WCAG 2.2)', 'Opportunity map', 'Clickable prototypes'],
        audience: 'Companies and startups',
      },
      {
        title: 'Product & Applied AI',
        description:
          'Strategy and guidance for AI initiatives: agents, automated reports and turning AI-built MVPs into real products.',
        deliverables: ['Prioritized use cases', 'Security review of AI-generated apps', 'Productization plan'],
        audience: 'Companies and founders',
      },
      {
        title: 'Workshops & training',
        description:
          'Hands-on in-company training in business data analysis, product management, agility and PMO.',
        deliverables: ['4h to 30h learning tracks', 'Materials and practical exercises', 'Groups of up to 35 people'],
        audience: 'Teams and leaders',
      },
    ],
  },

  about: {
    eyebrow: 'About me',
    title: 'From the service desk to leading product, data and AI',
    description: 'A hybrid profile: I understand the business, speak the language of engineering and know how to get the two moving together.',
    story: [
      "I started in the field, on the service desk and in retail automation consulting. From there I moved into software development and, early on, into conversational AI projects in education. That technical foundation never left me: to this day I build, test and ship products to production.",
      "Since 2018 I have worked in product and projects, as a Project Analyst, Product Owner of 4 digital products, PMO manager of a portfolio with 40+ developers, and Technology, Data & AI manager. Today I am a Product, Data & AI Product Designer at ATRA, a consultancy with more than 15 years in the market.",
      "In parallel, I build my own products (such as GiraHub and Portal PMO) and teach what I have learned. LP | Product & Portfolio was born from that: bringing the methodology I validated in practice to other professionals and companies.",
    ],
    pillars: [
      {
        title: 'Strategy',
        description: 'Roadmaps, OKRs and portfolio governance tied to business goals.',
      },
      {
        title: 'Technology',
        description: 'Technical depth to decide together with engineering, not just for it.',
      },
      {
        title: 'Applied AI',
        description: 'Agents, automation and data applied to real problems, safely.',
      },
      {
        title: 'People',
        description: 'Squad building, a feedback culture and leadership development.',
      },
    ],
    facts: [
      { label: 'Base', value: 'Ribeirão Preto · SP, Brazil' },
      { label: 'Work mode', value: 'Remote · Hybrid in São Paulo' },
      { label: 'Education', value: 'USP MBA · Computer Science' },
      { label: 'Languages', value: 'Portuguese (native) · English (advanced)' },
    ],
    imageAlt: 'Team collaborating around laptops in an office',
  },

  products: {
    eyebrow: 'Own products',
    title: 'Products I conceived, built and run',
    description:
      "From idea to production: discovery, design, code, infrastructure and go-to-market. It's the practical proof of what I teach.",
    stackLabel: 'Stack',
    statusLabels: {
      live: 'In production',
      internal: 'Internal use',
      beta: 'Pre-launch',
      sunset: 'Discontinued',
      personal: 'Personal tool',
    },
    items: [
      {
        name: 'GiraHub',
        category: 'Multi-tenant SaaS · Management for religious communities',
        status: 'live',
        description:
          'A platform to modernize the management of Umbanda and Candomblé temples, born from my own experience as a medium. Plans from Free to Premium.',
        highlights: [
          '9 modules: online ticketing, live front door, finance, members, inventory, courses and the temple website',
          '3-layer multi-tenant isolation, RBAC and LGPD compliance',
          '874 automated backend tests and zero lint and `any` warnings',
        ],
        stack: ['FastAPI', 'Next.js', 'TypeScript', 'PostgreSQL', 'Docker', 'GitHub Actions', 'Grafana'],
        year: 'in operation',
        art: 'rings',
        link: { label: 'Explore GiraHub', href: 'https://www.girahub.com.br' },
      },
      {
        name: 'LP Diagnóstico',
        category: 'Proprietary mentoring tool',
        status: 'internal',
        description:
          'The platform I use in diagnostics and mentoring: gate-weighted maturity assessment, client history, PDF reports and mentee management.',
        highlights: [
          'Methodology editor and maturity score by gate',
          'Client dashboard with history and progress',
          '1:1 mentoring module with sessions, actions and spot control',
        ],
        stack: ['React 19', 'Tailwind 4', 'shadcn/ui', 'Express', 'SQLite', 'Docker', 'Terraform'],
        year: '2026 —',
        art: 'radar',
      },
      {
        name: 'Portal PMO',
        category: 'Portfolio governance SaaS (2023–2026)',
        status: 'sunset',
        description:
          'My own portfolio management tool with 5-gate governance. Retired as a commercial product in 2026, and its methodology became the foundation of LP | Product & Portfolio.',
        highlights: [
          'Intake, Discovery, Planning, Execution and Closing gates',
          'Executive dashboards with traffic lights, KPIs and automated reports',
          'Multi-company administration with data segregation',
        ],
        stack: ['Next.js', 'React', 'FastAPI', 'PostgreSQL'],
        year: '2023 — 2026',
        art: 'gates',
      },
      {
        name: 'PlantMap',
        category: 'Collaborative mapping app',
        status: 'beta',
        description:
          "A mobile-first app to collaboratively catalog and map a community's medicinal, ritual and edible plants, with photos and species curation.",
        highlights: [
          'Collaborative map with photos, condition and growth stage of each plant',
          'Google login and admin approval for new locations (physical safety)',
          'Built with AI-assisted development (Claude Code)',
        ],
        stack: ['Next.js 15', 'TypeScript', 'Tailwind 4', 'Supabase', 'Vercel'],
        year: '2026 —',
        art: 'contour',
      },
    ],
  },

  experience: {
    eyebrow: 'Experience',
    title: 'Professional experience',
    description:
      'Education, financial services, government and technology: different contexts, always focused on measurable value.',
    currentLabel: 'Current',
    items: [
      {
        role: 'Product Designer · Product, Data & AI',
        company: 'ATRA Informática',
        period: 'Jul 2026 — present',
        location: 'Ribeirão Preto, SP · Hybrid',
        current: true,
        summary:
          'Data and AI consultancy with 15+ years in the market and a GPTW seal. I work on product, UX and AI for enterprise clients and in-house products.',
        achievements: [
          "Usability assessment of a mid-sized financial institution's app: 40+ screens, around 100 prioritized findings and a presentation to the board.",
          'Migrated the corporate website from WordPress to Next.js + Payload CMS, giving marketing autonomy.',
          'Pentest and remediation of an AI-generated recruiting system, followed by productization as a SaaS.',
          'Instructor of a 30-hour Data Analysis for Business workshop for a large insurance company.',
        ],
      },
      {
        role: 'Technology, Data & AI Manager',
        company: 'Educacross',
        period: 'Jan 2026 — Jul 2026',
        location: 'Ribeirão Preto, SP',
        summary: 'Led the technology, data and AI fronts of a nationwide edtech.',
        achievements: [
          'Led the data team in building a data lake with strategic views for every area.',
          'Created AI-powered automated reports sent to leadership on a regular basis, reducing manual analysis.',
          'Developed internal tools for project and goal management and a mini CRM, plus a wiki and AI agents.',
        ],
      },
      {
        role: 'Project, PMO and Technology/AI Manager',
        company: 'Educacross',
        period: 'Aug 2024 — Dec 2025',
        location: 'Ribeirão Preto, SP',
        summary: 'Structured the portfolio governance and the project office.',
        achievements: [
          'Implemented the PMO with metrics, gates and executive reports for the board.',
          'Built a school activation dashboard with automated weekly reports.',
          'Orchestrated launches of platforms and AI assistants and educational events in multiple cities.',
        ],
      },
      {
        role: 'Product Owner → Project and Operations Manager (PMO)',
        company: 'Digi.ai & partners',
        period: 'Mar 2021 — Aug 2024',
        location: 'Ribeirão Preto, SP',
        summary:
          'Started as a PO placed at a client and went on to own the entire portfolio, as the executive board\'s right hand.',
        achievements: [
          'Governance of hours, costs, value and capacity for a portfolio of 40+ devs in squads.',
          'Modernized legacy ERPs (including a transportation one) to .NET/React and integrated tax collection services.',
          'In-house products and solutions for city governments using Scrum, Lean and SAFe.',
        ],
      },
      {
        role: 'Project Analyst → Product Owner',
        company: 'Conexia Educação',
        period: 'Aug 2018 — Mar 2021',
        location: 'Ribeirão Preto, SP',
        summary: 'PO of 4 digital education products used by a large school network.',
        achievements: [
          'During the pandemic, led the live-class tooling for the school network.',
          'Ran design thinking and discovery workshops with multidisciplinary teams.',
          'Mentored other POs, keeping stakeholders and Scrum teams aligned.',
        ],
      },
      {
        role: 'Development, data & conversational AI',
        company: 'Early career',
        period: 'until 2018',
        location: 'Ribeirão Preto, SP',
        summary:
          'Service desk and retail automation consulting, software development and the first AI projects.',
        achievements: [
          "Conversational AI agent that tracked students' study routines.",
          'Data lake, BI and a platform with about 30 indicators for a network of 300 schools.',
        ],
      },
    ],
  },

  skills: {
    eyebrow: 'Skills',
    title: 'A complete toolkit, from business to deploy',
    description: 'Tools and practices I use every day and teach in the mentoring.',
    groups: [
      {
        id: 'product',
        label: 'Product & UX',
        description: 'Find the right problem before building the solution.',
        skills: [
          'Product Discovery',
          'Roadmaps & OKRs',
          'Figma',
          'Nielsen Heuristics',
          'WCAG 2.2',
          'Material Design',
          'Apple HIG',
          'Prototyping',
          'User research',
          'Product Growth',
        ],
      },
      {
        id: 'projects',
        label: 'Projects & PMO',
        description: 'Governance that helps people decide, not bureaucracy.',
        skills: [
          'Gate-based governance',
          'Portfolio management',
          'Scrum',
          'Kanban',
          'Lean',
          'SAFe',
          'OKR',
          'Capacity and cost management',
          'Executive reporting',
          'OpenProject',
        ],
      },
      {
        id: 'engineering',
        label: 'Engineering',
        description: 'The depth to build, and to evaluate what gets built.',
        skills: [
          'TypeScript',
          'JavaScript',
          'Python',
          'React',
          'Next.js',
          'Node.js / Express',
          'FastAPI',
          '.NET',
          'Android',
          'Automated testing',
          'Git',
        ],
      },
      {
        id: 'data-ai',
        label: 'Data & AI',
        description: 'Trustworthy data and responsibly applied AI.',
        skills: [
          'Data lake & BI',
          'SQL (PostgreSQL, SQL Server, Oracle)',
          'Pandas & Colab',
          'AI agents',
          'Gemini / Google AI Studio',
          'Claude Code',
          'Security of AI-generated code',
          'Google Cloud ML (PMLE)',
        ],
      },
      {
        id: 'infra',
        label: 'Cloud & DevOps',
        description: 'From commit to production, with observability.',
        skills: ['Docker', 'Terraform', 'GitHub Actions', 'Google Cloud', 'Vercel', 'Render', 'Nginx', 'Prometheus & Grafana'],
      },
      {
        id: 'leadership',
        label: 'Leadership',
        description: 'Mature people deliver mature products.',
        skills: [
          'Squad building (Tuckman)',
          'Feedback culture',
          'Structured hiring',
          'Executive communication',
          'Stakeholder management',
          'Workshop facilitation',
          'Teaching & training',
        ],
      },
    ],
  },

  education: {
    eyebrow: 'Education',
    title: 'Academic background and continuous learning',
    description: 'A solid foundation in computing and management, refreshed every year.',
    degreesTitle: 'Academic background',
    certificationsTitle: 'Certifications & courses',
    inProgressLabel: 'In progress',
    degrees: [
      {
        title: 'MBA in Project Management',
        institution: 'USP — University of São Paulo',
        period: '2024 — 2025',
        description: 'Agile frameworks, portfolio governance, strategic planning and PMO leadership.',
      },
      {
        title: "Bachelor's in Computer Science",
        institution: 'Estácio',
        period: '2016 — 2020',
        description: 'Software development, data structures and systems architecture.',
      },
      {
        title: 'Technologist in Systems Analysis and Development',
        institution: 'Centro Universitário Moura Lacerda',
        period: '2013 — 2014',
        description: 'Software engineering, requirements and the integration of business and technology.',
      },
      {
        title: 'Technical Degree in Internet Informatics',
        institution: 'IFSP — Federal Institute of São Paulo',
        period: '2013 — 2014',
        description: 'Responsive web applications, networking and project management fundamentals.',
      },
    ],
    certifications: [
      { title: 'Professional Machine Learning Engineer (track)', issuer: 'Google Cloud', date: '2026', tag: 'AI & ML', inProgress: true },
      { title: 'Introduction to AI and ML on Google Cloud', issuer: 'Google Cloud', date: 'Oct 2026', tag: 'AI & ML' },
      { title: 'Product Management', issuer: 'How Bootcamps', date: 'Apr 2020', tag: 'Product' },
      { title: 'Product Discovery', issuer: 'How Bootcamps', date: 'Nov 2019', tag: 'Product' },
      { title: 'Product Growth', issuer: 'How Bootcamps', date: 'Jun 2020', tag: 'Product' },
      { title: 'Product Marketing', issuer: 'How Bootcamps', date: 'Jun 2020', tag: 'Product' },
      { title: 'Kanban Foundation (KIKF)', issuer: 'Certiprof', date: 'Sep 2020', tag: 'Agility' },
      { title: 'Scrum: Advanced', issuer: 'LinkedIn Learning', date: 'Jan 2020', tag: 'Agility' },
      { title: 'Transitioning from Waterfall to Agile', issuer: 'LinkedIn Learning', date: 'Jan 2020', tag: 'Agility' },
      { title: 'OKR Bootcamp', issuer: 'Sympla', date: 'Jul 2019', tag: 'Management' },
      { title: 'JavaScript: DOM and localStorage', issuer: 'Alura', date: 'Feb 2024', tag: 'Engineering' },
      { title: 'Python 3', issuer: 'Codecademy', date: '2017', tag: 'Engineering' },
    ],
  },

  testimonials: {
    eyebrow: 'Testimonials',
    title: 'What people who worked with me say',
    description: 'Recommendations from leaders, peers and direct reports across product, engineering and operations teams.',
    sourceNote: 'Public recommendations on LinkedIn',
    items: [
      {
        quote:
          'Leo has qualities that are rare in an excellent professional: integrity, honesty, the ability to encourage the team, a focus on results and adaptability. If I had to sum him up, I would say he is a tireless professional!',
        role: 'Learning Experience Designer · L&D Consultant',
        context: 'Worked with me at Educacross',
      },
      {
        quote:
          'Leo is a great professional. He genuinely cares about the well-being of the team and about delivering results. He is a balanced person who translates product needs into exceptional outcomes.',
        role: 'Head of Engineering · ex-Nubank',
        context: 'Direct manager at Conexia Educação',
      },
      {
        quote:
          'Leo is a well-rounded professional. He has a strong ability to mentor Product Owners, keeping stakeholders and Scrum teams closely aligned.',
        role: 'Product Manager · Agile Coach · SAFe',
        context: 'We worked in different tribes at Conexia',
      },
      {
        quote:
          'Besides being a great professional, he is an inspiring and proactive person. He has excellent skills in project coordination and team leadership, and is always very attentive and organized.',
        role: 'CRM · Business Intelligence · Growth',
        context: 'Squad partner',
      },
      {
        quote:
          'I had the opportunity to work alongside him for years, as squad co-coordinators. He is creative, results-driven and multidisciplinary.',
        role: 'Senior Software Engineer · Full Stack',
        context: 'Co-led squads with me at Conexia',
      },
      {
        quote:
          'An extremely competent professional, focused on great deliveries. He masters stakeholder management, cultivates collaborative rituals and drives high-impact results.',
        role: 'Innovation Consultant · Knowledge Governance',
        context: 'Worked with me at Conexia Educação',
      },
    ],
  },

  faq: {
    eyebrow: 'FAQ',
    title: 'Frequently asked questions',
    description: "Didn't find your answer? Message me on WhatsApp.",
    items: [
      {
        question: 'Who is the 1:1 mentoring for?',
        answer:
          'For Product Owners, Product Managers, Product Designers, project managers, PMO analysts and tech leaders who want to accelerate their careers or solve concrete challenges: structuring a portfolio, implementing governance, prioritizing a roadmap, preparing for a promotion or a transition.',
      },
      {
        question: 'What is the "founder spot"?',
        answer:
          'These are the first spots, at a reduced price (R$ 997/month for mentoring and R$ 2,500 for the diagnostic), in exchange for an honest testimonial about the experience. The founder price stays in place for as long as your subscription is active.',
      },
      {
        question: 'Is there a lock-in or cancellation fee?',
        answer: 'No. The mentoring is a month-to-month subscription: you can cancel whenever you want, with no penalty.',
      },
      {
        question: 'How does the diagnostic for companies work?',
        answer:
          'Over 2 to 3 weeks I run interviews, analyze processes and artifacts, and apply the gate-based maturity methodology. You receive a report, a prioritized roadmap and an executive presentation. Implementation is optional and quoted separately.',
      },
      {
        question: 'Do you develop software for my company?',
        answer:
          "The mentoring and consulting are not a software factory. I help you decide what to build, how to govern it and how to measure it, and I can provide technical support on tool selection, architecture review and the security of AI-built solutions.",
      },
      {
        question: 'Are the sessions online?',
        answer:
          'Yes, by video call. For companies in São Paulo and the Ribeirão Preto region, in-person workshops and sessions can be arranged.',
      },
    ],
  },

  contact: {
    eyebrow: 'Contact',
    title: "Shall we talk about your next step?",
    description:
      "Tell me a bit about your context. I reply personally and, if it makes sense, we'll book a free 30-minute conversation.",
    channels: {
      whatsapp: 'Message on WhatsApp',
      email: 'Send an email',
      linkedin: 'Connect on LinkedIn',
      github: 'View GitHub',
    },
    whatsappMessage: "Hi, Leonardo! I saw your website and I'd like to talk about mentoring/consulting.",
    emailSubject: 'Contact via website · LP | Product & Portfolio',
    responseTime: 'Reply within 24 business hours',
    location: 'Ribeirão Preto · São Paulo · Remote',
    languages: 'Available in Portuguese and English',
  },

  footer: {
    tagline: 'Mentoring and consulting in Product, Portfolio, Data & AI.',
    rights: 'All rights reserved.',
    builtWith: 'Built with React, TypeScript, Tailwind and shadcn/ui.',
    imageCredits: 'Images: Unsplash',
  },
  ui: {
    scrollHint: 'Scroll to explore',
    illustrativeImage: 'Illustrative image · Unsplash',
    previous: 'Previous',
    next: 'Next',
    of: 'of',
    status: 'Status',
    year: 'Period',
    audience: 'For',
    deliverables: 'Deliverables',
  },
};
