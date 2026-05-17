"use client";

import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";

const API = process.env.NEXT_PUBLIC_API_URL || "https://trade-board-backend.vercel.app/api";
const categories = ["Plumbing", "Electrical", "Painting", "Joinery", "General"];

export default function NewJobPage() {
  const router = useRouter();
  const { user, token, loading } = useContext(AuthContext);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "General",
    location: "",
    contactName: "",
    contactEmail: "",
    contactNumber: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const errs = {};
    if (!form.title.trim()) errs.title = "Title is required";
    else if (form.title.length > 150) errs.title = "Title cannot exceed 150 characters";
    if (!form.description.trim()) errs.description = "Description is required";
    else if (form.description.length > 2000) errs.description = "Description cannot exceed 2000 characters";
    if (form.contactEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.contactEmail)) {
      errs.contactEmail = "Please enter a valid email address";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");
    if (!validate()) return;

    setSubmitting(true);
    try {
      const res = await fetch(`${API}/jobs`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        router.push("/");
      } else {
        setServerError(data.message || "Something went wrong");
      }
    } catch {
      setServerError("Failed to connect to server. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass = (field) =>
    `w-full px-4 py-3.5 rounded-xl bg-[#071412] border ${
      errors[field] ? "border-[#c0392b] focus:ring-[#c0392b]/20 focus:border-[#c0392b]" : "border-[#1a3a32] focus:ring-[#c9a84c]/30 focus:border-[#c9a84c]"
    } text-[#e0f0ec] placeholder:text-[#3a6055] focus:outline-none focus:ring-2 transition-all duration-200`;

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-[#050f0d] flex items-center justify-center">
        <svg className="w-10 h-10 text-[#c9a84c] animate-spin" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      </div>
    );
  }

  const descLen = form.description.length;
  const charColor = descLen >= 2000 ? "text-[#e07060]" : descLen >= 1800 ? "text-[#c9a84c]" : "text-[#4a7a6a]";

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#050f0d] flex flex-col items-center">
      {/* Decorative Header Bar */}
      <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-transparent via-[#c9a84c] to-transparent mb-0 z-50"></div>

      <div className="w-full py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center mt-[3px]">
        {/* Header Area Zone */}
        <div className="w-full max-w-3xl bg-[#071412] py-5 px-6 border border-[#1a3a32] rounded-xl mb-6 flex justify-between items-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-[#8ab5a8] hover:text-[#c9a84c] bg-[#0d2420] border border-[#1a3a32] hover:border-[#c9a84c] px-4 py-2 rounded-lg transition-all"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            Back to Jobs
          </Link>
          <span className="text-[#4a7a6a] text-sm tracking-widest font-semibold uppercase hidden sm:block">TradeBoard</span>
        </div>

        {/* Form Card */}
        <div className="relative z-10 w-full max-w-3xl bg-[#0a1e1a] border border-[#1a3a32] border-t-[3px] border-t-[#c9a84c] shadow-[0_8px_40px_0_rgba(0,0,0,0.6)] rounded-2xl p-8 sm:p-12">
          
          <div className="relative">
            <div className="mb-10 text-left">
              <h1 className="text-3xl sm:text-4xl font-bold font-sans text-[#e0f0ec] tracking-tight mb-3">
                Post a Service Request
              </h1>
              <p className="text-[#7aaa98] font-normal text-base">
                Describe what you need — verified tradespeople will find you.
              </p>
              <div className="w-10 h-0.5 bg-[#c9a84c] mt-4" />
            </div>

            {serverError && (
              <div className="mb-8 p-4 rounded-r-lg bg-[#1a0d0d] border-l-[3px] border-l-[#c0392b] text-sm font-medium text-[#e07060] flex items-start gap-3">
                <svg className="w-5 h-5 text-[#e07060] shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {serverError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-7" id="new-job-form">
              {/* Title */}
              <div>
                <label htmlFor="title" className="block text-xs font-semibold text-[#8ab5a8] mb-2 uppercase tracking-widest">
                  Job Title <span className="text-[#c9a84c]">*</span>
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder='e.g. "Need a plumber for a leaking kitchen tap"'
                  className={inputClass("title")}
                />
                {errors.title && <p className="mt-2 text-xs font-semibold text-[#e07060]">{errors.title}</p>}
              </div>

              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-xs font-semibold text-[#8ab5a8] mb-2 uppercase tracking-widest">
                  Detailed Description <span className="text-[#c9a84c]">*</span>
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={5}
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Describe the work needed, specific requirements, and any preferred timings..."
                  className={inputClass("description") + " resize-none leading-relaxed"}
                />
                <div className="flex justify-between mt-2">
                  {errors.description && <p className="text-xs font-semibold text-[#e07060]">{errors.description}</p>}
                  <p className={`text-xs font-bold ${charColor} ml-auto`}>{descLen}/2000</p>
                </div>
              </div>

              {/* Category + Location row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-7">
                <div>
                  <label htmlFor="category" className="block text-xs font-semibold text-[#8ab5a8] mb-2 uppercase tracking-widest">
                    Category
                  </label>
                  <div className="relative group">
                    <select
                      id="category"
                      name="category"
                      value={form.category}
                      onChange={handleChange}
                      className={inputClass("category") + " cursor-pointer appearance-none pr-10"}
                    >
                      {categories.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-[#4a7a6a] group-focus-within:text-[#c9a84c] transition-colors">
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>
                <div>
                  <label htmlFor="location" className="block text-xs font-semibold text-[#8ab5a8] mb-2 uppercase tracking-widest">
                    Location
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#4a7a6a] group-focus-within:text-[#c9a84c] transition-colors">
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <input
                      type="text"
                      id="location"
                      name="location"
                      value={form.location}
                      onChange={handleChange}
                      placeholder="e.g. Colombo"
                      className={inputClass("location") + " pl-11"}
                    />
                  </div>
                </div>
              </div>

              {/* Contact row */}
              <div className="pt-6 mt-6 border-t border-[#1a3a32]">
                <p className="text-xs font-semibold text-[#c9a84c] uppercase tracking-widest mb-5 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#c9a84c] inline-block"></span>
                  Contact Details
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-7">
                  <div>
                    <label htmlFor="contactName" className="block text-xs font-semibold text-[#8ab5a8] mb-2 uppercase tracking-widest">
                      Contact Name
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#4a7a6a] group-focus-within:text-[#c9a84c] transition-colors">
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <input
                        type="text"
                        id="contactName"
                        name="contactName"
                        value={form.contactName}
                        onChange={handleChange}
                        placeholder="Your name"
                        className={inputClass("contactName") + " pl-11"}
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="contactEmail" className="block text-xs font-semibold text-[#8ab5a8] mb-2 uppercase tracking-widest">
                      Contact Email
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#4a7a6a] group-focus-within:text-[#c9a84c] transition-colors">
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <input
                        type="email"
                        id="contactEmail"
                        name="contactEmail"
                        value={form.contactEmail}
                        onChange={handleChange}
                        placeholder="you@gmail.com"
                        className={inputClass("contactEmail") + " pl-11"}
                      />
                    </div>
                    {errors.contactEmail && <p className="mt-2 text-xs font-semibold text-[#e07060]">{errors.contactEmail}</p>}
                  </div>
                  <div>
                    <label htmlFor="contactNumber" className="block text-xs font-semibold text-[#8ab5a8] mb-2 uppercase tracking-widest">
                      Contact Number
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#4a7a6a] group-focus-within:text-[#c9a84c] transition-colors">
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                      </div>
                      <input
                        type="tel"
                        id="contactNumber"
                        name="contactNumber"
                        value={form.contactNumber}
                        onChange={handleChange}
                        placeholder="07X XXX XXXX"
                        className={inputClass("contactNumber") + " pl-11"}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit */}
              <div className="pt-6 mt-2">
                <button
                  type="submit"
                  id="submit-job"
                  disabled={submitting}
                  className="w-full py-4 rounded-xl bg-[#c9a84c] hover:bg-[#e8c55a] active:bg-[#9a7830] text-[#050f0d] text-sm font-bold tracking-widest uppercase shadow-[0_0_24px_rgba(201,168,76,0.25)] hover:shadow-[0_0_36px_rgba(201,168,76,0.4)] hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0 flex items-center justify-center gap-3 cursor-pointer"
                >
                  {submitting ? (
                    <>
                      <svg className="w-5 h-5 animate-spin text-[#050f0d]" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      POSTING...
                    </>
                  ) : (
                    <>
                      POST SERVICE REQUEST
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}