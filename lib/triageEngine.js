// ---------------------------------------------------------------------------
// Triage engine — the agent's decision logic.
//
// Fully deterministic and grounded in data/triage-data.js (no API key needed).
// The urgency DECISION is always made here; any LLM is used only to phrase the
// explanation in friendlier language (see app/api/triage/route.js).
// ---------------------------------------------------------------------------

import {
  SYMPTOMS,
  SYNONYMS,
  RED_FLAGS,
  CONDITION_PROFILES,
  PATHWAYS,
} from "../data/triage-data.js";

const SYMPTOM_BY_ID = Object.fromEntries(SYMPTOMS.map((s) => [s.id, s]));

// Pull symptom ids out of a free-text description via keyword matching.
export function extractSymptomsFromText(text) {
  if (!text) return [];
  const t = text.toLowerCase();
  const found = new Set();
  for (const [id, phrases] of Object.entries(SYNONYMS)) {
    if (phrases.some((p) => t.includes(p))) found.add(id);
  }
  return [...found];
}

// Check red-flag patterns. Returns the matched flags (each pattern requires
// ALL of its symptoms to be present).
function matchedRedFlags(symptomIds) {
  const set = new Set(symptomIds);
  return RED_FLAGS.filter((flag) => flag.pattern.every((id) => set.has(id)));
}

// Suggest non-diagnostic "areas to mention" by overlap with condition profiles.
function suggestAreas(symptomIds) {
  const set = new Set(symptomIds);
  return CONDITION_PROFILES.map((c) => {
    const overlap = c.symptoms.filter((id) => set.has(id)).length;
    return { name: c.name, overlap, size: c.symptoms.length };
  })
    .filter((c) => c.overlap >= 2)
    .sort((a, b) => b.overlap / b.size - a.overlap / a.size)
    .slice(0, 3)
    .map((c) => c.name);
}

// Map a severity score to an urgency level.
function scoreToLevel(score) {
  if (score >= 12) return "urgent";
  if (score >= 6) return "routine";
  return "selfcare";
}

// Main entry point. Returns a structured assessment.
export function assess({ symptoms = [], freeText = "" }) {
  const fromText = extractSymptomsFromText(freeText);
  const allIds = [...new Set([...symptoms, ...fromText])];

  const known = allIds.filter((id) => SYMPTOM_BY_ID[id]);
  const score = known.reduce((sum, id) => sum + SYMPTOM_BY_ID[id].weight, 0);

  const flags = matchedRedFlags(known);
  const overridden = flags.length > 0;
  const level = overridden ? "emergency" : scoreToLevel(score);

  const symptomLabels = known.map((id) => SYMPTOM_BY_ID[id].label);

  return {
    level,
    pathway: PATHWAYS[level],
    score,
    overridden,
    redFlags: flags.map((f) => f.reason),
    detectedSymptoms: known,
    symptomLabels,
    extractedFromText: fromText,
    suggestedAreas: suggestAreas(known),
    disclaimer:
      "This is automated decision-support, not a medical diagnosis. When in doubt, contact a qualified healthcare professional.",
  };
}

// A plain-language explanation used when no LLM key is configured (the
// zero-cost default). Always available so the demo never breaks.
export function templateExplanation(a) {
  if (a.level === "emergency") {
    return `Based on what you described, this needs emergency attention. ${a.redFlags[0] || ""} Please act on this now.`.trim();
  }
  const list = a.symptomLabels.length
    ? a.symptomLabels.slice(0, 4).join(", ").toLowerCase()
    : "the symptoms you entered";
  return `You reported ${list}. Together these point to a "${a.pathway.title.toLowerCase()}" level of care. ${a.pathway.action}`;
}
