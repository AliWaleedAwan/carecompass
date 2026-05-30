const META = {
  emergency: { label: "Emergency", dot: "#FF6B6B" },
  urgent: { label: "Urgent", dot: "#F2A33C" },
  routine: { label: "Routine", dot: "#5AA9E6" },
  selfcare: { label: "Self-care", dot: "#4FD18B" },
};

export default function UrgencyBadge({ level, size = "md" }) {
  const m = META[level] || META.selfcare;
  const pad = size === "lg" ? "px-4 py-2 text-base" : "px-3 py-1 text-sm";
  return (
    <span
      className={`pill rounded-full ${pad}`}
      style={{
        backgroundColor: m.dot + "22",
        color: m.dot,
        border: `1px solid ${m.dot}55`,
      }}
    >
      <span
        className="inline-block h-2 w-2 rounded-full"
        style={{ backgroundColor: m.dot, boxShadow: `0 0 8px ${m.dot}` }}
      />
      {m.label}
    </span>
  );
}
