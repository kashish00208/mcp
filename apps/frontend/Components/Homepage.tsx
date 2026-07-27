"use client"
import { Inter, JetBrains_Mono } from "next/font/google";
import { useRouter } from "next/navigation";
import { motion, Variants } from "framer-motion";
import { Header } from "./Header";

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
    <>
      <Header />
    
      <div className={`relative min-h-screen w-full overflow-hidden bg-zinc-950 text-white/80 ${mono.className} bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-size-[64px_64px]`}>
        
        <div className="absolute inset-0 bg-zinc-950 mask-[radial-gradient(ellipse_60%_60%_at_50%_50%,transparent_20%,black_100%)] pointer-events-none z-0"></div>

        <main className="relative z-10 flex flex-col justify-center min-h-screen px-6 md:px-16  mx-auto">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className={inter.className}
          >
            <motion.h1 
              variants={itemVariants} 
              className="text-4xl md:text-8xl font-extrabold leading-[0.9] mb-8 text-white"
            >
              Paper Analysis,<br />
              Synthesis,<br />
              Writing
            </motion.h1>

            <motion.div variants={itemVariants} className="max-w-xl space-y-4">
              <p className="text-slate-300 text-md md:text-xl font-medium leading-snug">
                AI research assistant with multi-model capability to analyze,
                summarize, and write academic papers.
              </p>
              <p className="text-slate-500 text-base md:text-lg">
                Accelerate breakthroughs with structured insights and collaborative workspace.
              </p>
            </motion.div>

            <motion.div variants={itemVariants} className="mt-12">
              <motion.button 
                onClick={() => { router.push("/auth/sign-up") }}
                whileHover={{ scale: 1.02 }} 
                whileTap={{ scale: 0.96 }}   
                className="group flex items-center gap-4 bg-white text-black px-4 py-2 md:px-8 md:py-4 font-bold uppercase tracking-widest text-sm hover:bg-gray-200 transition-colors duration-300 shadow-lg shadow-white/5"
              >
                Get Started
                <span className="transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform">
                  ↗
                </span>
              </motion.button>
            </motion.div>
          </motion.div>
        </main>
      </div>
    </>
  );
};

export default Homepage;