// Technical skills for the interactive skill map. The groups and tools below mirror the
// "Comprehensive Toolkit" on the About page. `details` adds a one-line description and the
// projects where a skill is actually used; "pairs with" is computed from shared projects.

export const categories = [
  { id: 'frontend', label: 'Front-end & Theming', blurb: 'Turning designs into fast, accessible pages and maintainable themes.', skills: ['Drupal custom theme', 'HTML', 'CSS', 'Responsive web design (RWD)', 'SCSS', 'LESS', 'All Bootstrap versions', 'MDL', 'Email templates', 'mPDF HTML', 'ATOM', 'Cross-browser compatibility'] },
  { id: 'compilers', label: 'Preprocessors & Compilers', blurb: 'Compiling Sass and Less and bundling assets for production.', skills: ['Koala', 'Gulp', 'Sass compiler', 'Less compiler'] },
  { id: 'cms', label: 'CMS & Frameworks', blurb: 'Content platforms and the JavaScript frameworks that sit in front of them.', skills: ['Drupal 8+', 'Drupal CMS', 'WordPress', 'Next.js', 'React'] },
  { id: 'apps', label: 'Web Applications', blurb: 'App-like experiences on the web.', skills: ['Progressive Web Apps (PWA)', 'Acquia Site Studio'] },
  { id: 'seo', label: 'Performance & SEO', blurb: 'Measuring speed, search visibility and accessibility, then fixing what the numbers show.', skills: ['Site performance optimization', 'Lighthouse', 'PageSpeed Insights', 'GTmetrix', 'Google Search Console (GSC)', 'Google Analytics (GA4)', 'SEO', 'SMO', 'Metatags', 'Structured data', 'Accessibility', 'SEMrush', 'SEO Analyzer'] },
  { id: 'hosting', label: 'Hosting & Development', blurb: 'Where code lives and where sites run.', skills: ['Pantheon', 'Acquia', 'GitHub', 'GitLab', 'Bitbucket'] },
  { id: 'local', label: 'Local Dev & Version Control', blurb: 'Local environments and command-line tools that match production.', skills: ['Acquia Dev Desktop', 'XAMPP', 'DDEV', 'Docker', 'NPM', 'Composer', 'Git Bash', 'Drush'] },
  { id: 'design', label: 'Design Tools', blurb: 'Planning and shaping layouts before code is written.', skills: ['Wireframing', 'Photoshop', 'Adobe XD', 'Photopea', 'Stitch'] },
  { id: 'ai', label: 'AI Tools', blurb: 'AI assistants for drafting, reviewing and speeding up routine work.', skills: ['ChatGPT', 'Claude', 'Google Gemini', 'Google AI Studio'] },
  { id: 'editors', label: 'Editors & IDEs', blurb: 'Where I write and review code.', skills: ['Visual Studio', 'Cursor', 'Sublime Text 3', 'Notepad', 'Kiro'] },
  { id: 'team', label: 'Task Management & Communication', blurb: 'Planning work and staying in step with remote teams.', skills: ['Jira', 'Project Camp (Redmine)', 'Basecamp', 'Notion', 'Slack', 'Skype', 'Zoom', 'Google Meet', 'Teams'] },
  { id: 'ftp', label: 'File Transfer (FTP)', blurb: 'Moving files to and from servers.', skills: ['FileZilla', 'WinSCP', 'PuTTY'] },
  { id: 'libs', label: 'Libraries & Plugins', blurb: 'Sliders, lightboxes, grids and motion for content-heavy pages.', skills: ['Animate on Scroll', 'Fancybox', 'Colorbox', 'Lightbox', 'Modal', 'Owl Carousel', 'Animate.css', 'Hover.css', 'Masonry', 'FontAwesome 4+', 'jQuery AniView', 'GSAP'] },
  { id: 'fonts', label: 'Font Management', blurb: 'Loading web fonts without slowing the page.', skills: ['Font-face Generator', 'Fontsquirrel', 'Google Fonts'] }
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

export const details = {
  'Drupal custom theme': { info: 'Turning designs into maintainable Drupal themes with clean, component-based CSS.', projects: ['flexi', 'bootstrap', 'scss', 'dxp'] },
  HTML: { info: 'Semantic markup that works for people, search engines and assistive tools.', projects: ['flexi', 'portfolio'] },
  CSS: { info: 'Modern CSS: custom properties, flexbox and fluid layouts.', projects: ['flexi', 'portfolio'] },
  'Responsive web design (RWD)': { info: 'Layouts that adapt to phones, tablets and large screens.', projects: ['flexi', 'portfolio'] },
  SCSS: { info: 'Design tokens, mixins and variable overrides in a modular structure.', projects: ['scss'] },
  'All Bootstrap versions': { info: 'Building on Bootstrap without fighting the framework, from older sites to Bootstrap 5.', projects: ['bootstrap', 'scss', 'migrations'] },
  'Cross-browser compatibility': { info: 'Pages that look and work the same in every major browser.', projects: ['flexi'] },
  'Email templates': { info: 'HTML for email clients, where normal CSS rules do not apply.' },
  'mPDF HTML': { info: 'HTML and CSS written for PDF output.' },
  'Drupal 8+': { info: 'Day-to-day work on Drupal sites, from custom themes to upgrades to the latest release.', projects: ['flexi', 'migrations', 'woody', 'dxp'] },
  'Drupal CMS': { info: 'The newer, ready-to-use Drupal distribution.' },
  'Next.js': { info: 'Server-rendered React front ends for content-heavy sites and apps.', projects: ['dxp', 'woody', 'workpulse'] },
  React: { info: 'Component-based interfaces for apps and decoupled sites.', projects: ['workpulse'] },
  'Progressive Web Apps (PWA)': { info: 'Installable, fast sites with a web manifest.', projects: ['portfolio'] },
  'Acquia Site Studio': { info: 'Low-code component and style building on top of Drupal.' },
  'Site performance optimization': { info: 'Cutting load time and blocking work so pages feel instant.', projects: ['portfolio', 'flexi', 'dxp'] },
  Lighthouse: { info: 'Measuring speed, accessibility and best practices.', projects: ['portfolio', 'flexi', 'dxp'] },
  'PageSpeed Insights': { info: 'Lab and field data that show what slows a page down.', projects: ['portfolio'] },
  SEO: { info: 'Clean markup, useful content and fast pages that search engines can read.', projects: ['portfolio'] },
  Metatags: { info: 'Titles, descriptions and Open Graph tags for search and social sharing.', projects: ['portfolio'] },
  'Structured data': { info: 'Schema.org markup that helps search engines understand a page.', projects: ['portfolio'] },
  Accessibility: { info: 'Keyboard support, clear focus states and sensible labels in every build.', projects: ['portfolio'] },
  GitHub: { info: 'Hosting code, reviewing changes and deploying with GitHub Actions.', projects: ['portfolio'] },
  Composer: { info: 'PHP dependency management, including installing Drupal themes.', projects: ['flexi', 'bootstrap', 'scss', 'dxp'] },
  NPM: { info: 'JavaScript packages and build scripts.', projects: ['scss', 'portfolio'] },
  Drush: { info: 'Managing Drupal sites from the command line.' },
  GSAP: { info: 'Scroll-driven motion that stays smooth and light.', projects: ['portfolio'] }
};

const slug = s => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

export const skills = categories.flatMap(c =>
  c.skills.map(name => ({
    id: slug(name),
    name,
    cat: c.id,
    info: (details[name] && details[name].info) || '',
    projects: (details[name] && details[name].projects) || []
  }))
);
