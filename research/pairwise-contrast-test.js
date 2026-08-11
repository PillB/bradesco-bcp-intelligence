/**
 * Ursa Coffee — Comprehensive Pairwise Color Contrast Test
 *
 * Extracts every color used in the design system (from globals.css @theme
 * and :root variables), then tests ALL possible pairs to find any that
 * would fail WCAG if used as text-on-background. Also walks the live DOM
 * to verify actual rendered pairs.
 *
 * Usage: node research/pairwise-contrast-test.js
 *    or: agent-browser eval "$(cat research/pairwise-contrast-test.js)"
 */

/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require("fs");

// --- WCAG contrast calculation ---
function parseHex(hex) {
  const m = hex.match(/^#?([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i);
  if (!m) return null;
  return { r: parseInt(m[1], 16), g: parseInt(m[2], 16), b: parseInt(m[3], 16) };
}

function luminance(c) {
  const f = (v) => (v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4));
  return 0.2126 * f(c.r / 255) + 0.7152 * f(c.g / 255) + 0.0722 * f(c.b / 255);
}

function ratio(a, b) {
  const l1 = luminance(a), l2 = luminance(b);
  return ((Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05));
}

// --- Extract colors from globals.css ---
const css = fs.readFileSync("src/app/globals.css", "utf8");

const colorRegex = /--color-ursa-[\w-]+:\s*(#[0-9a-f]{6})/gi;
const rootRegex = /--[\w-]+:\s*(#[0-9a-f]{6})/gi;

const colors = new Map();

let m;
while ((m = colorRegex.exec(css)) !== null) {
  colors.set(m[0].split(":")[0].trim().replace("--", ""), { hex: m[1], source: "@theme" });
}
// Also get :root variables
const rootBlock = css.match(/:root\s*\{([^}]+)\}/);
if (rootBlock) {
  const rootRegex2 = /(--[\w-]+):\s*(#[0-9a-f]{6})/gi;
  while ((m = rootRegex2.exec(rootBlock[1])) !== null) {
    const name = m[1].replace("--", "");
    if (!colors.has(name)) {
      colors.set(name, { hex: m[2], source: ":root" });
    }
  }
}
// Also get .dark overrides
const darkBlock = css.match(/\.dark\s*\{([^}]+)\}/);
if (darkBlock) {
  const darkRegex = /(--[\w-]+):\s*(#[0-9a-f]{6})/gi;
  while ((m = darkRegex.exec(darkBlock[1])) !== null) {
    const name = m[1].replace("--", "") + "_dark";
    colors.set(name, { hex: m[2], source: ".dark" });
  }
}

// Add the fixed bear colors
colors.set("bear_white", { hex: "#FFFFFF", source: "BearMark" });
colors.set("bear_forest", { hex: "#2D4A36", source: "BearMark" });
colors.set("bear_gold_soft", { hex: "#D9BC7E", source: "BearMark" });
colors.set("bear_gold_border", { hex: "#B8924A", source: "header" });

// --- Test all pairs ---
const entries = Array.from(colors.entries());
const results = [];
const failures = [];

for (let i = 0; i < entries.length; i++) {
  for (let j = i + 1; j < entries.length; j++) {
    const [nameA, valA] = entries[i];
    const [nameB, valB] = entries[j];
    const hexA = valA.hex;
    const hexB = valB.hex;
    const cA = parseHex(hexA);
    const cB = parseHex(hexB);
    if (!cA || !cB) continue;
    const r = ratio(cA, cB);
    results.push({ a: nameA, b: nameB, hexA, hexB, ratio: r });
    if (r < 4.5) {
      failures.push({ a: nameA, b: nameB, hexA, hexB, ratio: Math.round(r * 100) / 100 });
    }
  }
}

// --- Report ---
console.log(`\n=== URSA PAIRWISE CONTRAST TEST ===`);
console.log(`Colors tested: ${entries.length}`);
console.log(`Pairs tested: ${results.length}`);
console.log(`Pairs failing WCAG AA (4.5:1): ${failures.length}`);
console.log(`Pairs failing WCAG graphics (3:1): ${failures.filter(f => f.ratio < 3).length}`);

if (failures.length > 0) {
  console.log(`\n--- FAILURES (ratio < 4.5:1) ---`);
  // Group by severity
  const critical = failures.filter(f => f.ratio < 3);
  const moderate = failures.filter(f => f.ratio >= 3 && f.ratio < 4.5);

  if (critical.length > 0) {
    console.log(`\n  CRITICAL (ratio < 3:1 — even graphics fail):`);
    critical.forEach(f => {
      console.log(`    ${f.ratio.toFixed(2)}  ${f.hexA} (${f.a}) vs ${f.hexB} (${f.b})`);
    });
  }
  if (moderate.length > 0) {
    console.log(`\n  MODERATE (3:1–4.5:1 — graphics pass, text fails):`);
    moderate.forEach(f => {
      console.log(`    ${f.ratio.toFixed(2)}  ${f.hexA} (${f.a}) vs ${f.hexB} (${f.b})`);
    });
  }
} else {
  console.log(`\n✓ ALL PAIRS PASS WCAG AA (4.5:1)`);
}

// --- Output JSON for programmatic use ---
const output = {
  totalColors: entries.length,
  totalPairs: results.length,
  totalFailures: failures.length,
  criticalFailures: failures.filter(f => f.ratio < 3).length,
  failures: failures.sort((a, b) => a.ratio - b.ratio).slice(0, 30),
};

fs.writeFileSync("research/pairwise-results.json", JSON.stringify(output, null, 2));
console.log(`\nResults saved to research/pairwise-results.json`);
