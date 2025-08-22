#!/usr/bin/env node

/**
 * Update third-party libraries in src/lib/
 * - JSON5 (saved as json5.min.js)
 * - CodeMirror 5 (codemirror.min.js, codemirror.min.css, mode/javascript/javascript.min.js)
 *
 * Usage examples:
 *   node scripts/update-libs.js
 *   node scripts/update-libs.js --json5 2.2.3 --cm 5.65.16
 *   node scripts/update-libs.js --patch-json5
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

const SRC_LIB = path.join('src', 'lib');

const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m'
};
const log = (msg, color = colors.reset) => console.log(`${color}${msg}${colors.reset}`);

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function download(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          // follow redirect
          return resolve(download(res.headers.location));
        }
        if (res.statusCode !== 200) {
          return reject(new Error(`Request failed: ${res.statusCode} ${res.statusMessage} for ${url}`));
        }
        const chunks = [];
        res.on('data', (d) => chunks.push(d));
        res.on('end', () => resolve(Buffer.concat(chunks)));
      })
      .on('error', reject);
  });
}

function writeFile(filePath, data) {
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, data);
  const sizeKB = (data.length / 1024).toFixed(1);
  log(`✔ Wrote ${filePath} (${sizeKB} KB)`, colors.green);
}

function replaceInBuffer(buf, search, replacement) {
  const src = buf.toString('utf8');
  const out = src.split(search).join(replacement);
  return Buffer.from(out, 'utf8');
}

async function main() {
  const args = process.argv.slice(2);
  const getArg = (name, def) => {
    const i = args.indexOf(`--${name}`);
    return i !== -1 && args[i + 1] && !args[i + 1].startsWith('--') ? args[i + 1] : def;
  };
  const hasFlag = (name) => args.includes(`--${name}`);

  const json5Version = getArg('json5', '2.2.3');
  const cmVersion = getArg('cm', '5.65.16');
  const patchJson5 = hasFlag('patch-json5');

  log('Updating libraries in src/lib/', colors.blue);
  ensureDir(SRC_LIB);

  // Sources (jsDelivr CDN)
  const sources = [
    {
      name: 'json5',
      url: `https://cdn.jsdelivr.net/npm/json5@${json5Version}/dist/index.min.js`,
      out: path.join(SRC_LIB, 'json5.min.js'),
      post: (buf) => (patchJson5 ? replaceInBuffer(
        buf,
        'Function("return this")()',
        "(typeof globalThis!=='undefined'?globalThis:(typeof window!=='undefined'?window:(typeof self!=='undefined'?self:{})))"
      ) : buf)
    },
    {
      name: 'codemirror-js',
      url: `https://cdn.jsdelivr.net/npm/codemirror@${cmVersion}/lib/codemirror.min.js`,
      out: path.join(SRC_LIB, 'codemirror.min.js')
    },
    {
      name: 'codemirror-css',
      url: `https://cdn.jsdelivr.net/npm/codemirror@${cmVersion}/lib/codemirror.min.css`,
      out: path.join(SRC_LIB, 'codemirror.min.css')
    },
    {
      name: 'codemirror-mode-javascript',
      url: `https://cdn.jsdelivr.net/npm/codemirror@${cmVersion}/mode/javascript/javascript.min.js`,
      out: path.join(SRC_LIB, 'javascript.min.js')
    }
  ];

  for (const s of sources) {
    try {
      log(`↓ Downloading ${s.name} from ${s.url}`, colors.yellow);
      const data = await download(s.url);
      const outData = s.post ? s.post(data) : data;
      writeFile(s.out, outData);
    } catch (e) {
      log(`✖ Failed to update ${s.name}: ${e.message}`, colors.red);
      process.exitCode = 1;
    }
  }

  log('Done.', colors.blue);
}

main().catch((e) => {
  log(`Unexpected error: ${e.stack || e.message}`, colors.red);
  process.exit(1);
});
