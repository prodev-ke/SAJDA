# SAJDA — Sagante Jaldesa Daawah

Website for the SAJDA fundraiser: building the **Sagante Jaldessa Islamic Education Centre**,
strengthening **eight feeder madrasa centres**, and establishing a **KSH 80,000,000 Waqf
endowment** in Sagante Jaldesa Ward, Seku Constituency, Marsabit County, Kenya.

A static site — no build step, no dependencies, no framework.

## Pages

| File | Purpose |
| --- | --- |
| `index.html` | Home — the need, work already done, vision, gallery preview, donate |
| `project.html` | Full project plan — Centre of Excellence, the 8 centres, the Waqf, costs |
| `gallery.html` | 39 photographs with theme filters and a lightbox |
| `donate.html` | M-Pesa steps, other ways to give, committee contacts |

## Structure

```
assets/
  css/styles.css     all styling (design tokens at the top)
  js/main.js         nav, scroll reveal, counters, gallery filters, lightbox, copy buttons
  img/
    hero.jpg         homepage hero (2000px)
    band-*.jpg       full-bleed section backgrounds (2000px)
    invitation.jpg   the official invitation card
    gallery/         1600px — lightbox / full view
    med/             1100px — images placed inline in page content
    thumbs/          760px  — gallery grid tiles
```

Three image sizes exist on purpose: loading 1600px files into ~500px slots made the page
janky on scroll. Inline content uses `med/`, grid tiles use `thumbs/`, and only the lightbox
loads from `gallery/`.

## Editing common things

**Contribution numbers** — search for `247247` (paybill) and `537354` (account). They appear in
the paybill blocks, the footers and the donate steps.

**Contact numbers** — search for `+254`. Three entries per footer, plus the contact list on
`donate.html`.

**Fundraising totals** — `226` and `80` appear as `data-count` values on the animated stats and
as plain text elsewhere; search for `226,000,000` and `80,000,000`.

**The funding bar** — `<div class="funding__fill" data-progress="35">`. Change `35` to the
percentage you want filled. It currently illustrates the Waqf share of the total, not money
raised. If you start showing money raised, update the caption beneath it too.

**Adding gallery photographs** — add the three sizes under `thumbs/`, `med/` (if used inline)
and `gallery/`, then copy an existing `.gallery__item` button in `gallery.html` and set
`data-category` to one of `progress`, `learning`, `children`, `need`.

## Source media

The original photographs and video live in `Documentary/` (~3.5 GB) and are **excluded from git**
via `.gitignore`, along with the source `.pptx`. Only the web-sized derivatives in `assets/img/`
are committed. Keep the originals backed up separately — they are not in this repository.

## Publishing to GitHub Pages

```bash
git push -u origin main
```

Then in the repository on GitHub: **Settings → Pages → Source: Deploy from a branch**, branch
`main`, folder `/ (root)`. The site appears at
`https://<username>.github.io/SAJDA/` after a minute or two.

`.nojekyll` is present so GitHub serves the files as-is rather than running them through Jekyll.

## Notes

- Fonts (Fraunces, Inter, Amiri) load from Google Fonts, so the site needs a network connection
  to render exactly as designed; it degrades to system fonts otherwise.
- No figure for total pupils enrolled appears anywhere on the site, because none was recorded in
  the source materials. If you have an audited number, it is the single most persuasive statistic
  you could add to the stats bar on `index.html`.
- The funding bar shows the Waqf share of the target, not funds raised to date.
