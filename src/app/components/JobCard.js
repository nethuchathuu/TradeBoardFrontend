import Link from "next/link";
import StatusBadge from "./StatusBadge";

const categoryColors = {
  Plumbing: "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
  Electrical: "bg-yellow-50 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300",
  Painting: "bg-pink-50 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300",
  Joinery: "bg-orange-50 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300",
  General: "bg-surface-100 text-surface-600 dark:bg-surface-700 dark:text-surface-300",
};

export default function JobCard({ job }) {
  const timeAgo = (dateStr) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    if (days < 30) return `${days}d ago`;
    return new Date(dateStr).toLocaleDateString();
  };

  return (
    <Link href={`/jobs/${job._id}`} id={`job-card-${job._id}`}>
      <div className="glass-card rounded-2xl p-5 cursor-pointer group animate-fade-in">
        <div className="flex items-start justify-between gap-3 mb-3">
          <h3 className="flex-1 min-w-0 text-base font-semibold text-surface-800 dark:text-surface-100 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-200 line-clamp-2">
            {job.title}
          </h3>
          <StatusBadge status={job.status} />
        </div>
        <p className="text-sm text-surface-500 dark:text-surface-400 line-clamp-2 mb-4 leading-relaxed">
          {job.description}
        </p>
        <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-surface-100 dark:border-surface-700/50">
          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium ${categoryColors[job.category] || categoryColors.General}`}>
            {job.category}
          </span>
          {job.location && (
            <span className="inline-flex items-center gap-1 text-xs text-surface-500 dark:text-surface-400">
              📍 {job.location}
            </span>
          )}
          <span className="ml-auto text-xs text-surface-400 dark:text-surface-500">
            {timeAgo(job.createdAt)}
          </span>
        </div>
      </div>
    </Link>
  );
}
