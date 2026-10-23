# Erfan Jahanparast

Personal academic website: https://erfan-jp.github.io/

Edit `content.js` for biography, news, publications, experience, projects, and search metadata (`site`). Edit `style.css` for styling and `scripts/render.mjs` for HTML rendering. Assets live in `assets/`.

After editing content or rendering, regenerate the published files with Node.js 22 or newer (no dependency installation is needed):

```sh
node scripts/build.mjs
node scripts/build.mjs --check
node --test
```

Commit `index.html`, `sitemap.xml`, and `robots.txt` along with the source changes. The homepage is complete HTML and works without JavaScript. The check command fails if any generated file is missing or does not match its source.

GitHub Pages publishes the root of the `main` branch. Push changes to `main` to update the website.

After publication, add `https://erfan-jp.github.io/` as a URL-prefix property in [Google Search Console](https://search.google.com/search-console/). Use Google's supplied HTML verification file, or set `site.googleSiteVerification` in `content.js` to the supplied meta tag's `content` value and rebuild. Both methods retain verification across future builds. Submit `https://erfan-jp.github.io/sitemap.xml`, inspect the homepage, and request indexing. Search Console ownership and profile-link updates require access to your Google/LinkedIn/GitHub accounts.
