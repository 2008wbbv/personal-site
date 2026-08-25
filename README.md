# bnvac.com

Personal site for Ben Vaccaro. Plain HTML, CSS and JavaScript — no build step, no
framework, nothing to install. Upload the files and it works.

The look comes from
[academicpages](https://github.com/academicpages/academicpages.github.io) (itself a fork
of [Minimal Mistakes](https://mmistakes.github.io/minimal-mistakes/)), whose stylesheet
is used as-is. These files were generated from that template and then flattened; the
Jekyll source is in this repository's history at commit `ddf8813` if it is ever wanted
back.

## Deploying to Neocities

Upload the contents of this repository — not the folder itself, its contents — so
`index.html` sits at the site root. Skip `.git` and `README.md`.

Links are root-relative (`/education/`, `/assets/css/main.css`), so the site works at
`username.neocities.org` and at a custom domain without changing anything. That does
mean opening `index.html` by double-clicking it will not find the stylesheet — serve the
folder instead:

```sh
python3 -m http.server 8000
```

and visit <http://localhost:8000>.

Nothing is loaded from a CDN. Fonts, icons, stylesheet and script are all in `assets/`,
so the site cannot be broken by someone else's server going down.

## What is where

```
index.html              About — the front page
education/index.html    Education
experience/index.html   Experience
publications/index.html Publications
awards/index.html       Honors & awards
certifications/index.html
contact/index.html      Email, the Substack, social links
404.html                Not-found page
assets/                 Stylesheet, script, Font Awesome and its webfonts
images/profile.jpg      Sidebar portrait
images/photos/          18 photographs, not currently shown on any page
```

## Editing

Each page is a complete HTML file. The part worth editing sits between
`<div class="archive">` and its closing tag — everything above and below it is the
header, sidebar and footer, which are the same on every page.

That repetition is the cost of having no build step: **changing the sidebar or the header
means changing it in all seven pages.** A find-and-replace across `*.html` does it.

To add a tab, copy an existing page directory, edit its content and `<title>`, then add a
matching `<li class="masthead__menu-item">` to the header of every page.

## Still to fill in

- **Certifications** — `certifications/index.html` holds a note where the list goes.
- **Publications** — one "in preparation" entry until the first paper lands.
- **The photographs** in `images/photos/` are not linked from any page.
