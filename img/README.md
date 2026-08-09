# Images

Every file here is a **generated placeholder**. Replace them with real photographs —
keep the filenames and nothing else needs to change.

| File | Used for | Best shape |
| --- | --- | --- |
| `headshot.jpg` | Sidebar portrait, both pages | Square. Cropped `50% 20%`, i.e. pulled toward the upper third where a face sits in a full-length shot. Adjust `.avatar__img { object-position }` in `styles.css` if your crop sits differently. |
| `projects/*.jpg` | Project cards | 16:10 landscape |
| `adventures/IMG_*.jpg` | Adventures grid, grouped | Square |

Adventure photos keep the filenames they were uploaded with — `IMG_2310.jpg`,
`100_0246.jpg`. The placeholders here carry those exact names, so replacing one
is a straight overwrite with no code change. Which group a photo belongs to is
decided in `index.html`, one `<figure>` line each.

If `headshot.jpg` is missing the `bv` monogram shows instead — the `onerror`
attribute on the `<img>` removes it and reveals the fallback beneath.

Photos are plain `<img>` tags with `loading="lazy"`, width and height attributes,
and no processing step. Export them at roughly 2× their display size
(~1200px wide for projects, ~1100px square for adventures) and compress before
committing.
