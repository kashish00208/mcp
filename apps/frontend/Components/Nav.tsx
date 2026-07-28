"use client";

import { Inter } from "next/font/google";
import { useRouter } from "next/navigation";

const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"] });

export const Nav = () => {
  const router = useRouter();

  return (
    <header className="flex items-center justify-between px-8 py-6 max-w-7xl mx-auto w-full">
      <div 
        onClick={() => router.push("/")} 
        className="text-2xl font-black text-slate-900 cursor-pointer tracking-tight"
      >
        OPEN PAPERS
      </div>

      <nav className="hidden md:flex items-center space-x-8 text-sm font-semibold text-slate-600">
        <a href="#home" className="text-blue-600 hover:text-blue-700 transition-colors">Home</a>
        <a href="#features" className="hover:text-slate-900 transition-colors">Features</a>
        <a href="#about" className="hover:text-slate-900 transition-colors">About us</a>
        <a href="#contact" className="hover:text-slate-900 transition-colors">Contact</a>
      </nav>

      <div className="flex items-center space-x-4">
        <button
          onClick={() => router.push("/auth/sign-in")}
          className="text-slate-800 text-sm font-semibold hover:text-slate-900 transition-colors px-2 py-1"
        >
          Log in
        </button>
        <button
          onClick={() => router.push("/auth/sign-up")}
          className="text-white text-sm font-semibold px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 transition-all shadow-md shadow-blue-500/20"
        >
          Sign up
        </button>
      </div>
    </header>
  );
};

