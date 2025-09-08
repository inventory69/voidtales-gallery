// External download configuration file: Defines settings for downloading external markdown files and images.
// Uses environment variables for URLs and enables/disables download scripts during build.

require('dotenv').config(); // Load environment variables from .env file

module.exports = {
  // Flag to enable/disable markdown file download script
  enableCopyMdFiles: true,
  
  // Flag to enable/disable original image download script
  enableCopyOriginalImages: true,
  
  // Internal URL for markdown files (from environment variable)
  mdSourceUrlInternal: process.env.EXT_DL_URL_MARKDOWN,
  
  // External fallback URL for markdown files (from environment variable)
  mdSourceUrlExternal: process.env.EXT_DL_URL_MARKDOWN_EXTERNAL,
  
  // Internal URL for original images (from environment variable)
  originalSourceUrlInternal: process.env.EXT_DL_URL_ORIGINAL,
  
  // External fallback URL for original images (from environment variable)
  originalSourceUrlExternal: process.env.EXT_DL_URL_ORIGINAL_EXTERNAL,
};