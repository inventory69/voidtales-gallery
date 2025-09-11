import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import preact from '@astrojs/preact';
// Import site config for global settings
import { siteConfig } from './src/config/site.js';

export default defineConfig({
  // Base URL for the site, used for sitemaps and canonical links
  site: siteConfig.url,

  // Integrations for Astro project
  integrations: [
    preact(),   // Enables Preact for client-side interactivity
    sitemap()   // Generates sitemap.xml for SEO
  ]
});