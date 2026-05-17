"use client";

import { useState, useEffect, use, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";

const API = process.env.NEXT_PUBLIC_API_URL || "trade-board-backend-hmvyx13j6-nethuchathuus-projects.vercel.app";

const statusConfig = {
  Open: {
    bg: "bg-emerald-50 dark:bg-emerald-900/30",
    text: "text-emerald-700 dark:text-emerald-400",
    dot: "bg-emerald-500",
  },
  "In Progress": {
    bg: "bg-amber-50 dark:bg-amber-900/30",
    text: "text-amber-700 dark:text-amber-400",
    dot: "bg-amber-500",
  },
  Closed: {
    bg: "bg-stone-100 dark:bg-stone-800",
    text: "text-stone-500 dark:text-stone-400",
    dot: "bg-stone-400",
  },
};

const categoryColors = {
  Plumbing: "bg-cyan-50 dark:bg-cyan-900/20 text-cyan-800 dark:text-cyan-400",
  Electrical: "bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-400",
  Painting: "bg-violet-50 dark:bg-violet-900/20 text-violet-800 dark:text-violet-400",
  Joinery: "bg-amber-50 dark:bg-amber-900/20 text-amber-800 dark:text-amber-400",
  General: "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-800 dark:text-emerald-400",
};

function formatRelativeTime(dateStr) {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 60) return `${diffMins} min ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

export default function JobDetailPage({ params }) {
  const { id } = use(params);
  const router = useRouter();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { user, token } = useContext(AuthContext);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await fetch(`${API}/jobs/${id}`);
        const data = await res.json();
        if (data.success) {
          setJob(data.data);
        } else {
          setError(data.message || "Job not found");
        }
      } catch {
        setError("Failed to connect to server");
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id]);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this job request?")) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`${API}/jobs/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (res.ok) {
        router.push("/");
      } else {
        const data = await res.json();
        alert(data.message || "Failed to delete job");
        setIsDeleting(false);
      }
    } catch (err) {
      console.error(err);
      alert("Error connecting to server");
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f0d1a] pt-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#160d1e] border border-[#2a1a3a] p-8 rounded-2xl space-y-4">
            <div className="h-4 w-24 bg-[#2a1a3a] rounded animate-pulse" />
            <div className="h-8 w-3/4 bg-[#2a1a3a] rounded animate-pulse" />
            <div className="h-4 w-full bg-[#2a1a3a] rounded animate-pulse" />
            <div className="h-4 w-2/3 bg-[#2a1a3a] rounded animate-pulse" />
            <div className="h-40 w-full mt-4 bg-[#2a1a3a] rounded-xl animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0f0d1a] flex items-center justify-center">
        <div className="text-center px-4">
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-[#4B1528] flex items-center justify-center">
            <svg className="w-10 h-10 text-[#F4C0D1]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-[#e8e0f0] mb-6">{error}</h3>
          <Link href="/" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#993556] text-white text-sm font-semibold hover:bg-[#D4537E] transition-all">
            Back to Jobs
          </Link>
        </div>
      </div>
    );
  }

  const sc = statusConfig[job.status] || statusConfig.Open;
  const cc = categoryColors[job.category] || categoryColors.General;

  const posterName = job.contactName || job.name || job.posterName || job.contact?.name;
  const posterEmail = job.contactEmail || job.email || job.contact?.email;
  const posterPhone = job.contactNumber || job.phone || job.contact?.phone;
  const showContact = !!posterName;
  const initials = posterName ? posterName.substring(0, 2).toUpperCase() : "JP";

  return (
    <div className="bg-[#0f0d1a] min-h-screen text-[#e8e0f0]">
      {/* Full-width Hero Banner */}
      <div className="w-full bg-gradient-to-b from-[#130d1f] to-[#1a0d1f] border-b border-[#2a1a3a] pt-12 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Back link */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-[#8a7aaa] hover:text-[#ED93B1] transition-colors mb-6"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            Back to Jobs
          </Link>

          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4 leading-tight">
                {job.title}
              </h1>
              
              <div className="flex flex-wrap items-center gap-4">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${sc.bg} ${sc.text}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
                  {job.status}
                </span>
                
                <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium ${cc}`}>
                  {job.category}
                </span>

                {job.location && (
                  <span className="flex items-center gap-1.5 text-sm text-[#AFA9EC]">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                    </svg>
                    {job.location}
                  </span>
                )}
                
                <span className="flex items-center gap-1.5 text-sm text-[#AFA9EC]">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {formatRelativeTime(job.createdAt)}
                </span>
              </div>

              {/* Owner Actions */}
              {user && job.user === user._id && (
                <div className="mt-6 flex items-center gap-3">
                  <button
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="px-4 py-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 text-sm font-medium border border-red-500/20 transition-colors flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    {isDeleting ? "Deleting..." : "Delete Job"}
                  </button>
                </div>
              )}
            </div>

            {/* Compensation in Hero */}
            {job.salary && (
              <div className="md:text-right shrink-0">
                <p className="text-sm font-medium text-[#8a7aaa] uppercase tracking-wider mb-1">
                  Compensation
                </p>
                <p className="text-2xl font-bold text-[#e8e0f0]">
                  {job.salary}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Grid Below Hero */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 -mt-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main column */}
          <div className="lg:col-span-2">
            <div className="bg-[#160d1e] rounded-2xl border border-[#2a1a3a] p-8 border-l-4 border-l-[#7F77DD] shadow-lg">
              <h2 className="text-sm font-semibold text-[#AFA9EC] uppercase tracking-wider mb-4">
                Description
              </h2>
              <p className="text-[#e8e0f0] leading-relaxed text-base whitespace-pre-wrap">
                {job.description}
              </p>
            </div>
          </div>

          {/* Sidebar column */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Poster Contact Card */}
            {showContact && (
              <div className="bg-[#160d1e] rounded-2xl border border-[#2a1a3a] p-6 shadow-lg">
                <h3 className="text-xs font-semibold text-[#8a7aaa] uppercase tracking-wider mb-4">
                  Posted by
                </h3>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#72243E] text-[#F4C0D1] flex items-center justify-center font-bold text-lg shrink-0">
                    {initials}
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-[15px] font-semibold text-[#e8e0f0] truncate">
                      {posterName}
                    </p>
                    {posterEmail && (
                      <a href={`mailto:${posterEmail}`} className="text-sm text-[#D4537E] hover:text-[#ED93B1] truncate block mt-0.5 transition-colors">
                        {posterEmail}
                      </a>
                    )}
                    {posterPhone && (
                      <p className="text-sm text-[#8a7aaa] truncate mt-0.5">
                        {posterPhone}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Apply / Contact Card */}
            <div className="bg-[#0d1022] rounded-2xl border border-[#2a1a3a] p-6 shadow-lg">
              <h3 className="text-lg font-semibold text-white mb-2">
                Interested in this job?
              </h3>
              <p className="text-sm text-[#8a7aaa] mb-6">
                Submit your details and the homeowner will be in touch.
              </p>
              <button className="w-full px-6 py-3.5 rounded-xl bg-[#993556] hover:bg-[#D4537E] text-white font-semibold transition-all">
                Apply Now
              </button>
              <button className="w-full mt-3 border border-[#3a1a4a] rounded-xl py-3 text-[#ED93B1] hover:bg-[#1a0d1f] text-sm font-medium transition-all">
                Save Job
              </button>
              
              <div className="mt-4 flex items-center justify-center gap-2 text-xs text-[#8a7aaa]">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                </svg>
                Your details are kept private
              </div>
            </div>

            {/* Job Details Card */}
            <div className="bg-[#160d1e] rounded-2xl border border-[#2a1a3a] p-6 shadow-lg">
              <h3 className="text-sm font-semibold text-[#AFA9EC] uppercase tracking-wider mb-4">
                Job Details
              </h3>

              <div className="space-y-0">
                <div className="flex items-center justify-between py-3 border-b border-[#2a1a3a]">
                  <span className="flex items-center gap-2 text-sm text-[#AFA9EC]">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                    Category
                  </span>
                  <span className="text-sm font-medium text-[#e8e0f0]">
                    {job.category}
                  </span>
                </div>

                <div className="flex items-center justify-between py-3 border-b border-[#2a1a3a]">
                  <span className="flex items-center gap-2 text-sm text-[#AFA9EC]">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                    </svg>
                    Location
                  </span>
                  <span className="text-sm font-medium text-[#e8e0f0]">
                    {job.location || "Not specified"}
                  </span>
                </div>

                <div className="flex items-center justify-between py-3 border-b border-[#2a1a3a]">
                  <span className="flex items-center gap-2 text-sm text-[#AFA9EC]">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Posted
                  </span>
                  <span className="text-sm font-medium text-[#e8e0f0]">
                    {formatRelativeTime(job.createdAt)}
                  </span>
                </div>

                <div className="flex items-center justify-between py-3">
                  <span className="flex items-center gap-2 text-sm text-[#AFA9EC]">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Status
                  </span>
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${sc.bg} ${sc.text}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
                    {job.status}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}