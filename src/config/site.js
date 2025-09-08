// Site configuration file: Defines global settings for the VoidTales Gallery site.
// Used across the application for metadata, SEO, and UI elements like hero and footer.

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
};