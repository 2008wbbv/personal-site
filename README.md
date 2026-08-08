# bnvac.com

Personal site for Ben Vaccaro — wireless BCI and radar systems.

Vanilla HTML, CSS and JavaScript. No build step, no framework, no dependencies,
no trackers, no external network requests at runtime.

## Structure

```
index.html      Home — about, experience, research & projects, awards, writing, contact
cv.html         Curriculum vitae, print/PDF-ready
404.html        Not-found page
css/style.css   All styles (design tokens → components → responsive → print)
js/main.js      Theme, scrollspy, filters, copy-to-clipboard, command palette
```

## Design

The layout borrows the **author-profile sidebar and academic section model** from
[academicpages](https://github.com/academicpages/academicpages.github.io), and the
**single-column reading rhythm, command palette, timeline entries and status-badged
project cards** from [ashutoshx7.me](https://www.ashutoshx7.me/). Content comes from
[bnvac.com](https://bnvac.com).

- **Type** — system font stack, monospace for dates, tags and labels. No webfonts, so no
  layout shift and no third-party requests.
- **Color** — zinc-based monochrome with a single teal accent. Light and dark palettes are
  defined as CSS custom properties; dark overrides only the tokens that change.
- **Theme** — follows the OS by default. The toggle writes to `localStorage`, and an inline
  script in `<head>` applies it before first paint so there's no flash.

## Behavior

Everything in `js/main.js` is progressive enhancement — with JavaScript disabled the page is
still complete, readable, and every section is visible.

| Feature | Notes |
| --- | --- |
| Command palette | `⌘K` / `Ctrl-K`, or `/`. Arrow keys, `Home`/`End`, `Enter`, `Esc`. Fuzzy subsequence matching, so `cv` finds "View CV". |
| Theme toggle | Light / dark, persisted. |
| Scrollspy | `IntersectionObserver` marks the section you're reading in the sidebar nav. |
| Experience filter | all / research / engineering / leadership. Hidden until JS loads. |
| Copy email | Clipboard API with an `execCommand` fallback for non-secure contexts. |

## Accessibility

Semantic landmarks, a skip link, visible focus rings, `aria-*` on the palette combobox and
listbox, focus restored on dialog close, and `prefers-reduced-motion` honored throughout.

## Running locally

No tooling required — open `index.html`, or serve the folder:

```sh
python3 -m http.server 8000
```

Then visit <http://localhost:8000>.

## Deploying

Static files, so any host works. For GitHub Pages, push and enable Pages on the branch —
`.nojekyll` is present so files are served as-is.

## Editing

- **Text and entries** live directly in `index.html` and `cv.html`. Copy an existing
  `.entry`, `.card` or `.row` block and edit it.
- **Experience filters** read the `data-cat` attribute on each `.entry`
  (`research`, `engineering`, `leadership`).
- **Project status badges** are `badge--live`, `badge--build`, `badge--done`.
- **Palette entries** are the `commands` array near the bottom of `js/main.js`.
- **Colors and spacing** are the custom properties in the `:root` block of `css/style.css`.

### Still to fill in

- **Millis High School years** — the date cell is intentionally empty in both
  `index.html` (`.entry__when`) and `cv.html` (`.row__when`). Each is marked with an HTML
  comment; drop your start and graduation years in and it renders like every other row.
- **Publications** currently hold a single "To be published / in preparation" entry in
  `index.html` and `cv.html`. Copy the marked `<li class="pub">` or `<div class="row">`
  for each paper as it lands.
