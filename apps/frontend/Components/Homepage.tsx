"use client"
import { Inter, JetBrains_Mono } from "next/font/google";
import { motion, Variants } from "framer-motion";
import { Nav } from "./Nav";
import { useRouter } from "next/navigation";


const inter = Inter({ subsets: ["latin"], weight: ["700", "800"] });
const mono = JetBrains_Mono({ subsets: ["latin"] });

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      duration: 0.8, 
      ease: [0.16, 1, 0.3, 1] 
    } 
  },
};

const Homepage = () => {
  const router = useRouter();

  return (
    <div className={`min-h-screen bg-slate-100/70 text-slate-800 ${inter.className} flex flex-col justify-between py-4 px-4 sm:px-8`}>
      
      <div className="max-w-7xl w-full mx-auto bg-white/60 backdrop-blur-sm rounded-3xl border border-slate-200/60 shadow-sm overflow-hidden min-h-[92vh] flex flex-col justify-between p-4 sm:p-8">
      
        <Nav />

        <main className="max-w-7xl mx-auto w-full px-4 sm:px-8 py-12 my-auto">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center"
          >
            <div className="lg:col-span-7 space-y-6">
              
              <motion.div variants={itemVariants}>
                <span className="text-slate-400 text-xs sm:text-sm font-bold uppercase tracking-wider">
                  — FREE 30 DAYS TRIAL
                </span>
              </motion.div>

              <motion.h1 
                variants={itemVariants} 
                className="text-4xl sm:text-6xl lg:text-7xl font-black text-slate-900 leading-[1.05] tracking-tight"
              >
                Paper Analysis, <br />
                Synthesis, <br />
                Writing.
              </motion.h1>

              {/* Subtitles */}
              <motion.div variants={itemVariants} className="space-y-2 max-w-lg">
                <p className="text-slate-600 text-base sm:text-lg font-medium leading-snug">
                  AI research assistant with multi-model capability to analyze, summarize, and write academic papers.
                </p>
                <p className="text-slate-400 text-sm sm:text-base">
                  Accelerate breakthroughs with structured insights and collaborative workspace.
                </p>
              </motion.div>

              <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-4 pt-4">
                <button 
                  onClick={() => router.push("/auth/sign-up")}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl transition-all shadow-md shadow-blue-500/20 text-sm"
                >
                  Get started for free
                </button>
                <button 
                  onClick={() => router.push("#demo")}
                  className="bg-transparent hover:bg-slate-100 text-slate-700 font-semibold px-6 py-3 rounded-xl border border-slate-300 transition-all text-sm"
                >
                  See how it works
                </button>
              </motion.div>
            </div>

            <motion.div 
              variants={itemVariants}
              className="lg:col-span-5 flex justify-center items-center relative"
            >
              <div className="relative w-full max-w-md aspect-square flex items-center justify-center">
               
              </div>
            </motion.div>
          </motion.div>
       </main>
    
      </div>
    </div>
  );
};

export default Homepage;