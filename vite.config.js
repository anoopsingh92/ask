// vite.config.js
import fs from 'fs';
import { resolve } from 'node:path';
import { defineConfig, loadEnv } from 'vite';
import injectHTML from 'vite-plugin-html-inject';

// Collapses whitespace, indentation and comments in the served HTML (script, style, pre and
// textarea contents are left untouched). Smaller HTML means a higher text-to-HTML ratio.
const BLOCK = 'html|head|body|title|meta|link|script|style|header|footer|nav|main|section|article|aside|div|p|h[1-6]|ul|ol|li|dl|dt|dd|form|table|thead|tbody|tr|td|th|figure|figcaption|picture|source|noscript|br|hr|pre';
const minifyHtml = html =>
  html
    .split(/(<(script|style|pre|textarea)\b[\s\S]*?<\/\2>)/gi)
    // split() with two groups returns [text, whole, tag, text, ...]; keep every 3rd item as text
    .map((part, i) => {
      if (i % 3 !== 0) return i % 3 === 1 ? part : '';
      return part
        .replace(/<!--(?!\[if)[\s\S]*?-->/g, '')
        .replace(/\s+/g, ' ')
        .replace(new RegExp('> <(?=/?(?:' + BLOCK + ')\\b)', 'gi'), '><')
        .replace(new RegExp('(</?(?:' + BLOCK + ')\\b[^>]*>) ', 'gi'), '$1')
        .replace(new RegExp(' (?=</?(?:' + BLOCK + ')\\b)', 'gi'), '');
    })
    .join('');

const htmlMinifyPlugin = () => ({
  name: 'html-minify',
  transformIndexHtml: {
    order: 'post',
    handler: html => minifyHtml(html)
  }
});

// Dev server only: Vite injects CSS through JavaScript while developing, so the
// unstyled HTML would flash before the styles arrive. Hide the page until script.js
// adds html.is-ready (after the CSS modules have been applied). Production builds
// link the stylesheet in <head>, so they never need this.
const devNoFlashPlugin = () => ({
  name: 'dev-no-flash',
  apply: 'serve',
  transformIndexHtml() {
    return [
      {
        tag: 'style',
        children: 'html:not(.is-ready){visibility:hidden}',
        injectTo: 'head-prepend'
      }
    ];
  }
});

const dev404Plugin = () => ({
  name: 'dev-404-middleware',
  configureServer(server) {
    server.middlewares.use((req, res, next) => {
      if (req.url.startsWith('/@') || req.url.includes('.')) {
        return next();
      }

      const cleanUrl = req.url.replace(/^\/ask/, '').replace(/\/$/, '');

      const validPaths = [
        '',
        '/about',
        '/journey',
        '/products',
        '/products/flexi-style',
        '/products/flexistyle-bootstrap',
        '/products/flexistyle-bootstrap-scss',
        '/products/flexistyle-dxp',
        '/products/workpulse',
        '/case-studies',
        '/case-studies/anoop-singh-portfolio',
        '/case-studies/flexi-style',
        '/case-studies/flexistyle-bootstrap',
        '/case-studies/flexistyle-bootstrap-scss',
        '/case-studies/flexistyle-dxp',
        '/case-studies/workpulse',
      ];

      if (!validPaths.includes(cleanUrl)) {
        const file404 = resolve(import.meta.dirname, '404.html');
        if (fs.existsSync(file404)) {
          let html = fs.readFileSync(file404, 'utf-8');
          server.transformIndexHtml(req.url, html).then((transformed) => {
            res.statusCode = 404;
            res.setHeader('Content-Type', 'text/html');
            res.end(transformed);
          });
          return;
        }
      }
      next();
    });
  },
});

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const basePath = env.BASE_PATH || './';

  return {
    base: basePath,
    plugins: [injectHTML(), htmlMinifyPlugin(), dev404Plugin(), devNoFlashPlugin()],
    server: {
      host: 'localhost',
      port: 5173,
      hmr: {
        protocol: 'ws',
        host: 'localhost',
        port: 5173,
      },
    },
    build: {
      outDir: 'dist',
      target: 'es2020',
      assetsDir: 'assets',
      cssCodeSplit: false,
      sourcemap: false,
      rollupOptions: {
        input: {
          main: resolve(import.meta.dirname, 'index.html'),
          about: resolve(import.meta.dirname, 'about/index.html'),
          notfound: resolve(import.meta.dirname, '404.html'),
          products: resolve(import.meta.dirname, 'products/index.html'),
          productFlexiStyle: resolve(import.meta.dirname, 'products/flexi-style/index.html'),
          productBootstrap: resolve(import.meta.dirname, 'products/flexistyle-bootstrap/index.html'),
          productBootstrapScss: resolve(import.meta.dirname, 'products/flexistyle-bootstrap-scss/index.html'),
          productDxp: resolve(import.meta.dirname, 'products/flexistyle-dxp/index.html'),
          workpulse: resolve(import.meta.dirname, 'products/workpulse/index.html'),
          journey: resolve(import.meta.dirname, 'journey/index.html'),
          caseStudies: resolve(import.meta.dirname, 'case-studies/index.html'),
          caseStudiesAnoopSingh: resolve(import.meta.dirname, 'case-studies/anoop-singh-portfolio/index.html'),
          caseStudiesFlexiStyle: resolve(import.meta.dirname, 'case-studies/flexi-style/index.html'),
          caseStudiesFlexiStyleBootstrap: resolve(import.meta.dirname, 'case-studies/flexistyle-bootstrap/index.html'),
          caseStudiesFlexiStyleBootstrapScss: resolve(import.meta.dirname, 'case-studies/flexistyle-bootstrap-scss/index.html'),
          caseStudiesFlexiStyleDxp: resolve(import.meta.dirname, 'case-studies/flexistyle-dxp/index.html'),
          caseStudiesWorkpulse: resolve(import.meta.dirname, 'case-studies/workpulse/index.html'),
        },
        output: {
          entryFileNames: 'assets/[name].min.js',
          chunkFileNames: 'assets/[name].min.js',
          assetFileNames: (assetInfo) => {
            if (assetInfo.name && assetInfo.name.endsWith('.css')) {
              return 'assets/bundle.min.css';
            }
            return 'assets/[name].[ext]';
          },
        },
      },
    },
  };
});