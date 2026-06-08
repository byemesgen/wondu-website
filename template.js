// ── Escape helpers ──────────────────────────────────────────────────────────
function esc(str = '') {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}
function escAttr(str = '') { return esc(str) }
function escJsStr(str = '') {
  return String(str).replace(/\\/g, '\\\\').replace(/'/g, "\\'")
}

// ── Main render function ────────────────────────────────────────────────────
export function renderTemplate(data) {
  const { settings: s, hero: h, marqueeItems, projects, about, contact: c } = data

  const email      = s.email || ''
  const emailJs    = escJsStr(email)
  const accentColor = escAttr(s.accentColor || '#FF3D00')
  const pdfUrl     = escAttr(s.pdfUrl  || '#')
  const cvUrl      = escAttr(about.cvUrl   || '#')
  const imdbUrl    = escAttr(about.imdbUrl || '#')

  // ── Hero pills ─────────────────────────────────────────────────────────
  const pillsHtml = (h.pills || []).map(pill =>
    pill.isAvailabilityPill
      ? `<div class="pill available"><span class="pill-dot"></span>${esc(pill.text)}</div>`
      : `<div class="pill">${esc(pill.text)}</div>`
  ).join('\n                    ')

  // ── Marquee (auto-duplicated for seamless loop) ────────────────────────
  const allItems   = [...marqueeItems, ...marqueeItems]
  const marqueeHtml = allItems
    .map(item => `<span class="mq-item">${esc(item)}</span>`)
    .join('\n                ')

  // ── Work cards ─────────────────────────────────────────────────────────
  const workCardsHtml = projects.map((p, i) => {
    const num = String(i + 1).padStart(2, '0')
    const bg  = p.thumbnailUrl
      ? `background:url('${escAttr(p.thumbnailUrl)}') center/cover no-repeat`
      : `background:#111`
    const tagsHtml = (p.tags || []).map(t => `<span class="tag">${esc(t)}</span>`).join('')
    return `
                <article class="pcard pcard-new" onclick="openVideo('${escAttr(p.videoPlatform)}','${escAttr(p.videoId)}')" role="button" tabindex="0">
                    <div class="pcard-bg-new" style="${bg}"></div>
                    <div class="play-ring" aria-hidden="true"><svg width="16" height="16" viewBox="0 0 16 16" fill="white"><path d="M4 2l10 6-10 6V2z"/></svg></div>
                    <div class="pcard-overlay"><div class="pcard-overlay-content">
                        <span class="pnum">${num}</span>
                        <p class="pyear">${esc(p.company)} / ${esc(p.year)}</p>
                        <h3 class="pname">${p.title}</h3>
                        <div class="tags">${tagsHtml}</div>
                    </div></div>
                </article>`
  }).join('\n')

  // ── IMDB credits ────────────────────────────────────────────────────────
  const creditsHtml = (about.imdbCredits || []).map(cr => `
                            <li class="exp-item">
                                <div class="ei-l">
                                    <span class="ei-co">${esc(cr.projectTitle)}</span>
                                    <span class="ei-role">${esc(cr.role)}</span>
                                </div>
                                <span class="ei-yr">${esc(cr.year)}</span>
                            </li>`).join('')

  // ── Awards ──────────────────────────────────────────────────────────────
  const awardsHtml = (about.awards || []).map(a => `
                            <li class="award-item">
                                <div class="aw-l">
                                    <span class="aw-title">${esc(a.awardTitle)}</span>
                                    <span class="aw-issuer">${esc(a.issuer)}</span>
                                </div>
                                <span class="aw-yr">${esc(a.year)}</span>
                            </li>`).join('')

  // ── Press ───────────────────────────────────────────────────────────────
  const pressHtml = (about.press || []).map(p => {
    const headlineEl = p.url
      ? `<a href="${escAttr(p.url)}" target="_blank" rel="noopener" class="aw-title">${esc(p.headline)}</a>`
      : `<span class="aw-title">${esc(p.headline)}</span>`
    return `
                            <li class="award-item">
                                <div class="aw-l">
                                    ${headlineEl}
                                    <span class="aw-issuer">${esc(p.publication)}</span>
                                </div>
                                <span class="aw-yr">${esc(p.year)}</span>
                            </li>`
  }).join('')

  // ── Skills ──────────────────────────────────────────────────────────────
  const skillsHtml = (about.skills || [])
    .map(sk => `<span class="skill-pill">${esc(sk)}</span>`)
    .join('\n                            ')

  // ── Social links (email always first, then CMS links) ──────────────────
  const socialHtml = (s.socialLinks || []).map(l => {
    const isEmail = l.url && l.url.startsWith('mailto:')
    return isEmail
      ? `<a href="${escAttr(l.url)}" data-cursor="hi">${esc(l.label)}</a>`
      : `<a href="${escAttr(l.url)}" target="_blank" rel="noopener" data-cursor="hi">${esc(l.label)}</a>`
  }).join('\n                    ')

  // ── Full HTML ────────────────────────────────────────────────────────────
  return `<!DOCTYPE html>
<html lang="en">

<head>
    <script>
        (function() {
            var s = localStorage.getItem('theme');
            document.documentElement.setAttribute('data-theme', s ? s : (window.matchMedia('(prefers-color-scheme:dark)').matches ? 'dark' : 'light'));
        }());
    </script>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
    <title>${esc(s.siteTitle)}</title>
    <meta name="description" content="${escAttr(s.metaDescription)}" />

    <meta name="robots" content="index, follow" />
    <link rel="canonical" href="${escAttr(s.siteUrl)}" />

    <!-- Open Graph -->
    <meta property="og:type" content="website" />
    <meta property="og:url" content="${escAttr(s.siteUrl)}" />
    <meta property="og:title" content="${escAttr(s.siteTitle)}" />
    <meta property="og:description" content="${escAttr(s.metaDescription)}" />
    ${s.ogImageUrl ? `<meta property="og:image" content="${escAttr(s.ogImageUrl)}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />` : ''}

    <!-- Twitter / X Card -->
    <meta name="twitter:card" content="${s.ogImageUrl ? 'summary_large_image' : 'summary'}" />
    <meta name="twitter:title" content="${escAttr(s.siteTitle)}" />
    <meta name="twitter:description" content="${escAttr(s.metaDescription)}" />
    ${s.ogImageUrl ? `<meta name="twitter:image" content="${escAttr(s.ogImageUrl)}" />` : ''}

    <!-- JSON-LD Structured Data -->
    <script type="application/ld+json">${JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: `${h.nameLineOne} ${h.nameLineTwo}`,
      jobTitle: h.eyebrow,
      description: s.metaDescription,
      url: s.siteUrl,
      ...(s.ogImageUrl && { image: s.ogImageUrl }),
      sameAs: (s.socialLinks || [])
        .map(l => l.url)
        .filter(u => u && !u.startsWith('mailto:')),
    })}</script>

    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link rel="preconnect" href="https://cdnjs.cloudflare.com" crossorigin />
    <link rel="preload" as="style" href="https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Inter:ital,wght@0,300;0,400;0,600;1,300&display=swap" onload="this.onload=null;this.rel='stylesheet'" />
    <noscript><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Inter:ital,wght@0,300;0,400;0,600;1,300&display=swap" /></noscript>

    <!-- Favicon -->
    ${s.faviconUrl ? `<link rel="icon" type="image/png" href="${escAttr(s.faviconUrl)}" />
    <link rel="apple-touch-icon" href="${escAttr(s.faviconUrl)}" />` : ''}

    <!-- CMS accent color override -->
    <style>:root { --accent: ${accentColor}; } [data-theme="light"] { --accent: ${accentColor}; }</style>

    <style>
        /* ============================================
       VARIABLES & THEMES
    ============================================ */

        :root {
            --bg: #0C0C0B;
            --bg2: #141413;
            --fg: #EDEDE8;
            --muted: #93938F;
            --border: rgba(237, 237, 232, 0.09);
            --border-hover: rgba(237, 237, 232, 0.38);
            --accent: #FF3D00;
            --accent2: #FF7A5C;
            --radius: 14px;
            --transition: 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }

        [data-theme="light"] {
            --bg: #F0EDE5;
            --bg2: #E8E5DD;
            --fg: #0C0C0B;
            --muted: #5B5A57;
            --border: rgba(12, 12, 11, 0.1);
            --border-hover: rgba(12, 12, 11, 0.38);
            --accent: #FF3D00;
            --accent2: #D93300;
        }

        /* ============================================
       RESET
    ============================================ */

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body { font-family: 'Inter', system-ui, sans-serif; background: var(--bg); color: var(--fg); overflow-x: hidden; cursor: none; transition: background var(--transition), color var(--transition); }
        a { color: inherit; text-decoration: none; }
        img { display: block; max-width: 100%; }
        ul { list-style: none; }
        *, *::before, *::after { cursor: none !important; }

        @media (pointer: coarse) {
            *, *::before, *::after { cursor: auto !important; }
            body { cursor: auto; }
            .cursor { display: none !important; }
        }

        /* ============================================
       NOISE OVERLAY
    ============================================ */

        body::after {
            content: '';
            position: fixed;
            inset: 0;
            background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E");
            opacity: 0.028;
            pointer-events: none;
            z-index: 9997;
        }

        /* ============================================
       CURSOR
    ============================================ */

        .cursor { position: fixed; top: 0; left: 0; pointer-events: none; z-index: 9999; will-change: transform; opacity: 0; }
        .cursor-arrow { position: absolute; top: 0; left: 0; width: 22px; height: 26px; transition: transform 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94); filter: drop-shadow(0 1px 3px rgba(0,0,0,0.45)); }
        .cursor-arrow svg { display: block; }
        .cursor-label { position: absolute; top: 18px; left: 16px; background: #1A1A19; color: #EDEDE8; font-family: 'Inter', sans-serif; font-size: 11px; font-weight: 600; letter-spacing: 0.04em; padding: 4px 10px 4px 8px; border-radius: 100px; white-space: nowrap; display: flex; align-items: center; gap: 5px; box-shadow: 0 2px 8px rgba(0,0,0,0.35), inset 0 0 0 1px rgba(255,255,255,0.07); transition: background 0.25s ease, transform 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94); }
        .cursor-label-dot { width: 6px; height: 6px; border-radius: 50%; background: #FF3D00; flex-shrink: 0; }

        @keyframes pill-bounce {
            0%   { transform: scale(1, 1); }
            18%  { transform: scale(1.14, 0.86); }
            38%  { transform: scale(0.93, 1.07); }
            58%  { transform: scale(1.05, 0.96); }
            78%  { transform: scale(0.98, 1.02); }
            100% { transform: scale(1, 1); }
        }

        #cursorLabelText { transition: opacity 0.12s ease; }
        body.is-hovering .cursor-arrow { transform: rotate(-12deg) scale(0.92); }
        body.is-hovering .cursor-label { background: #FF3D00; color: #fff; animation: pill-bounce 0.42s cubic-bezier(.36,.07,.19,.97); }
        body.is-hovering .cursor-label-dot { background: rgba(255,255,255,0.6); }

        /* ============================================
       PRELOADER
    ============================================ */

        #preloader { position: fixed; inset: 0; background: var(--bg); z-index: 9000; display: flex; align-items: center; justify-content: center; flex-direction: column; gap: 20px; }
        .pl-name { font-family: 'Syne', sans-serif; font-size: clamp(32px, 6vw, 72px); font-weight: 800; letter-spacing: -0.045em; overflow: hidden; text-align: center; }
        .pl-name span { display: inline-block; transform: translateY(110%); }
        .pl-bar-wrap { width: 160px; height: 1px; background: var(--border); overflow: hidden; }
        .pl-bar { height: 100%; width: 0; background: var(--fg); transition: width 0.9s cubic-bezier(0.76, 0, 0.24, 1); }

        /* ============================================
       NAVIGATION
    ============================================ */

        nav { position: fixed; top: 0; left: 0; right: 0; z-index: 200; padding: 22px 44px; display: flex; justify-content: space-between; align-items: center; transition: padding 0.45s cubic-bezier(0.4,0,0.2,1), top 0.45s cubic-bezier(0.4,0,0.2,1), left 0.45s cubic-bezier(0.4,0,0.2,1), right 0.45s cubic-bezier(0.4,0,0.2,1), border-radius 0.45s cubic-bezier(0.4,0,0.2,1), background 0.4s ease, backdrop-filter 0.4s ease, box-shadow 0.4s ease; }
        nav.scrolled { top: 16px; left: 22%; right: 22%; gap: 48px; padding: 14px 36px; border-radius: 100px; background: rgba(54,54,54,0.90); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); box-shadow: 0 4px 24px rgba(0,0,0,0.25); }
        [data-theme="light"] nav.scrolled { background: rgba(255,255,255,0.90); box-shadow: 0 4px 24px rgba(0,0,0,0.10); }
        .nav-logo { font-family: 'Syne', sans-serif; font-size: 15px; font-weight: 800; letter-spacing: -0.02em; }
        .nav-right { display: flex; align-items: center; gap: 36px; }
        .nav-links { display: flex; gap: 28px; }
        .nav-links a { font-size: 12px; font-weight: 400; letter-spacing: 0.1em; text-transform: uppercase; color: var(--muted); transition: color 0.3s; position: relative; }
        .nav-links a::after { content: ''; position: absolute; bottom: -2px; left: 0; width: 0; height: 1px; background: var(--fg); transition: width 0.3s ease; }
        .nav-links a:hover { color: var(--fg); }
        .nav-links a:hover::after { width: 100%; }
        .theme-btn { display: flex; align-items: center; gap: 7px; background: none; border: 1px solid var(--border); border-radius: 100px; padding: 7px 15px; cursor: none; color: var(--muted); font-family: 'Inter', sans-serif; font-size: 11px; letter-spacing: 0.08em; text-transform: uppercase; transition: all 0.3s ease; }
        .theme-btn:hover { background: var(--fg); color: var(--bg); border-color: var(--fg); }
        .theme-btn .t-icon { font-size: 13px; }

        /* ============================================
       HERO
    ============================================ */

        #hero { min-height: 100svh; display: flex; flex-direction: column; justify-content: flex-end; padding: 0 44px max(56px, calc(56px + env(safe-area-inset-bottom))); position: relative; }
        .hero-eyebrow { font-size: 11px; letter-spacing: 0.14em; text-transform: uppercase; color: var(--muted); margin-bottom: 20px; overflow: hidden; }
        .hero-eyebrow span { display: inline-block; transform: translateY(110%); }
        .hero-title { font-family: 'Syne', sans-serif; font-size: clamp(72px, 12vw, 176px); font-weight: 800; line-height: 0.88; letter-spacing: -0.05em; margin-bottom: 48px; }
        .hero-title .tl { overflow: hidden; display: block; }
        .hero-title .tl span { display: block; transform: translateY(110%); }
        .s-title .tl { overflow: hidden; display: block; }
        .s-title .tl span { display: block; transform: translateY(110%); }
        .hero-bottom { display: flex; justify-content: space-between; align-items: flex-end; gap: 32px; }
        .hero-desc { max-width: 360px; font-size: 15px; line-height: 1.65; color: var(--muted); font-weight: 300; overflow: hidden; }
        .hero-right { display: flex; flex-direction: column; align-items: flex-end; gap: 10px; }
        .pill { display: inline-flex; align-items: center; gap: 7px; font-size: 11px; letter-spacing: 0.09em; text-transform: uppercase; border: 1px solid var(--border); padding: 7px 14px; border-radius: 100px; color: var(--muted); }
        .pill.available { border-color: rgba(0,220,100,0.28); color: rgba(0,220,100,0.85); }
        [data-theme="light"] .pill.available { color: #006E2D; border-color: rgba(0,110,45,0.35); }
        .pill-dot { width: 6px; height: 6px; border-radius: 50%; background: currentColor; animation: blink 2.2s ease infinite; }

        @keyframes blink { 0%, 100% { opacity: 1 } 50% { opacity: 0.4 } }

        .scroll-hint { position: absolute; top: 110px; right: 44px; display: flex; flex-direction: column; align-items: center; gap: 10px; opacity: 0; }
        .scroll-hint span { font-size: 9px; letter-spacing: 0.18em; text-transform: uppercase; color: var(--muted); writing-mode: vertical-lr; }
        .sh-line { width: 1px; height: 64px; background: var(--border); position: relative; overflow: hidden; }
        .sh-line::after { content: ''; position: absolute; top: -100%; left: 0; width: 100%; height: 100%; background: var(--accent); animation: shline 2.4s ease infinite; }

        @keyframes shline { 0% { top: -100% } 100% { top: 100% } }

        /* ============================================
       MARQUEE
    ============================================ */

        .marquee-wrap { border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); padding: 14px 0; overflow: hidden; white-space: nowrap; }
        .marquee-track { display: inline-flex; animation: mq 28s linear infinite; }
        .marquee-wrap:hover .marquee-track { animation-play-state: paused; }
        .mq-item { font-family: 'Syne', sans-serif; font-size: 11px; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; color: var(--muted); padding: 0 28px; display: inline-flex; align-items: center; gap: 56px; }
        .mq-item::after { content: '✦'; font-size: 7px; }

        @keyframes mq { from { transform: translateX(0) } to { transform: translateX(-50%) } }

        /* ============================================
       SECTION COMMON
    ============================================ */

        .s-header { display: flex; justify-content: space-between; align-items: center; padding-bottom: 20px; border-bottom: 1px solid var(--border); margin-bottom: 64px; }
        .s-label { font-size: 10px; letter-spacing: 0.14em; text-transform: uppercase; color: var(--muted); margin-bottom: 8px; }
        .s-title { font-family: 'Syne', sans-serif; font-size: clamp(52px, 8vw, 110px); font-weight: 800; letter-spacing: -0.045em; line-height: 0.88; }
        .cv-btn { display: inline-flex; align-items: center; gap: 7px; align-self: flex-end; background: none; border: 1px solid var(--border); border-radius: 100px; padding: 7px 15px; color: var(--muted); font-family: 'Inter', sans-serif; font-size: 11px; letter-spacing: 0.08em; text-transform: uppercase; text-decoration: none; white-space: nowrap; transition: all 0.3s ease; cursor: none; }
        .cv-btn:hover { background: var(--fg); color: var(--bg); border-color: var(--fg); }
        .cv-btn:hover svg { stroke: var(--bg); transform: translateX(3px); }
        .cv-btn svg { flex-shrink: 0; transition: stroke 0.3s ease, transform 0.3s ease; }

        /* ============================================
       WORK
    ============================================ */

        #work { padding: 120px 44px; }
        .projects { display: flex; flex-direction: column; gap: 16px; }
        .pcard { border: 1px solid var(--border); border-radius: var(--radius); overflow: hidden; cursor: none; transition: border-color 0.4s ease; }
        .pcard:hover { border-color: var(--border-hover); }
        .pnum { font-size: 10px; font-weight: 600; letter-spacing: 0.12em; color: var(--muted); }
        .tags { display: flex; gap: 6px; flex-wrap: wrap; }
        .tag { font-size: 9px; letter-spacing: 0.1em; text-transform: uppercase; padding: 4px 11px; border: 1px solid var(--border); border-radius: 100px; color: var(--muted); }
        .pname { font-family: 'Inter', sans-serif; font-size: clamp(22px, 2.8vw, 40px); font-weight: 800; letter-spacing: -0.03em; line-height: 1.08; }
        .pyear { font-size: 12px; color: var(--muted); margin-top: 10px; }

        /* ============================================
       ABOUT
    ============================================ */

        #about { padding: 120px 44px; }
        .about-grid { display: grid; grid-template-columns: 1.1fr 0.9fr; gap: 80px; margin-top: 80px; }
        .about-headshot { width: 100%; max-width: 220px; aspect-ratio: 3/4; object-fit: cover; object-position: center top; border-radius: 8px; margin-bottom: 36px; display: block; }
        .about-bio p { font-size: clamp(17px, 1.7vw, 22px); line-height: 1.62; font-weight: 300; color: var(--muted); margin-bottom: 24px; }
        .about-bio p:last-child { margin-bottom: 0; }
        .about-bio strong { font-weight: 300; color: var(--fg); }
        .about-bio em { font-style: normal; color: var(--accent); }
        .about-side { display: flex; flex-direction: column; gap: 44px; }
        .detail-h { font-size: 10px; letter-spacing: 0.14em; text-transform: uppercase; color: var(--muted); margin-bottom: 16px; }
        .exp-list { display: flex; flex-direction: column; }
        .exp-item { display: flex; justify-content: space-between; align-items: baseline; padding: 14px 0; border-bottom: 1px solid var(--border); gap: 12px; }
        .ei-l { display: flex; flex-direction: column; gap: 2px; }
        .ei-co { font-family: 'Syne', sans-serif; font-size: 14px; font-weight: 700; letter-spacing: -0.01em; }
        .ei-role { font-size: 12px; color: var(--muted); }
        .ei-yr { font-size: 11px; color: var(--muted); white-space: nowrap; flex-shrink: 0; }
        .awards-list { display: flex; flex-direction: column; }
        .award-item { display: flex; justify-content: space-between; align-items: baseline; padding: 14px 0; border-bottom: 1px solid var(--border); gap: 12px; }
        .aw-l { display: flex; flex-direction: column; gap: 2px; }
        .aw-title { font-family: 'Syne', sans-serif; font-size: 14px; font-weight: 700; letter-spacing: -0.01em; }
        .aw-issuer { font-size: 12px; color: var(--muted); }
        .aw-yr { font-size: 11px; color: var(--muted); white-space: nowrap; flex-shrink: 0; }
        .skills-row { display: flex; flex-wrap: wrap; gap: 7px; }
        .skill-pill { font-size: 11px; letter-spacing: 0.06em; padding: 6px 14px; border: 1px solid var(--border); border-radius: 100px; color: var(--muted); }

        /* ============================================
       CONTACT
    ============================================ */

        #contact { padding: 120px 44px 80px; }
        .contact-headline { font-family: 'Syne', sans-serif; font-size: clamp(52px, 9vw, 130px); font-weight: 800; letter-spacing: -0.045em; line-height: 0.88; margin: 56px 0 72px; overflow: hidden; }
        .contact-headline .tl { overflow: hidden; display: block; }
        .contact-headline .tl span { display: block; }
        .contact-headline a { position: relative; display: inline-block; transition: color 0.3s; }
        .contact-headline a::after { content: ''; position: absolute; bottom: 6px; left: 0; width: 0; height: 4px; background: var(--accent); transition: width 0.55s cubic-bezier(0.25, 0.46, 0.45, 0.94); }
        .contact-headline a:hover { color: var(--accent); }
        .contact-headline a:hover::after { width: 100%; }
        .contact-footer { display: flex; justify-content: space-between; align-items: flex-end; padding-top: 36px; }
        .cf-left { display: flex; flex-direction: column; }
        .cf-email-row { display: flex; align-items: center; gap: 8px; }
        .cf-left p { font-size: 13px; color: var(--muted); line-height: 1.7; }
        .copy-btn { display: inline-flex; align-items: center; justify-content: center; background: none; border: none; padding: 2px; cursor: none; color: var(--muted); opacity: 0; transition: opacity 0.2s ease, color 0.2s ease; }
        .cf-email-row:hover .copy-btn { opacity: 1; }
        .copy-btn:hover { color: var(--fg); }
        .copy-btn.copied { color: #00C96B; opacity: 1; }
        .cf-right { display: flex; gap: 24px; }
        .cf-right a { font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase; color: var(--muted); transition: color 0.3s; }
        .cf-right a:hover { color: var(--fg); }
        .copy { font-size: 11px; color: var(--muted); margin-top: 32px; text-align: center; padding-top: 32px; border-top: 1px solid var(--border); }

        /* ============================================
       WORK GRID v2 — 2-col + hover overlay
    ============================================ */

        #work .projects { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        .pcard-new { position: relative; aspect-ratio: 16 / 10; }
        .pcard-bg-new { position: absolute; inset: 0; }
        .play-ring { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 56px; height: 56px; border: 1.5px solid rgba(255,255,255,0.4); border-radius: 50%; display: flex; align-items: center; justify-content: center; padding-left: 3px; opacity: 0; transition: opacity 0.3s ease, border-color 0.25s; z-index: 3; }
        .pcard-new:hover .play-ring { opacity: 1; border-color: rgba(255,255,255,0.9); }
        .pcard-overlay { position: absolute; inset: 0; background: linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.4) 50%, transparent 100%); display: flex; align-items: flex-end; padding: 28px 32px; opacity: 0; transition: opacity 0.35s ease; z-index: 2; }
        .pcard-new:hover .pcard-overlay { opacity: 1; }
        .pcard-overlay-content { display: flex; flex-direction: column; gap: 8px; width: 100%; }
        .pcard-overlay .pnum { font-size: 10px; font-weight: 600; letter-spacing: 0.12em; color: rgba(255,255,255,0.4); }
        .pcard-overlay .pyear { font-size: 11px; letter-spacing: 0.08em; text-transform: uppercase; color: rgba(255,255,255,0.55); margin-top: 0; }
        .pcard-overlay .pname { color: #fff; font-size: clamp(14px, 1.8vw, 20px); line-height: 1.2; letter-spacing: -0.02em; font-weight: 800; }
        .pcard-overlay .tag { border-color: rgba(255,255,255,0.2); color: rgba(255,255,255,0.6); }

        @media (max-width: 640px) {
            #work .projects { grid-template-columns: 1fr; }
            .pcard-overlay { opacity: 1; }
            .play-ring { opacity: 1; }
        }

        /* ============================================
       VIDEO MODAL
    ============================================ */

        .video-modal { position: fixed; inset: 0; z-index: 9998; display: flex; align-items: center; justify-content: center; opacity: 0; pointer-events: none; transition: opacity 0.3s ease; }
        .video-modal.active { opacity: 1; pointer-events: all; }
        .video-modal-bg { position: absolute; inset: 0; background: rgba(0,0,0,0.9); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); }
        .video-modal-inner { position: relative; width: min(960px, 92vw); z-index: 1; }
        .video-embed-wrap { position: relative; padding-bottom: 56.25%; height: 0; border-radius: 10px; overflow: hidden; background: #000; }
        .video-embed-wrap iframe { position: absolute; inset: 0; width: 100%; height: 100%; border: none; }
        .video-modal-close { position: absolute; top: -48px; right: 0; background: none; border: 1px solid rgba(255,255,255,0.25); border-radius: 50%; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; color: rgba(255,255,255,0.8); transition: background 0.2s, border-color 0.2s; }
        .video-modal-close:hover { background: rgba(255,255,255,0.15); border-color: rgba(255,255,255,0.5); }

        /* ============================================
       UTILITIES
    ============================================ */

        .sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0,0,0,0); white-space: nowrap; border: 0; }

        /* ============================================
       RESPONSIVE
    ============================================ */

        @media (max-width: 900px) {
            nav { padding: 18px 24px; }
            nav.scrolled { top: 12px; left: 16px; right: 16px; padding: 12px 20px; }
            #hero { padding: 0 24px max(40px, calc(40px + env(safe-area-inset-bottom))); }
            .hero-bottom { flex-direction: column; align-items: flex-start; }
            .hero-right { align-items: flex-start; }
            .scroll-hint { top: auto; bottom: 56px; }
            #work, #about, #contact { padding: 80px 24px; }
            .s-header { margin-bottom: 40px; }
            .about-grid { grid-template-columns: 1fr; gap: 48px; margin-top: 48px; }
            .contact-footer { flex-direction: column; gap: 24px; align-items: flex-start; }
            .nav-links { display: none; }
        }

        @media (max-width: 480px) {
            .hero-title { font-size: 15vw; hyphens: manual; overflow-wrap: break-word; }
            .s-title { font-size: 14vw; }
            .pname { font-size: 7vw; }
        }

        @media (prefers-reduced-motion: reduce) {
            .marquee-track { animation: none; }
            .sh-line::after { animation: none; }
            .pill-dot { animation: none; }
        }
    </style>
</head>

<body>

    <!-- PRELOADER -->
    <div id="preloader" aria-hidden="true">
        <div class="pl-name"><span>${esc(s.preloaderName || s.siteTitle.split('—')[0].trim())}</span></div>
        <div class="pl-bar-wrap"><div class="pl-bar" id="plBar"></div></div>
    </div>

    <!-- CURSOR -->
    <div class="cursor" id="cursor" aria-hidden="true">
        <div class="cursor-arrow">
            <svg width="22" height="26" viewBox="0 0 22 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2 2L2 21L6.8 16.2L10.4 24L13.4 22.6L9.8 14.8L17 14.8L2 2Z" fill="white" stroke="#0C0C0B" stroke-width="1.4" stroke-linejoin="round" stroke-linecap="round"/>
            </svg>
        </div>
        <div class="cursor-label" id="cursorLabel">
            <span class="cursor-label-dot"></span>
            <span id="cursorLabelText">Guest</span>
        </div>
    </div>

    <!-- NAV -->
    <nav id="nav">
        <a href="#hero" class="nav-logo">${esc(s.navLogo)}</a>
        <div class="nav-right">
            <ul class="nav-links">
                <li><a href="#work">Work</a></li>
                <li><a href="#about">About</a></li>
                <li><a href="#contact">Contact</a></li>
            </ul>
            <button class="theme-btn" id="themeBtn" aria-label="Toggle colour scheme">
                <span class="t-icon" id="tIcon">◐</span>
                <span id="tLabel">Light</span>
            </button>
        </div>
    </nav>

    <main>

        <!-- HERO -->
        <section id="hero">
            <p class="hero-eyebrow"><span>${esc(h.eyebrow)}</span></p>
            <h1 class="hero-title">
                <span class="tl"><span>${esc(h.nameLineOne)}</span></span>
                <span class="tl"><span>${esc(h.nameLineTwo)}</span></span>
            </h1>
            <div class="hero-bottom">
                <p class="hero-desc"><span>${esc(h.description)}</span></p>
                <div class="hero-right">
                    ${pillsHtml}
                </div>
            </div>
            <div class="scroll-hint" aria-hidden="true">
                <div class="sh-line"></div>
                <span>Scroll</span>
            </div>
        </section>

        <!-- MARQUEE -->
        <div class="marquee-wrap" aria-hidden="true">
            <div class="marquee-track">
                ${marqueeHtml}
            </div>
        </div>

        <!-- WORK -->
        <section id="work">
            <div class="s-header">
                <div>
                    <p class="s-label">Selected Projects</p>
                    <h2 class="s-title"><span class="tl"><span>Work</span></span></h2>
                </div>
            </div>
            <div class="projects">
                ${workCardsHtml}
            </div>
            <div class="pdf-strip" style="margin-top:48px;padding-top:48px;border-top:1px solid var(--border);display:flex;align-items:center;justify-content:space-between;gap:24px;flex-wrap:wrap;">
                <div>
                    <p style="font-size:14px;font-weight:600;color:var(--fg);margin-bottom:4px;">Looking for more?</p>
                    <p style="font-size:13px;color:var(--muted);line-height:1.5;">Additional work is available as a PDF, including projects from earlier in my career.</p>
                </div>
                <a href="${pdfUrl}" class="cv-btn">
                    View PDF
                    <svg width="12" height="12" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12L12 2M12 2H4M12 2V10"/></svg>
                </a>
            </div>
        </section>

        <!-- ABOUT -->
        <section id="about">
            <div class="s-header">
                <div>
                    <p class="s-label">My story</p>
                    <h2 class="s-title"><span class="tl"><span>About</span></span></h2>
                </div>
            </div>
            <div class="about-grid">
                <div class="about-bio">
                    ${about.headshotUrl ? `<img class="about-headshot" src="${escAttr(about.headshotUrl)}" alt="Wondu Dikran" />` : ''}
                    ${about.bioHtml}
                    <a href="${cvUrl}" class="cv-btn" style="margin-top:20px;">
                        View CV
                        <svg width="12" height="12" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12L12 2M12 2H4M12 2V10"/></svg>
                    </a>
                </div>
                <div class="about-side">
                    <div>
                        <h3 class="detail-h">IMDB Credits</h3>
                        <ul class="exp-list">
                            ${creditsHtml}
                        </ul>
                        <a href="${imdbUrl}" target="_blank" rel="noopener" class="cv-btn" style="margin-top:16px;">
                            View full profile on IMDB
                            <svg width="12" height="12" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12L12 2M12 2H4M12 2V10"/></svg>
                        </a>
                    </div>
                    <div>
                        <h3 class="detail-h">Awards &amp; Recognition</h3>
                        <ul class="awards-list">
                            ${awardsHtml}
                        </ul>
                        <h3 class="detail-h" style="margin-top:32px;">Press</h3>
                        <ul class="awards-list">
                            ${pressHtml}
                        </ul>
                    </div>
                    <div>
                        <h3 class="detail-h">Skills</h3>
                        <div class="skills-row">
                            ${skillsHtml}
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- CONTACT -->
        <section id="contact">
            <p class="s-label">${esc(c.sectionLabel)}</p>
            <div class="contact-headline">
                <span class="tl"><span>${esc(c.headlineLineOne)}</span></span>
                <span class="tl">
                    <span><a href="mailto:${escAttr(email)}" data-cursor="hi">${esc(c.headlineLineTwo)} <svg width="0.7em" height="0.7em" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" style="display:inline-block;vertical-align:middle;margin-bottom:0.12em;"><path d="M3 15L15 3M15 3H5M15 3V13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></a></span>
                </span>
            </div>
            <div class="contact-footer">
                <div class="cf-left">
                    <div class="cf-email-row">
                        <p>${esc(email)}</p>
                        <button class="copy-btn" id="copyEmailBtn" aria-label="Copy email address">
                            <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round">
                                <rect x="4.5" y="4.5" width="7" height="7" rx="1.2"/>
                                <path d="M1.5 8.5V2.5a1 1 0 0 1 1-1h6"/>
                            </svg>
                        </button>
                    </div>
                    <p>${esc(s.location)}</p>
                </div>
                <div class="cf-right">
                    <a href="mailto:${escAttr(email)}" data-cursor="hi">Email</a>
                    ${socialHtml}
                </div>
            </div>
            <p class="copy">${esc(s.copyrightText)}</p>
        </section>

    </main>

    <!-- VIDEO MODAL -->
    <div id="videoModal" class="video-modal" role="dialog" aria-modal="true" aria-label="Video player">
        <div class="video-modal-bg" onclick="closeVideo()"></div>
        <div class="video-modal-inner">
            <button class="video-modal-close" onclick="closeVideo()" aria-label="Close video">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round">
                    <path d="M2 2l10 10M12 2L2 12"/>
                </svg>
            </button>
            <div class="video-embed-wrap">
                <iframe id="videoFrame" src="" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe>
            </div>
        </div>
    </div>

    <!-- SCRIPTS -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"></script>
    <script>
        /* ---- THEME ---- */
        const html = document.documentElement;
        const tBtn = document.getElementById('themeBtn');
        const tIcon = document.getElementById('tIcon');
        const tLabel = document.getElementById('tLabel');
        let dark = (localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')) === 'dark';
        tIcon.textContent = dark ? '◐' : '◑';
        tLabel.textContent = dark ? 'Light' : 'Dark';
        tBtn.addEventListener('click', () => {
            dark = !dark;
            html.setAttribute('data-theme', dark ? 'dark' : 'light');
            localStorage.setItem('theme', dark ? 'dark' : 'light');
            tIcon.textContent = dark ? '◐' : '◑';
            tLabel.textContent = dark ? 'Light' : 'Dark';
        });

        /* ---- CURSOR ---- */
        if (window.matchMedia('(pointer: fine)').matches) {
            const cursorEl = document.getElementById('cursor');
            document.addEventListener('mousemove', e => {
                cursorEl.style.transform = \`translate(\${e.clientX}px, \${e.clientY}px)\`;
                cursorEl.style.opacity = '1';
            });
            document.addEventListener('mouseleave', () => { cursorEl.style.opacity = '0'; });
            document.addEventListener('mouseenter', () => { cursorEl.style.opacity = '1'; });
            document.querySelectorAll('a, button, .pcard:not(.pcard--wip)').forEach(el => {
                el.addEventListener('mouseenter', () => {
                    document.body.classList.add('is-hovering');
                    const t = document.getElementById('cursorLabelText');
                    if (t && el.dataset.cursor === 'hi') {
                        t.style.opacity = '0';
                        setTimeout(() => { t.textContent = 'Say hi! 👋'; t.style.opacity = '1'; }, 120);
                    }
                });
                el.addEventListener('mouseleave', () => {
                    document.body.classList.remove('is-hovering');
                    const t = document.getElementById('cursorLabelText');
                    if (t && t.textContent !== 'Guest') {
                        t.style.opacity = '0';
                        setTimeout(() => { t.textContent = 'Guest'; t.style.opacity = '1'; }, 120);
                    }
                });
            });
        }

        /* ---- PRELOADER ---- */
        const preloader = document.getElementById('preloader');
        const plBar = document.getElementById('plBar');
        const plName = document.querySelector('.pl-name span');
        gsap.registerPlugin(ScrollTrigger);

        if (sessionStorage.getItem('wndkrn_visited')) {
            preloader.style.display = 'none';
            heroIn();
        } else {
            sessionStorage.setItem('wndkrn_visited', '1');
            gsap.to(plName, { y: 0, duration: 0.7, ease: 'power3.out', delay: 0.1 });
            setTimeout(() => { plBar.style.width = '100%'; }, 150);
            setTimeout(() => {
                gsap.to(preloader, {
                    yPercent: -100, duration: 0.9, ease: 'power3.inOut',
                    onComplete: () => { preloader.style.display = 'none'; heroIn(); }
                });
            }, 1300);
        }

        /* ---- HERO ENTRANCE ---- */
        function heroIn() {
            gsap.set('.nav-logo', { opacity: 0 });
            gsap.set('.nav-right', { opacity: 0 });
            gsap.set('.pill', { opacity: 0, x: 32 });
            gsap.to(['.nav-logo', '.nav-right'], { opacity: 1, duration: 0.7, stagger: 0.12, ease: 'power2.out' });
            gsap.to('.hero-title .tl span', { y: 0, duration: 1.05, stagger: 0.1, ease: 'power3.out', delay: 0.05 });
            gsap.to('.hero-eyebrow span', { y: 0, duration: 0.75, ease: 'power3.out', delay: 0.5 });
            gsap.set('.hero-desc', { opacity: 0, y: 16 });
            gsap.to('.hero-desc', { opacity: 1, y: 0, duration: 0.75, ease: 'power2.out', delay: 0.65 });
            gsap.to('.pill', { x: 0, opacity: 1, duration: 0.55, stagger: 0.1, ease: 'power2.out', delay: 0.75 });
            gsap.to('.scroll-hint', { opacity: 1, duration: 0.6, delay: 1.2 });
            initScroll();
        }

        /* ---- SCROLL ANIMATIONS ---- */
        function initScroll() {
            gsap.set('.pcard:not([hidden])', { opacity: 0, y: 40 });
            gsap.set('.pdf-strip', { opacity: 0, y: 24 });
            gsap.set('.about-bio .cv-btn', { opacity: 0, y: 16 });
            if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
                document.querySelectorAll('.pcard:not([hidden]), .pdf-strip, .about-bio .cv-btn').forEach(el => {
                    el.style.opacity = '1'; el.style.transform = 'none';
                });
                return;
            }
            gsap.utils.toArray('.s-title').forEach(el => {
                gsap.to(el.querySelectorAll('.tl span'), { y: 0, duration: 1.05, stagger: 0.08, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 88%' } });
            });
            gsap.utils.toArray('.pcard:not([hidden])').forEach((el, i) => {
                gsap.to(el, { opacity: 1, y: 0, duration: 0.75, ease: 'power2.out', delay: i * 0.08, scrollTrigger: { trigger: el, start: 'top 88%' } });
            });
            gsap.utils.toArray('.about-bio p').forEach((el, i) => {
                gsap.fromTo(el, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.65, delay: i * 0.08, ease: 'power2.out', scrollTrigger: { trigger: el, start: 'top 90%' } });
            });
            gsap.to('.pdf-strip', { opacity: 1, y: 0, duration: 0.65, ease: 'power2.out', scrollTrigger: { trigger: '.pdf-strip', start: 'top 88%' } });
            gsap.to('.about-bio .cv-btn', { opacity: 1, y: 0, duration: 0.65, ease: 'power2.out', scrollTrigger: { trigger: '.about-bio .cv-btn', start: 'top 92%' } });
            gsap.utils.toArray('.about-side > div').forEach((el, i) => {
                gsap.fromTo(el, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.65, delay: i * 0.1, ease: 'power2.out', scrollTrigger: { trigger: el, start: 'top 88%' } });
            });
            gsap.utils.toArray('.contact-headline .tl span').forEach((el, i) => {
                gsap.fromTo(el, { y: '110%' }, { y: '0%', duration: 0.9, delay: i * 0.12, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 90%' } });
            });
            gsap.fromTo('.contact-footer', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out', scrollTrigger: { trigger: '.contact-footer', start: 'top 90%' } });
            setTimeout(() => ScrollTrigger.refresh(), 400);
            window.addEventListener('load', () => ScrollTrigger.refresh());
        }

        /* ---- NAV SCROLL STATE ---- */
        const navEl = document.getElementById('nav');
        let navScrolled = false;
        window.addEventListener('scroll', () => {
            const shouldScroll = window.scrollY > 60;
            if (shouldScroll === navScrolled) return;
            navScrolled = shouldScroll;
            navEl.classList.toggle('scrolled', shouldScroll);
        }, { passive: true });

        /* ---- SMOOTH ANCHOR SCROLL ---- */
        document.querySelectorAll('a[href^="#"]').forEach(a => {
            a.addEventListener('click', e => {
                const target = document.querySelector(a.getAttribute('href'));
                if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
            });
        });

        /* ---- VIDEO MODAL ---- */
        function openVideo(platform, id) {
            const frame = document.getElementById('videoFrame');
            const modal = document.getElementById('videoModal');
            let src = '';
            if (platform === 'youtube') {
                src = \`https://www.youtube.com/embed/\${id}?autoplay=1&rel=0\`;
            } else if (platform === 'youtube-playlist') {
                src = \`https://www.youtube.com/embed/videoseries?list=\${id}&autoplay=1\`;
            } else if (platform === 'vimeo') {
                src = \`https://player.vimeo.com/video/\${id}?autoplay=1\`;
            } else if (platform === 'vimeo-hash') {
                const [vid, hash] = id.split('/');
                src = \`https://player.vimeo.com/video/\${vid}?h=\${hash}&autoplay=1\`;
            }
            frame.src = src;
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }

        function closeVideo() {
            document.getElementById('videoFrame').src = '';
            document.getElementById('videoModal').classList.remove('active');
            document.body.style.overflow = '';
        }

        document.addEventListener('keydown', e => { if (e.key === 'Escape') closeVideo(); });

        /* ---- COPY EMAIL ---- */
        const copyBtn = document.getElementById('copyEmailBtn');
        if (copyBtn) {
            copyBtn.addEventListener('click', () => {
                navigator.clipboard.writeText('${emailJs}').then(() => {
                    copyBtn.classList.add('copied');
                    copyBtn.innerHTML = '<svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M2 7l3.5 3.5L11 3"/></svg>';
                    setTimeout(() => {
                        copyBtn.classList.remove('copied');
                        copyBtn.innerHTML = '<svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><rect x="4.5" y="4.5" width="7" height="7" rx="1.2"/><path d="M1.5 8.5V2.5a1 1 0 0 1 1-1h6"/></svg>';
                    }, 2000);
                });
            });
        }
    </script>
</body>
</html>`
}
