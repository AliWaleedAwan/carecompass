import { assess, templateExplanation } from "../../../lib/triageEngine.js";

// POST /api/triage  — the "agent" action.
// Body: { symptoms: string[], freeText: string }
// Always returns a deterministic assessment. If GEMINI_API_KEY is set, the
// explanation text is upgraded via Gemini; otherwise a template is used.
export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const assessment = assess({
    symptoms: body.symptoms || [],
    freeText: body.freeText || "",
  });

  let explanation = templateExplanation(assessment);
  let explanationSource = "template";

  const key = process.env.GEMINI_API_KEY;
  if (key) {
    try {
      explanation = await geminiExplain(key, assessment);
      explanationSource = "gemini";
    } catch (e) {
      // Fall back silently to the template — the demo must never break.
      explanationSource = "template (gemini-failed)";
    }
  }

  return Response.json({ ...assessment, explanation, explanationSource });
}

async function geminiExplain(key, a) {
  const prompt = [
    "You are a calm, careful health-triage assistant. The triage DECISION has",
    "already been made by a rules engine and must NOT be changed by you.",
    `Urgency level: ${a.level}.`,
    `Reported symptoms: ${a.symptomLabels.join(", ") || "none specified"}.`,
    `Recommended action: ${a.pathway.action}`,
    "",
    "Write 2-3 short sentences for the patient: acknowledge their symptoms,",
    "explain the urgency level in plain language, and restate the action.",
    "Do NOT diagnose. Do NOT contradict the urgency level. No markdown.",
  ].join("\n");

  const url =
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" +
    key;

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
  });

  if (!res.ok) throw new Error("Gemini request failed");
  const data = await res.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error("Empty Gemini response");
  return text.trim();
}
