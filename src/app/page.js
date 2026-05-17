"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import HeroSection from "./components/HeroSection";
import EnhancedJobCard from "./components/EnhancedJobCard";


const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
const statuses = ["All", "Open", "In Progress", "Closed"];

const categoryConfig = {
  All: {
    icon: null,
    label: "All Categories",
  },
  Plumbing: {
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
      </svg>
    ),
    label: "Plumbing",
  },
  Electrical: {
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
      </svg>
    ),
    label: "Electrical",
  },
  Painting: {
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
      </svg>
    ),
    label: "Painting",
  },
  Joinery: {
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
      </svg>
    ),
    label: "Joinery",
  },
  General: {
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 010 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 010-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    label: "General",
  },
};

const categories = ["All", "Plumbing", "Electrical", "Painting", "Joinery", "General"];

export default function HomePage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");
  const [status, setStatus] = useState("All");
  const [search, setSearch] = useState("");
  const [searchDebounced, setSearchDebounced] = useState("");
  const boardRef = useRef(null);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => setSearchDebounced(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  // Fetch jobs
  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (activeCategory !== "All") params.set("category", activeCategory);
        if (status !== "All") params.set("status", status);
        if (searchDebounced) params.set("search", searchDebounced);

        const res = await fetch(`${API}/jobs?${params.toString()}`);
        const data = await res.json();
        if (data.success) {
          setJobs(data.data);
        }
      } catch (err) {
        console.error("Failed to fetch jobs:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, [activeCategory, status, searchDebounced]);

  const scrollToBoard = () => {
    boardRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      {/* ========== HERO ========== */}
      <HeroSection onScrollToBoard={scrollToBoard} />

      {/* ========== JOB BOARD ========== */}
      <section 
        ref={boardRef} 
        className="w-full bg-[#f8faf9] dark:bg-gradient-to-br dark:from-[#0d1f16] dark:via-[#0a1a1f] dark:to-[#0e151e]"
      >
        {/* Banner with Search & Filters */}
        <div className="w-full bg-[#e8ece8] dark:bg-[#0a1a1f]/80 py-10 px-6 sm:px-10 lg:px-16 border-y border-[#d1d5db] dark:border-[#1e3a2c]">
          <div className="flex flex-col gap-6">
            <div className="text-center sm:text-left">
              <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 dark:text-[#e2f0e8] mb-2">
                Service Requests
              </h2>
              <p className="text-stone-500 dark:text-[#6b8c78] text-sm sm:text-base">
                Browse open jobs and connect with homeowners in your area.
              </p>
            </div>

            {/* Search + status filter */}
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <svg
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 dark:text-[#6b8c78]"
                  fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
                <input
                  type="text"
                  id="search-input"
                  placeholder="Search jobs by keyword…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-stone-300 dark:border-[#1e3a2c]
                             bg-white dark:bg-[#111f19] text-stone-800 dark:text-[#e2f0e8]
                             text-sm placeholder:text-stone-400 dark:placeholder:text-[#6b8c78]
                             focus:outline-none focus:ring-2 focus:ring-[#10b981]/30 focus:border-[#10b981]
                             transition-all duration-200"
                />
              </div>

              {/* Status filter */}
              <select
                id="status-filter"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="px-4 py-3 rounded-xl border border-stone-300 dark:border-[#1e3a2c]
                           bg-white dark:bg-[#111f19] text-stone-800 dark:text-[#e2f0e8]
                           text-sm min-w-[160px] cursor-pointer
                           focus:outline-none focus:ring-2 focus:ring-[#10b981]/30 focus:border-[#10b981]
                           transition-all duration-200"
              >
                {statuses.map((s) => (
                  <option key={s} value={s}>
                    {s === "All" ? "All Statuses" : s}
                  </option>
                ))}
              </select>
            </div>

            {/* Category Pills (Inline Filter) */}
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide py-2">
              {categories.map((cat) => {
                const isActive = activeCategory === cat;
                const config = categoryConfig[cat];
                return (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`shrink-0 inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all duration-150 cursor-pointer border
                      ${
                        isActive
                          ? "bg-[#10b981] text-white border-[#10b981] shadow-sm shadow-[#10b981]/20"
                          : "bg-white dark:bg-[#111f19] text-stone-600 dark:text-[#6b9e82] border-stone-200 dark:border-[#1e3a2c] hover:bg-stone-50 dark:hover:bg-[#1a2e24] dark:hover:text-[#e2f0e8]"
                      }`}
                  >
                    {config.icon}
                    {config.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Results Body */}
        <div className="px-6 sm:px-10 lg:px-16 py-12">
          {/* Results count */}
          <p className="text-sm text-stone-500 dark:text-[#6b8c78] mb-6">
            {loading ? "Loading…" : `${jobs.length} job${jobs.length !== 1 ? "s" : ""} found`}
          </p>

          {/* Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="rounded-2xl border border-stone-200 dark:border-[#1e3a2c] p-5 space-y-3 bg-[#e8ece8] dark:bg-[#1a2420]"
                >
                  <div className="flex items-start justify-between">
                    <div className="h-5 w-3/4 bg-stone-300 dark:bg-[#111f19] rounded-lg animate-pulse" />
                    <div className="h-6 w-16 bg-stone-300 dark:bg-[#111f19] rounded-full animate-pulse" />
                  </div>
                  <div className="h-4 w-full bg-stone-300 dark:bg-[#111f19] rounded-lg animate-pulse" />
                  <div className="h-4 w-2/3 bg-stone-300 dark:bg-[#111f19] rounded-lg animate-pulse" />
                  <div className="flex items-center justify-between pt-3 border-t border-stone-300 dark:border-[#1e3a2c]">
                    <div className="h-6 w-20 bg-stone-300 dark:bg-[#111f19] rounded-lg animate-pulse" />
                    <div className="h-4 w-24 bg-stone-300 dark:bg-[#111f19] rounded-lg animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          ) : jobs.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-stone-200 dark:bg-[#111f19] flex items-center justify-center">
                <svg className="w-10 h-10 text-stone-400 dark:text-[#10b981]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-stone-700 dark:text-[#e2f0e8] mb-2">
                No jobs found
              </h3>
              <p className="text-sm text-stone-500 dark:text-[#6b8c78] mb-6">
                Try adjusting your filters or post a new request.
              </p>
              <Link
                href="/new"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#10b981] text-white text-sm font-semibold
                           hover:bg-[#059669] shadow-lg shadow-[#10b981]/25 transition-all duration-200"
              >
                Post a Request
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {jobs.map((job) => (
                <EnhancedJobCard key={job._id} job={job} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}