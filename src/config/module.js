module.exports = {
  enableCopyMdFiles: true,
  enableCopyOriginalImages: true,
  mdSourceUrl: process.env.EXT_DL_URL_MARKDOWN || 'http://172.19.0.1:8723/markdown/',
  originalSourceUrl: process.env.EXT_DL_URL_ORIGINAL || 'http://172.19.0.1:8723/original/',
};