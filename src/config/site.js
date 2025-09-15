// Site configuration file: Defines global settings for the VoidTales Gallery site.
// Used across the application for metadata, SEO, and UI elements like hero and footer.

/**
 * Configuration object for the VoidTales Gallery website.
 *
 * @typedef {Object} SiteConfig
 * @property {string} name - Site name, displayed in browser title and meta tags.
 * @property {string} description - Site description for SEO and social media previews.
 * @property {string} url - Base URL of the site, used for canonical links and sitemaps.
 * @property {string} ogImage - Path to the Open Graph image for social media previews.
 * @property {string} author - Name of the site creator or maintainer.
 * @property {string[]} keywords - Array of keywords for SEO and meta tags.
 * @property {string[]} fonts - Array of font URLs to be loaded for the site.
 * @property {string} manifest - Path to the web app manifest file.
 * @property {string} favicon - Path to the site favicon.
 * @property {Object} hero - Configuration for the homepage hero section.
 * @property {string} hero.title - Main headline for the hero section.
 * @property {string} hero.subtitle - Subtitle text for the hero section.
 * @property {string} hero.cta - Call-to-action button text in the hero section.
 * @property {Object} footer - Configuration for the site footer.
 * @property {string} footer.copyright - Copyright text displayed in the footer.
 * @property {string} defaultSort - Default Sorting Order.
 */
export const siteConfig = {
  // Site name: Displayed in the browser title and meta tags
  name: 'VoidTales Gallery',
  
  // Site description: Used for SEO meta description and social media previews
  description: 'A sleek, high-performance photo gallery built with Astro, TypeScript, and vanilla CSS/JS. Showcase your photos with modern design, automatic sorting, and seamless dark mode.',
  
  // Site URL: Base URL for the site, used for canonical links and sitemaps
  url: 'https://gallery.voidtales.win',
  
  // Open Graph image: Path to image used for social media previews (place in public/images/)
  ogImage: '/images/og-image.webp',
  
  // Site author: Name of the site creator or maintainer
  author: 'inventory69',
  
  // Keywords: Array of keywords for SEO and meta tags
  keywords: ['photo gallery', 'Astro', 'VoidTales', 'images', 'modern web'],

  // Fonts: Array of font URLs to be loaded for the site
  fonts: [
    'https://fonts.googleapis.com/css2?family=Macondo&family=Macondo+Swash+Caps&display=swap'
  ],

  // Main font family for the site
  fontFamily: "'Macondo', cursive",

  // Paths to manifest and favicon files in the public directory
  manifest: '/manifest.json',
  favicon: '/favicon.ico',
  
  // Hero section configuration: Defines content for the main hero area on the homepage
  hero: {
    title: 'Discover the VoidTales Gallery',  // Main headline for the hero section
    subtitle: 'The latest images from the world of VoidTales – sorted by date.',  // Subtitle text
    cta: 'To the images',  // Call-to-action button text
  },
  
  // Footer configuration: Defines content for the site footer
  footer: {
    copyright: 'VoidTales',  // Copyright text displayed in the footer
  },

  // Default sort order for images: 'date-asc' or 'date-desc'
  defaultSort: 'date-desc',
};