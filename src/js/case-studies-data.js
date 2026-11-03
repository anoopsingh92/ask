// src/js/case-studies-data.js
export const caseStudies = [
  {
    id: 'flexi-style',
    title: 'FlexiStyle: Pure CSS Variable Base Theme for Drupal 9–11',
    category: 'CSS Architecture · Open Source',
    client: 'Drupal Community',
    excerpt: 'Architecting an unopinionated, WCAG 2.1 AA foundation stripped of legacy JS bloat, cutting default theme assets by 60%.',
    tags: ['Drupal 10/11', 'CSS Custom Props', 'Twig 3', 'Zero JS'],
    stats: { Lighthouse: '100', CSSSize: '<14KB' },
    link: 'flexi-style/'
  },
  {
    id: 'flexistyle-bootstrap',
    title: 'FlexiStyle Bootstrap: Modern Vanilla Sub-Theme Framework',
    category: 'Theme Engineering · UI Systems',
    client: 'Drupal Community',
    excerpt: 'Integrating Bootstrap 5 vanilla ES6 components into Drupal Layout Builder and Views with zero jQuery dependencies.',
    tags: ['Bootstrap 5', 'Drupal 11', 'Vanilla JS', 'Layout Builder'],
    stats: { CWV: '99', jQuery: '0%' },
    link: 'flexistyle-bootstrap/'
  },
  {
    id: 'flexistyle-bootstrap-scss',
    title: 'FlexiStyle Bootstrap SCSS: Enterprise Build & Token Pipeline',
    category: 'DevOps · Asset Pipeline',
    client: 'Enterprise Theming',
    excerpt: 'Structuring modular design tokens and automated Vite/PostCSS compilation, accelerating build cycles down to 180ms.',
    tags: ['Vite', 'SCSS Tokens', 'PostCSS', 'Hot Reload'],
    stats: { CSSReduction: '-42%', Compile: '180ms' },
    link: 'flexistyle-bootstrap-scss/'
  },
  {
    id: 'flexistyle-dxp',
    title: 'Enterprise Headless Drupal DXP Transformation',
    category: 'Headless CMS · Decoupled DXP',
    client: 'NextOpcode',
    excerpt: 'Pairing decoupled Next.js with robust Drupal JSON:API endpoints to achieve sub-second TTFB and near-perfect Core Web Vitals.',
    tags: ['Next.js', 'Drupal 11 DXP', 'JSON:API', 'Edge Cache'],
    stats: { SpeedBoost: '+64%', LCP: '0.8s' },
    link: 'flexistyle-dxp/'
  },
  {
    id: 'workpulse',
    title: 'WorkPulse: Enterprise Workforce Management & Analytics SaaS',
    category: 'Full-Stack SaaS · Systems OS',
    client: 'NextOpcode Consulting',
    excerpt: 'Engineering an integrated workforce tracker with real-time sprint schedules, attendance metrics, and granular RBAC security.',
    tags: ['React', 'Next.js', 'Tailwind CSS', 'GraphQL'],
    stats: { Uptime: '99.98%', ActiveUsers: '1.2k+' },
    link: 'workpulse/'
  },
  {
    id: 'anoop-singh-portfolio',
    title: 'Personal Portfolio: Sub-Second Multi-Page App Architecture',
    category: 'Performance Engineering · AI/GEO',
    client: 'Personal Hub',
    excerpt: 'Crafting a static Vite MPA with interactive canvas particles, GSAP momentum inertia, zero CLS, and full llms.txt discovery.',
    tags: ['Vite MPA', 'GSAP ScrollTrigger', 'HTML Inject', 'Schema.org'],
    stats: { PageSpeed: '100', SEO: '100' },
    link: 'anoop-singh-portfolio/'
  }
];