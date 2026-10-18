# Design direction: the editorial canvas

Three directions were considered: an architectural dark hero, an ivory editorial canvas, and a document-transformation hero. The editorial canvas was selected for its immediate legibility, quiet authority and performance. The document transformation becomes a separate useful exhibit rather than competing with the opening statement.

The original composition combines an oversized two-line editorial heading, a fine-line architectural space and a locally rendered document study. It uses no copied reference imagery, stock legal symbols or remote assets. The approved existing wordmark is displayed through a CSS crop of the unchanged original transparent PNG. The footer uses a monochrome CSS treatment. A small typographic favicon is provisional pending approval.

## Tokens

- Ink: `#182c30`
- Warm ivory: `#f5f2e9`
- Soft paper: `#fcfbf7`
- Olive: `#7e8469`
- Bronze: `#8b6e43`
- Fine rules: `#d7d7ca`
- Display: Newsreader variable, regular and italic.
- Body/interface: DM Sans variable.

Newsreader and DM Sans are self-hosted Latin subsets from Fontsource and licensed under SIL Open Font License 1.1. Font weight ranges and rendered samples were checked in the browser. Assets load without Google Fonts requests. Font licences are in the installed packages; notices are documented in LICENSES.md.

## Composition and interaction

Maximum content width 1360px, with 56px desktop and 20px mobile gutters. Fine rules structure the page. Dark expertise and footer sections balance warm paper sections. Major headings use an editorial serif; small labels use spaced uppercase sans-serif. No testimonial, award, client-count or success-statistic scaffolding is used.

The signature specimen has three keyboard-accessible stages. Capability links update an adjacent illustration on focus/hover and expose descriptive text on touch layouts. The process, reading-room filters, search, native disclosures and enquiry composer all have meaningful behaviour.

Motion is limited to short page-entry transitions, link feedback and the document illustration's pointer response. There is no scroll hijacking or mandatory loading sequence. Reduced-motion preferences remove transitions. The native modal menu has explicit focus wrapping and Escape support.

Each principal page has its own composition: indexed expertise, sequential method, filtered reading room, long-form article layout, typographic founder presentation and a two-column enquiry page. Mobile layouts reorganise these structures rather than scaling down the desktop canvas.
