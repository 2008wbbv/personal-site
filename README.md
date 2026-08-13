# bnvac.com

Personal site for Ben Vaccaro — radar sensing, machine learning systems, neural interfaces.

Vanilla HTML, CSS and JavaScript. No build step, no framework, no dependencies,
no trackers, no external network requests at runtime.

## Structure

```
index.html      Home — about, education, experience, publications,
                honors & awards, certifications, adventures, contact
cv.html         Curriculum vitae, web version
cv/cv.tex       Curriculum vitae, LaTeX source — one page
cv/cv.pdf       Typeset output (pdflatex cv.tex)
404.html        Not-found page
styles.css      All styles (design tokens → components → responsive → print)
main.js         Theme, greedy nav, view switching, filters, copy-to-clipboard
img/            Photographs — see img/README.md
```

The CV exists twice on purpose: `cv.html` for reading in a browser, and a
one-page LaTeX version for sending to people. Both carry the same content.

Sections follow academic CV convention: education and experience lead, and publications
sit with the research rather than after the skills list. Each
masthead link swaps the body for that section rather than scrolling, so the landing
view is the standing summary, the bio and the research interests, and nothing else.

## Design

The page follows [academicpages](https://github.com/academicpages/academicpages.github.io)
closely: a fixed masthead carrying the site title, the section links and the theme
control; the author-profile sidebar with a circular portrait and icon links; a 925px
measure; and section headings ruled underneath. Its text and border colours
(`#494e52`, `#f2f3f3`) are the template's own. Timeline entries and status-badged
project cards come from [ashutoshx7.me](https://www.ashutoshx7.me/). Content comes from
[bnvac.com](https://bnvac.com).

- **Restraint** — no boxes where whitespace will do, and no decorative colour. Blue
  appears in exactly three places: inline links, the focus ring, and the marker on the
  active nav item. Everything else — highlighted tags, award ranks, status badges — is
  monochrome, carrying emphasis by weight and rule instead. Nothing blinks or pulses.
- **Type** — Arial, with a mono only for dates and small labels. No webfonts, so no
  layout shift and no third-party requests. Hierarchy comes from weight and size
  rather than a second family, which is the plainer academic register.
- **Color** — zinc-based monochrome. The one accent is blue (`#1d4ed8` light, `#60a5fa`
  dark), spent only where the Restraint note says. Project status survives as a small
  coloured dot beside a neutral label, so the meaning is kept without the page turning
  into a set of coloured pills.
- **Theme** — a labeled Light / Dark switch rather than a bare icon, so the current state is
  readable at a glance. Follows the OS until you choose, then persists in `localStorage`;
  an inline script in `<head>` applies it before first paint so there's no flash.

## Behavior

Everything in `main.js` is progressive enhancement — with JavaScript disabled the page is
still complete, readable, and every section is visible.

| Feature | Notes |
| --- | --- |
| Theme switch | Labeled Light / Dark control, persisted; tracks the OS until you pick one. |
| Greedy nav | The masthead stays one row: links that do not fit move into an overflow menu and return when the window widens, re-fitting on load and resize. Without JavaScript the bar sits in flow and wraps instead, so every link stays reachable. |
| Views | A masthead link shows that section and hides the rest, pushing a history entry so deep links, the back button and the page title all follow. Without JavaScript every section stays in the document and the page reads top to bottom. |
| Experience filter | all / research / engineering / leadership. Hidden until JS loads. |
| Sidebar | Sticks when it fits the viewport; below 940px tall it scrolls with the page so nothing is trapped behind a hidden scrollbar. |
| Photos | Plain `<img>`, lazy-loaded, with width/height set so nothing reflows. The portrait falls back to a monogram when the file is absent. |
| Certifications | Linked rows with the issuer's mark: logo, name, issuer, year. The logo is optional — drop the `<img>` and the row still lines up. |
| Copy email | Clipboard API with an `execCommand` fallback for non-secure contexts. |

## Accessibility

Semantic landmarks, a skip link, visible focus rings, a visually-hidden heading naming the
opening section, and `prefers-reduced-motion` honored throughout. The masthead nav mirrors
the section order exactly, and its overflow menu is keyboard reachable.

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
- **Colors and spacing** are the custom properties in the `:root` block of `styles.css`.

## Building the CV

```sh
cd cv && pdflatex cv.tex
```

Plain LaTeX — `article`, Charter, and a handful of standard packages. No CV class.
It is written to stay on one page; if you add entries and it spills onto a second,
trim a bullet rather than shrinking the margins.

### Parked

- **Projects** is commented out in `index.html`, markup intact, along with its
  masthead item. Uncomment both to bring it back. Its card images are still in
  `img/projects/`.

### Still to fill in

- **Photographs** — the portrait and the Adventures grid are real; the certification
  logos and the parked project cards are still generated placeholders. See
  `img/README.md`.
- **Certifications** holds two template rows in `index.html`. Each needs a name, a
  verification URL on the `<a>`, an issuer, a year, and optionally a square logo at
  `img/certs/<name>.png`.
- **Links in the bio** — the organisations in the opening paragraphs are plain text.
  Give me URLs and they become links, which is where the accent colour belongs.
- **Publications** currently hold a single "To be published / in preparation" entry in
  `index.html`, `cv.html` and `cv/cv.tex`. Copy the marked `<li class="pub">`,
  `<div class="row">` or `\item` for each paper as it lands.
