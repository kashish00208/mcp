"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Inter, JetBrains_Mono } from "next/font/google";

const inter = Inter({ subsets: ["latin"], weight: ["400", "700", "900"] });
const mono = JetBrains_Mono({ subsets: ["latin"], weight: ["500", "700"] });

const page = () => {
  const [name, setUserName] = useState("");
  const [email, setUserEmail] = useState("");
  const [password, setUserPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const backend_url = process.env.BACKEND_URL


  const handleSubmit = async () => {
    setError("");

    try {
      const res = await fetch(`${backend_url}/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      if (!res.ok) {
        setError("Server side issue Try again later")
        throw new Error('Server side issue Try again later ')
      }

      const data = await res.json();
      console.log("User:", data);
      
      router.push("/chat");
    } catch (err) {
      setError("Server connection failed");
      console.log(err);
    }
  };

  return (
    <div className={`${inter.className} min-h-screen w-full flex justify-center items-center px-4 bg-white text-black`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white border-2 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative"
      >
        <div className="flex justify-center mb-8">
          <div 
            onClick={() => router.push("/")}
            className="flex items-center gap-2 cursor-pointer select-none group"
          >
            <div className="w-4 h-4 bg-black group-hover:bg-white group-hover:border-black border-2 border-black transition-colors" />
            <span className="text-xl font-black tracking-tighter uppercase">OPEN PAPERS</span>
          </div>
        </div>

        <h2 className="text-2xl font-black uppercase text-black mb-6 text-center tracking-tight">
          Create Account
        </h2>

        <div className="space-y-4">
          <div className="flex flex-col gap-1.5">
            <label className={`${mono.className} text-xs font-bold uppercase tracking-wider text-black`}>
              Name
            </label>
            <input
              type="text"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setUserName(e.target.value)}
              className="bg-white border-2 border-black p-3 text-black text-sm outline-none focus:bg-neutral-50 transition-all placeholder:text-neutral-400 font-medium"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className={`${mono.className} text-xs font-bold uppercase tracking-wider text-black`}>
              Email
            </label>
            <input
              type="email"
              placeholder="hello@example.com"
              value={email}
              onChange={(e) => setUserEmail(e.target.value)}
              className="bg-white border-2 border-black p-3 text-black text-sm outline-none focus:bg-neutral-50 transition-all placeholder:text-neutral-400 font-medium"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className={`${mono.className} text-xs font-bold uppercase tracking-wider text-black`}>
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setUserPassword(e.target.value)}
              className="bg-white border-2 border-black p-3 text-black text-sm outline-none focus:bg-neutral-50 transition-all placeholder:text-neutral-400 font-medium"
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSubmit}
            className={`${mono.className} w-full mt-2 bg-black text-white font-bold py-3.5 border-2 border-black text-xs uppercase tracking-wider shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)] hover:bg-neutral-800 transition-all active:shadow-none`}
          >
            Create Account
          </motion.button>
        </div>

        {error && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`${mono.className} text-xs mt-4 text-center  text-red-500 p-2 font-bold uppercase`}
          >
            ERR: {error.trim()}
          </motion.div>
        )}

        <p className={`${mono.className} text-center text-xs text-black/70 mt-8 uppercase font-bold`}>
          Already have an account?{" "}
          <span 
            onClick={() => router.push("/auth/sign-in")} 
            className="text-black cursor-pointer underline hover:bg-black hover:text-white px-1 transition-colors"
          >
            Sign In
          </span>
        </p>
      </motion.div>
    </div>
  );
};

export default page;