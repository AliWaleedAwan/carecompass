"use client";

import { useState } from "react";
import { SYMPTOMS } from "../../data/triage-data.js";
import { useStore } from "../../lib/store.js";
import UrgencyBadge from "../../components/UrgencyBadge.jsx";

export default function PatientPage() {
  const { encounters, addEncounter } = useStore();
  const [selected, setSelected] = useState([]);
  const [freeText, setFreeText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const toggle = (id) =>
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  async function runTriage() {
    if (!selected.length && !freeText.trim()) return;
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/triage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ symptoms: selected, freeText }),
      });
      const data = await res.json();
      setResult(data);
      addEncounter({
        symptomLabels: data.symptomLabels,
        level: data.level,
        explanation: data.explanation,
        overridden: data.overridden,
        redFlags: data.redFlags,
        suggestedAreas: data.suggestedAreas,
        freeText,
      });
    } finally {
      setLoading(false);
    }
  }

  function reset() {
    setSelected([]);
    setFreeText("");
    setResult(null);
  }

  const myHistory = encounters.slice(0, 5);
  const isEmergency = result?.level === "emergency";

  return (
    <div className="rise grid gap-8 lg:grid-cols-[1.3fr_1fr]">
      <section>
        <h1 className="font-display text-3xl text-fg">How are you feeling?</h1>
        <p className="mt-1 text-muted">
          Select what applies and add anything in your own words.
        </p>

        <div className="mt-5 flex flex-wrap gap-2">
          {SYMPTOMS.map((s) => {
            const on = selected.includes(s.id);
            return (
              <button
                key={s.id}
                onClick={() => toggle(s.id)}
                className={
                  "rounded-full border px-3 py-1.5 text-sm transition active:scale-95 " +
                  (on
                    ? "border-teal bg-teal text-[#06231C] shadow-lg shadow-teal/20"
                    : "border-line bg-white/[0.03] text-fg/80 hover:border-teal/50 hover:text-fg")
                }
              >
                {s.label}
              </button>
            );
          })}
        </div>

        <textarea
          value={freeText}
          onChange={(e) => setFreeText(e.target.value)}
          rows={3}
          placeholder="e.g. I've had chest pain and shortness of breath for an hour"
          className="glass mt-5 w-full rounded-xl p-3 text-fg placeholder:text-muted/60 outline-none transition focus:border-teal/60"
        />

        <div className="mt-4 flex gap-3">
          <button
            onClick={runTriage}
            disabled={loading || (!selected.length && !freeText.trim())}
            className="rounded-full bg-teal px-6 py-2.5 font-semibold text-[#06231C] shadow-lg shadow-teal/20 transition hover:brightness-110 active:scale-95 disabled:opacity-30"
          >
            {loading ? "Assessing…" : "Get my triage"}
          </button>
          <button
            onClick={reset}
            className="rounded-full border border-line px-5 py-2.5 text-muted transition hover:bg-white/5 hover:text-fg"
          >
            Clear
          </button>
        </div>

        {result && (
          <div
            className={
              "pop glass mt-7 rounded-2xl p-6 " +
              (isEmergency ? "pulse-emergency" : "")
            }
            style={{ borderColor: isEmergency ? "#FF6B6B66" : undefined }}
          >
            <div className="flex items-center justify-between gap-3">
              <UrgencyBadge level={result.level} size="lg" />
              {result.overridden && (
                <span className="font-mono text-[11px] uppercase tracking-wide text-emergency">
                  ⚠ red-flag override
                </span>
              )}
            </div>
            <h2 className="mt-4 font-display text-2xl text-fg">
              {result.pathway.title}
            </h2>
            <p className="mt-2 text-fg/85">{result.explanation}</p>
            <p className="mt-3 rounded-lg border border-teal/20 bg-teal/10 p-3 text-sm text-fg/85">
              {result.pathway.action}
            </p>

            {result.redFlags?.length > 0 && (
              <ul className="mt-4 space-y-1 text-sm text-emergency">
                {result.redFlags.map((r, i) => (
                  <li key={i}>• {r}</li>
                ))}
              </ul>
            )}

            {result.suggestedAreas?.length > 0 && (
              <p className="mt-4 text-sm text-muted">
                <span className="font-medium text-fg/80">
                  Mention to your clinician:
                </span>{" "}
                {result.suggestedAreas.join(", ")} (not a diagnosis).
              </p>
            )}

            <p className="mt-5 border-t border-white/8 pt-3 font-mono text-[11px] text-muted/70">
              severity score {result.score} · explanation via{" "}
              {result.explanationSource} · {result.disclaimer}
            </p>
          </div>
        )}
      </section>

      <aside>
        <h3 className="font-display text-xl text-fg">Recent check-ins</h3>
        <div className="mt-3 space-y-2">
          {myHistory.length === 0 && (
            <p className="text-sm text-muted">No check-ins yet.</p>
          )}
          {myHistory.map((e) => (
            <div key={e.id} className="glass rounded-xl p-3">
              <div className="flex items-center justify-between">
                <UrgencyBadge level={e.level} />
                <span className="font-mono text-[10px] text-muted/70">
                  {new Date(e.createdAt).toLocaleString()}
                </span>
              </div>
              <p className="mt-2 text-sm text-fg/70">
                {e.symptomLabels?.slice(0, 4).join(", ") || "—"}
              </p>
            </div>
          ))}
        </div>
      </aside>
    </div>
  );
}
