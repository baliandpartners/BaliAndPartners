# Asset and dependency notes

- Bali & Partners logo: existing repository asset supplied by the owner. The original PNG remains unchanged.
- Newsreader variable: SIL Open Font License 1.1. Redistributed licence in `project/public/licenses/Newsreader-OFL.txt`.
- DM Sans variable: SIL Open Font License 1.1. Redistributed licence in `project/public/licenses/DM-Sans-OFL.txt`.
- Lucide icons: ISC licence, with upstream brand icons subject to their applicable trademark rights; no external brand logo is newly asserted here.
- Original document/line compositions: authored as CSS/SVG for this website. No benchmark-site photography, code or artwork was copied.
- React, Vite, React Router and the testing tools retain their upstream licences in their installed packages.

`package-lock.json` pins installed versions and integrity checksums. Keep the font licence files with redistributed font assets. No paid assets, analytics subscription or CMS account is required.

The weight-400 Newsreader normal and italic WOFF2 files in `project/src/assets/` are derived from the pinned Fontsource 5.3.0 Latin variable fonts using fontTools instancing. They preserve the original outlines at the existing design weight and are redistributed under the same SIL OFL 1.1 licence. `project/scripts/prepare-display-fonts.py` documents regeneration; the normal build uses the committed assets and needs no Python dependency. Original variable faces remain available for other weights. Only the three above-the-fold font faces are preloaded.
