#!/usr/bin/env node
/**
 * clean-css.js — Pratvim CSS deduplicator + !important remover
 *
 * Strategy:
 *   1. Parse CSS into rule-blocks (selector + declarations)
 *   2. For each selector, merge all blocks — last declaration for
 *      each property wins (mirrors browser cascade / patch-wins logic)
 *   3. Strip !important from every declaration EXCEPT:
 *      - display:none !important  on  .is-hidden  (JS toggle utility)
 *   4. Emit a single, clean, ordered CSS file
 *
 * Output:  styles.css  (overwrites in place)
 */

const fs   = require('fs');
const path = require('path');

const INPUT  = path.join(__dirname, 'styles.css');
const OUTPUT = path.join(__dirname, 'styles.css');

// ── Tokeniser ──────────────────────────────────────────────
// Splits CSS text into an array of tokens:
//   { type:'rule',    selector, declarations }
//   { type:'atrule',  text }          (@keyframes, @font-face, @media …)
//   { type:'comment', text }
//   { type:'whitespace' }

function tokenise(css) {
  const tokens = [];
  let i = 0;
  const len = css.length;

  while (i < len) {
    // Comment
    if (css[i] === '/' && css[i+1] === '*') {
      const end = css.indexOf('*/', i + 2);
      if (end === -1) { i = len; break; }
      tokens.push({ type: 'comment', text: css.slice(i, end + 2) });
      i = end + 2;
      continue;
    }

    // @-rule block
    if (css[i] === '@') {
      const braceOpen = css.indexOf('{', i);
      const semi      = css.indexOf(';', i);

      // @-rules that end with ; (e.g. @import, @charset)
      if (semi !== -1 && (braceOpen === -1 || semi < braceOpen)) {
        tokens.push({ type: 'atrule', text: css.slice(i, semi + 1) });
        i = semi + 1;
        continue;
      }

      // @-rule with block (braces must be counted for nesting)
      if (braceOpen !== -1) {
        let depth = 0;
        let j = braceOpen;
        while (j < len) {
          if (css[j] === '{') depth++;
          else if (css[j] === '}') { depth--; if (depth === 0) { j++; break; } }
          j++;
        }
        tokens.push({ type: 'atrule', text: css.slice(i, j) });
        i = j;
        continue;
      }
    }

    // Plain whitespace / newlines between blocks
    if (/\s/.test(css[i])) {
      let j = i;
      while (j < len && /\s/.test(css[j])) j++;
      tokens.push({ type: 'whitespace' });
      i = j;
      continue;
    }

    // Regular rule: everything up to the next {
    const braceOpen = css.indexOf('{', i);
    if (braceOpen === -1) { i = len; break; }

    const selector = css.slice(i, braceOpen).trim();

    // Find the matching closing brace
    let depth = 0;
    let j = braceOpen;
    while (j < len) {
      if (css[j] === '{') depth++;
      else if (css[j] === '}') { depth--; if (depth === 0) { j++; break; } }
      j++;
    }

    const body = css.slice(braceOpen + 1, j - 1);
    const declarations = parseDeclarations(body);

    tokens.push({ type: 'rule', selector, declarations });
    i = j;
  }

  return tokens;
}

// ── Declaration parser ─────────────────────────────────────
function parseDeclarations(body) {
  const decls = [];
  // Split on ; but not inside strings or parentheses
  let current = '';
  let depth = 0;
  for (let i = 0; i < body.length; i++) {
    const ch = body[i];
    if (ch === '(') depth++;
    else if (ch === ')') depth--;
    else if (ch === ';' && depth === 0) {
      const d = current.trim();
      if (d) decls.push(d);
      current = '';
      continue;
    }
    current += ch;
  }
  if (current.trim()) decls.push(current.trim());
  return decls;
}

// ── Strip !important from a declaration ───────────────────
// Keeps !important ONLY on "display: none" for .is-hidden utility
function stripImportant(decl, selector) {
  const isHiddenSelector = /\.is-hidden/.test(selector);
  const isDisplayNone    = /display\s*:\s*none/.test(decl);

  if (isHiddenSelector && isDisplayNone) return decl; // keep

  return decl.replace(/\s*!important/g, '');
}

// ── Normalise selector for dedup key ──────────────────────
function normaliseSelector(sel) {
  return sel.replace(/\s+/g, ' ').trim();
}

// ── Merge rule map: selector → ordered Map of prop → value ─
function buildRuleMap(tokens) {
  // Map<normalisedSelector, Map<property, declaration>>
  const map = new Map();
  // Preserve the ORDER in which selectors first appeared
  const order = [];

  for (const tok of tokens) {
    if (tok.type !== 'rule') continue;
    const key = normaliseSelector(tok.selector);

    if (!map.has(key)) {
      map.set(key, new Map());
      order.push({ key, originalSelector: tok.selector });
    }

    const propMap = map.get(key);
    for (const decl of tok.declarations) {
      // Extract property name (everything before the first colon)
      const colon = decl.indexOf(':');
      if (colon === -1) continue;
      const prop = decl.slice(0, colon).trim().toLowerCase();
      // Later declaration wins — just overwrite
      propMap.set(prop, decl);
    }
  }

  return { map, order };
}

// ── Emit merged rules ─────────────────────────────────────
function emitRules(map, order) {
  const parts = [];
  for (const { key, originalSelector } of order) {
    const propMap = map.get(key);
    if (!propMap || propMap.size === 0) continue;

    const decls = [...propMap.values()]
      .map(d => '  ' + stripImportant(d, key) + ';')
      .join('\n');

    parts.push(`${originalSelector} {\n${decls}\n}`);
  }
  return parts.join('\n\n');
}

// ── At-rules and comments — emit as-is ───────────────────
function emitAtRules(tokens) {
  return tokens
    .filter(t => t.type === 'atrule')
    .map(t => t.text)
    .join('\n\n');
}

// ── Section comment blocks (retain the big ones) ──────────
function collectSectionComments(tokens) {
  // Keep only the top-of-file comment for attribution
  const comments = tokens.filter(t => t.type === 'comment');
  return comments.length > 0 ? comments[0].text : '';
}

// ── Main ─────────────────────────────────────────────────
function main() {
  console.log('[clean-css] Reading', INPUT);
  const raw = fs.readFileSync(INPUT, 'utf8');

  console.log('[clean-css] Tokenising…');
  const tokens = tokenise(raw);

  const ruleCount   = tokens.filter(t => t.type === 'rule').length;
  const atRuleCount = tokens.filter(t => t.type === 'atrule').length;
  console.log(`[clean-css] Found ${ruleCount} rule blocks, ${atRuleCount} at-rules`);

  console.log('[clean-css] Merging duplicate selectors…');
  const { map, order } = buildRuleMap(tokens);
  console.log(`[clean-css] Unique selectors: ${order.length} (was ${ruleCount})`);

  // Separate at-rules: @keyframes, @font-face go after rules; @media inline
  // Strategy: preserve at-rules in their original relative position
  // We'll emit them in the order they appeared, interleaved with rule output

  // Build final output in token order, deduplicating rules
  const emittedSelectors = new Set();
  const outputParts = [];

  outputParts.push(`/*!
 * Pratvim — styles.css
 * Cleaned: ${new Date().toISOString().slice(0,10)}
 * Single file, deduplicated, minimal !important
 * Edit this file directly; sections are ordered:
 *   1. CSS custom properties (:root)
 *   2. Base reset & typography
 *   3. Layout (app shell, headers)
 *   4. Components (buttons, cards, modals, chat, composer)
 *   5. Pages (splash, auth, chat, parent, info)
 *   6. Animations (@keyframes)
 */`);

  for (const tok of tokens) {
    if (tok.type === 'comment') continue; // skip — header already added
    if (tok.type === 'whitespace') continue;

    if (tok.type === 'atrule') {
      // Strip !important from keyframe bodies too
      const cleaned = tok.text.replace(/\s*!important/g, '');
      outputParts.push(cleaned);
      continue;
    }

    if (tok.type === 'rule') {
      const key = normaliseSelector(tok.selector);
      if (emittedSelectors.has(key)) continue; // already emitted merged version
      emittedSelectors.add(key);

      const propMap = map.get(key);
      if (!propMap || propMap.size === 0) continue;

      const decls = [...propMap.values()]
        .map(d => '  ' + stripImportant(d, key) + ';')
        .join('\n');

      outputParts.push(`${tok.selector} {\n${decls}\n}`);
    }
  }

  const output = outputParts.join('\n\n') + '\n';

  // Count remaining !important
  const remaining = (output.match(/!important/g) || []).length;
  const origImportant = (raw.match(/!important/g) || []).length;

  console.log(`[clean-css] !important: ${origImportant} → ${remaining}`);
  console.log(`[clean-css] Lines: ${raw.split('\n').length} → ${output.split('\n').length}`);

  fs.writeFileSync(OUTPUT, output);
  console.log('[clean-css] Written to', OUTPUT);
}

main();
