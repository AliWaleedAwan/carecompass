import Link from "next/link";

const CARDS = [
  {
    href: "/patient",
    tag: "User view",
    title: "Patient",
    body: "Describe symptoms, get an urgency level and a clear next step in seconds.",
  },
  {
    href: "/provider",
    tag: "Client view",
    title: "Provider",
    body: "An incoming referral queue, auto-sorted by urgency, ready to accept or schedule.",
  },
  {
    href: "/admin",
    tag: "Oversight view",
    title: "Admin",
    body: "Live metrics: triage volume, urgency mix, red-flag rate and top symptoms.",
  },
];

export default function Home() {
  return (
    <div>
      <p className="rise font-mono text-xs uppercase tracking-[0.2em] text-teal">
        Sustainable Development Goal 3 · Good Health &amp; Well-being
      </p>
      <h1
        className="rise mt-3 max-w-3xl font-display text-4xl leading-tight text-fg sm:text-6xl"
        style={{ animationDelay: "80ms" }}
      >
        The right care, at the right time, for{" "}
        <span className="bg-gradient-to-r from-teal to-routine bg-clip-text text-transparent">
          everyone.
        </span>
      </h1>
      <p
        className="rise mt-5 max-w-2xl text-lg text-muted"
        style={{ animationDelay: "160ms" }}
      >
        CareCompass is a health-triage agent. It reads a patient&apos;s symptoms,
        decides how urgent they are, and routes them &mdash; from emergency to
        self-care &mdash; reducing avoidable ER load and widening access to timely
        guidance (SDG target&nbsp;3.8).
      </p>

      <div className="mt-12 grid gap-4 sm:grid-cols-3">
        {CARDS.map((c, i) => (
          <Link
            key={c.href}
            href={c.href}
            className="rise group glass rounded-2xl p-5 transition hover:-translate-y-1.5 hover:border-teal/40 hover:shadow-2xl hover:shadow-teal/10"
            style={{ animationDelay: `${240 + i * 90}ms` }}
          >
            <span className="font-mono text-[10px] uppercase tracking-wider text-teal">
              {c.tag}
            </span>
            <h3 className="mt-1 font-display text-2xl text-fg">{c.title}</h3>
            <p className="mt-2 text-sm text-muted">{c.body}</p>
            <span className="mt-4 inline-block text-sm font-medium text-teal transition group-hover:translate-x-1">
              Open →
            </span>
          </Link>
        ))}
      </div>

      <p
        className="rise mt-12 max-w-2xl text-sm text-muted/70"
        style={{ animationDelay: "560ms" }}
      >
        Decision-support only — not a medical diagnosis. Data derived from the
        Kaggle Disease-Symptom dataset. Works fully without any paid API; an
        optional free Gemini key adds natural-language explanations.
      </p>
    </div>
  );
}
