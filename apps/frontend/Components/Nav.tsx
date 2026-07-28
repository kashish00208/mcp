"use client";

import { Inter } from "next/font/google";
import { useRouter } from "next/navigation";

const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });

export const Nav = () => {
  const router = useRouter();

  return (
    <header className="fixed top-0 inset-x-0 z-50 flex items-center justify-between px-8 py-6 max-w-7xl mx-auto bg-black/80 backdrop-blur-md">
      {/* Logo */}
      <div 
        onClick={() => router.push("/")} 
        className="text-xl md:text-2xl font-serif italic text-white cursor-pointer tracking-wide uppercase"
      >
        Open Papers
      </div>

      <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-zinc-400">
        <a href="#analysis" className="hover:text-white transition-colors">Analysis</a>
        <a href="#synthesis" className="hover:text-white transition-colors">Synthesis</a>
        <a href="#workspace" className="text-amber-200/90 hover:text-amber-200 transition-colors">Workspace</a>
        <a href="#about" className="hover:text-white transition-colors">About</a>
      </nav>

      {/* Action Buttons */}
      <div className="flex items-center space-x-3">
        <button
          onClick={() => router.push("/auth/sign-in")}
          className="text-zinc-300 text-xs px-4 py-2 font-medium rounded-md border border-zinc-800 bg-zinc-950 hover:bg-zinc-900 transition-all"
        >
          Sign in
        </button>
       
      </div>
    </header>
  );
};


