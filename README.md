# a11y test site

A deliberately half-broken static site — "Demo Bakery" — used to demo accessibility testing in
CI/CD. On every push it deploys to GitHub Pages and is then scanned live by
[axe-scan-action](https://github.com/pattonwebz/axe-scan-action) +
[axe-report-action](https://github.com/pattonwebz/axe-report-action) — see the job summary of any
[Deploy and scan run](../../actions) for the report.

**The workflow is expected to fail.** That's the demo: the report enforces `fail-on: serious`
against pages that contain intentional violations.

All three pages share a real product-site look (`site/assets/style.css`): a nav bar, a hero
section, a menu/feature grid, and a footer with a working newsletter signup form — so the
intentional violations sit inside a page that actually looks like something worth scanning,
rather than bare unstyled markup. That chrome is itself real, tested code: verified with a real
axe-core scan against all three pages, with two contrast bugs the chrome introduced (a footer text
color and a footer link color, both only checked against the light background originally, not the
footer's dark one) found and fixed the same way — by actually running the scan, not assuming the
CSS was fine. `clean.html` is re-verified at 0 violations after every change to the shared chrome,
since that's its entire job.

| Page | Intentional issues |
|---|---|
| `index.html` | Image without alt text, low-contrast text, clickable `div`, link with no text |
| `about.html` | Missing `lang` attribute, skipped heading level, unlabeled form inputs (note: axe's automated `label` rule does not flag the unlabeled inputs — `placeholder` text satisfies the accessible-name computation even though it disappears on focus; this is a real, documented limit of automated scanning, not a bug in this demo) |
| `clean.html` | None — exists to show a passing row in the report |
