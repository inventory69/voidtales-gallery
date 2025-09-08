module.exports = {
  enableCopyMdFiles: true,
  enableCopyOriginalImages: true,
  mdSourceUrlInternal: process.env.EXT_DL_URL_MARKDOWN || 'http://172.19.0.1:8723/markdown/',
  mdSourceUrlExternal: process.env.EXT_DL_URL_MARKDOWN_EXTERNAL || 'http://168.119.127.193:8723/markdown/',
  originalSourceUrlInternal: process.env.EXT_DL_URL_ORIGINAL || 'http://172.19.0.1:8723/original/',
  originalSourceUrlExternal: process.env.EXT_DL_URL_ORIGINAL_EXTERNAL || 'http://168.119.127.193:8723/original/',
};