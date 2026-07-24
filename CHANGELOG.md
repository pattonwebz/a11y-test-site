# Changelog

Notable changes to this demo site and its scan pipeline.

## 2026-07-24

### Removed

- The `custom-rules` job (EDAC custom ruleset scan via the private `accessibility-checker-rules`
  and `axe-html-report-action` repos). It was a curiosity experiment to see if a custom ruleset
  was feasible in this pipeline — confirmed it was, but the site's actual scan pipeline goes back
  to vanilla standard axe-core only, via the `accessibility` job. The `index.html` "Custom rule
  triggers" section (justified text, tiny text, underlined non-link text) is left in place but is
  now inert — nothing in this workflow checks it anymore.

### Added

- Shared site chrome (`site/assets/style.css`): nav bar, hero section, a menu/feature grid on
  `index.html`, and a footer with a working newsletter signup form across all three pages — so
  the site looks like a real product page instead of bare unstyled markup. All new chrome is
  itself intentionally clean; every pre-existing intentional violation is untouched.

### Fixed

- Two contrast bugs introduced by the new footer chrome, both caught by a real axe-core scan
  after building it (not assumed): footer meta text and footer links were only checked against
  the light page background, not the footer's own dark background, and measured 2.42:1 and
  2.24:1 respectively — both now correctly use light-on-dark colors verified at 12:1 and 9.7:1.
- Missing `<main>` landmark on `index.html`/`about.html` after adding a `<nav>` — was tripping
  axe's `landmark-one-main` and `region` rules as new, unintended violations; wrapped existing
  content in `<main>` to fix (`clean.html` already had one).

## 2026-07-11 (later)

### Changed

- Workflow: axe-scan-action bumped to v0.0.3 (opt-in custom rulesets via configure-file + rules filter).

## 2026-07-11

### Added

- MIT `LICENSE`.

### Changed

- Workflow: axe-scan-action and axe-report-action bumped to v0.0.2 (JSON `urls` input, non-2xx responses fail the scan by default).

## 2026-07-10

Initial version: static demo site with intentional accessibility issues (plus a clean control page), deployed to GitHub Pages and scanned by axe-scan-action / axe-report-action on every deploy.
