# EDS Lab

Personal Adobe Edge Delivery Services project by Roy Guadalupe Suárez, built on
[adobe/aem-boilerplate](https://github.com/adobe/aem-boilerplate) and authored in
Document Authoring (da.live).

It runs the same blocks as the portfolio at [webpro123.com/roy](https://webpro123.com/roy/),
which is a PHP site that paints its content as EDS block markup and loads it with the
boilerplate's `aem.js`. Here the markup comes from documents instead, so the Lab shows that
the blocks work unchanged against real authored content.

## What it shows

- **Blocks** (`blocks/`): `hero`, `cards`, `case-study`, `timeline`, `skills`, `education`,
  `beyond-code`, `contact`, plus a small `header` that reads `/nav`. Each `decorate()` finds
  its pieces by content (picture, heading, list) instead of by position, so authors can
  leave out or reorder cells.
- **Three-phase loading** (`scripts/scripts.js`): the hero is the only eager block; the rest
  load in the lazy phase; `scripts/delayed.js` loads after 3 s.
- **Block inspector**: the "Show blocks" button in the header outlines each block with its
  name, its loading phase and when it finished loading.
- **A React block**: `timeline` arrives as plain rows; when it gets close to the viewport,
  `timeline.js` imports `timeline-app.js` (React 18, built from `src-react/` with Vite) to add
  a technology filter and expandable details. It works without React.
- **Performance**: one self-hosted variable font with `font-display: optional` and a metric-
  adjusted fallback (no layout shift), images as `<picture>`, lazy below the fold. The portfolio
  scores 96 (mobile) / 99 (desktop) in Lighthouse with CLS 0.

## Local development

```bash
npm install
npm run import        # portfolio -> drafts/ (local preview) and da/ (documents for da.live)
npm run up            # aem up --html-folder drafts --html-mount /  -> http://localhost:3000/
npm run build:react   # src-react/timeline-app.jsx -> blocks/timeline/timeline-app.js
npm run lint
```

`npm run up` needs the AEM CLI (`npm install -g @adobe/aem-cli`, Node 18 or later). Once the
site is connected, plain `aem up` serves the da.live content instead of `drafts/`.

`npm run import` reads `http://webpro123.local/roy/` by default (`-- --base <url>` for another
one): the portfolio's `<main>` is already block markup, so the importer only rewrites images
and links, and adds a metadata block with `Robots: noindex, nofollow`.

Not served by EDS (`.hlxignore`): `src-react/`, `tools/`, `drafts/`, `da/`, `vite.config.mjs`.
`drafts/` and `da/` are not versioned either: the content lives in da.live, so the repository
holds code only.
`blocks/timeline/timeline-app.js` is a build output, committed because EDS has no build step.

## Setup (accounts)

1. Create an empty repository on GitHub (public or private; no README, `.gitignore` or license,
   they are already here), then `git remote add origin <your repo>` and `git push -u origin main`.
2. Install the [AEM Code Sync](https://github.com/apps/aem-code-sync/installations/new) app
   for that repository only, and complete its setup screen to the end ("Finish"): it creates the
   site configuration. Add as admin the email you sign in to da.live with. `fstab.yaml` points
   the content to `https://content.da.live/<owner>/<repo>/`. Until this step is done, every URL
   answers `x-error: Missing configuration`.
3. In [da.live](https://da.live/), check the account menu: the active Adobe profile must be the
   one you added as admin (a work profile under the same login gets "Not permitted"). Then drag
   in the content of `da/`: `index.html`, `nav.html`, `footer.html` and the `media/` folder.
   Images are JPEG because da.live's drag and drop silently skips WebP files.
4. Preview and publish `nav`, `footer` and `index` (in that order) from da.live or the AEM
   Sidekick extension.
5. The site is then at `https://main--<repo>--<owner>.aem.page/` (preview) and `.aem.live`.

Every page carries `Robots: noindex, nofollow` in its metadata block: the Lab is meant to be
shown, not indexed.

## Licenses

Boilerplate code, including the unmodified `scripts/aem.js`: Apache License 2.0 (`LICENSE`).
Schibsted Grotesk: SIL Open Font License 1.1 (`fonts/OFL-schibsted-grotesk.txt`).
