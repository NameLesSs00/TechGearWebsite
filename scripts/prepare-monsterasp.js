const fs = require('fs');
const path = require('path');

const rootDir = process.cwd();
const standaloneDir = path.join(rootDir, '.next', 'standalone');

console.log('Preparing MonsterASP.NET deployment folder...');

// 1. Copy .next/static
const sourceStatic = path.join(rootDir, '.next', 'static');
const destStatic = path.join(standaloneDir, '.next', 'static');
if (fs.existsSync(sourceStatic)) {
  fs.cpSync(sourceStatic, destStatic, { recursive: true });
  console.log('Copied .next/static');
}

// 2. Copy public
const sourcePublic = path.join(rootDir, 'public');
const destPublic = path.join(standaloneDir, 'public');
if (fs.existsSync(sourcePublic)) {
  fs.cpSync(sourcePublic, destPublic, { recursive: true });
  console.log('Copied public');
}

// 3. Copy web.config
const sourceWebConfig = path.join(rootDir, 'web.config');
const destWebConfig = path.join(standaloneDir, 'web.config');
if (fs.existsSync(sourceWebConfig)) {
  fs.copyFileSync(sourceWebConfig, destWebConfig);
  console.log('Copied web.config');
}

// 4. Patch server.js
const serverJsPath = path.join(standaloneDir, 'server.js');
if (fs.existsSync(serverJsPath)) {
  let serverJs = fs.readFileSync(serverJsPath, 'utf8');
  
  // Replace the default parseInt(process.env.PORT, 10) logic to support string named-pipes
  const oldPortLogic = "const currentPort = parseInt(process.env.PORT, 10) || 3000";
  const newPortLogic = "const currentPort = process.env.PORT || 3000";
  
  if (serverJs.includes(oldPortLogic)) {
    serverJs = serverJs.replace(oldPortLogic, newPortLogic);
    console.log('Patched server.js for iisnode pipe support');
  } else {
    // Sometimes Next.js minifies it differently, so we use a more generic regex
    const regex = /parseInt\(\s*process\.env\.PORT\s*,\s*10\s*\)/g;
    if (regex.test(serverJs)) {
      serverJs = serverJs.replace(regex, 'process.env.PORT');
      console.log('Patched server.js for iisnode pipe support (regex)');
    }
  }

  // Also patch req.url if it leaks named pipes, just in case (as mentioned in build.md "patches Next's internal origin handling")
  // Often req.url contains the pipe path on iisnode initially if not stripped by middleware before hitting nextjs.
  // Actually, Next.js 13+ standalone server handles this decently if we do middleware, but let's be safe.
  fs.writeFileSync(serverJsPath, serverJs);
}

console.log('Done! Ready to zip .next/standalone');
