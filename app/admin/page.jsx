"use client";

import { useStore } from "../../lib/store.js";

const LEVELS = [
  { id: "emergency", label: "Emergency", color: "#FF6B6B" },
  { id: "urgent", label: "Urgent", color: "#F2A33C" },
  { id: "routine", label: "Routine", color: "#5AA9E6" },
  { id: "selfcare", label: "Self-care", color: "#4FD18B" },
];

function Stat({ label, value, sub, delay }) {
  return (
    <div className="pop glass rounded-2xl p-5" style={{ animationDelay: delay }}>
      <p className="font-mono text-xs uppercase tracking-wider text-muted">
        {label}
      </p>
      <p className="mt-1 font-display text-4xl text-fg">{value}</p>
      {sub && <p className="mt-1 text-sm text-muted">{sub}</p>}
    </div>
  );
}

export default function AdminPage() {
  const { encounters, reset } = useStore();
  const total = encounters.length;

  const byLevel = LEVELS.map((l) => ({
    ...l,
    count: encounters.filter((e) => e.level === l.id).length,
  }));
  const max = Math.max(1, ...byLevel.map((l) => l.count));

  const redFlags = encounters.filter((e) => e.overridden).length;
  const redFlagRate = total ? Math.round((redFlags / total) * 100) : 0;

  const symptomCounts = {};
  encounters.forEach((e) =>
    (e.symptomLabels || []).forEach((s) => {
      symptomCounts[s] = (symptomCounts[s] || 0) + 1;
    })
  );
  const topSymptoms = Object.entries(symptomCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6);

  return (
    <div className="rise">
      <div className="flex items-end justify-between">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-teal">
            Oversight view
          </p>
          <h1 className="font-display text-3xl text-fg">System metrics</h1>
        </div>
        <button
          onClick={reset}
          className="rounded-full border border-line px-4 py-2 text-sm text-muted transition hover:bg-white/5 hover:text-fg"
        >
          Reset demo data
        </button>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <Stat label="Total triages" value={total} delay="0ms" />
        <Stat
          label="Red-flag overrides"
          value={redFlags}
          sub={`${redFlagRate}% of all triages`}
          delay="80ms"
        />
        <Stat
          label="Emergency + Urgent"
          value={byLevel[0].count + byLevel[1].count}
          sub="high-priority cases"
          delay="160ms"
        />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <div className="pop glass rounded-2xl p-5" style={{ animationDelay: "200ms" }}>
          <h3 className="font-display text-xl text-fg">Urgency distribution</h3>
          <div className="mt-4 space-y-3">
            {byLevel.map((l) => (
              <div key={l.id}>
                <div className="flex justify-between text-sm text-muted">
                  <span>{l.label}</span>
                  <span className="font-mono">{l.count}</span>
                </div>
                <div className="mt-1 h-2.5 rounded-full bg-white/8">
                  <div
                    className="bar-anim h-2.5 rounded-full"
                    style={{
                      width: `${(l.count / max) * 100}%`,
                      backgroundColor: l.color,
                      boxShadow: `0 0 10px ${l.color}66`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="pop glass rounded-2xl p-5" style={{ animationDelay: "280ms" }}>
          <h3 className="font-display text-xl text-fg">Top reported symptoms</h3>
          <div className="mt-4 space-y-2">
            {topSymptoms.length === 0 && (
              <p className="text-sm text-muted">No data yet.</p>
            )}
            {topSymptoms.map(([name, count]) => (
              <div
                key={name}
                className="flex items-center justify-between rounded-lg border border-teal/15 bg-teal/10 px-3 py-2 text-sm"
              >
                <span className="text-fg/85">{name}</span>
                <span className="font-mono text-muted">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <p className="mt-6 font-mono text-[11px] text-muted/70">
        Metrics computed live from triage encounters. Demo data persists in your
        browser; swap in Supabase for multi-user persistence (see README).
      </p>
    </div>
  );
}
