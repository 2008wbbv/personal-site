# bnvac.com

Personal academic site for Ben Vaccaro, built on
[academicpages](https://github.com/academicpages/academicpages.github.io) — a Jekyll
template forked from [Minimal Mistakes](https://mmistakes.github.io/minimal-mistakes/).

The template is used **unmodified**. `_sass/`, `assets/`, `_layouts/` and `_includes/`
are byte-identical to upstream; nothing here overrides its styles. All the site-specific
content lives in configuration and Markdown.

## What is where

```
_config.yml            Site title, URL, and the author block that fills the sidebar
_data/navigation.yml   The header links
_pages/about.md        The front page — the bio
_pages/education.md    Education
_pages/experience.md   Experience
_pages/awards.md       Honors & awards
_pages/certifications.md
_pages/contact.md      Email, the Substack, and the social links
_publications/         One file per paper
images/profile.jpg     Sidebar portrait
images/photos/         18 photographs, currently unused — see images/README.md
```

There is no CV page. Its content is split across the tabs in the header instead —
Education, Experience, Publications, Honors & Awards, Certifications, Contact — one
page each, in the order `_data/navigation.yml` lists them. The site title on the left
returns to the front page.

Page headings follow the template's Markdown convention: the `title` in the front
matter becomes the page's only `h1`, and entries inside a page use `------` beneath
them, which Markdown renders as `h2`. Using `======` there instead would make every
entry compete with the page title.

## Dark mode

Built into the template: the sun icon at the right of the header. It follows the
operating system until you choose, then remembers the choice in `localStorage`.
Nothing was added for it.

## Adding content

**A publication** — a new file in `_publications/`, front matter as in the existing one.
`markdown_generator/` can bulk-generate these from a spreadsheet if that is ever easier.

**A page** — a new file in `_pages/` with a `permalink`, then a link in
`_data/navigation.yml`. The template also ships archive layouts for talks, teaching,
a portfolio and a blog; those collections exist but are empty, so add files to
`_talks/`, `_teaching/`, `_portfolio/` or `_posts/` and give each a page and a nav entry.

**The sidebar** — the `author:` block in `_config.yml`. Filling in a service (ORCID,
Google Scholar, Bluesky, and so on) makes its icon appear; leaving it blank hides it.

## Running locally

```sh
bundle install
bundle exec jekyll serve
```

Then visit <http://localhost:4000>.

`url` in `_config.yml` is `https://bnvac.com`, so a plain local build points its assets
at the production domain. To preview locally, override it:

```sh
bundle exec jekyll serve --config _config.yml,_config_local.yml
```

with `_config_local.yml` containing `url: "http://localhost:4000"`.

## Deploying

GitHub Pages builds Jekyll automatically — push and enable Pages on the branch. There is
deliberately no `.nojekyll` file; that would switch the build off and serve the raw
source. If the site is ever served from a project path rather than `bnvac.com`, set
`baseurl` in `_config.yml` to match.

## Still to fill in

- **Certifications** — `_pages/certifications.md` holds a note and a commented-out
  example row in place of the list.
- **Publications** — one "in preparation" entry stands in until the first paper lands.
- **The photographs** in `images/photos/` have no page. The template ships a portfolio
  collection and layout if they should be shown again.
