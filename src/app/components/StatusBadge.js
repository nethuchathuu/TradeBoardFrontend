export default function StatusBadge({ status }) {
  const config = {
    Open: {
      bg: "bg-emerald-50 dark:bg-emerald-900/30",
      text: "text-emerald-700 dark:text-emerald-300",
      dot: "bg-emerald-500",
      ring: "ring-emerald-500/20 dark:ring-emerald-400/20",
    },
    "In Progress": {
      bg: "bg-amber-50 dark:bg-amber-900/30",
      text: "text-amber-700 dark:text-amber-300",
      dot: "bg-amber-500",
      ring: "ring-amber-500/20 dark:ring-amber-400/20",
    },
    Closed: {
      bg: "bg-surface-100 dark:bg-surface-700/50",
      text: "text-surface-600 dark:text-surface-400",
      dot: "bg-surface-400",
      ring: "ring-surface-400/20",
    },
  };

  const c = config[status] || config["Open"];

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ring-1 ${c.bg} ${c.text} ${c.ring}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot} ${status === "Open" ? "animate-pulse" : ""}`} />
      {status}
    </span>
  );
}
