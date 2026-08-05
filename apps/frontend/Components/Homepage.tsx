"use client";

import { useState } from "react";
import { Inter, JetBrains_Mono } from "next/font/google";
import { motion, Variants } from "framer-motion";
import { useRouter } from "next/navigation";
import { Nav } from "./Nav";

const inter = Inter({ subsets: ["latin"], weight: ["400", "600", "700", "900"] });
const mono = JetBrains_Mono({ subsets: ["latin"], weight: ["400", "500", "700"] });

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.05 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  },
};

export default function Homepage() {
  const router = useRouter();
  const [activeModel, setActiveModel] = useState<"gpt" | "claude" | "gemini">("claude");

  const handleDemoScroll = () => {
    const demoElement = document.getElementById("demo");
    if (demoElement) {
      demoElement.scrollIntoView({ behavior: "smooth" });
    } else {
      router.push("#demo");
    }
  };

  return (
    <div className={`${inter.className} w-full bg-white text-black min-h-screen flex flex-col justify-between p-2 px-4 sm:p-2 border-b-2 border-black`}>
      <Nav />

      <main className="max-w-7xl mx-auto w-full px-4 sm:px-8 py-12 my-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center"
        >
          {/* Left Column */}
          <div className="lg:col-span-7 space-y-8">
            <motion.h1
              variants={itemVariants}
              className="text-5xl sm:text-7xl lg:text-7xl font-black text-black leading-[0.95] tracking-tight uppercase"
            >
              Paper <br />
              Analysis, <br />
              Synthesis, <br />
              Writing.
            </motion.h1>

            <motion.div variants={itemVariants} className="space-y-2 max-w-xl border-l-2 border-black pl-4">
              <p className="text-black text-lg sm:text-xl font-bold leading-snug">
                AI research assistant with multi-model capability to analyze, summarize, and write academic papers.
              </p>
              <p className="text-black/70 text-sm sm:text-base font-medium">
                Accelerate breakthroughs with structured insights and collaborative workspace.
              </p>
            </motion.div>

            <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-4 pt-2">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => router.push("/auth/sign-up")}
                className="bg-black hover:bg-neutral-800 text-white font-bold px-8 py-4 border-2 border-black transition-all text-sm uppercase tracking-wide shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)] active:shadow-none"
              >
                Get started for free
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleDemoScroll}
                className="bg-white hover:bg-black hover:text-white text-black font-bold px-8 py-4 border-2 border-black transition-all text-sm uppercase tracking-wide shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none"
              >
                See how it works
              </motion.button>
            </motion.div>

            
          </div>

          <motion.div variants={itemVariants} className="lg:col-span-5 flex justify-center items-center">
            <div className="relative w-full max-w-lg">
              <div className="rounded-none bg-white p-6 border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                {/* Header */}
                <div className="flex items-center justify-between pb-4 border-b-2 border-black">
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 border border-black bg-black" />
                    <div className="w-3 h-3 border border-black bg-white" />
                    <div className="w-3 h-3 border border-black bg-black" />
                  </div>
                  <div className="flex border-2 border-black bg-white p-0.5">
                    {(["claude", "gpt", "gemini"] as const).map((model) => (
                      <button
                        key={model}
                        onClick={() => setActiveModel(model)}
                        className={`px-3 py-1 text-xs font-mono font-bold uppercase transition-all ${
                          activeModel === model
                            ? "bg-black text-white"
                            : "bg-white text-black hover:bg-neutral-100"
                        }`}
                      >
                        {model}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Content Output Preview */}
                <div className="py-6 space-y-4">
                  <div className="flex items-center justify-between text-xs font-mono font-bold">
                    <span>ANALYSIS_OUTPUT.PDF</span>
                    <span className="bg-black text-white px-2 py-0.5 uppercase">PROCESSING</span>
                  </div>

                  <div className={`${mono.className} text-xs bg-neutral-100 p-4 border-2 border-black text-black space-y-3 leading-relaxed`}>
                    <p className="font-bold border-b border-black/20 pb-1">&gt; EXTRACTING METHODOLOGIES...</p>
                    <p>
                      [1] Comparative analysis indicates a <span className="font-bold underline">34% reduction</span> in synthesis latency.
                    </p>
                    <p className="text-black/70">
                      [2] Generated LaTeX citations cross-verified with ArXiv IDs.
                    </p>
                  </div>
                </div>

                {/* Badge */}
                <div className="pt-2 border-t-2 border-black flex items-center justify-between text-xs font-mono font-bold">
                  <span>STATUS: READY</span>
                  <span>VERIFIED 42/42</span>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
}