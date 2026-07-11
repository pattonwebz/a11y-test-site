# Changelog

Notable changes to this demo site and its scan pipeline.

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
