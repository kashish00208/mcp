"use client";

import { Inter, JetBrains_Mono } from "next/font/google";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

const inter = Inter({ subsets: ["latin"], weight: ["400", "700", "900"] });
const mono = JetBrains_Mono({ subsets: ["latin"], weight: ["500", "700"] });

export const Nav = () => {
  const router = useRouter();

  return (
    <header
      className={`${inter.className} sticky top-0 z-50 w-full bg-white border-b-2 border-black pb-3 transition-all`}
    >
      <div className="max-w-fu mx-auto flex items-center justify-between">
        <div
          onClick={() => router.push("/")}
          className="group flex items-center gap-2.5 cursor-pointer select-none"
        >
          <span className="text-xl sm:text-2xl font-black text-black tracking-tighter uppercase">
            OPEN PAPERS
          </span>
          <span
            className={`${mono.className} text-[10px] font-bold bg-black text-white px-1.5 py-0.5 uppercase tracking-widest hidden sm:inline-block border border-black`}
          >
            BETA
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => router.push("/auth/sign-in")}
            className="bg-white hover:bg-neutral-100 text-black text-xs font-mono font-bold uppercase tracking-wider border-2 border-black px-4 sm:px-5 py-2 sm:py-2.5 transition-all shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:shadow-none"
          >
            Log in
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => router.push("/auth/sign-up")}
            className="bg-black hover:bg-neutral-800 text-white text-xs font-mono font-bold uppercase tracking-wider border-2 border-black px-4 sm:px-5 py-2 sm:py-2.5 transition-all shadow-[3px_3px_0px_0px_rgba(0,0,0,0.25)] active:shadow-none"
          >
            Sign up
          </motion.button>
        </div>
      </div>
    </header>
  );
};
