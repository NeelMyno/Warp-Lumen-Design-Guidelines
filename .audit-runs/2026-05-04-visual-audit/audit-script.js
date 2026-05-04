// Lumen forensic audit — runs in any page context, returns JSON.
// Returns: { meta, hierarchy, accent, surfaces, spacing, micro, a11y, violations }
(() => {
  const cs = (el) => getComputedStyle(el);
  const root = document.documentElement;
  const all = Array.from(document.querySelectorAll('main *')).filter(Boolean);
  const accentRgb = 'rgb(0, 250, 138)';

  // ---------- meta ----------
  const meta = {
    url: location.pathname,
    title: document.title,
    mood: root.dataset.mood,
    theme: root.dataset.theme,
    viewport: { w: innerWidth, h: innerHeight, dpr: devicePixelRatio },
    scroll_height: root.scrollHeight,
    el_count_main: all.length,
  };

  // ---------- hierarchy ----------
  const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6')).map(h => ({
    tag: h.tagName, text: h.innerText?.slice(0, 60), fontSize: cs(h).fontSize,
    fontWeight: cs(h).fontWeight, color: cs(h).color, lineHeight: cs(h).lineHeight,
  }));
  const h1Count = headings.filter(h => h.tag === 'H1').length;
  const headingsBySize = {};
  headings.forEach(h => { headingsBySize[h.fontSize] = (headingsBySize[h.fontSize] || 0) + 1; });

  // ---------- font-size distribution (only text elements with content) ----------
  const fontSizes = {};
  all.forEach(el => {
    const text = el.innerText?.trim();
    if (!text) return;
    const fs = cs(el).fontSize;
    fontSizes[fs] = (fontSizes[fs] || 0) + 1;
  });
  const fsSorted = Object.entries(fontSizes).sort((a, b) => parseFloat(a[0]) - parseFloat(b[0]));
  const fsBelow12 = fsSorted.filter(([sz]) => parseFloat(sz) < 12).reduce((a, b) => a + b[1], 0);
  const fsOddSizes = fsSorted.filter(([sz]) => ![10, 11, 12, 14, 16, 18, 20, 22, 28, 31, 36, 39, 44, 49, 54, 64, 72].includes(parseFloat(sz)));

  // ---------- accent discipline ----------
  let accentBg = 0, accentFg = 0;
  const accentBgEls = [];
  const accentFgEls = [];
  all.forEach(el => {
    const bg = cs(el).backgroundColor;
    const fg = cs(el).color;
    if (bg === accentRgb) { accentBg++; if (accentBgEls.length < 8) accentBgEls.push({ tag: el.tagName, text: el.innerText?.trim().slice(0, 30), classes: el.className?.toString()?.slice(0, 60) }); }
    if (fg === accentRgb) { accentFg++; if (accentFgEls.length < 8) accentFgEls.push({ tag: el.tagName, text: el.innerText?.trim().slice(0, 30), classes: el.className?.toString()?.slice(0, 60) }); }
  });

  // ---------- micro-interactions ----------
  const interactives = Array.from(document.querySelectorAll('button, a, input, select, textarea, [role="button"], [role="tab"], [role="link"]'));
  const interactiveStats = {
    total: interactives.length,
    with_transition: 0,
    no_transition: 0,
    transition_durations: {},
    no_focus_visible: [],
  };
  interactives.forEach(el => {
    const trans = cs(el).transition;
    if (trans && trans !== 'none' && trans !== 'all 0s ease 0s') {
      interactiveStats.with_transition++;
      const dur = trans.match(/(\d+(?:\.\d+)?)(?:ms|s)/);
      if (dur) {
        const key = dur[0];
        interactiveStats.transition_durations[key] = (interactiveStats.transition_durations[key] || 0) + 1;
      }
    } else {
      interactiveStats.no_transition++;
    }
  });

  // ---------- inline-style violations (token discipline) ----------
  const inlineHexUse = [];
  const inlinePxUse = [];
  document.querySelectorAll('main [style]').forEach(el => {
    const s = el.getAttribute('style') || '';
    if (/#[0-9a-fA-F]{3,8}/.test(s)) {
      inlineHexUse.push({ tag: el.tagName, style: s.slice(0, 80), classes: el.className?.toString()?.slice(0, 50) });
    }
    if (/\d+px/.test(s) && !/border|width|height|stroke/.test(s)) {
      inlinePxUse.push({ tag: el.tagName, style: s.slice(0, 80) });
    }
  });

  // ---------- arbitrary Tailwind value detection ----------
  let arbTypoCount = 0;
  let arbSpaceCount = 0;
  let arbColorCount = 0;
  all.forEach(el => {
    const c = el.className?.toString() || '';
    if (/text-\[\d+px\]/.test(c)) arbTypoCount++;
    if (/(?:gap|p[xytrbl]?|m[xytrbl]?)-\[\d+px\]/.test(c)) arbSpaceCount++;
    if (/(?:bg|text|border)-\[#[0-9a-f]/i.test(c)) arbColorCount++;
  });

  // ---------- ARIA / semantic check (above fold focus) ----------
  const a11y = {
    landmarks: {
      main: !!document.querySelector('main'),
      nav: document.querySelectorAll('nav').length,
      header: document.querySelectorAll('header').length,
      footer: document.querySelectorAll('footer').length,
      asides: document.querySelectorAll('aside').length,
      h1_count: h1Count,
    },
    inputs_without_label: Array.from(document.querySelectorAll('input, select, textarea')).filter(el => {
      const id = el.id;
      const label = id ? document.querySelector(`label[for="${CSS.escape(id)}"]`) : null;
      const aria = el.getAttribute('aria-label') || el.getAttribute('aria-labelledby');
      return !label && !aria && el.type !== 'hidden';
    }).length,
    buttons_no_text_no_label: Array.from(document.querySelectorAll('button')).filter(b => !b.innerText.trim() && !b.getAttribute('aria-label')).length,
    images_no_alt: Array.from(document.querySelectorAll('img')).filter(i => !i.hasAttribute('alt')).length,
  };

  // ---------- focal-point quick check on visible viewport ----------
  const visibleAboveFold = all.filter(el => {
    const r = el.getBoundingClientRect();
    return r.top >= 0 && r.top < innerHeight * 0.9 && r.width > 80 && r.height > 30;
  });
  const dominantWeight = visibleAboveFold.map(el => {
    const fs = parseFloat(cs(el).fontSize);
    const fw = parseFloat(cs(el).fontWeight);
    const r = el.getBoundingClientRect();
    return { tag: el.tagName, text: el.innerText?.trim().slice(0, 40), fontSize: fs, fontWeight: fw, area: Math.round(r.width * r.height), weight_score: fs * (fw / 400) };
  }).sort((a, b) => b.weight_score - a.weight_score).slice(0, 8);

  return JSON.stringify({
    meta,
    hierarchy: { headings: headings.slice(0, 24), h1_count: h1Count, headings_by_size: headingsBySize },
    typography: { unique_sizes: Object.keys(fontSizes).length, distribution: Object.fromEntries(fsSorted), below_12px_count: fsBelow12, off_scale_sizes: fsOddSizes.map(s => s[0] + ':' + s[1]) },
    accent: { bg_count: accentBg, fg_count: accentFg, accent_bg_els: accentBgEls, accent_fg_els: accentFgEls },
    micro: interactiveStats,
    violations: { inline_hex_count: inlineHexUse.length, inline_px_count: inlinePxUse.length, arbitrary_typography: arbTypoCount, arbitrary_spacing: arbSpaceCount, arbitrary_color: arbColorCount, inline_hex_examples: inlineHexUse.slice(0, 5) },
    a11y,
    above_fold_top_focal: dominantWeight,
  }, null, 2);
})();
