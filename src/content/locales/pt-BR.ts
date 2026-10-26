import type { SiteContent } from '../types';

export const ptBR: SiteContent = {
  locale: 'pt-BR',

  nav: {
    items: [
      { id: 'mentoring', label: 'Mentoring' },
      { id: 'diagnostic', label: 'Diagnostic' },
      { id: 'about', label: 'About' },
      { id: 'contact', label: 'Contact' },
    ],
    home: 'Início',
    cta: 'Book a call',
    clientArea: 'Client area',
    toggleLanguage: 'Switch to English',
    openMenu: 'Abrir menu',
    skipToContent: 'Pular para o conteúdo',
  },

  home: {
    meta: {
      title: 'Mentoria de Produto e Diagnóstico de PMO | Leonardo Pontes',
      description:
        'Mentoria 1:1 para Product Managers e POs (R$ 997/mês) e diagnóstico de maturidade de PMO e portfólio para empresas, com Leonardo Pontes, MBA USP.',
    },
    profile: {
      eyebrow: 'Your mentor',
      title: 'Mais de 8 anos fazendo produto e governança funcionarem',
      description:
        'Fui Product Owner de 4 produtos digitais, gerente de PMO de um portfólio com mais de 40 desenvolvedores e gerente de Tecnologia, Dados e IA. Hoje atuo em produto, dados e IA na ATRA e conduzo a LP · Product & Portfolio.',
      cta: 'Conhecer a trajetória completa',
    },
  },

  mentoringPage: {
    meta: {
      title: 'Mentoria de Produto para PM e PO, 1:1 | Leonardo Pontes',
      description:
        'Mentoria para PO e Product Manager: 2 sessões de 60 min por mês, suporte no WhatsApp e plano de desenvolvimento individual. R$ 997/mês, sem fidelidade.',
    },
    hero: {
      eyebrow: 'Private mentoring · 1:1',
      title: 'Mentoria de produto para',
      titleHighlight: 'PMs e POs.',
      description:
        'Duas sessões por mês com quem já foi Product Owner, gerente de PMO e gerente de Tecnologia, Dados e IA. Você traz os desafios reais do seu trabalho e sai de cada encontro com o próximo passo claro.',
      primaryCta: 'Garantir vaga fundador',
      secondaryCta: 'Ver como funciona',
      facts: [
        { label: 'Formato', value: '2 sessões/mês · 60 min · online' },
        { label: 'Entre as sessões', value: 'WhatsApp, em até 24–48h úteis' },
        { label: 'Investimento', value: 'R$ 997/mês · 5 vagas fundador' },
        { label: 'Compromisso', value: 'Mês a mês, sem fidelidade' },
      ],
    },
    scope: {
      eyebrow: 'The mentoring',
      title: 'Para crescer como PM, PO ou líder de produto',
      description: 'Acompanhamento individual e recorrente, centrado nos desafios do seu trabalho e da sua carreira.',
      audienceTitle: 'Para quem é',
      audience: [
        'Product Owners e Product Managers',
        'Product Designers e analistas de produto',
        'Gerentes de projeto e analistas de PMO',
        'Líderes técnicos que passaram a cuidar de produto',
      ],
      topicsTitle: 'O que trabalhamos',
      topics: [
        'Estruturar um portfólio e priorizar o roadmap',
        'Implantar governança, discovery e rituais que funcionam',
        'Plano de carreira e revisão de CV e de portfólio',
        'Preparação para promoção, transição e entrevistas, com simulação de cases',
      ],
    },
    journey: {
      eyebrow: 'How it works',
      title: 'Como funciona a mentoria',
      description: 'Do primeiro contato à rotina de sessões.',
      steps: [
        {
          title: 'Conversa inicial',
          description: 'Uma conversa gratuita de 30 minutos para entender o seu momento, os seus objetivos e o encaixe.',
        },
        {
          title: 'Plano individual',
          description: 'Mapeamos onde você está e aonde quer chegar, e montamos um plano de desenvolvimento com prioridades.',
        },
        {
          title: 'Sessões quinzenais',
          description: 'Duas sessões de 60 minutos por mês sobre os desafios reais do seu trabalho, com revisão dos seus entregáveis.',
        },
        {
          title: 'Entre as sessões',
          description: 'Dúvidas e revisões pelo WhatsApp, com resposta em até 24–48h úteis, e templates prontos para aplicar.',
        },
      ],
      isNot: {
        title: 'O que esta mentoria não é',
        items: [
          'Curso gravado ou infoproduto genérico',
          'Aula de teoria desligada do seu dia a dia',
          'Promessa de promoção garantida',
        ],
      },
    },
    faq: {
      eyebrow: 'FAQ',
      title: 'Perguntas sobre a mentoria',
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
            'São as 5 primeiras vagas, a R$ 997/mês (depois, R$ 1.497/mês), em troca de um depoimento sincero sobre a experiência. O preço fundador fica valendo enquanto a assinatura estiver ativa.',
        },
        {
          question: 'Existe fidelidade ou multa?',
          answer: 'Não. A mentoria é uma assinatura mês a mês: você cancela quando quiser, sem multa.',
        },
        {
          question: 'Como funciona o suporte pelo WhatsApp?',
          answer:
            'Entre as sessões você pode mandar dúvidas, documentos e entregáveis para revisão. A resposta vem em até 24–48h úteis.',
        },
        {
          question: 'Os encontros são online?',
          answer: 'Sim, por videochamada, em horários combinados com antecedência.',
        },
      ],
    },
  },

  diagnosticPage: {
    meta: {
      title: 'Diagnóstico de Maturidade de PMO e Portfólio | Leonardo Pontes',
      description:
        'Diagnóstico de maturidade de PMO e governança de portfólio por gates: entrevistas, score, roadmap priorizado e apresentação executiva em 2 a 3 semanas.',
    },
    hero: {
      eyebrow: 'For companies · Portfolio Diagnostic',
      title: 'Diagnóstico de maturidade de',
      titleHighlight: 'PMO e portfólio.',
      description:
        'Para empresas com projetos demais, prioridades em disputa e pouca visibilidade do que gera valor. Em 2 a 3 semanas você recebe o retrato da maturidade da sua governança, gate a gate, e um roadmap priorizado para evoluir.',
      primaryCta: 'Agendar diagnóstico',
      secondaryCta: 'Ver as etapas',
      facts: [
        { label: 'Duração', value: '2 a 3 semanas' },
        { label: 'Método', value: 'Maturidade por gates' },
        { label: 'Investimento', value: 'R$ 7.500 · 3 vagas fundador' },
        { label: 'Preço cheio', value: 'R$ 12.000' },
      ],
    },
    process: {
      eyebrow: 'How it works',
      title: 'Do primeiro contato à execução acompanhada',
      description: 'Quatro etapas, cada uma com uma decisão clara antes da próxima.',
      steps: [
        {
          title: 'Conversa inicial',
          description: 'Uma conversa gratuita de 30 minutos para entender o contexto, os objetivos e o encaixe.',
        },
        {
          title: 'Diagnóstico',
          description: 'Entrevistas e análise de processos e artefatos: mapeamos maturidade, gargalos e prioridades, com dados.',
        },
        {
          title: 'Plano de ação',
          description: 'Um roadmap priorizado, com rituais, artefatos e métricas adaptados à realidade da empresa.',
        },
        {
          title: 'Execução acompanhada',
          description: 'Se fizer sentido, a implementação vem sob proposta, com acompanhamento até virar rotina.',
        },
      ],
      isNot: {
        title: 'O que este diagnóstico não é',
        items: [
          'Consultoria de “PowerPoint” sem implementação',
          'Fábrica de software terceirizada',
          'Venda de ferramenta ou amarração a fornecedor',
        ],
      },
    },
    deliverables: {
      eyebrow: 'Deliverables',
      title: 'O que a sua empresa recebe',
      description: 'Um diagnóstico de baixo risco antes de qualquer implementação: o próximo passo é decidido com dados na mão.',
      itemsTitle: 'Entregáveis do diagnóstico',
      items: [
        {
          title: 'Entrevistas e análise',
          description: 'Conversas com stakeholders e leitura dos processos, artefatos e ferramentas em uso.',
        },
        {
          title: 'Score de maturidade por gate',
          description: 'Intake, descoberta, planejamento, execução e encerramento avaliados com a mesma régua.',
        },
        {
          title: 'Relatório e roadmap priorizado',
          description: 'Onde estão os gargalos, o que atacar primeiro e o que pode esperar.',
        },
        {
          title: 'Apresentação executiva',
          description: 'Achados e roadmap apresentados à liderança, prontos para decisão.',
        },
      ],
    },
    faq: {
      eyebrow: 'FAQ',
      title: 'Perguntas sobre o diagnóstico',
      description: 'Não encontrou sua resposta? Me chame no WhatsApp.',
      items: [
        {
          question: 'Como funciona o diagnóstico?',
          answer:
            'Em 2 a 3 semanas faço entrevistas, analiso processos e artefatos e aplico a metodologia de maturidade por gates. Você recebe um relatório, um roadmap priorizado e uma apresentação executiva. A implementação é opcional e orçada à parte.',
        },
        {
          question: 'O que é a “vaga fundador”?',
          answer:
            'São as 3 primeiras empresas: o diagnóstico sai por R$ 7.500 (depois, R$ 12.000), em troca de um depoimento sincero sobre a experiência, e a implementação tem 15–20% de desconto.',
        },
        {
          question: 'Preciso contratar a implementação?',
          answer:
            'Não. O relatório e o roadmap ficam com a sua empresa, que pode executá-los com o próprio time. A implementação comigo é opcional e orçada à parte.',
        },
        {
          question: 'Você desenvolve o software para a minha empresa?',
          answer:
            'A consultoria não é uma fábrica de software. Eu ajudo a decidir o que construir, como governar e como medir, e posso apoiar tecnicamente a escolha de ferramentas, a revisão de arquitetura e a segurança de soluções criadas com IA.',
        },
        {
          question: 'É presencial ou online?',
          answer:
            'As entrevistas e a apresentação podem ser por videochamada. Para empresas em São Paulo e na região de Ribeirão Preto, sessões presenciais podem ser combinadas.',
        },
      ],
    },
  },

  aboutPage: {
    meta: {
      title: 'Sobre Leonardo Pontes: Produto, PMO, Dados e IA',
      description:
        'Trajetória de Leonardo Pontes: Product Owner, gerente de PMO e de Tecnologia, Dados e IA. MBA em Gestão de Projetos pela USP e criador do GiraHub.',
    },
  },

  notFound: {
    meta: {
      title: 'Página não encontrada | Leonardo Pontes',
      description: 'Esta página não existe. Conheça a mentoria de produto, o diagnóstico de PMO ou a trajetória de Leonardo Pontes.',
    },
    eyebrow: 'Error 404',
    title: 'Esta página não existe',
    description: 'O endereço pode ter mudado com a nova versão do site. Escolha um destes caminhos:',
    linksTitle: 'Páginas do site',
  },

  hero: {
    badge: 'Mentoria fundador · 5 vagas abertas',
    greeting: 'Leonardo Pontes · Product & Portfolio',
    title: 'Mentoria de produto e diagnóstico de PMO que',
    titleHighlight: 'saem do papel.',
    description:
      'Para PMs, POs e líderes de produto que querem crescer na carreira, e para empresas que precisam pôr ordem no portfólio de projetos. Você sai com um plano claro e apoio para executá-lo, de quem lidera produtos e PMOs há mais de 8 anos.',
    offersLabel: 'Escolha o seu caminho',
    secondaryCta: 'Prefiro conversar no WhatsApp',
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
    eyebrow: 'Offers',
    title: 'Mentoria e consultoria para quem precisa de resultado, não de slide',
    description:
      'Duas formas de trabalhar comigo, com a metodologia que eu desenvolvi e validei liderando times reais: mentoria para quem quer evoluir na carreira de produto e diagnóstico para empresas que precisam organizar o portfólio e o PMO.',
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
        priceShort: 'R$ 997/mês',
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
        detailCta: 'Ver a mentoria em detalhe',
        highlighted: true,
        whatsappMessage:
          'Olá, Leonardo! Vi seu site e quero saber mais sobre a Mentoria 1:1 (vaga fundador).',
      },
      {
        id: 'diagnostic',
        tag: 'Para empresas',
        title: 'Diagnóstico de Maturidade de PMO & Portfólio',
        description:
          'Para empresas que precisam estruturar governança de portfólio, PMO ou processos de produto, começando com um diagnóstico de baixo risco antes de qualquer implementação.',
        price: 'R$ 7.500',
        priceShort: 'R$ 7.500',
        priceNote: 'diagnóstico · 3 vagas fundador',
        regularPrice: 'Depois: R$ 12.000',
        features: [
          'Diagnóstico de 2–3 semanas com entrevistas e análise de processos',
          'Relatório de maturidade por gates e roadmap recomendado',
          'Apresentação executiva para a liderança',
          'Implementação de metodologia e ferramentas sob proposta',
          '15–20% de desconto na implementação para clientes fundadores',
        ],
        cta: 'Agendar diagnóstico',
        detailCta: 'Ver o diagnóstico em detalhe',
        highlighted: false,
        whatsappMessage:
          'Olá, Leonardo! Vi seu site e quero conversar sobre o Diagnóstico de Maturidade para a minha empresa.',
      },
    ],
  },

  services: {
    eyebrow: 'Services',
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
    eyebrow: 'About',
    title: 'Do service desk à liderança de produto, dados e IA',
    description: 'Um perfil híbrido: entendo o negócio, falo a língua da engenharia e sei colocar as duas coisas para andar juntas.',
    story: [
      'Comecei no campo, no service desk e em consultoria de automação de varejo. De lá fui para o desenvolvimento de software e, cedo, para projetos de IA conversacional em educação. Essa base técnica nunca me deixou: até hoje eu construo, testo e coloco produtos em produção.',
      'Desde 2018 atuo com produto e projetos, como Project Analyst, Product Owner de 4 produtos digitais, gerente de PMO de um portfólio com mais de 40 desenvolvedores e gerente de Tecnologia, Dados e IA. Hoje sou Product Designer de Produto, Dados & IA na ATRA, uma consultoria com mais de 15 anos de mercado.',
      'Em paralelo, crio meus próprios produtos (como o GiraHub e o Portal PMO) e ensino o que aprendi. A LP · Product & Portfolio nasceu disso: levar para outros profissionais e empresas a metodologia que validei na prática.',
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
    eyebrow: 'Products',
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
          'Ferramenta autoral de gestão de portfólio com governança em 5 gates. Saiu de linha como produto comercial em 2026, e a metodologia virou a base da LP · Product & Portfolio.',
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
    eyebrow: 'Track record',
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
    eyebrow: 'Expertise',
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
    eyebrow: 'Education',
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
    eyebrow: 'Testimonials',
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

  contact: {
    eyebrow: 'Contact',
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
    emailSubject: 'Contato pelo site · LP · Product & Portfolio',
    responseTime: 'Resposta em até 24h úteis',
    location: 'Ribeirão Preto · São Paulo · Remoto',
    languages: 'Atendimento em português e inglês',
  },

  footer: {
    tagline: 'Mentoria e consultoria em Produto, Portfólio, Dados & IA.',
    rights: 'Todos os direitos reservados.',
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
