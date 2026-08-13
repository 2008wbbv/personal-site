# Images

`headshot.jpg` and everything in `adventures/` are real photographs. The files in
`certs/` and `projects/` are still **generated placeholders** — replace them with
real images, keep the filenames, and nothing else needs to change.

| File | Used for | Best shape |
| --- | --- | --- |
| `headshot.jpg` | Sidebar portrait, both pages | Square, already cropped to head and shoulders. The CSS also pulls a non-square file toward the upper third (`50% 20%`); adjust `.avatar__img { object-position }` in `styles.css` if a replacement crop sits differently. |
| `adventures/*.jpg` | Adventures grid | Square, 1100px |
| `projects/*.jpg` | Project cards | 16:10 landscape |
| `certs/*.png` | Certification logos | Square, transparent background |

If `headshot.jpg` is missing the `bv` monogram shows instead — the `onerror`
attribute on the `<img>` removes it and reveals the fallback beneath.

Photos are plain `<img>` tags with `loading="lazy"`, width and height attributes,
and no processing step. Export them at roughly 2× their display size
(~1200px wide for projects, ~1100px square for adventures) and compress before
committing.
