// All profile text is escaped before it becomes HTML. Only our own SVGs and
// the supported **bold** markers generate markup.
export function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, character => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[character]);
}

function link(label, url, attributes = '') {
  if (!url) return `<span class="missing">${escapeHtml(label)} [add link]</span>`;
  if (!/^(https?:|mailto:)/i.test(url) && !/^(?![\/\\]|.*:)[^\s]+$/.test(url)) {
    throw new Error(`Unsupported link URL: ${url}`);
  }
  const rel = url.startsWith('https://') ? ' rel="noopener noreferrer"' : '';
  return `<a href="${escapeHtml(url)}"${rel}${attributes}>${escapeHtml(label)}</a>`;
}

export function linkedText(text, links = []) {
  let result = '';
  let offset = 0;
  while (offset < text.length) {
    let next;
    for (const item of links) {
      if (!item.text) continue;
      const position = text.indexOf(item.text, offset);
      if (position >= 0 && (!next || position < next.position)) next = { ...item, position };
    }
    if (!next) return result + escapeHtml(text.slice(offset));
    result += escapeHtml(text.slice(offset, next.position)) + link(next.text, next.url);
    offset = next.position + next.text.length;
  }
  return result;
}

function biography(profile) {
  return profile.bio.map(text => `<p>${text.split(/(\*\*[^*]+\*\*)/).map(part =>
    part.startsWith('**') && part.endsWith('**')
      ? `<strong>${linkedText(part.slice(2, -2), profile.bioLinks)}</strong>`
      : linkedText(part, profile.bioLinks)
  ).join('')}</p>`).join('\n');
}

const socialIcons = {
  Email: '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2.5" y="4.5" width="19" height="15" rx="2"/><path d="m3 6 9 7 9-7"/></svg>',
  Scholar: '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="currentColor"><path d="M12 1 0 10l4.7 3.6a8.2 8.2 0 0 1 14.6 0L24 10 12 1Z"/><circle cx="12" cy="17" r="6.5"/></svg>',
  LinkedIn: '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="currentColor"><path d="M20.4 2H3.6C2.7 2 2 2.7 2 3.6v16.8c0 .9.7 1.6 1.6 1.6h16.8c.9 0 1.6-.7 1.6-1.6V3.6c0-.9-.7-1.6-1.6-1.6ZM8 18.7H5V9h3v9.7ZM6.5 7.7a1.7 1.7 0 1 1 0-3.4 1.7 1.7 0 0 1 0 3.4Zm12.2 11h-3v-4.8c0-1.1-.1-2.4-1.5-2.4s-1.8 1.1-1.8 2.3v4.9h-3V9h2.9v1.3h.1c.4-.8 1.4-1.6 2.8-1.6 3 0 3.5 1.9 3.5 4.4v5.6Z"/></svg>'
};

function social(profile) {
  return [['Email', `mailto:${profile.email}`], ['Scholar', profile.scholar], ['LinkedIn', profile.linkedin]]
    .filter(([, url]) => url)
    .map(([label, url]) => {
      const name = label === 'Scholar' ? 'Google Scholar' : label;
      return link('', url, ` class="social-icon" aria-label="${name}" title="${name}"`)
        .replace('</a>', `${socialIcons[label]}</a>`);
    }).join('');
}

function portrait(profile) {
  if (profile.portrait) return `<img src="${escapeHtml(profile.portrait)}" alt="${escapeHtml(profile.name)}">`;
  return '<svg viewBox="0 0 120 120" aria-hidden="true"><circle cx="60" cy="40" r="22" fill="currentColor"/><path d="M18 108c0-30 18-45 42-45s42 15 42 45" fill="currentColor"/></svg><span>[Add your portrait]</span>';
}

function paper(item, name) {
  let figure;
  if (item.image) {
    const dimensions = item.imageWidth && item.imageHeight
      ? ` width="${escapeHtml(item.imageWidth)}" height="${escapeHtml(item.imageHeight)}"` : '';
    const image = `<img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.imageAlt || `${item.title} research figure`)}" loading="lazy"${dimensions}>`;
    const panel = item.imagePanel === 'left' ? `<div class="figure-left-panel">${image}</div>` : image;
    const label = `View full-size ${item.imageLabel || 'figure'} for ${item.title} (opens in a new tab)`;
    figure = `<div class="figure has-image"><a class="figure-link" href="${escapeHtml(item.image)}" target="_blank" rel="noopener noreferrer" aria-label="${escapeHtml(label)}">${panel}<span class="figure-caption">${escapeHtml(item.imageLabel || 'Figure')} · View full size ↗</span></a></div>`;
  } else {
    figure = `<div class="figure"><strong>${escapeHtml(item.tag)}</strong><span>[Add research figure]</span></div>`;
  }
  const firstLink = Object.values(item.links).find(Boolean);
  const title = firstLink ? link(item.title, firstLink) : escapeHtml(item.title);
  const authors = item.authors ? `<p class="authors">${item.authors.split(name).map((part, index) => {
    // Keep the equal-contribution asterisk inside the highlighted author name.
    const previousName = index ? `<strong>${escapeHtml(name)}${part.startsWith('*') ? '*' : ''}</strong>` : '';
    return previousName + `<span>${escapeHtml(index && part.startsWith('*') ? part.slice(1) : part)}</span>`;
  }).join('')}</p><p class="venue">${escapeHtml(item.venue)}</p>` : '';
  const links = Object.entries(item.links).map(([label, url]) => {
    const status = item.linkStatuses?.[label];
    return !url && status ? `<span class="missing">${escapeHtml(label)} (${escapeHtml(status)})</span>` : link(label, url);
  }).join('');
  return `<article class="paper">${figure}<div><h3>${title}</h3>${authors}${links ? `<div class="paper-links">${links}</div>` : ''}<p>${escapeHtml(item.description)}</p></div></article>`;
}

function experience(items) {
  return items.map(item => {
    const logo = item.logo ? `<div class="entry-logo"><img src="${escapeHtml(item.logo)}" alt="${escapeHtml(item.logoAlt || `${item.org} logo`)}" loading="lazy" width="112" height="84"></div>` : '';
    const details = ['location', 'advisor', 'text'].filter(key => item[key]).map(key =>
      `<p${key === 'text' ? '' : ` class="${key}"`}>${key === 'advisor' ? 'Advisor: ' : ''}${escapeHtml(item[key])}</p>`
    ).join('');
    return `<article class="entry${logo ? ' has-logo' : ''}">${logo}<div class="entry-content"><div class="entry-head"><h3>${escapeHtml(item.org)}</h3><span class="date">${escapeHtml(item.dates)}</span></div><p class="role">${escapeHtml(item.role)}</p>${details}</div></article>`;
  }).join('\n');
}

export function structuredData(profile) {
  const url = profile.site.url;
  const current = profile.experience.find(item => /present/i.test(item.dates));
  return {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'WebSite', '@id': `${url}#website`, url, name: profile.name,
        publisher: { '@id': `${url}#person` } },
      { '@type': 'ProfilePage', '@id': `${url}#webpage`, url, name: profile.site.title,
        description: profile.site.description, isPartOf: { '@id': `${url}#website` },
        mainEntity: { '@id': `${url}#person` } },
      { '@type': 'Person', '@id': `${url}#person`, name: profile.name, url,
        ...(profile.portrait ? { image: new URL(profile.portrait, url).href } : {}),
        ...(current ? { jobTitle: current.role, worksFor: { '@type': 'Organization', name: current.org } } : {}),
        sameAs: [profile.scholar, profile.linkedin].filter(Boolean) }
    ]
  };
}

export function renderPage(profile) {
  // Escape '<' in JSON so profile strings cannot terminate the script element.
  const schema = JSON.stringify(structuredData(profile), null, 2).replace(/</g, '\\u003c');
  return `<!doctype html>
<!-- Generated from content.js by scripts/build.mjs. Run: node scripts/build.mjs -->
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>${escapeHtml(profile.site.title)}</title>
  <meta name="description" content="${escapeHtml(profile.site.description)}">
${profile.site.googleSiteVerification ? `  <meta name="google-site-verification" content="${escapeHtml(profile.site.googleSiteVerification)}">\n` : ''}\
  <link rel="canonical" href="${escapeHtml(profile.site.url)}">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="${escapeHtml(profile.name)}">
  <meta property="og:title" content="${escapeHtml(profile.site.title)}">
  <meta property="og:description" content="${escapeHtml(profile.site.description)}">
  <meta property="og:url" content="${escapeHtml(profile.site.url)}">
  <meta name="theme-color" content="#ffffff">
  <link rel="icon" href="assets/favicon.svg" type="image/svg+xml">
  <link rel="stylesheet" href="style.css">
  <script type="application/ld+json">
${schema}
  </script>
</head>
<body>
<a class="skip" href="#main">Skip to content</a>
<main id="main">
  <header class="intro">
    <div><h1 id="name">${escapeHtml(profile.name)}</h1><div id="bio">${biography(profile)}</div><div class="social" id="social">${social(profile)}</div></div>
    <div id="portrait" class="portrait">${portrait(profile)}</div>
  </header>
  <section id="news"><h2>News</h2><ul class="news" id="news-list">${profile.news.map(item => `<li><span class="date">${escapeHtml(item.date)}</span><span>${linkedText(item.text, item.links)}</span></li>`).join('\n')}</ul></section>
  <section id="publications"><h2>Publications and preprints</h2><p class="note">* denotes equal contribution</p><div id="publication-list">${profile.publications.map(item => paper(item, profile.name)).join('\n')}</div></section>
  <section id="experience"><h2>Experience</h2><div id="experience-list">${experience(profile.experience)}</div></section>
  <section id="projects"><h2>Selected research projects</h2><div id="project-list">${profile.projects.map(item => paper(item, profile.name)).join('\n')}</div></section>
</main>
</body>
</html>
`;
}

export function renderFiles(profile) {
  const url = new URL(profile.site.url);
  if (url.protocol !== 'https:' || url.pathname !== '/' || url.search || url.hash || url.username || url.password) {
    throw new Error('site.url must be an HTTPS homepage URL ending in /');
  }
  // Canonical, JSON-LD, sitemap, and robots all use the exact same URL.
  if (url.href !== profile.site.url) throw new Error('site.url must use its normalized form, including the trailing /');
  return {
    'index.html': renderPage(profile),
    'sitemap.xml': `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url><loc>${escapeHtml(url.href)}</loc></url>\n</urlset>\n`,
    'robots.txt': `User-agent: *\nAllow: /\n\nSitemap: ${new URL('sitemap.xml', url).href}\n`
  };
}
