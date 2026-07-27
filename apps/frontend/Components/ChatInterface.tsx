"use client"
import { PiBookOpenUserLight } from "react-icons/pi";
import { TiPlus } from "react-icons/ti";
import { FaHistory } from "react-icons/fa";

const profile = () => {
  return (
    <div className='h-full w-full flex justify-center items-center'>
      <div className='flex w-full m-2 mt-3'>
        <div className='h-screen w-full flex'>
          <div className='w-1/6 border-r border-white/15 p-2'>
            <div className="flex justify-between">
              <li className="flex items-center gap-1 cursor-pointer hover:opacity-80 transition-opacity list-none">
                <span>OPEN</span>
                <span className="text-black bg-white text-sm px-2 py-1 font-bold">
                  PAPERS
                </span>
              </li>

              <PiBookOpenUserLight className="text-3xl" />
            </div>

            <div className="mt-6">
              <button className="group flex items-center gap-3 w-full py-2 rounded-xl text-gray-300 hover:bg-zinc-800 transition-all duration-200">
                <TiPlus className="text-lg group-hover:rotate-90 transition-transform duration-200" />
                <span className="font-medium">New Chat</span>
              </button>
            </div>
            <div className="">
              <button className="group flex items-center gap-3 w-full py-2 rounded-xl text-gray-300 hover:bg-zinc-800 transition-all duration-200">
                <FaHistory className="text-lg group-hover:rotate-90 transition-transform duration-200" />
                <span className="font-medium">History</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default profile;
