"use client";

import React, { useState, useRef, useEffect } from "react";
import { 
  Paperclip, 
  ChevronDown, 
  Send, 
  Sparkles, 
  FileText, 
  Bot, 
  User, 
  Plus, 
  MessageSquare, 
  Trash2, 
  PanelLeftClose, 
  PanelLeft 
} from "lucide-react";
import { Inter } from "next/font/google";
import { useRouter } from "next/navigation";

const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"] });

interface Message {
  id: number;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface ChatSession {
  id: string;
  title: string;
  date: string;
}

export default function FullPageChat() {
  const router = useRouter();
  
  // Chat state
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedModel, setSelectedModel] = useState("Llama 3.3 70B");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const [sessions, setSessions] = useState<ChatSession[]>([
    { id: "1", title: "Transformer Architecture Paper", date: "Today" },
    { id: "2", title: "RAG vs Fine-tuning Analysis", date: "Yesterday" },
    { id: "3", title: "Quantum Computing Basics", date: "3 days ago" },
  ]);
  const [activeSessionId, setActiveSessionId] = useState<string>("1");

  const fileInputRef = useRef<HTMLInputElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new message
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
    uploadPdf(file);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const uploadPdf = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://localhost:8080/chat", {
        method: "POST",
        body: formData,
      });
      if (!response.ok) throw new Error("Upload failed");
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  const handleSend = async () => {
    if (!input.trim() && !selectedFile) return;

    const userQuery = input;
    const userMsg: Message = {
      id: Date.now(),
      role: "user",
      content: userQuery,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    // Simulated API response matching backend
    setTimeout(() => {
      const assistantMsg: Message = {
        id: Date.now() + 1,
        role: "assistant",
        content:
          "I have analyzed your query based on the active academic model. Let me know if you would like me to summarize key findings, extract methodologies, or generate citations.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMsg]);
    }, 1000);
  };

  const handleNewChat = () => {
    setMessages([]);
    setSelectedFile(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className={`h-screen w-screen overflow-hidden bg-slate-100 text-slate-800 ${inter.className} flex`}>
      
      {/* Sidebar - Chat History */}
      <aside
        className={`${
          isSidebarOpen ? "w-64 sm:w-72" : "w-0"
        } transition-all duration-300 bg-white border-r border-slate-200/80 flex flex-col justify-between overflow-hidden shrink-0 z-20`}
      >
        <div className="p-4 flex flex-col h-full">
          {/* Brand Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div 
              onClick={() => router.push("/")}
              className="flex items-center space-x-2.5 cursor-pointer"
            >
             
              <span className="font-extrabold text-slate-900 text-base tracking-tight">OPEN PAPERS</span>
            </div>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <PanelLeftClose size={18} />
            </button>
          </div>

          {/* New Chat Button */}
          <button
            onClick={handleNewChat}
            className="mt-4 flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl transition-all shadow-sm shadow-blue-500/20"
          >
            <Plus size={16} />
            <span>New Research Chat</span>
          </button>

          {/* Sessions List */}
          <div className="flex-1 overflow-y-auto mt-6 space-y-1">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-2 mb-2">
              Recent Workspaces
            </p>
            {sessions.map((session) => (
              <div
                key={session.id}
                onClick={() => setActiveSessionId(session.id)}
                className={`group flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer text-xs font-semibold transition-all ${
                  activeSessionId === session.id
                    ? "bg-slate-100 text-blue-600"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <div className="flex items-center gap-2.5 truncate">
                  <MessageSquare size={14} className={activeSessionId === session.id ? "text-blue-600" : "text-slate-400"} />
                  <span className="truncate">{session.title}</span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSessions((prev) => prev.filter((s) => s.id !== session.id));
                  }}
                  className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 transition-opacity p-1"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            ))}
          </div>

          {/* User Profile Footer */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-bold">
                U
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-slate-800">Researcher</span>
                <span className="text-[10px] text-slate-400 font-medium">Free Plan</span>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Full-Page Chat Content */}
      <main className="flex-1 flex flex-col h-full bg-slate-50/50 relative overflow-hidden">
        
        {/* Top App Header */}
        <header className="h-16 border-b border-slate-200/80 bg-white/80 backdrop-blur-md px-6 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            {!isSidebarOpen && (
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="text-slate-500 hover:text-slate-800 p-1.5 rounded-xl hover:bg-slate-100 transition-colors"
              >
                <PanelLeft size={20} />
              </button>
            )}
            <h1 className="font-bold text-slate-800 text-sm sm:text-base">
              Paper Analysis Workspace
            </h1>
          </div>

          {/* Model Selection Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200/70 text-slate-700 font-semibold text-xs px-3.5 py-2 rounded-xl border border-slate-200 transition-all"
            >
              <Sparkles size={14} className="text-blue-600" />
              <span>{selectedModel}</span>
              <ChevronDown size={14} className="text-slate-400" />
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-xl z-50 py-1.5 text-xs">
                {["Llama 3.3 70B", "DeepSeek R1", "GPT-4o Academic"].map((model) => (
                  <button
                    key={model}
                    onClick={() => {
                      setSelectedModel(model);
                      setIsDropdownOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2 hover:bg-slate-50 font-medium transition-colors ${
                      selectedModel === model ? "text-blue-600 font-semibold" : "text-slate-600"
                    }`}
                  >
                    {model}
                  </button>
                ))}
              </div>
            )}
          </div>
        </header>

        {/* Chat Feed */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-8 py-6 flex flex-col justify-between max-w-5xl mx-auto w-full">
          {messages.length === 0 ? (
            <div className="my-auto flex flex-col items-center justify-center text-center space-y-4 max-w-lg mx-auto">
             
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                What research are we analyzing today?
              </h2>
              <p className="text-slate-400 text-xs sm:text-sm font-medium">
                Upload PDFs, summarize long papers, ask technical questions, or synthesize multiple documents.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-6 w-full pb-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex items-start gap-3.5 w-full ${
                    msg.role === "user" ? "flex-row-reverse" : "flex-row"
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 shadow-sm ${
                      msg.role === "user"
                        ? "bg-slate-900 text-white"
                        : "bg-blue-600 text-white"
                    }`}
                  >
                    {msg.role === "user" ? <User size={16} /> : <Bot size={16} />}
                  </div>

                  <div
                    className={`max-w-2xl px-5 py-3.5 rounded-2xl text-sm leading-relaxed ${
                      msg.role === "user"
                        ? "bg-blue-600 text-white font-medium rounded-tr-none shadow-sm"
                        : "bg-white text-slate-800 border border-slate-200/80 rounded-tl-none shadow-sm"
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                  </div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>
          )}
        </div>

        {/* Selected Attachment Badge */}
        {selectedFile && (
          <div className="max-w-4xl mx-auto w-full px-6 mb-2">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 border border-blue-200/80 text-blue-700 text-xs font-semibold rounded-lg">
              <FileText size={14} />
              <span className="truncate max-w-xs">{selectedFile.name}</span>
              <button
                onClick={() => setSelectedFile(null)}
                className="ml-1 text-blue-500 hover:text-blue-800 font-bold"
              >
                x
              </button>
            </div>
          </div>
        )}

        <div className="p-4 sm:p-6 max-w-4xl w-full mx-auto shrink-0">
          <div className="flex items-center h-14 sm:h-16 px-4 rounded-2xl border border-slate-200 bg-white shadow-md shadow-slate-200/50 hover:border-slate-300 transition-all">
            
            {/* File Upload Button */}
            <label className="p-2 text-slate-400 hover:text-blue-600 transition shrink-0 cursor-pointer rounded-xl hover:bg-slate-50">
              <Paperclip size={20} strokeWidth={2} />
              <input
                type="file"
                className="hidden"
                onChange={handleFileSelect}
                ref={fileInputRef}
                accept=".pdf"
              />
            </label>

            {/* Input Text Box */}
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Message Open Papers..."
              className="flex-1 bg-transparent px-3 text-sm sm:text-base text-slate-800 placeholder:text-slate-400 outline-none w-full font-medium"
            />

            {/* Send Button */}
            <button
              onClick={handleSend}
              disabled={!input.trim() && !selectedFile}
              className={`ml-2 h-10 w-10 sm:h-11 sm:w-11 shrink-0 rounded-xl flex items-center justify-center transition-all ${
                input.trim() || selectedFile
                  ? "bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20"
                  : "bg-slate-100 text-slate-300 cursor-not-allowed"
              }`}
            >
              <Send size={18} strokeWidth={2.5} />
            </button>
          </div>
        </div>

      </main>
    </div>
  );
}