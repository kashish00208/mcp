"use client";

import React, { useState, useRef } from "react";
import { Paperclip, ChevronDown, Send } from "lucide-react";

interface Message {
  id: number;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) {
      return;
    }
    uploadPdf(selectedFile);
    
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const uploadPdf = async (selectedFile: File) => {
    if (!selectedFile) {
      return;
    }
    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await fetch("http://localhost:8080/chat", {
        method: "POST",
        body: formData,
      });
      if (!response.ok) {
        throw new Error("Upload failed try again");
      }

      const data = await response.json();
      console.log(data);

      const chatResponse = await fetch("http://localhost:8080/api/chat/groq",{
        method: "POST",
        body: input,
      });
      if (!response.ok) {
        throw new Error("Upload failed try again");
      }
    } catch (error) {
      console.error("Error uploading file", error);
    }
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const userMsg: Message = {
      id: Date.now(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    setTimeout(() => {
      const assistantMsg: Message = {
        id: Date.now() + 1,
        role: "assistant",
        content: "This is a sample AI response. Connect your backend/API here.",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMsg]);
    }, 1000);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col justify-between items-center h-screen w-full bg-black text-white p-4">
      <div className="flex-1 w-full overflow-y-auto flex flex-col">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center px-4">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center">
              What can I help you with?
            </h1>
            <p className="text-zinc-500 text-center">
              Ask coding, debugging, AI, or general questions
            </p>
          </div>
        ) : (
          <div className="max-w-4xl w-full mx-auto px-6 py-8 flex flex-col gap-6">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex w-full ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-3xl ${
                    msg.role === "user"
                      ? "bg-zinc-800 px-5 py-3 rounded-2xl"
                      : "px-2 py-3"
                  }`}
                >
                  <p className="text-[15px] leading-7 text-zinc-200 whitespace-pre-wrap">
                    {msg.content}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="w-full max-w-4xl mt-4">
        <div className="flex items-center h-16 sm:h-20 px-4 sm:px-6 rounded-full border border-zinc-800 bg-linear-to-b from-[#0f0f0f] to-[#111111] shadow-[0_0_20px_rgba(255,255,255,0.03)] w-full">
          
          <label className="text-white hover:text-zinc-300 transition shrink-0 cursor-pointer flex items-center justify-center">
            <Paperclip size={24} strokeWidth={2} />
            <input
              type="file"
              className="hidden"
              onChange={handleFileSelect}
              ref={fileInputRef}
              accept=".pdf" 
            />
          </label>

          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Message Openpapers"
            className="flex-1 bg-transparent px-4 sm:px-5 text-[16px] sm:text-[18px] text-white placeholder:text-zinc-500 outline-none w-full"
          />

          <button className="hidden sm:flex items-center gap-2 text-white font-medium text-lg hover:text-zinc-300 transition whitespace-nowrap">
            Select Models
            <ChevronDown size={18} />
          </button>

          <button
            onClick={input.trim() ? handleSend : undefined}
            className="ml-4 sm:ml-6 h-12 w-12 sm:h-14 sm:w-14 shrink-0 rounded-full bg-white flex items-center justify-center hover:scale-105 transition"
          >
            {input.trim() ? (
              <Send size={24} className="text-black ml-1" strokeWidth={2.5} />
            ) : (
              <Send size={24} className="text-black" strokeWidth={2.5} />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}