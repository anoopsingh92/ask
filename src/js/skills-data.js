// Data for the interactive skill map on the homepage.
// Skills come from the toolkit on the About page. "Seen in" links point at real
// products, case studies and projects; "pairs with" is computed from shared projects.

export const categories = [
  { id: 'theming', label: 'Front-end & Theming' },
  { id: 'cms', label: 'CMS & Apps' },
  { id: 'speed', label: 'Performance & SEO' },
  { id: 'build', label: 'Build & Hosting' },
  { id: 'design', label: 'Design, AI & Motion' },
  { id: 'work', label: 'Editors & Teamwork' }
];

// Paths are relative to the site root (resolved with getAppRoot at runtime)
export const projects = {
  flexi: { label: 'FlexiStyle Base Theme', href: 'case-studies/flexi-style/' },
  bootstrap: { label: 'FlexiStyle Bootstrap', href: 'case-studies/flexistyle-bootstrap/' },
  scss: { label: 'FlexiStyle Bootstrap SCSS', href: 'case-studies/flexistyle-bootstrap-scss/' },
  dxp: { label: 'FlexiStyle DXP', href: 'case-studies/flexistyle-dxp/' },
  workpulse: { label: 'WorkPulse', href: 'case-studies/workpulse/' },
  portfolio: { label: 'This portfolio', href: 'case-studies/anoop-singh-portfolio/' },
  woody: { label: 'Woody Plants (decoupled)', href: 'https://woodyplants.kendallhunt.com/', external: true },
  migrations: { label: 'Drupal 7 to 11 migrations', href: 'about/' }
};

export const skills = [
  // Front-end & Theming
  { id: 'theming', name: 'Custom Drupal theming', cat: 'theming', info: 'Turning designs into maintainable Drupal themes with clean, component-based CSS.', projects: ['flexi', 'bootstrap', 'scss', 'dxp'] },
  { id: 'html-css', name: 'HTML, CSS & RWD', cat: 'theming', info: 'Semantic markup and modern CSS that adapts to phones, tablets and large screens.', projects: ['flexi', 'portfolio'] },
  { id: 'scss-less', name: 'SCSS & LESS', cat: 'theming', info: 'Design tokens, mixins and variable overrides in a modular structure.', projects: ['scss'] },
  { id: 'bootstrap', name: 'All Bootstrap versions', cat: 'theming', info: 'Building on Bootstrap without fighting the framework, from older sites to Bootstrap 5.', projects: ['bootstrap', 'scss', 'migrations'] },
  { id: 'crossbrowser', name: 'Cross-browser compatibility', cat: 'theming', info: 'Pages that look and work the same in every major browser.', projects: ['flexi'] },
  { id: 'email', name: 'Email templates & mPDF HTML', cat: 'theming', info: 'HTML for email clients and for PDF output, where normal CSS rules do not apply.', projects: [] },
  { id: 'a11y', name: 'Accessibility', cat: 'theming', info: 'Keyboard support, clear focus states and sensible labels in every build.', projects: ['portfolio'] },

  // CMS & Apps
  { id: 'drupal', name: 'Drupal 8+ & Drupal CMS', cat: 'cms', info: 'Day-to-day work on Drupal sites, from custom themes to upgrades to the latest release.', projects: ['flexi', 'migrations', 'woody', 'dxp'] },
  { id: 'sitestudio', name: 'Acquia Site Studio', cat: 'cms', info: 'Low-code component and style building on top of Drupal.', projects: [] },
  { id: 'wordpress', name: 'WordPress', cat: 'cms', info: 'Themes and front-end work for WordPress sites.', projects: [] },
  { id: 'nextjs', name: 'Next.js', cat: 'cms', info: 'Server-rendered React front ends for content-heavy sites and apps.', projects: ['dxp', 'woody', 'workpulse'] },
  { id: 'react', name: 'React', cat: 'cms', info: 'Component-based interfaces for apps and decoupled sites.', projects: ['workpulse'] },
  { id: 'pwa', name: 'Progressive Web Apps', cat: 'cms', info: 'Installable, fast sites with a web manifest and offline support.', projects: ['portfolio'] },

  // Performance & SEO
  { id: 'lighthouse', name: 'Lighthouse & site performance', cat: 'speed', info: 'Measuring and tuning speed, accessibility and best practices.', projects: ['portfolio', 'flexi', 'dxp'] },
  { id: 'psi', name: 'PageSpeed Insights & GTmetrix', cat: 'speed', info: 'Lab and field tests that show what slows a page down.', projects: ['portfolio'] },
  { id: 'gsc', name: 'Search Console & GA4', cat: 'speed', info: 'Tracking search traffic, indexing and visitor behaviour.', projects: [] },
  { id: 'seo', name: 'SEO, metatags & structured data', cat: 'speed', info: 'Meta tags, Open Graph and Schema.org markup that search engines can read.', projects: ['portfolio'] },
  { id: 'semrush', name: 'SEMrush & SEO Analyzer', cat: 'speed', info: 'Keyword and page checks that guide copy and markup changes.', projects: [] },

  // Build & Hosting
  { id: 'gulp', name: 'Gulp, Koala & compilers', cat: 'build', info: 'Compiling Sass and Less and bundling assets for production.', projects: [] },
  { id: 'composer', name: 'Composer, NPM & Drush', cat: 'build', info: 'Dependency and site management from the command line.', projects: ['flexi', 'bootstrap', 'scss', 'dxp'] },
  { id: 'git', name: 'Git, GitHub, GitLab & Bitbucket', cat: 'build', info: 'Clean branches, code review and shared workflows.', projects: ['portfolio'] },
  { id: 'dev-env', name: 'DDEV, Docker & XAMPP', cat: 'build', info: 'Local environments that match production.', projects: [] },
  { id: 'hosting', name: 'Pantheon & Acquia', cat: 'build', info: 'Hosting and deploying Drupal sites on managed platforms.', projects: [] },

  // Design, AI & Motion
  { id: 'design', name: 'Wireframing, Photoshop & Adobe XD', cat: 'design', info: 'Shaping layouts and reading designs before a line of code is written.', projects: [] },
  { id: 'photopea', name: 'Photopea & Stitch', cat: 'design', info: 'Quick image edits and interface ideas.', projects: [] },
  { id: 'ai', name: 'ChatGPT, Claude, Gemini & AI Studio', cat: 'design', info: 'AI assistants for drafting, reviewing and speeding up routine work.', projects: [] },
  { id: 'gsap', name: 'GSAP & Animate on Scroll', cat: 'design', info: 'Scroll-driven motion that stays smooth and light.', projects: ['portfolio'] },
  { id: 'plugins', name: 'Owl Carousel, Fancybox & Masonry', cat: 'design', info: 'Sliders, lightboxes and grids for content-heavy pages.', projects: [] },

  // Editors & Teamwork
  { id: 'editors', name: 'Cursor, Visual Studio & Sublime Text', cat: 'work', info: 'Editors I use for writing and reviewing code.', projects: [] },
  { id: 'tasks', name: 'Jira, Basecamp, Notion & Redmine', cat: 'work', info: 'Planning and tracking work with the rest of the team.', projects: [] },
  { id: 'comms', name: 'Slack, Zoom, Google Meet & Teams', cat: 'work', info: 'Staying in step with remote teams and clients.', projects: [] }
];
