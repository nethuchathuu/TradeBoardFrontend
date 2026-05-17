"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { user, logout } = useContext(AuthContext);

  const links = [
    { href: "/", label: "Home" },
    { href: "/new", label: "Post a Job" },
  ];

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-xl bg-white/90 border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left side: Logo and Nav links */}
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2 group" id="navbar-logo">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:shadow-emerald-500/40 transition-shadow duration-300">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <span className="text-xl font-bold text-emerald-600">TradeBoard</span>
            </Link>

            <div className="hidden md:flex items-center gap-1">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={(e) => {
                    if (link.href === "/" && pathname === "/") {
                      e.preventDefault();
                      document.getElementById("hero")?.scrollIntoView({ behavior: "smooth" });
                    }
                  }}
                  id={`nav-${link.label.toLowerCase().replace(/\s/g, "-")}`}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                    ${
                      pathname === link.href
                        ? "bg-emerald-50 text-emerald-700"
                        : "text-stone-600 hover:text-stone-900 hover:bg-stone-100"
                    }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Right side: Auth and Mobile Menu */}
          <div className="flex items-center gap-3">
            {/* Desktop Auth */}
            <div className="hidden md:flex items-center gap-3">
              {user ? (
                <div className="relative">
                  <button 
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center gap-2 px-2 py-1 rounded-full hover:bg-stone-100 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm uppercase">
                      {user.name.charAt(0)}
                    </div>
                    <span className="text-sm font-medium text-stone-700">{user.name.split(" ")[0]}</span>
                    <svg className="w-4 h-4 text-stone-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white border border-stone-200 rounded-xl shadow-lg py-1 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                      <button 
                        onClick={() => {
                          logout();
                          setDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <Link href="/login" className="text-sm font-medium text-stone-600 hover:text-emerald-700 transition-colors">
                    Log in
                  </Link>
                  <Link href="/signup" className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium transition-colors shadow-sm shadow-emerald-600/20">
                    Sign up
                  </Link>
                </>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden w-10 h-10 rounded-xl flex items-center justify-center
                         bg-stone-100 hover:bg-stone-200
                         border border-stone-200 transition-all duration-200 cursor-pointer"
              id="mobile-menu-toggle"
              aria-label="Toggle menu"
            >
              <svg className={`w-5 h-5 text-stone-600 transition-transform duration-300 ${mobileOpen ? "rotate-90" : ""}`}
                fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                {mobileOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile dropdown */}
        {mobileOpen && (
          <div className="md:hidden pb-4">
            <div className="flex flex-col gap-1 pt-2 border-t border-stone-200">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={(e) => {
                    if (link.href === "/" && pathname === "/") {
                      e.preventDefault();
                      document.getElementById("hero")?.scrollIntoView({ behavior: "smooth" });
                    }
                    setMobileOpen(false);
                  }}
                  className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200
                    ${
                      pathname === link.href
                        ? "bg-emerald-50 text-emerald-700"
                        : "text-stone-600 hover:bg-stone-100"
                    }`}
                >
                  {link.label}
                </Link>
              ))}

              <div className="mt-4 pt-4 border-t border-stone-100 px-4 flex flex-col gap-2">
                {user ? (
                  <>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm uppercase">
                        {user.name.charAt(0)}
                      </div>
                      <span className="text-sm font-medium text-stone-700">{user.name}</span>
                    </div>
                    <button 
                      onClick={() => {
                        logout();
                        setMobileOpen(false);
                      }}
                      className="text-left py-2.5 text-sm font-medium text-red-600 flex items-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link href="/login" onClick={() => setMobileOpen(false)} className="w-full text-center py-2.5 rounded-lg border border-stone-200 text-stone-700 font-medium text-sm">
                      Log in
                    </Link>
                    <Link href="/signup" onClick={() => setMobileOpen(false)} className="w-full text-center py-2.5 rounded-lg bg-emerald-600 text-white font-medium text-sm shadow-sm">
                      Sign up
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
