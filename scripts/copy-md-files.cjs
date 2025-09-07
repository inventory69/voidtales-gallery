const fs = require('fs');
   const path = require('path');

   const srcDir = '/etc/dokploy/mountfiles/markdown/';
   const destDir = './src/content/photos/';

   fs.readdirSync(srcDir).forEach(file => {
     if (file.endsWith('.md')) {
       fs.copyFileSync(path.join(srcDir, file), path.join(destDir, file));
     }
   });
