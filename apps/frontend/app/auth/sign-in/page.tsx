"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

const Page = () => {
  const [email, setUserEmail] = useState("");
  const [password, setUserPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async () => {
    setError("");

    try {
      const res = await fetch("http://localhost:8080/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      if (!res.ok) {
        const message = await res.text();
        setError(message || "Something went wrong");
        return;
      }

      const data = await res.json();
      console.log("User:", data);

      router.push("/chat")

    } catch (err) {
      setError("Server connection failed");
      console.log(err);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex justify-center items-center px-4 bg-zinc-950 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-size:[32px_32px]">
     
      <div className="absolute inset-0 bg-zinc-950 mask-[radial-gradient(ellipse_60%_60%_at_50%_50%,transparent_20%,black_100%)] pointer-events-none"></div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg backdrop-blur-xs bg-black/40 border border-white/10  p-8 shadow-2xl relative z-10"
      >
        <div className="flex justify-center mb-8">
          <div 
            onClick={() => router.push("/")}
            className="flex items-center gap-1 cursor-pointer hover:opacity-80 transition-opacity select-none"
          >
            <span className="text-white font-semibold tracking-widest text-lg">OPEN</span>
            <span className="text-black bg-white text-sm px-2 py-1 font-bold rounded-sm">PAPERS</span>
          </div>
        </div>

        <h2 className="text-3xl font-bold text-white mb-8 text-center">
          Welcome back
        </h2>

        <div className="space-y-5">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-400 ml-1">Email</label>
            <input
              type="email"
              placeholder="hello@example.com"
              value={email}
              onChange={(e) => setUserEmail(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-xl p-3 text-white outline-none focus:border-white/30 focus:bg-white/10 transition-all placeholder:text-gray-600"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-400 ml-1">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setUserPassword(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-xl p-3 text-white outline-none focus:border-white/30 focus:bg-white/10 transition-all placeholder:text-gray-600"
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSubmit}
            className="w-full mt-4 bg-white text-black font-semibold py-3 rounded-xl shadow-lg hover:bg-gray-200 transition-colors"
          >
            Sign In
          </motion.button>
        </div>

        {error && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-red-400 text-sm mt-4 text-center bg-red-400/10 py-2 rounded-lg"
          >
            {error.trim()}
          </motion.div>
        )}

        <p className="text-center text-gray-500 text-sm mt-8">
          Don't have an account?{" "}
          <span 
            onClick={() => router.push("/auth/sign-up")} 
            className="text-white cursor-pointer hover:underline font-medium"
          >
            Sign Up
          </span>
        </p>
      </motion.div>
    </div>
  );
};

export default Page;