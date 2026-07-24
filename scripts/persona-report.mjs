import { appendFileSync, readFileSync } from "node:fs";

// Real people, not just disability categories — the GOV.UK / GDS accessibility persona
// set. Same registry used by the WordPress demo stack's report generator, adapted for
// this static site's axe-scan-action output shape.
const personas = [
  {
    key: "ashleigh",
    name: "Ashleigh",
    userType: "Blind & Screen Reader Users",
    identity: "Partially sighted, uses JAWS and other screen reader features",
    needs: "Clear semantic structure, labelled controls, and full keyboard access"
  },
  {
    key: "claudia",
    name: "Claudia",
    userType: "Low-Vision & Magnification Users",
    identity: "Partially sighted (glaucoma, diabetes), uses ZoomText and a large monitor",
    needs: "Strong contrast, predictable layout, content that reflows under magnification"
  },
  {
    key: "christopher",
    name: "Christopher",
    userType: "Motor & Dexterity Users",
    identity: "Has rheumatoid arthritis, prefers keyboard access, exploring speech recognition",
    needs: "Full keyboard operability, generous touch targets, no drag-and-drop-only controls"
  },
  {
    key: "pawel",
    name: "Pawel",
    userType: "Autistic & Cognitive-Load-Sensitive Users",
    identity: "Autistic, experiences anxiety, prefers simpler and less cluttered interfaces",
    needs: "Predictable layouts, plain language, minimal motion and distraction"
  },
  {
    key: "ron",
    name: "Ron",
    userType: "Older Users",
    identity: "Older user with arthritis, cataracts, and hearing loss",
    needs: "Large text, high contrast, and simple, uncluttered forms"
  },
  {
    key: "saleem",
    name: "Saleem",
    userType: "Deaf & Hard-of-Hearing Users",
    identity: "Profoundly deaf, BSL is his first language",
    needs: "Accurate captions and transcripts, and non-audio contact routes"
  },
  {
    key: "simone",
    name: "Simone",
    userType: "Dyslexic Users",
    identity: "Dyslexic, benefits from plain language and strong structure",
    needs: "Clear headings, readable typography, and uncomplicated forms"
  }
];

const ruleToPersonaKeys = {
  label: ["ashleigh", "christopher", "claudia", "ron", "simone"],
  "button-name": ["ashleigh", "christopher", "claudia", "ron", "simone"],
  "link-name": ["ashleigh", "christopher", "claudia", "ron", "simone"],
  "image-alt": ["ashleigh", "ron", "simone"],
  "color-contrast": ["claudia", "ron", "simone"],
  "aria-hidden-focus": ["ashleigh", "christopher", "claudia", "ron"],
  bypass: ["ashleigh", "christopher", "claudia", "ron"],
  region: ["ashleigh", "christopher", "claudia", "ron"],
  list: ["ashleigh", "ron", "simone", "saleem"],
  listitem: ["ashleigh", "ron", "simone", "saleem"],
  "heading-order": ["ashleigh", "claudia", "ron", "simone"],
  "target-size": ["christopher", "ron", "claudia"],
  "meta-viewport": ["claudia", "ron"],
  "document-title": ["ashleigh", "claudia", "ron", "simone", "saleem"],
  "duplicate-id-active": ["ashleigh", "christopher", "claudia", "ron"],
  tabindex: ["ashleigh", "christopher", "claudia", "ron"],
  "nested-interactive": ["ashleigh", "christopher", "claudia", "ron"],
  "html-has-lang": ["ashleigh", "saleem", "simone", "ron", "pawel"],
  "valid-lang": ["ashleigh", "saleem", "simone", "ron", "pawel"],
  "video-caption": ["saleem", "pawel", "simone"],
  "audio-caption": ["saleem"],
  blink: ["pawel", "simone"],
  "meta-refresh-no-exceptions": ["ashleigh", "christopher", "ron", "pawel", "simone"]
};

const personaByKey = new Map(personas.map((persona) => [persona.key, persona]));

function personasForRule(ruleId) {
  return (ruleToPersonaKeys[ruleId] ?? [])
    .map((key) => personaByKey.get(key))
    .filter(Boolean);
}

const resultsFile = process.argv[2];
if (!resultsFile) {
  console.error("Usage: node persona-report.mjs <axe-results.json>");
  process.exit(1);
}

const pages = JSON.parse(readFileSync(resultsFile, "utf8"));

const violationsByRule = new Map();
for (const page of pages) {
  for (const violation of page.results?.violations ?? []) {
    const current = violationsByRule.get(violation.id) ?? {
      id: violation.id,
      count: 0,
      impact: violation.impact ?? "unknown",
      help: violation.help,
      pages: new Set()
    };
    current.count += violation.nodes.length;
    current.pages.add(page.url);
    violationsByRule.set(violation.id, current);
  }
}

const ruleBreakdown = Array.from(violationsByRule.values()).sort(
  (left, right) => right.count - left.count || left.id.localeCompare(right.id)
);

const lines = [
  "## Personas: who these findings affect",
  "",
  "Real people from the GOV.UK / GDS accessibility persona set, not just disability labels.",
  ""
];

for (const persona of personas) {
  const matchedRules = ruleBreakdown.filter((rule) =>
    (ruleToPersonaKeys[rule.id] ?? []).includes(persona.key)
  );
  lines.push(`### ${persona.userType} — ${persona.name}`, "");
  lines.push(`- ${persona.identity}`);
  lines.push(`- Needs: ${persona.needs}`);
  if (matchedRules.length > 0) {
    const ruleList = matchedRules.map((rule) => `\`${rule.id}\` (${rule.count})`).join(", ");
    lines.push(`- Found in this scan: ${ruleList}`);
  } else {
    lines.push(
      "- Found in this scan: none of the rules that map to this persona's primary needs. Automation coverage here is limited — prioritize manual testing."
    );
  }
  lines.push("");
}

if (ruleBreakdown.length > 0) {
  lines.push("## Rule breakdown", "");
  for (const rule of ruleBreakdown) {
    const names = personasForRule(rule.id).map((persona) => persona.name);
    lines.push(`- \`${rule.id}\`: ${rule.count} affected nodes across ${rule.pages.size} page(s) — ${rule.help}`);
    if (names.length > 0) {
      lines.push(`  - Affects: ${names.join(", ")}`);
    }
  }
  lines.push("");
}

const summaryFile = process.env.GITHUB_STEP_SUMMARY;
if (summaryFile) {
  appendFileSync(summaryFile, `${lines.join("\n")}\n`);
} else {
  console.log(lines.join("\n"));
}
