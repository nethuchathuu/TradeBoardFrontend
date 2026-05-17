"use client";

import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../app/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AuthPage({ defaultTab = "signup" }) {
  const [activeTab] = useState(defaultTab);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { register, login, user } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push("/");
    }
  }, [user, router]);

  const calculateStrength = (pass) => {
    let score = 0;
    if (!pass) return 0;
    if (pass.length >= 6) score += 1;
    if (pass.length >= 10) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;
    return score; // 0 to 5
  };

  const strength = calculateStrength(password);
  
  const getStrengthColor = () => {
    if (strength <= 1) return "bg-red-500";
    if (strength === 2 || strength === 3) return "bg-yellow-500";
    return "bg-green-500";
  };
  
  const getStrengthLabel = () => {
    if (!password) return "";
    if (strength <= 1) return "Weak";
    if (strength === 2 || strength === 3) return "Fair";
    return "Strong";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    if (activeTab === "signup" && password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsSubmitting(true);
    
    let res;
    if (activeTab === "signup") {
      res = await register(name, email, password);
    } else {
      res = await login(email, password);
    }

    if (res.success) {
      if (activeTab === "signup") {
        // Option 1: if they want to navigate to /login we can just push
        // Or if we just want to reset form and switch to login tab: router.push("/login")
        router.push("/login");
      } else {
        router.push("/");
      }
    } else {
      setError(res.message);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-row bg-[#0f0e0c]">
      {/* Left Panel */}
      <div className="hidden lg:flex w-[45%] bg-[#1a1710] flex-col justify-between p-12 border-r border-[#8a7a52]">
        <div>
          <Link href="/" className="text-[#f0e8d8] font-bold text-xl tracking-wider">
            TRADEBOARD
          </Link>
        </div>
        
        <div className="max-w-md">
          <h1 className="font-serif text-5xl text-[#f0e8d8] leading-tight mb-6">
            Find the right hands for every job.
          </h1>
          <p className="text-[#8a7a68] text-lg mb-8">
            TradeBoard connects homeowners with trusted local tradespeople.
          </p>
          <div className="w-16 border-b border-[#3a3020]"></div>
        </div>

        <div>
          <div className="bg-[#12100d] p-6 rounded-sm flex items-center justify-between mb-8">
            <div className="text-center">
              <p className="text-[#8a7a52] font-semibold">200+</p>
              <p className="text-[#8a7a68] text-xs uppercase tracking-wider mt-1">Jobs Posted</p>
            </div>
            <div className="text-center">
              <p className="text-[#8a7a52] font-semibold">150+</p>
              <p className="text-[#8a7a68] text-xs uppercase tracking-wider mt-1">Tradespeople</p>
            </div>
            <div className="text-center">
              <p className="text-[#8a7a52] font-semibold">4.8★</p>
              <p className="text-[#8a7a68] text-xs uppercase tracking-wider mt-1">Rating</p>
            </div>
          </div>
          <p className="text-[#5a5040] text-xs uppercase tracking-widest">
            EST. 2024
          </p>
        </div>
      </div>

      {/* Right Panel */}
      <div className="w-full lg:w-[55%] px-10 py-16 flex flex-col justify-center max-w-md mx-auto">
        <div className="mb-12">
          <h2 className="font-serif text-3xl text-[#f0e8d8] font-normal mb-2">
            {activeTab === "signup" ? "Create your account" : "Welcome back"}
          </h2>
          <p className="text-[#8a7a68] text-sm">
            {activeTab === "signup" ? "Join TradeBoard today." : "Sign in to your TradeBoard account"}
          </p>
        </div>

        {error && (
          <div className="mb-8 border-l-2 border-[#c0392b] pl-3 py-1 bg-transparent">
            <p className="text-[#e07060] text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {activeTab === "signup" && (
            <div className="relative group mt-4">
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full bg-transparent border-b border-[#3a3020] text-[#f0e8d8] placeholder-transparent focus:outline-none focus:border-[#8a7a52] py-3 text-sm transition-colors peer"
                placeholder="Full Name"
              />
              <label
                htmlFor="name"
                className="absolute left-0 -top-3.5 text-xs text-[#5a5040] transition-all duration-300 peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-focus:-top-3.5 peer-focus:text-xs peer-focus:text-[#8a7a52] pointer-events-none"
              >
                Full Name
              </label>
            </div>
          )}

          <div className="relative group mt-4">
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-transparent border-b border-[#3a3020] text-[#f0e8d8] placeholder-transparent focus:outline-none focus:border-[#8a7a52] py-3 text-sm transition-colors peer"
              placeholder="Email Address"
            />
            <label
              htmlFor="email"
              className="absolute left-0 -top-3.5 text-xs text-[#5a5040] transition-all duration-300 peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-focus:-top-3.5 peer-focus:text-xs peer-focus:text-[#8a7a52] pointer-events-none"
            >
              Email Address
            </label>
          </div>

          <div className="relative group mt-4">
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-transparent border-b border-[#3a3020] text-[#f0e8d8] placeholder-transparent focus:outline-none focus:border-[#8a7a52] py-3 text-sm transition-colors peer"
              placeholder="Password"
            />
            <label
              htmlFor="password"
              className="absolute left-0 -top-3.5 text-xs text-[#5a5040] transition-all duration-300 peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-focus:-top-3.5 peer-focus:text-xs peer-focus:text-[#8a7a52] pointer-events-none"
            >
              Password
            </label>
            
            {activeTab === "signup" && password && (
              <div className="mt-2">
                <div className="flex gap-1 h-1 w-full mb-1">
                  {[1, 2, 3, 4, 5].map((level) => (
                    <div 
                      key={level} 
                      className={`h-full flex-1 rounded-full transition-colors ${level <= strength ? getStrengthColor() : "bg-[#3a3020]"}`}
                    ></div>
                  ))}
                </div>
                <p className="text-xs text-[#8a7a68] text-right">{getStrengthLabel()}</p>
              </div>
            )}
          </div>
          
          {activeTab === "signup" && (
            <div className="relative group mt-4">
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full bg-transparent border-b border-[#3a3020] text-[#f0e8d8] placeholder-transparent focus:outline-none focus:border-[#8a7a52] py-3 text-sm transition-colors peer"
                placeholder="Confirm Password"
              />
              <label
                htmlFor="confirmPassword"
                className="absolute left-0 -top-3.5 text-xs text-[#5a5040] transition-all duration-300 peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-focus:-top-3.5 peer-focus:text-xs peer-focus:text-[#8a7a52] pointer-events-none"
              >
                Confirm Password
              </label>
              
              {confirmPassword && (
                <p className={`text-xs mt-2 ${password === confirmPassword ? 'text-green-500' : 'text-red-500'}`}>
                  {password === confirmPassword ? '✓ Passwords match' : '✗ Passwords do not match'}
                </p>
              )}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting || (activeTab === "signup" && password !== confirmPassword)}
            className="w-full py-3.5 mt-8 bg-[#8a7a52] hover:bg-[#a08a5c] text-[#0f0e0c] rounded-none font-medium text-sm tracking-widest uppercase transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting
              ? activeTab === "signup"
                ? "CREATING..."
                : "SIGNING IN..."
              : activeTab === "signup"
              ? "CREATE ACCOUNT"
              : "SIGN IN"}
          </button>
        </form>

        <p className="text-xs mt-8 text-[#5a5040] text-center">
          {activeTab === "signup" ? (
            <>
              Already have an account?{" "}
              <Link href="/login" className="text-[#8a7a52] hover:text-[#a08a5c] transition-colors">
                Sign in
              </Link>
            </>
          ) : (
            <>
              Don't have an account?{" "}
              <Link href="/signup" className="text-[#8a7a52] hover:text-[#a08a5c] transition-colors">
                Sign up
              </Link>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
