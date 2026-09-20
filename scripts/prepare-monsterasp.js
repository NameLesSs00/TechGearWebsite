const fs = require('fs');
const path = require('path');

const rootDir = process.cwd();
const standaloneDir = path.join(rootDir, '.next', 'standalone');

console.log('Preparing MonsterASP.NET deployment folder...');

// 1. Copy .next/static into standalone
const sourceStatic = path.join(rootDir, '.next', 'static');
const destStatic = path.join(standaloneDir, '.next', 'static');
if (fs.existsSync(sourceStatic)) {
  fs.cpSync(sourceStatic, destStatic, { recursive: true });
  console.log('✓ Copied .next/static');
}

// 2. Copy public into standalone
const sourcePublic = path.join(rootDir, 'public');
const destPublic = path.join(standaloneDir, 'public');
if (fs.existsSync(sourcePublic)) {
  fs.cpSync(sourcePublic, destPublic, { recursive: true });
  console.log('✓ Copied public');
}

// 3. Copy web.config into standalone
const sourceWebConfig = path.join(rootDir, 'web.config');
const destWebConfig = path.join(standaloneDir, 'web.config');
if (fs.existsSync(sourceWebConfig)) {
  fs.copyFileSync(sourceWebConfig, destWebConfig);
  console.log('✓ Copied web.config');
}

// 4. Patch server.js — HttpPlatformHandler passes PORT as a plain string,
//    but Next.js standalone does parseInt(process.env.PORT, 10) which works
//    fine with numeric ports. However we also ensure HOSTNAME is respected.
const serverJsPath = path.join(standaloneDir, 'server.js');
if (fs.existsSync(serverJsPath)) {
  let serverJs = fs.readFileSync(serverJsPath, 'utf8');

  // Patch 1: Make sure PORT is read correctly (some Next.js versions use parseInt)
  // HttpPlatformHandler sends a plain numeric port string so parseInt works fine.
  // But just in case, also support a direct string port.
  const oldPortLogic = 'const currentPort = parseInt(process.env.PORT, 10) || 3000';
  const newPortLogic = 'const currentPort = parseInt(process.env.PORT, 10) || process.env.PORT || 3000';
  if (serverJs.includes(oldPortLogic)) {
    serverJs = serverJs.replace(oldPortLogic, newPortLogic);
    console.log('✓ Patched server.js PORT handling');
  }

  // Patch 2: Ensure HOSTNAME is respected (so Node listens on 0.0.0.0)
  const oldHostname = "const hostname = process.env.HOSTNAME || 'localhost'";
  const newHostname = "const hostname = process.env.HOSTNAME || '0.0.0.0'";
  if (serverJs.includes(oldHostname)) {
    serverJs = serverJs.replace(oldHostname, newHostname);
    console.log('✓ Patched server.js HOSTNAME to 0.0.0.0');
  }

  fs.writeFileSync(serverJsPath, serverJs);
}

// 5. Create logs directory (needed by web.config stdoutLogFile)
const logsDir = path.join(standaloneDir, 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
  console.log('✓ Created logs directory');
}

console.log('\n🎉 Done! Ready to deploy: zip and upload the .next/standalone folder.');
console.log('   Make sure to set NEXT_PUBLIC_API_URL in MonsterASP environment variables or web.config.');
