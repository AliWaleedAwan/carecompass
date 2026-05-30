"use client";

import { useStore } from "../../lib/store.js";
import UrgencyBadge from "../../components/UrgencyBadge.jsx";

const ORDER = { emergency: 0, urgent: 1, routine: 2, selfcare: 3 };

export default function ProviderPage() {
  const { encounters, ready, updateStatus } = useStore();

  const queue = [...encounters]
    .filter((e) => e.status !== "closed")
    .sort(
      (a, b) =>
        ORDER[a.level] - ORDER[b.level] ||
        new Date(b.createdAt) - new Date(a.createdAt)
    );

  return (
    <div className="rise">
      <div className="flex items-end justify-between">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-teal">
            Client view
          </p>
          <h1 className="font-display text-3xl text-fg">Referral queue</h1>
          <p className="mt-1 text-muted">
            Incoming triaged patients, most urgent first.
          </p>
        </div>
        <span className="glass rounded-full px-3 py-1 font-mono text-sm text-fg/80">
          {queue.length} open
        </span>
      </div>

      <div className="mt-6 space-y-3">
        {ready && queue.length === 0 && (
          <div className="rounded-2xl border border-dashed border-line bg-white/[0.02] p-8 text-center text-muted">
            No referrals yet. Submit a triage from the Patient view to see it
            appear here.
          </div>
        )}

        {queue.map((e, i) => (
          <div
            key={e.id}
            className="pop glass flex flex-col gap-3 rounded-2xl p-5 sm:flex-row sm:items-center sm:justify-between"
            style={{
              animationDelay: `${i * 60}ms`,
              borderLeft:
                e.level === "emergency" ? "3px solid #FF6B6B" : undefined,
            }}
          >
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-3">
                <UrgencyBadge level={e.level} />
                {e.overridden && (
                  <span className="font-mono text-[10px] uppercase text-emergency">
                    red-flag
                  </span>
                )}
                {e.status === "accepted" && (
                  <span className="font-mono text-[10px] uppercase text-teal">
                    accepted
                  </span>
                )}
              </div>
              <p className="mt-2 text-fg/90">{e.symptomLabels?.join(", ") || "—"}</p>
              {e.freeText && (
                <p className="mt-1 text-sm italic text-muted">“{e.freeText}”</p>
              )}
              <p className="mt-1 font-mono text-[10px] text-muted/70">
                {e.id} · {new Date(e.createdAt).toLocaleString()}
              </p>
            </div>

            <div className="flex shrink-0 gap-2">
              {e.status !== "accepted" && (
                <button
                  onClick={() => updateStatus(e.id, "accepted")}
                  className="rounded-full bg-teal px-4 py-2 text-sm font-semibold text-[#06231C] transition hover:brightness-110 active:scale-95"
                >
                  Accept
                </button>
              )}
              <button
                onClick={() => updateStatus(e.id, "closed")}
                className="rounded-full border border-line px-4 py-2 text-sm text-muted transition hover:bg-white/5 hover:text-fg"
              >
                Close
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
