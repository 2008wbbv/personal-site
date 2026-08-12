# bnvac.com

Personal site for Ben Vaccaro — radar sensing, machine learning systems, neural interfaces.

Vanilla HTML, CSS and JavaScript. No build step, no framework, no dependencies,
no trackers, no external network requests at runtime.

## Structure

```
index.html      Home — about, education, experience, publications, projects,
                honors & awards, certifications, writing, adventures, contact
cv.html         Curriculum vitae, web version
cv/cv.tex       Curriculum vitae, LaTeX source — one page
cv/cv.pdf       Typeset output (pdflatex cv.tex)
404.html        Not-found page
styles.css      All styles (design tokens → components → responsive → print)
main.js         Theme, scrollspy, experience filters, copy-to-clipboard
img/            Photographs — see img/README.md
```

The CV exists twice on purpose: `cv.html` for reading in a browser, and a
one-page LaTeX version for sending to people. Both carry the same content.

Sections follow academic CV convention: education and experience lead, publications
sit with the research rather than after the skills list, and projects follow. The
page opens with the standing summary as a short affiliation list, prose after it,
and the photographs last.

## Design

The layout borrows the **author-profile sidebar and academic section model** from
[academicpages](https://github.com/academicpages/academicpages.github.io), and the
**single-column reading rhythm, timeline entries and status-badged project cards** from [ashutoshx7.me](https://www.ashutoshx7.me/). Content comes from
[bnvac.com](https://bnvac.com).

- **Restraint** — no boxes where whitespace will do. Research interests and the
  headline statistics are plain type on open ground; the hairline rules and the card
  borders are the only chrome on the page. Nothing blinks or pulses.
- **Type** — Arial, with a mono only for dates and small labels. No webfonts, so no
  layout shift and no third-party requests. Hierarchy comes from weight and size
  rather than a second family, which is the plainer academic register.
- **Color** — zinc-based monochrome with a single blue accent (`#1d4ed8` light,
  `#60a5fa` dark). Status hues for project badges are separate from the accent and lift in
  dark so they stay legible on near-black.
- **Theme** — a labeled Light / Dark switch rather than a bare icon, so the current state is
  readable at a glance. Follows the OS until you choose, then persists in `localStorage`;
  an inline script in `<head>` applies it before first paint so there's no flash.

## Behavior

Everything in `main.js` is progressive enhancement — with JavaScript disabled the page is
still complete, readable, and every section is visible.

| Feature | Notes |
| --- | --- |
| Theme switch | Labeled Light / Dark control, persisted; tracks the OS until you pick one. |
| Scrollspy | `IntersectionObserver` marks the section you're reading in the sidebar nav, with the last section pinned once you reach the bottom — a short closing section can never win on visible area. |
| Experience filter | all / research / engineering / leadership. Hidden until JS loads. |
| Sidebar | Sticks when it fits the viewport; below 940px tall it scrolls with the page so nothing is trapped behind a hidden scrollbar. |
| Photo grids | Track-based, no breakpoints of their own: one column on a phone through four on a wide screen. |
| Photos | Plain `<img>`, lazy-loaded, with width/height set so nothing reflows. The portrait falls back to a monogram when the file is absent. |
| Copy email | Clipboard API with an `execCommand` fallback for non-secure contexts. |

## Accessibility

Semantic landmarks, a skip link, visible focus rings, a visually-hidden heading naming the
opening section, and `prefers-reduced-motion` honored throughout. The sidebar nav mirrors
the section order exactly.

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

### Still to fill in

- **Photographs** — everything in `img/` is a generated placeholder carrying the
  real filename. Overwrite `img/adventures/IMG_2310.jpg` with that photo and it
  appears; nothing in the markup changes. See `img/README.md`.
- **Adventure groupings** — the seven groups are in place but which photo sits in
  which group is a first pass. Each photo is one `<figure>` line; move the line
  into another `<section class="group">` to regroup.
- **Certifications** holds one template row in `index.html`. Copy the
  `<li class="cert">` per certification.
- **Publications** currently hold a single "To be published / in preparation" entry in
  `index.html`, `cv.html` and `cv/cv.tex`. Copy the marked `<li class="pub">`,
  `<div class="row">` or `\item` for each paper as it lands.
