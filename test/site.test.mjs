import assert from 'node:assert/strict';
import { cpSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import vm from 'node:vm';
import test from 'node:test';
import { escapeHtml, linkedText, renderFiles } from '../scripts/render.mjs';

const root = new URL('../', import.meta.url);
const read = name => readFileSync(new URL(name, root), 'utf8');
const context = vm.createContext({ window: {} });
vm.runInContext(read('content.js'), context);
const profile = JSON.parse(JSON.stringify(context.window.PROFILE));
const html = read('index.html');

test('published HTML includes the complete profile without executable JavaScript', () => {
  assert.equal((html.match(/<h1\b/g) || []).length, 1);
  assert.ok(html.includes(`<h1 id="name">${escapeHtml(profile.name)}</h1>`));
  assert.equal((html.match(/<article class="paper">/g) || []).length,
    profile.publications.length + profile.projects.length);
  assert.equal((html.match(/<article class="entry/g) || []).length, profile.experience.length);
  for (const item of [...profile.publications, ...profile.projects]) {
    assert.ok(html.includes(escapeHtml(item.title)), `Missing title: ${item.title}`);
    assert.ok(html.includes(escapeHtml(item.description)), `Missing description: ${item.title}`);
    for (const url of Object.values(item.links).filter(Boolean)) assert.ok(html.includes(`href="${escapeHtml(url)}"`));
  }
  for (const item of profile.news) assert.ok(html.includes(escapeHtml(item.date)));
  for (const { url } of profile.bioLinks) assert.ok(html.includes(`href="${escapeHtml(url)}"`));
  assert.equal((html.match(/<script\b/g) || []).length, 1);
  assert.match(html, /<script type="application\/ld\+json">/);
  assert.doesNotMatch(html, /<script[^>]*src=|<noscript>|requires JavaScript/);
  assert.match(html, /<strong>Erfan Jahanparast\*<\/strong>/);
  assert.match(html, /Code \(coming soon\)/);
});

test('search metadata and structured identity agree with the visible profile', () => {
  assert.ok(html.includes(`<title>${escapeHtml(profile.site.title)}</title>`));
  assert.ok(html.includes(`<meta name="description" content="${escapeHtml(profile.site.description)}">`));
  assert.ok(html.includes(`<link rel="canonical" href="${profile.site.url}">`));
  const data = JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]);
  const byType = Object.fromEntries(data['@graph'].map(item => [item['@type'], item]));
  assert.equal(byType.Person.name, profile.name);
  assert.equal(byType.Person.worksFor.name, profile.experience.find(item => /present/i.test(item.dates)).org);
  assert.deepEqual(byType.Person.sameAs, [profile.scholar, profile.linkedin]);
  assert.equal(byType.ProfilePage.mainEntity['@id'], byType.Person['@id']);
  assert.equal(byType.WebSite.name, profile.name);
  for (const item of data['@graph']) assert.equal(item.url, profile.site.url);
  assert.doesNotMatch(html, /name="robots"[^>]*noindex/);
});

test('discovery files list only the canonical homepage and allow crawling', () => {
  const sitemap = read('sitemap.xml');
  assert.equal((sitemap.match(/<loc>/g) || []).length, 1);
  assert.ok(sitemap.includes(`<loc>${profile.site.url}</loc>`));
  assert.match(sitemap, /xmlns="http:\/\/www.sitemaps.org\/schemas\/sitemap\/0.9"/);
  assert.equal(read('robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${profile.site.url}sitemap.xml\n`);
});

test('build detects stale content and regenerates correctly from another working directory', t => {
  const directory = mkdtempSync(join(tmpdir(), 'erfan-site-test-'));
  t.after(() => rmSync(directory, { recursive: true, force: true }));
  cpSync(new URL('scripts/', root), join(directory, 'scripts'), { recursive: true });
  for (const name of ['content.js', 'index.html', 'sitemap.xml', 'robots.txt']) {
    writeFileSync(join(directory, name), read(name));
  }
  const run = (...args) => spawnSync(process.execPath, [join(directory, 'scripts/build.mjs'), ...args],
    { cwd: tmpdir(), encoding: 'utf8' });
  assert.equal(run('--check').status, 0);
  writeFileSync(join(directory, 'content.js'), `${read('content.js')}\nwindow.PROFILE.news.push({date: 'Test date', text: 'A newly added research update.'});\n`);
  const stale = run('--check');
  assert.equal(stale.status, 1);
  assert.match(stale.stderr, /index.html is missing or stale/);
  assert.equal(run().status, 0);
  assert.ok(readFileSync(join(directory, 'index.html'), 'utf8').includes('A newly added research update.'));
  assert.equal(run('--check').status, 0);
});

test('profile text and verification tokens remain safe HTML and JSON', () => {
  const modified = structuredClone(profile);
  modified.name = 'Researcher </script><img src=x onerror="alert(1)">';
  modified.site.title = modified.name;
  modified.site.googleSiteVerification = 'verification" & token';
  modified.bio = ['A **bold & clear** statement with <markup>.'];
  const result = renderFiles(modified)['index.html'];
  assert.ok(result.includes('<strong>bold &amp; clear</strong>'));
  assert.ok(result.includes('&lt;markup&gt;'));
  assert.ok(result.includes('content="verification&quot; &amp; token"'));
  assert.equal((result.match(/<script\b/g) || []).length, 1);
  const data = JSON.parse(result.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]);
  assert.equal(data['@graph'].find(item => item['@type'] === 'Person').name, modified.name);
  assert.throws(() => linkedText('unsafe', [{ text: 'unsafe', url: 'javascript:alert(1)' }]), /Unsupported link URL/);
  assert.equal(linkedText('Complete text', [{ text: '', url: 'https://example.com/' }]), 'Complete text');
});

test('invalid canonical URLs fail instead of generating conflicting discovery metadata', () => {
  for (const url of ['http://example.com/', 'https://example.com/path', 'https://example.com', 'https://example.com/?test=1']) {
    const modified = structuredClone(profile);
    modified.site.url = url;
    assert.throws(() => renderFiles(modified));
  }
});
