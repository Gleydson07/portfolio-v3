export const siteConfig = {
  name: "Gleydson Santos",
  title: "Engenheiro de software",
  description:
    "Engenheiro de software com foco em arquitetura, código de qualidade e entrega de soluções escaláveis com impacto mensurável.",
  url: "https://gsantos.dev.br",
  locale: "pt_BR",
  status: "DISPONÍVEL · VIÇOSA, AL",
};

export type NavAnchorItem = { id: string; label: string; href?: never };
export type NavLinkItem = { label: string; href: string; id?: never };
export type NavItem = NavAnchorItem | NavLinkItem;

export const navigation: NavItem[] = [
  { id: "inicio", label: "Início" },
  { id: "expertise", label: "Expertise" },
  { id: "experiencia", label: "Trajetória" },
  { id: "contato", label: "Contato" },
  { label: "Blog", href: "/blog" },
];

export const heroContent = {
  greeting: "Olá, meu nome é",
  name: "Gleydson Santos",
  title: "Engenheiro de software",
  subtitle:
    "Unindo arquitetura, engenharia de software e visão de produto para entregar soluções que escalam.",
  hudLabel: "// SYS.ONLINE",
  ctaSecondary: "LinkedIn",
};

export const experienceContent = {
  hudLabel: "// TRAJETÓRIA",
  title: "Trajetória",
  subtitle: "Experiência profissional e formação acadêmica.",
  jobs: [
    {
      company: "Trinus Co",
      period: "07/2022 — 06/2026",
      workMode: "Remoto",
      roles: [
        {
          title: "Desenvolvedor Full-stack",
          impacts: [
            "Desenvolvimento full-stack com NestJS, Clean Architecture, Next.js, SQL Server e Docker.",
            "Aplicação de SOLID, clean code e testes em ambientes de produção.",
            "Integração de sistemas internos com ERPs de mercado no setor financeiro e imobiliário.",
          ],
        },
        {
          title: "Tech Lead",
          impacts: [
            "Coordenação técnica na automatização de monitoramento de recebíveis (financeiro/imobiliário).",
            "Discovery e validação técnica com o time de produto.",
          ],
        },
      ],
    },
    {
      company: "Confi",
      period: "08/2021 — 05/2022",
      workMode: "Remoto",
      roles: [
        {
          title: "Desenvolvedor ReactJS",
          impacts: [
            "Plataformas web com React, Next.js, Prismic CMS e Sentry.",
            "Testes unitários e estilização com Styled-components.",
          ],
        },
      ],
    },
  ],
  education: [
    {
      institution: "Faculdade Brasília",
      period: "2023 — 2025",
      degree: "MBA — Arquitetura FullCycle",
    },
    {
      institution: "Estácio",
      period: "2021 — 2022",
      degree: "Pós-graduação — Engenharia de Software",
    },
    {
      institution: "CESMAC",
      period: "2014 — 2017",
      degree: "Graduação — Gestão de Sistemas de Informação",
    },
  ],
};

export const expertiseContent = {
  hudLabel: "// EXPERTISE",
  title: "Expertise Técnica",
  subtitle: "Stack, práticas e IA aplicada no ciclo de desenvolvimento.",
  categories: [
    {
      label: "Frontend",
      skills: ["React", "Next.js", "TypeScript"],
    },
    {
      label: "Backend",
      skills: ["Node.js", "NestJS", "Express", "Docker", "PrismaORM", "TypeORM", "Drizzle"],
    },
    {
      label: "Dados",
      skills: ["PostgreSQL", "SQL Server", "MongoDB"],
    },
    {
      label: "Engenharia",
      skills: ["SOLID", "Clean Code", "Testes", "Arquitetura", "Scrum"],
    },
    {
      label: "Inteligência Artificial",
      context:
        "Uso IA generativa como multiplicador no dia a dia — do planejamento ao código, revisão e entrega, com Cursor e Claude no fluxo de trabalho.",
      skills: ["Cursor", "Claude", "LLMs", "Integração via API", "Automação de fluxos"],
      highlight: true,
    },
  ],
};

export const contactContent = {
  hudLabel: "// CONTATO",
  title: "Tem um produto para construir?",
  description:
    "Uno arquitetura, engenharia de software e visão de produto para levar sua ideia à entrega — com soluções que escalam. Escolha um canal abaixo e vamos conversar.",
  links: [
    {
      label: "LinkedIn",
      href: "https://www.linkedin.com/in/gsantosdev/",
      external: true,
    },
    {
      label: "GitHub",
      href: "https://github.com/Gleydson07",
      external: true,
    },
    {
      label: "E-mail",
      href: "mailto:gsantos.dev@gmail.com",
      external: false,
    },
  ],
};
