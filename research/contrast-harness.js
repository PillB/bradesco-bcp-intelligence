/**
 * Ursa Coffee — Runtime Contrast Evaluation Harness
 *
 * Walks the DOM, finds all text-bearing elements, computes the ACTUAL
 * rendered text color vs the ACTUAL rendered background color (walking
 * up the ancestor chain for transparency), and calculates the WCAG
 * contrast ratio. Reports all failures (ratio < 4.5:1 for normal text,
 * < 3:1 for large text ≥18px or ≥14px bold).
 *
 * Usage: paste into browser console, or run via agent-browser eval.
 */

(function () {
  "use strict";

  function parseColor(color) {
    // Parse rgb(r, g, b) / rgba(r, g, b, a) / #rrggbb / #rgb / oklab(... / a)
    var m;
    if ((m = color.match(/^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*([\d.]+)\s*)?\)$/))) {
      return { r: +m[1], g: +m[2], b: +m[3], a: m[4] !== undefined ? +m[4] : 1 };
    }
    // Handle rgb(r g b / a) space-separated format
    if ((m = color.match(/^rgba?\(\s*([\d.]+)\s+([\d.]+)\s+([\d.]+)\s*(?:\/\s*([\d.]+)\s*)?\)$/))) {
      return { r: +m[1], g: +m[2], b: +m[3], a: m[4] !== undefined ? +m[4] : 1 };
    }
    if ((m = color.match(/^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i))) {
      return { r: parseInt(m[1], 16), g: parseInt(m[2], 16), b: parseInt(m[3], 16), a: 1 };
    }
    if ((m = color.match(/^#([0-9a-f])([0-9a-f])([0-9a-f])$/i))) {
      return { r: parseInt(m[1] + m[1], 16), g: parseInt(m[2] + m[2], 16), b: parseInt(m[3] + m[3], 16), a: 1 };
    }
    // Handle oklab(L a b / alpha) — convert to approximate RGB
    if ((m = color.match(/^oklab\(\s*([\d.]+)\s+([\d.e-]+)\s+([\d.e-]+)\s*(?:\/\s*([\d.]+)\s*)?\)$/))) {
      var L = +m[1], a = +m[2], b = +m[3], alpha = m[4] !== undefined ? +m[4] : 1;
      // Approximate oklab->RGB: use the L as a brightness proxy
      // For contrast purposes, we need the relative luminance
      // oklab L is perceptual lightness (0=black, 1=white)
      // Approximate sRGB luminance from oklab L: L^2 (rough)
      var approxLum = L * L;
      // Recover approximate RGB from oklab (simplified)
      // This is a rough conversion — for exact, use the CSS color module
      var r = Math.max(0, Math.min(255, Math.round(255 * Math.pow(L + 0.396 * a + 0.216 * b, 3))));
      var g = Math.max(0, Math.min(255, Math.round(255 * Math.pow(L - 0.106 * a - 0.063 * b, 3))));
      var b_ = Math.max(0, Math.min(255, Math.round(255 * Math.pow(L - 0.089 * a - 0.703 * b, 3))));
      return { r: r, g: g, b: b_, a: alpha };
    }
    return null;
  }

  function luminance(c) {
    function f(v) { return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }
    var r = c.r / 255, g = c.g / 255, b = c.b / 255;
    return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
  }

  function contrastRatio(fg, bg) {
    var l1 = luminance(fg), l2 = luminance(bg);
    var hi = Math.max(l1, l2), lo = Math.min(l1, l2);
    return (hi + 0.05) / (lo + 0.05);
  }

  // Alpha-blend a color over a background
  function blend(fg, bg) {
    if (fg.a >= 1) return fg;
    var a = fg.a;
    return {
      r: Math.round(fg.r * a + bg.r * (1 - a)),
      g: Math.round(fg.g * a + bg.g * (1 - a)),
      b: Math.round(fg.b * a + bg.b * (1 - a)),
      a: 1
    };
  }

  // Walk up ancestors to find the effective background color
  function getEffectiveBg(el) {
    var node = el;
    while (node && node !== document.documentElement) {
      var cs = getComputedStyle(node);
      var bg = cs.backgroundColor;
      // Check for gradient backgrounds (linear-gradient, radial-gradient)
      var bgImage = cs.backgroundImage;
      if (bgImage && bgImage !== "none") {
        // Extract ALL colors from the gradient and find the darkest one
        // (darkest = worst case for light text, best case for dark text)
        var gradColors = bgImage.match(/(rgba?\([^)]+\)|#[0-9a-f]{3,8})/gi) || [];
        var darkest = null;
        var darkestLum = 1;
        gradColors.forEach(function(gc) {
          var parsed = parseColor(gc);
          if (parsed && parsed.a > 0.5) {
            var l = luminance(parsed);
            if (l < darkestLum) {
              darkestLum = l;
              darkest = parsed;
            }
          }
        });
        if (darkest) return darkest;
      }
      var parsed = parseColor(bg);
      if (parsed && parsed.a > 0) {
        if (parsed.a >= 1) return parsed;
        // Semi-transparent: blend with parent
        var parentBg = getEffectiveBg(node.parentElement);
        return blend(parsed, parentBg);
      }
      // If backgroundColor is transparent but there's a gradient, we already
      // handled it above. If no gradient either, continue to parent.
      node = node.parentElement;
    }
    var docBg = parseColor(getComputedStyle(document.body).backgroundColor);
    return docBg || { r: 255, g: 255, b: 255, a: 1 };
  }

  function getEffectiveFg(el) {
    var node = el;
    while (node) {
      var color = getComputedStyle(node).color;
      var parsed = parseColor(color);
      if (parsed) {
        if (parsed.a >= 1) return parsed;
        // Semi-transparent text: blend with bg
        var bg = getEffectiveBg(el);
        return blend(parsed, bg);
      }
      node = node.parentElement;
    }
    return { r: 0, g: 0, b: 0, a: 1 };
  }

  function isLargeText(el) {
    var cs = getComputedStyle(el);
    var fontSize = parseFloat(cs.fontSize);
    var fontWeight = parseInt(cs.fontWeight) || 400;
    return fontSize >= 18 || (fontSize >= 14 && fontWeight >= 700);
  }

  function getSnippet(el) {
    var text = (el.textContent || "").trim();
    return text.length > 50 ? text.substring(0, 50) + "…" : text;
  }

  function getSelector(el) {
    if (el.id) return "#" + el.id;
    var s = el.tagName.toLowerCase();
    if (el.className && typeof el.className === "string") {
      var cls = el.className.trim().split(/\s+/).slice(0, 3).join(".");
      if (cls) s += "." + cls;
    }
    return s;
  }

  // Collect all text-bearing elements
  var failures = [];
  var warnings = [];
  var passed = 0;
  var skipped = 0;

  var all = document.querySelectorAll("body *:not(script):not(style):not(noscript)");
  all.forEach(function (el) {
    // Only check elements with direct text content
    var hasText = false;
    for (var i = 0; i < el.childNodes.length; i++) {
      if (el.childNodes[i].nodeType === 3 && el.childNodes[i].textContent.trim().length > 1) {
        hasText = true;
        break;
      }
    }
    if (!hasText) { skipped++; return; }

    // Skip hidden elements
    var cs = getComputedStyle(el);
    if (cs.display === "none" || cs.visibility === "hidden" || cs.opacity === "0") {
      skipped++;
      return;
    }

    var fg = getEffectiveFg(el);
    var bg = getEffectiveBg(el);
    var ratio = contrastRatio(fg, bg);
    var large = isLargeText(el);
    var threshold = large ? 3.0 : 4.5;

    if (ratio < threshold) {
      failures.push({
        selector: getSelector(el),
        text: getSnippet(el),
        fgColor: "rgb(" + fg.r + "," + fg.g + "," + fg.b + ")",
        bgColor: "rgb(" + bg.r + "," + bg.g + "," + bg.b + ")",
        ratio: Math.round(ratio * 100) / 100,
        threshold: threshold,
        largeText: large,
        fontSize: parseFloat(cs.fontSize),
        fontWeight: cs.fontWeight
      });
    } else if (ratio < threshold + 0.5) {
      // Near-miss warning
      warnings.push({
        selector: getSelector(el),
        text: getSnippet(el),
        ratio: Math.round(ratio * 100) / 100,
        threshold: threshold
      });
    } else {
      passed++;
    }
  });

  // Output
  var result = {
    summary: {
      totalChecked: passed + failures.length + warnings.length,
      passed: passed,
      failed: failures.length,
      warnings: warnings.length,
      skipped: skipped
    },
    failures: failures.slice(0, 30),
    warnings: warnings.slice(0, 10)
  };

  // Print to console
  console.log("=== URSA CONTRAST HARNESS RESULTS ===");
  console.log("Checked: " + result.summary.totalChecked + " | Passed: " + result.summary.passed + " | Failed: " + result.summary.failed + " | Warnings: " + result.summary.warnings);
  if (failures.length > 0) {
    console.table(failures.slice(0, 15));
  }
  if (warnings.length > 0) {
    console.log("Near-miss warnings (within 0.5 of threshold):");
    console.table(warnings.slice(0, 5));
  }

  return JSON.stringify(result);
})();
