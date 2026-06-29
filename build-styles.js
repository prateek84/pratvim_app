#!/usr/bin/env node
/**
 * build-styles.js
 * Pratvim SCSS → CSS compiler
 *
 * Handles:
 *  - @use  → inline the partial file (strips @use from output)
 *  - $var: value  → SCSS variables (replaced at build time)
 *  - Nested selectors with & parent reference
 *  - @mixin / @include (basic single-arg support)
 *  - @for loops (limited)
 *  - // line comments → stripped
 *
 * Usage:
 *   node build-styles.js               → writes styles.css
 *   node build-styles.js --watch       → watches for changes
 */

const fs   = require('fs');
const path = require('path');

const ROOT    = path.join(__dirname, 'styles');
const ENTRY   = path.join(ROOT, 'main.scss');
const OUT_CSS = path.join(__dirname, 'styles.compiled.css');

// ── Step 1: resolve and inline all @use partials ───────────
const loadedFiles = new Set();

function resolvePartial(importPath, fromDir) {
  const bare = importPath.replace(/^['"]|['"]$/g, '');
  const segments = bare.split('/');
  const base = segments.pop();
  const dir  = segments.length ? path.join(fromDir, ...segments) : fromDir;

  const candidates = [
    path.join(dir, `_${base}.scss`),
    path.join(dir, `${base}.scss`),
    path.join(dir, base, '_index.scss'),
  ];
  for (const c of candidates) {
    if (fs.existsSync(c)) return c;
  }
  return null;
}

function inlineUse(content, filePath) {
  const dir = path.dirname(filePath);
  // Strip @use 'abstracts/mixins' as m; (mixins file is helpers-only, no CSS output)
  return content.replace(/@use\s+['"]([^'"]+)['"][^;]*;/g, (match, importPath) => {
    const resolved = resolvePartial(importPath, dir);
    if (!resolved) return `/* @use not resolved: ${importPath} */`;
    if (loadedFiles.has(resolved)) return '';   // already included
    loadedFiles.add(resolved);
    const sub = fs.readFileSync(resolved, 'utf8');
    return inlineUse(sub, resolved);
  });
}

// ── Step 2: process SCSS syntax → CSS ─────────────────────
function processScss(raw) {
  let css = raw;

  // Strip // line comments
  css = css.replace(/\/\/[^\n]*/g, '');

  // Collect and remove $variable declarations
  const vars = {};
  css = css.replace(/^\s*\$([\w-]+)\s*:\s*([^;]+);/gm, (_, name, val) => {
    vars[name] = val.trim();
    return '';
  });

  // Replace $variable usages (longest match first)
  const varNames = Object.keys(vars).sort((a, b) => b.length - a.length);
  for (const name of varNames) {
    const re = new RegExp('\\$' + name + '(?![\\w-])', 'g');
    css = css.replace(re, vars[name]);
  }

  // Collect @mixin definitions
  const mixins = {};
  css = css.replace(/@mixin\s+([\w-]+)\s*(?:\(([^)]*)\))?\s*\{([\s\S]*?)\n\}/g,
    (_, name, argStr, body) => {
      mixins[name] = {
        args: argStr ? argStr.split(',').map(s => s.trim()) : [],
        body
      };
      return '';
    }
  );

  // Expand @include calls
  css = css.replace(/@include\s+([\w-]+)\s*(?:\(([^)]*)\))?;/g, (_, name, argStr) => {
    if (!mixins[name]) return `/* @include ${name} not found */`;
    let body = mixins[name].body;
    if (argStr) {
      const vals = argStr.split(',').map(s => s.trim());
      mixins[name].args.forEach((arg, i) => {
        const re = new RegExp(arg.replace('$', '\\$') + '(?![\\w-])', 'g');
        body = body.replace(re, vals[i] || '');
      });
    }
    return body;
  });

  // Expand @for $i from N through M
  css = css.replace(/@for\s+\$(\w+)\s+from\s+(\d+)\s+through\s+(\d+)\s*\{([\s\S]*?)\n\s*\}/g,
    (_, varName, startStr, endStr, body) => {
      let out = '';
      const start = parseInt(startStr), end = parseInt(endStr);
      for (let i = start; i <= end; i++) {
        out += body.replace(new RegExp('#\\{\\$' + varName + '\\}', 'g'), String(i))
                   .replace(new RegExp('\\$' + varName + '(?![\\w-])', 'g'), String(i));
      }
      return out;
    }
  );

  // Expand interpolation #{$var} remaining
  for (const [name, val] of Object.entries(vars)) {
    css = css.replace(new RegExp('#\\{\\$' + name + '\\}', 'g'), val);
  }

  // Process nesting
  css = expandNesting(css);

  return css;
}

// ── Nesting expander ───────────────────────────────────────
function expandNesting(css) {
  // Tokenise into blocks
  let out = '';
  let pos = 0;

  function parseBlock(parentSels) {
    let decls = '';
    let childBlocks = [];

    while (pos < css.length) {
      if (css[pos] === '}') { pos++; break; }

      // Read until next { or }
      let chunk = '';
      while (pos < css.length && css[pos] !== '{' && css[pos] !== '}') {
        chunk += css[pos++];
      }

      if (pos >= css.length) { decls += chunk; break; }

      if (css[pos] === '}') { decls += chunk; break; }

      if (css[pos] === '{') {
        pos++;
        const sel = chunk.trim();
        if (!sel) { decls += chunk; continue; }

        // At-rules that don't nest (media, keyframes, font-face, etc.)
        const atMatch = sel.match(/^@(media|keyframes|font-face|supports|layer|property)/);
        if (atMatch) {
          let inner = '';
          let depth = 1;
          while (pos < css.length && depth > 0) {
            if (css[pos] === '{') depth++;
            else if (css[pos] === '}') { depth--; if (depth === 0) { pos++; break; } }
            inner += css[pos++];
          }
          // For @keyframes and @font-face — emit as-is
          if (atMatch[1] === 'keyframes' || atMatch[1] === 'font-face') {
            childBlocks.push({ raw: `${sel} {${inner}}` });
          } else {
            // @media — need to expand inner with current parent context
            // re-parse the inner content with same parentSels
            const savedPos = pos;
            const origCss = css;
            css = inner;
            pos = 0;
            const innerOut = [];
            while (pos < css.length) {
              parseBlock(parentSels);
            }
            // simpler: just output the @media with inner expanded inline
            css = origCss;
            pos = savedPos;
            childBlocks.push({ raw: `${sel} {\n${expandNesting(inner)}\n}` });
          }
        } else {
          // Regular selector block
          const resolved = resolveSel(sel, parentSels);
          const content = parseBlock(resolved);
          if (content.decls.trim()) {
            childBlocks.push({ selectors: resolved, decls: content.decls });
          }
          childBlocks.push(...(content.children || []));
        }
        continue;
      }
    }

    return { decls, children: childBlocks };
  }

  function resolveSel(sel, parents) {
    if (!parents || parents.length === 0) return [sel.trim()];
    const parts = sel.split(',').map(s => s.trim());
    const result = [];
    for (const part of parts) {
      for (const parent of parents) {
        if (part.includes('&')) {
          result.push(part.replace(/&/g, parent));
        } else {
          result.push(`${parent} ${part}`);
        }
      }
    }
    return result;
  }

  function emit(block) {
    if (block.raw) return block.raw + '\n\n';
    if (!block.selectors) return '';
    return `${block.selectors.join(',\n')} {\n${block.decls.trim()}\n}\n\n`;
  }

  // Kick off top-level parse
  const topLevel = [];
  pos = 0;
  while (pos < css.length) {
    // Top-level read: find next selector block or just emit raw text
    let chunk = '';
    while (pos < css.length && css[pos] !== '{' && css[pos] !== '}') {
      chunk += css[pos++];
    }

    if (pos >= css.length) { out += chunk; break; }

    if (css[pos] === '}') { out += chunk; pos++; continue; }

    if (css[pos] === '{') {
      pos++;
      const sel = chunk.trim();
      if (!sel) { out += chunk; continue; }

      const atMatch = sel.match(/^@(keyframes|font-face)/);
      if (atMatch) {
        let inner = '';
        let depth = 1;
        while (pos < css.length && depth > 0) {
          if (css[pos] === '{') depth++;
          else if (css[pos] === '}') { depth--; if (depth === 0) { pos++; break; } }
          inner += css[pos++];
        }
        out += `${sel} {${inner}}\n\n`;
        continue;
      }

      const atMediaMatch = sel.match(/^@(media|supports|layer)/);
      if (atMediaMatch) {
        let inner = '';
        let depth = 1;
        while (pos < css.length && depth > 0) {
          if (css[pos] === '{') depth++;
          else if (css[pos] === '}') { depth--; if (depth === 0) { pos++; break; } }
          inner += css[pos++];
        }
        out += `${sel} {\n${expandNesting(inner)}\n}\n\n`;
        continue;
      }

      // Regular top-level block
      const selectors = sel.split(',').map(s => s.trim()).filter(Boolean);
      const content = parseBlock(selectors);
      if (content.decls.trim()) {
        out += `${selectors.join(',\n')} {\n${content.decls.trim()}\n}\n\n`;
      }
      for (const child of (content.children || [])) {
        out += emit(child);
      }
    }
  }

  return out;
}

// ── Main build ─────────────────────────────────────────────
function build() {
  console.log('[build-styles] Building...');
  const start = Date.now();

  loadedFiles.clear();
  loadedFiles.add(ENTRY);

  const raw = fs.readFileSync(ENTRY, 'utf8');
  const inlined = inlineUse(raw, ENTRY);
  const compiled = processScss(inlined);

  const header = `/*!\n * Pratvim — compiled stylesheet\n * Built: ${new Date().toISOString()}\n * Source: styles/main.scss\n * DO NOT EDIT DIRECTLY — edit SCSS partials and run build-styles.js\n */\n\n`;
  const output = header + compiled;

  fs.writeFileSync(OUT_CSS, output);

  const ms = Date.now() - start;
  const kb = (output.length / 1024).toFixed(1);
  console.log(`[build-styles] Done in ${ms}ms → styles.css (${kb}KB)`);
}

// ── Watch mode ─────────────────────────────────────────────
const watch = process.argv.includes('--watch');

build();

if (watch) {
  console.log('[build-styles] Watching styles/ for changes...');
  fs.watch(ROOT, { recursive: true }, (event, filename) => {
    if (filename && filename.endsWith('.scss')) {
      console.log(`[build-styles] Changed: ${filename}`);
      try { build(); } catch (e) { console.error('[build-styles] Error:', e.message); }
    }
  });
}
