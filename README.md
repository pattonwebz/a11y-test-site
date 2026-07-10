# a11y test site

A deliberately half-broken static site used to demo accessibility testing in CI/CD. On every push it deploys to GitHub Pages and is then scanned live by [axe-scan-action](https://github.com/pattonwebz/axe-scan-action) + [axe-report-action](https://github.com/pattonwebz/axe-report-action) — see the job summary of any [Deploy and scan run](../../actions) for the report.

**The workflow is expected to fail.** That's the demo: the report enforces `fail-on: serious` against pages that contain intentional violations.

| Page | Intentional issues |
|---|---|
| `index.html` | Image without alt text, low-contrast text, clickable `div`, link with no text |
| `about.html` | Missing `lang` attribute, skipped heading level, unlabeled form inputs |
| `clean.html` | None — exists to show a passing row in the report |
