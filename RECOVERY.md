# OpenMap Studio source reconstruction

This repository was recovered from a static production upload rather than an
authored source repository. The following materials were available:

- a Vite/Rolldown-produced React 19 application in `assets/`;
- the app stylesheet in `assets/index-JnKeWNpm.css`;
- readable classic-browser extension scripts in the repository root; and
- static-host rules in `_headers` and `_redirects`.

## Reconstructed build

- `src/main.js` is the documented application entry point.
- `vite.config.js` builds the entry point and copies the classic runtime
  extensions plus host rules into `dist/`.
- `index.html` loads the source entry during development and preserves the
  extension ordering used by the original deployment.

Run `npm install`, then use `npm run dev` for development or `npm run build`
to create `dist/`.

## Source recovery boundary

The main React screen was supplied only as minified, content-hashed production
modules. Those modules are retained as the functional baseline and are imported
by `src/main.js`; they have not been represented as misleading hand-authored
source. A future full recovery can split and rename code from
`assets/page-D7Nn_9ji.js`, but it should be treated as a behavior-preserving
refactor and verified visually and functionally after each extraction.
