import type { SiteContent } from '../types';

export const ptBR: SiteContent = {
  locale: 'pt-BR',

  meta: {
    title: 'Leonardo Pontes · Produto, Portfólio, Dados & IA | Mentoria e Consultoria',
    description:
      'Mentoria 1:1 e consultoria em produto digital, governança de portfólio, PMO, dados e IA — por Leonardo Pontes, MBA USP, criador do GiraHub e do Portal PMO.',
  },

  nav: {
    items: [
      { id: 'mentoria', label: 'Mentoria' },
      { id: 'depoimentos', label: 'Depoimentos' },
      { id: 'servicos', label: 'Serviços' },
      { id: 'sobre', label: 'Sobre' },
      { id: 'produtos', label: 'Produtos' },
      { id: 'experiencia', label: 'Trajetória' },
      { id: 'contato', label: 'Contato' },
    ],
    cta: 'Agendar conversa',
    toggleTheme: 'Alternar tema claro/escuro',
    toggleLanguage: 'Switch to English',
    openMenu: 'Abrir menu',
    skipToContent: 'Pular para o conteúdo',
  },

  hero: {
    badge: 'Mentoria fundador · 5 vagas abertas',
    greeting: 'Olá, eu sou o Leonardo Pontes',
    title: 'Produto, portfólio e IA que',
    titleHighlight: 'saem do papel.',
    description:
      'Mais de 8 anos liderando produtos digitais, PMOs e times de tecnologia, dados e IA, do service desk à gestão de um portfólio com mais de 40 desenvolvedores. Hoje ajudo profissionais e empresas a implementar o que funciona na prática, e não só a teoria de curso.',
    primaryCta: 'Conhecer a mentoria',
    secondaryCta: 'Falar no WhatsApp',
    portraitAlt: 'Retrato de Leonardo Fonseca Pontes',
    availability: 'Agenda aberta para mentoria e diagnósticos',
    stats: [
      { value: '8+', label: 'anos em produto e projetos' },
      { value: '40+', label: 'devs em portfólio gerido' },
      { value: '30+', label: 'projetos digitais entregues' },
      { value: '2', label: 'SaaS próprios criados do zero' },
    ],
    trustLine: 'Experiência construída em',
    trustItems: ['ATRA', 'Educacross', 'Digi.ai', 'Conexia Educação', 'MBA USP'],
  },

  offer: {
    eyebrow: 'LP | Produto & Portfólio',
    title: 'Mentoria e consultoria para quem precisa de resultado, não de slide',
    description:
      'Um acompanhamento próximo e prático em governança de portfólio, PMO e gestão de produtos digitais, com a metodologia que eu desenvolvi e validei liderando times reais.',
    bookingHint: 'ou agende uma conversa gratuita de 30 min',
    founderNote:
      'Turma fundadora: preço especial para os primeiros clientes em troca de um depoimento sincero sobre a experiência.',
    plans: [
      {
        id: 'mentoring',
        tag: 'Para profissionais',
        title: 'Mentoria 1:1 em Produto & Portfólio',
        description:
          'Acompanhamento recorrente para POs, PMs, gerentes de projeto e líderes que querem evoluir na carreira e destravar desafios reais do dia a dia.',
        price: 'R$ 997',
        priceNote: '/mês · 5 vagas fundador',
        regularPrice: 'Depois: R$ 1.497/mês',
        features: [
          '2 sessões por mês (quinzenais, 60 min)',
          'Suporte assíncrono no WhatsApp entre as sessões (resposta em até 24–48h úteis)',
          'Plano de desenvolvimento individual e revisão de entregáveis',
          'Templates e frameworks de governança, discovery e roadmap',
          'Assinatura mês a mês, sem fidelidade',
        ],
        cta: 'Garantir vaga fundador',
        highlighted: true,
        whatsappMessage:
          'Olá, Leonardo! Vi seu site e quero saber mais sobre a Mentoria 1:1 (vaga fundador).',
      },
      {
        id: 'diagnostic',
        tag: 'Para empresas',
        title: 'Diagnóstico de Maturidade + Implementação',
        description:
          'Para empresas que precisam estruturar governança de portfólio, PMO ou processos de produto, começando com um diagnóstico de baixo risco antes de qualquer implementação.',
        price: 'R$ 2.500',
        priceNote: 'diagnóstico · 3 vagas fundador',
        regularPrice: 'Depois: R$ 3.500',
        features: [
          'Diagnóstico de 2–3 semanas com entrevistas e análise de processos',
          'Relatório de maturidade por gates e roadmap recomendado',
          'Apresentação executiva para a liderança',
          'Implementação de metodologia e ferramentas sob proposta',
          '15–20% de desconto na implementação para clientes fundadores',
        ],
        cta: 'Agendar diagnóstico',
        highlighted: false,
        whatsappMessage:
          'Olá, Leonardo! Vi seu site e quero conversar sobre o Diagnóstico de Maturidade para a minha empresa.',
      },
    ],
    journey: {
      title: 'Como funciona',
      steps: [
        {
          title: 'Conversa inicial',
          description: 'Uma conversa gratuita de 30 minutos para entender o contexto, os objetivos e o encaixe.',
        },
        {
          title: 'Diagnóstico',
          description: 'Mapeamos o ponto de partida: maturidade, gargalos e prioridades, com dados.',
        },
        {
          title: 'Plano de ação',
          description: 'Um roadmap claro, com rituais, artefatos e métricas adaptados à sua realidade.',
        },
        {
          title: 'Execução acompanhada',
          description: 'Sessões recorrentes, revisão de entregas e ajustes até virar rotina.',
        },
      ],
    },
    isNot: {
      title: 'O que esta mentoria não é',
      items: [
        'Curso gravado ou infoproduto genérico',
        'Fábrica de software terceirizada',
        'Consultoria de “PowerPoint” sem implementação',
      ],
    },
  },

  services: {
    eyebrow: 'Serviços',
    title: 'Como posso gerar valor para você ou sua empresa',
    description:
      'Atuo na ponte entre negócio, produto e engenharia. Escolha o formato que faz sentido para o seu momento.',
    cta: 'Conversar sobre um projeto',
    items: [
      {
        title: 'Mentoria de carreira em Produto & Projetos',
        description:
          'Para quem quer crescer como PO, PM, Product Designer, gerente de projetos ou líder de PMO.',
        deliverables: ['Plano de carreira', 'Revisão de portfólio e CV', 'Simulação de cases e entrevistas'],
        audience: 'Profissionais',
      },
      {
        title: 'Diagnóstico de PMO & Portfólio',
        description:
          'Avaliação de maturidade da governança de projetos e produtos, com relatório e roadmap priorizado.',
        deliverables: ['Entrevistas com stakeholders', 'Score de maturidade por gate', 'Roadmap de evolução'],
        audience: 'Empresas',
      },
      {
        title: 'Implementação de governança e metodologia',
        description:
          'Desenho e implantação de gates, rituais ágeis, métricas e ferramentas, sem amarração a fornecedor.',
        deliverables: ['Fluxo de intake e priorização', 'Dashboards executivos', 'Rituais e templates'],
        audience: 'Empresas',
      },
      {
        title: 'Discovery & UX de produtos digitais',
        description:
          'Diagnóstico de usabilidade, entrevistas com usuários e protótipos para decidir o que construir antes de investir.',
        deliverables: ['Avaliação heurística (Nielsen, WCAG 2.2)', 'Mapa de oportunidades', 'Protótipos navegáveis'],
        audience: 'Empresas e startups',
      },
      {
        title: 'Produto & IA aplicada',
        description:
          'Estratégia e acompanhamento de iniciativas com IA: agentes, relatórios automatizados e produtização de MVPs criados com IA.',
        deliverables: ['Casos de uso priorizados', 'Revisão de segurança de apps gerados por IA', 'Plano de produtização'],
        audience: 'Empresas e fundadores',
      },
      {
        title: 'Workshops & treinamentos',
        description:
          'Formações práticas in company em análise de dados para negócios, gestão de produto, agilidade e PMO.',
        deliverables: ['Trilhas de 4h a 30h', 'Material e exercícios práticos', 'Turmas de até 35 pessoas'],
        audience: 'Times e lideranças',
      },
    ],
  },

  about: {
    eyebrow: 'Sobre mim',
    title: 'Do service desk à liderança de produto, dados e IA',
    description: 'Um perfil híbrido: entendo o negócio, falo a língua da engenharia e sei colocar as duas coisas para andar juntas.',
    story: [
      'Comecei no campo, no service desk e em consultoria de automação de varejo. De lá fui para o desenvolvimento de software e, cedo, para projetos de IA conversacional em educação. Essa base técnica nunca me deixou: até hoje eu construo, testo e coloco produtos em produção.',
      'Desde 2018 atuo com produto e projetos, como Project Analyst, Product Owner de 4 produtos digitais, gerente de PMO de um portfólio com mais de 40 desenvolvedores e gerente de Tecnologia, Dados e IA. Hoje sou Product Designer de Produto, Dados & IA na ATRA, uma consultoria com mais de 15 anos de mercado.',
      'Em paralelo, crio meus próprios produtos (como o GiraHub e o Portal PMO) e ensino o que aprendi. A LP | Produto & Portfólio nasceu disso: levar para outros profissionais e empresas a metodologia que validei na prática.',
    ],
    pillars: [
      {
        title: 'Estratégia',
        description: 'Roadmaps, OKRs e governança de portfólio ligados a objetivos de negócio.',
      },
      {
        title: 'Tecnologia',
        description: 'Repertório técnico para decidir com a engenharia, e não apenas para ela.',
      },
      {
        title: 'IA aplicada',
        description: 'Agentes, automações e dados aplicados a problemas reais, com segurança.',
      },
      {
        title: 'Pessoas',
        description: 'Formação de squads, cultura de feedback e desenvolvimento de lideranças.',
      },
    ],
    facts: [
      { label: 'Base', value: 'Ribeirão Preto · SP' },
      { label: 'Atuação', value: 'Remoto · Híbrido em São Paulo' },
      { label: 'Formação', value: 'MBA USP · Ciência da Computação' },
      { label: 'Idiomas', value: 'Português (nativo) · Inglês (avançado)' },
    ],
    imageAlt: 'Equipe colaborando em torno de notebooks em um escritório',
  },

  products: {
    eyebrow: 'Produtos autorais',
    title: 'Produtos que eu idealizei, construí e opero',
    description:
      'Da ideia à produção: discovery, design, código, infraestrutura e go-to-market. É a prova prática do que eu ensino.',
    stackLabel: 'Stack',
    statusLabels: {
      live: 'Em produção',
      internal: 'Uso interno',
      beta: 'Pré-lançamento',
      sunset: 'Descontinuado',
      personal: 'Ferramenta pessoal',
    },
    items: [
      {
        name: 'GiraHub',
        category: 'SaaS multi-tenant · Gestão para comunidades religiosas',
        status: 'live',
        description:
          'Plataforma para modernizar a gestão de terreiros de Umbanda e Candomblé, nascida da minha vivência como médium. Planos de Free a Premium.',
        highlights: [
          '9 módulos: senhas online, porta ao vivo, financeiro, associados, estoque, cursos e site do terreiro',
          'Isolamento multi-tenant em 3 camadas, RBAC e conformidade com a LGPD',
          '874 testes automatizados no backend e zero warnings de lint e de `any`',
        ],
        stack: ['FastAPI', 'Next.js', 'TypeScript', 'PostgreSQL', 'Docker', 'GitHub Actions', 'Grafana'],
        year: 'em operação',
        art: 'rings',
        link: { label: 'Conhecer o GiraHub', href: 'https://www.girahub.com.br' },
      },
      {
        name: 'LP Diagnóstico',
        category: 'Ferramenta proprietária da mentoria',
        status: 'internal',
        description:
          'Plataforma que uso nos diagnósticos e mentorias: avaliação de maturidade ponderada por gates, histórico de clientes, relatórios em PDF e gestão de mentorados.',
        highlights: [
          'Editor de metodologia e score de maturidade por gate',
          'Dashboard de clientes com histórico e evolução',
          'Módulo de mentoria 1:1 com sessões, ações e controle de vagas',
        ],
        stack: ['React 19', 'Tailwind 4', 'shadcn/ui', 'Express', 'SQLite', 'Docker', 'Terraform'],
        year: '2026 —',
        art: 'radar',
      },
      {
        name: 'Portal PMO',
        category: 'SaaS de governança de portfólio (2023–2026)',
        status: 'sunset',
        description:
          'Ferramenta autoral de gestão de portfólio com governança em 5 gates. Saiu de linha como produto comercial em 2026, e a metodologia virou a base da LP | Produto & Portfólio.',
        highlights: [
          'Gates de Intake, Descoberta, Planejamento, Execução e Encerramento',
          'Dashboards executivos com semáforo, KPIs e relatórios automatizados',
          'Administração multiempresa com segregação de dados',
        ],
        stack: ['Next.js', 'React', 'FastAPI', 'PostgreSQL'],
        year: '2023 — 2026',
        art: 'gates',
      },
      {
        name: 'PlantMap',
        category: 'App colaborativo de mapeamento',
        status: 'beta',
        description:
          'App mobile-first para catalogar e mapear, de forma colaborativa, plantas medicinais, rituais e alimentícias de uma comunidade, com fotos e curadoria de espécies.',
        highlights: [
          'Mapa colaborativo com fotos, condição e estágio de cada planta',
          'Login Google e aprovação de admin para novos locais (segurança física)',
          'Construído com desenvolvimento assistido por IA (Claude Code)',
        ],
        stack: ['Next.js 15', 'TypeScript', 'Tailwind 4', 'Supabase', 'Vercel'],
        year: '2026 —',
        art: 'contour',
      },
    ],
  },

  experience: {
    eyebrow: 'Trajetória',
    title: 'Experiência profissional',
    description:
      'Educação, serviços financeiros, governo e tecnologia: contextos diferentes, sempre com foco em valor mensurável.',
    currentLabel: 'Atual',
    items: [
      {
        role: 'Product Designer · Produto, Dados & IA',
        company: 'ATRA Informática',
        period: 'jul 2026 — atual',
        location: 'Ribeirão Preto, SP · Híbrido',
        current: true,
        summary:
          'Consultoria de dados e IA com mais de 15 anos de mercado e selo GPTW. Atuo em produto, UX e IA para clientes enterprise e produtos próprios.',
        achievements: [
          'Diagnóstico de usabilidade do app de uma instituição financeira de médio porte: mais de 40 telas, cerca de 100 pontos priorizados e apresentação à diretoria.',
          'Migração do site institucional de WordPress para Next.js + Payload CMS, dando autonomia ao marketing.',
          'Pentest e correção de um sistema de recrutamento gerado por IA, seguidos da produtização como SaaS.',
          'Instrutor de um workshop de 30h de Análise de Dados para Negócios para uma grande seguradora.',
        ],
      },
      {
        role: 'Gerente de Tecnologia, Dados & IA',
        company: 'Educacross',
        period: 'jan 2026 — jul 2026',
        location: 'Ribeirão Preto, SP',
        summary: 'Liderança das frentes de tecnologia, dados e IA de uma edtech com atuação nacional.',
        achievements: [
          'Liderou o time de dados na construção de um data lake com visões estratégicas para todas as áreas.',
          'Criou relatórios automatizados com IA enviados periodicamente à liderança, reduzindo a análise manual.',
          'Desenvolveu ferramentas internas de gestão de projetos, metas e um mini CRM, além de wiki e agentes de IA.',
        ],
      },
      {
        role: 'Gerente de Projetos, PMO e Tecnologia/IA',
        company: 'Educacross',
        period: 'ago 2024 — dez 2025',
        location: 'Ribeirão Preto, SP',
        summary: 'Estruturação da governança de portfólio e do escritório de projetos.',
        achievements: [
          'Implantou o PMO com métricas, gates e relatórios executivos para a diretoria.',
          'Criou um dashboard de ativação de escolas com relatórios automáticos semanais.',
          'Orquestrou lançamentos de plataformas e assistentes de IA e eventos educacionais em várias cidades.',
        ],
      },
      {
        role: 'Product Owner → Gerente de Projetos e Operações (PMO)',
        company: 'Digi.ai & parceiros',
        period: 'mar 2021 — ago 2024',
        location: 'Ribeirão Preto, SP',
        summary:
          'Comecei como PO alocado em cliente e passei a responder por todo o portfólio, como braço da diretoria.',
        achievements: [
          'Governança de horas, custos, valor e capacidade de um portfólio com mais de 40 devs em squads.',
          'Modernização de ERPs legados (inclusive de transporte) para .NET/React e integração de serviços de arrecadação.',
          'Produtos próprios e soluções para prefeituras com Scrum, Lean e SAFe.',
        ],
      },
      {
        role: 'Project Analyst → Product Owner',
        company: 'Conexia Educação',
        period: 'ago 2018 — mar 2021',
        location: 'Ribeirão Preto, SP',
        summary: 'PO de 4 produtos digitais educacionais usados por uma grande rede de escolas.',
        achievements: [
          'Liderou, na pandemia, o ferramental de aulas ao vivo para a rede de escolas.',
          'Conduziu workshops de design thinking e discovery com times multidisciplinares.',
          'Mentorou outros POs, mantendo o alinhamento entre stakeholders e times Scrum.',
        ],
      },
      {
        role: 'Desenvolvimento, dados & IA conversacional',
        company: 'Início de carreira',
        period: 'até 2018',
        location: 'Ribeirão Preto, SP',
        summary:
          'Service desk e consultoria de automação de varejo, desenvolvimento de software e os primeiros projetos de IA.',
        achievements: [
          'Agente de IA conversacional que acompanhava a rotina de estudos de alunos.',
          'Data lake, BI e plataforma com cerca de 30 indicadores para uma rede de 300 escolas.',
        ],
      },
    ],
  },

  skills: {
    eyebrow: 'Competências',
    title: 'Um repertório completo, do negócio ao deploy',
    description: 'Ferramentas e práticas que uso no dia a dia e que ensino na mentoria.',
    groups: [
      {
        id: 'product',
        label: 'Produto & UX',
        description: 'Descobrir o problema certo antes de construir a solução.',
        skills: [
          'Product Discovery',
          'Roadmaps & OKRs',
          'Figma',
          'Heurísticas de Nielsen',
          'WCAG 2.2',
          'Material Design',
          'Apple HIG',
          'Prototipação',
          'Pesquisa com usuários',
          'Product Growth',
        ],
      },
      {
        id: 'projects',
        label: 'Projetos & PMO',
        description: 'Governança que ajuda a decidir, e não burocracia.',
        skills: [
          'Governança em gates',
          'Gestão de portfólio',
          'Scrum',
          'Kanban',
          'Lean',
          'SAFe',
          'OKR',
          'Gestão de capacidade e custos',
          'Relatórios executivos',
          'OpenProject',
        ],
      },
      {
        id: 'engineering',
        label: 'Engenharia',
        description: 'Repertório para construir e para avaliar o que é construído.',
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
          'Testes automatizados',
          'Git',
        ],
      },
      {
        id: 'data-ai',
        label: 'Dados & IA',
        description: 'Dados confiáveis e IA aplicada com responsabilidade.',
        skills: [
          'Data lake & BI',
          'SQL (PostgreSQL, SQL Server, Oracle)',
          'Pandas & Colab',
          'Agentes de IA',
          'Gemini / Google AI Studio',
          'Claude Code',
          'Segurança de código gerado por IA',
          'Google Cloud ML (PMLE)',
        ],
      },
      {
        id: 'infra',
        label: 'Cloud & DevOps',
        description: 'Do commit à produção, com observabilidade.',
        skills: ['Docker', 'Terraform', 'GitHub Actions', 'Google Cloud', 'Vercel', 'Render', 'Nginx', 'Prometheus & Grafana'],
      },
      {
        id: 'leadership',
        label: 'Liderança',
        description: 'Pessoas maduras entregam produtos maduros.',
        skills: [
          'Formação de squads (Tuckman)',
          'Cultura de feedback',
          'Contratação estruturada',
          'Comunicação executiva',
          'Gestão de stakeholders',
          'Facilitação de workshops',
          'Ensino & treinamento',
        ],
      },
    ],
  },

  education: {
    eyebrow: 'Formação',
    title: 'Formação acadêmica e aprendizado contínuo',
    description: 'Base sólida em computação e gestão, renovada a cada ano.',
    degreesTitle: 'Formação acadêmica',
    certificationsTitle: 'Certificações & cursos',
    inProgressLabel: 'Em andamento',
    degrees: [
      {
        title: 'MBA em Gestão de Projetos',
        institution: 'USP — Universidade de São Paulo',
        period: '2024 — 2025',
        description: 'Frameworks ágeis, governança de portfólio, planejamento estratégico e liderança de PMO.',
      },
      {
        title: 'Bacharelado em Ciência da Computação',
        institution: 'Estácio',
        period: '2016 — 2020',
        description: 'Desenvolvimento de software, estruturas de dados e arquitetura de sistemas.',
      },
      {
        title: 'Tecnólogo em Análise e Desenvolvimento de Sistemas',
        institution: 'Centro Universitário Moura Lacerda',
        period: '2013 — 2014',
        description: 'Engenharia de software, requisitos e integração entre negócio e tecnologia.',
      },
      {
        title: 'Técnico em Informática para Internet',
        institution: 'IFSP — Instituto Federal de São Paulo',
        period: '2013 — 2014',
        description: 'Aplicações web responsivas, redes e fundamentos de gestão de projetos.',
      },
    ],
    certifications: [
      { title: 'Professional Machine Learning Engineer (trilha)', issuer: 'Google Cloud', date: '2026', tag: 'IA & ML', inProgress: true },
      { title: 'Introduction to AI and ML on Google Cloud', issuer: 'Google Cloud', date: 'out 2026', tag: 'IA & ML' },
      { title: 'Product Management', issuer: 'How Bootcamps', date: 'abr 2020', tag: 'Produto' },
      { title: 'Product Discovery', issuer: 'How Bootcamps', date: 'nov 2019', tag: 'Produto' },
      { title: 'Product Growth', issuer: 'How Bootcamps', date: 'jun 2020', tag: 'Produto' },
      { title: 'Product Marketing', issuer: 'How Bootcamps', date: 'jun 2020', tag: 'Produto' },
      { title: 'Kanban Foundation (KIKF)', issuer: 'Certiprof', date: 'set 2020', tag: 'Agilidade' },
      { title: 'Scrum: Advanced', issuer: 'LinkedIn Learning', date: 'jan 2020', tag: 'Agilidade' },
      { title: 'Transitioning from Waterfall to Agile', issuer: 'LinkedIn Learning', date: 'jan 2020', tag: 'Agilidade' },
      { title: 'OKR Bootcamp', issuer: 'Sympla', date: 'jul 2019', tag: 'Gestão' },
      { title: 'JavaScript: DOM e localStorage', issuer: 'Alura', date: 'fev 2024', tag: 'Engenharia' },
      { title: 'Python 3', issuer: 'Codecademy', date: '2017', tag: 'Engenharia' },
    ],
  },

  testimonials: {
    eyebrow: 'Depoimentos',
    title: 'O que dizem as pessoas que trabalharam comigo',
    description: 'Recomendações de líderes, pares e liderados de times de produto, engenharia e operações.',
    sourceNote: 'Recomendações públicas no LinkedIn',
    items: [
      {
        quote:
          'O Leo tem qualidades muito caras a um excelente profissional: integridade, honestidade, capacidade de encorajar o time, foco em resultados e adaptação. Se eu pudesse resumi-lo, diria que ele é um profissional incansável!',
        role: 'Learning Experience Designer · L&D Consultant',
        context: 'Trabalhou comigo na Educacross',
      },
      {
        quote:
          'Leo é um grande profissional. Tem genuína preocupação com o bem-estar do time e com a entrega de resultados. É uma pessoa equilibrada que traduz necessidades do produto em resultados excepcionais.',
        role: 'Head of Engineering · ex-Nubank',
        context: 'Gestor direto na Conexia Educação',
      },
      {
        quote:
          'Leo é um profissional completo. Possui forte capacidade para mentorar Product Owners, mantendo alto alinhamento entre stakeholders e times Scrum.',
        role: 'Product Manager · Agile Coach · SAFe',
        context: 'Atuamos em tribos diferentes na Conexia',
      },
      {
        quote:
          'Além de um grande profissional, é uma pessoa inspiradora e proativa. Possui excelente habilidade em coordenação de projetos e liderança de equipe, sempre muito atencioso e organizado.',
        role: 'CRM · Business Intelligence · Growth',
        context: 'Parceira de squad',
      },
      {
        quote:
          'Tive a oportunidade de estar ao lado dele por anos, como co-coordenadores de squads. É criativo, orientado a resultados e multidisciplinar.',
        role: 'Senior Software Engineer · Full Stack',
        context: 'Co-liderou squads comigo na Conexia',
      },
      {
        quote:
          'Profissional extremamente competente, focado em ótimas entregas. Domina a gestão de stakeholders, cultiva ritos colaborativos e promove resultados de alto impacto.',
        role: 'Consultora em Inovação · Governança do Conhecimento',
        context: 'Trabalhou comigo na Conexia Educação',
      },
    ],
  },

  faq: {
    eyebrow: 'Dúvidas frequentes',
    title: 'Perguntas frequentes',
    description: 'Não encontrou sua resposta? Me chame no WhatsApp.',
    items: [
      {
        question: 'Para quem é a mentoria 1:1?',
        answer:
          'Para Product Owners, Product Managers, Product Designers, gerentes de projeto, analistas de PMO e líderes técnicos que querem acelerar a carreira ou resolver desafios concretos: estruturar um portfólio, implantar governança, priorizar um roadmap, se preparar para uma promoção ou transição.',
      },
      {
        question: 'O que é a “vaga fundador”?',
        answer:
          'São as primeiras vagas, com preço reduzido (R$ 997/mês na mentoria e R$ 2.500 no diagnóstico), em troca de um depoimento sincero sobre a experiência. O preço fundador fica valendo enquanto a assinatura estiver ativa.',
      },
      {
        question: 'Existe fidelidade ou multa?',
        answer: 'Não. A mentoria é uma assinatura mês a mês: você cancela quando quiser, sem multa.',
      },
      {
        question: 'Como funciona o diagnóstico para empresas?',
        answer:
          'Em 2 a 3 semanas faço entrevistas, analiso processos e artefatos e aplico a metodologia de maturidade por gates. Você recebe um relatório, um roadmap priorizado e uma apresentação executiva. A implementação é opcional e orçada à parte.',
      },
      {
        question: 'Você desenvolve o software para a minha empresa?',
        answer:
          'A mentoria e a consultoria não são uma fábrica de software. Eu ajudo a decidir o que construir, como governar e como medir, e posso apoiar tecnicamente a escolha de ferramentas, a revisão de arquitetura e a segurança de soluções criadas com IA.',
      },
      {
        question: 'Os encontros são online?',
        answer:
          'Sim, por videochamada. Para empresas em São Paulo e região de Ribeirão Preto, workshops e sessões presenciais podem ser combinados.',
      },
    ],
  },

  contact: {
    eyebrow: 'Contato',
    title: 'Vamos conversar sobre o seu próximo passo?',
    description:
      'Conte rapidamente o seu contexto. Respondo pessoalmente e, se fizer sentido, marcamos uma conversa gratuita de 30 minutos.',
    channels: {
      booking: 'Agendar conversa de 30 min',
      whatsapp: 'Chamar no WhatsApp',
      email: 'Enviar e-mail',
      linkedin: 'Conectar no LinkedIn',
      github: 'Ver GitHub',
    },
    whatsappMessage: 'Olá, Leonardo! Vi seu site e gostaria de conversar sobre mentoria/consultoria.',
    emailSubject: 'Contato pelo site · LP | Produto & Portfólio',
    responseTime: 'Resposta em até 24h úteis',
    location: 'Ribeirão Preto · São Paulo · Remoto',
    languages: 'Atendimento em português e inglês',
  },

  footer: {
    tagline: 'Mentoria e consultoria em Produto, Portfólio, Dados & IA.',
    rights: 'Todos os direitos reservados.',
    builtWith: 'Feito com React, TypeScript, Tailwind e shadcn/ui.',
    imageCredits: 'Imagens: Unsplash',
  },
  ui: {
    motion: {
      label: 'Animações',
      gentleNotice: 'Seu sistema pede menos movimento, então mostramos uma versão suave do site.',
      enableFull: 'Ver animações completas',
      reduce: 'Reduzir animações',
      followSystem: 'Seguir o sistema',
      dismiss: 'Fechar aviso',
    },
    certColumns: ['Curso', 'Instituição', 'Data'],
    readMore: 'Ler mais',
    readLess: 'Ler menos',
    seeAll: 'Ver todas',
    scrollHint: 'Role para explorar',
    illustrativeImage: 'Imagem ilustrativa · Unsplash',
    previous: 'Anterior',
    next: 'Próximo',
    of: 'de',
    status: 'Status',
    year: 'Período',
    audience: 'Para',
    deliverables: 'Entregáveis',
  },
};
