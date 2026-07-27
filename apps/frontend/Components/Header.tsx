'use client'
import { useRouter } from "next/navigation";

export const Header = () => {
  const router = useRouter();
  return (
    <header 
      className="fixed top-6 inset-x-0 z-50 flex justify-center px-4 border-b border-white/15 pb-4 not-first-of-type:" 
    >
        <ul className="flex w-full justify-between items-center text-xl font-medium text-white ">
          <li className="flex items-center gap-1 cursor-pointer hover:opacity-80 transition-opacity">
            <span>OPEN</span>
            <span className="text-black bg-white text-sm px-2 py-1 font-bold">PAPERS</span>
          </li>

          <li className="cursor-pointer hover:scale-110 transition-transform active:scale-95">
            <button onClick={()=>{router.push("/auth/sign-up")}} className="bg-white text-black text-sm p-2 font-bold">GET STARTED</button>
          </li>
        </ul>
    </header>
  );
};