"use client"
import { Inter, JetBrains_Mono } from "next/font/google";
import { useRouter } from "next/navigation";
import { motion, Variants } from "framer-motion";
import { Nav } from "./Nav";

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
  return (
    <div className={`min-h-screen w-full bg-black text-white ${inter.className}`}>
      <Nav />
    
      <main className="relative pt-36 pb-16 px-8 max-w-7xl mx-auto">
        hellow world
      </main>
    </div>
  );
};

export default Homepage;