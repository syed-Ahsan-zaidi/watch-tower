"use client";
import { useEffect, useState } from "react";

// 🌍 API URL configuration
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:3001';

export default function Home() {
  const [monitors, setMonitors] = useState([]);
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");

  // 📡 1. Data Fetch karne ka function
  const fetchMonitors = async () => {
    try {
      const res = await fetch(`${API_URL}/api/monitors`, { cache: 'no-store' });
      if (!res.ok) throw new Error('Network response was not ok');
      const data = await res.json();
      setMonitors(data);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  // ➕ 2. Naya Monitor Add karne ka function
  const addMonitor = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/api/monitors/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, url, interval: 60 }),
      });

      if (res.ok) {
        setName(""); 
        setUrl("");
        fetchMonitors(); 
      }
    } catch (err) {
      alert("Add karne mein masla aaya!");
    }
  };

  useEffect(() => {
    fetchMonitors();
    const interval = setInterval(fetchMonitors, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-3xl font-bold mb-8 border-b border-gray-700 pb-4 text-center">
        📡 WatchTower Dashboard
      </h1>

      {/* 📝 FORM SECTION */}
      <div className="max-w-4xl mx-auto mb-12 bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-xl">
        <h3 className="text-lg font-medium mb-4 text-blue-400">Add New Website to Monitor</h3>
        <form onSubmit={addMonitor} className="flex flex-wrap gap-4 items-end">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-xs text-gray-400 mb-1">Website Name</label>
            <input 
              value={name} onChange={(e) => setName(e.target.value)}
              placeholder="e.g. GitHub" required
              className="w-full bg-gray-900 border border-gray-600 p-2 rounded text-sm outline-none focus:border-blue-500"
            />
          </div>
          <div className="flex-[2] min-w-[200px]">
            <label className="block text-xs text-gray-400 mb-1">URL (https://...)</label>
            <input 
              value={url} onChange={(e) => setUrl(e.target.value)}
              placeholder="https://github.com" required
              className="w-full bg-gray-900 border border-gray-600 p-2 rounded text-sm outline-none focus:border-blue-500"
            />
          </div>
          <button type="submit" className="bg-blue-600 hover:bg-blue-700 px-8 py-2 rounded font-bold transition-all h-[38px]">
            Add Link
          </button>
        </form>
      </div>

      {/* 📋 MONITOR CARDS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {monitors.map((m: any) => (
          <div key={m.id} className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-lg transition-transform hover:scale-[1.02]">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold truncate w-40">{m.name}</h2>
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                m.status === "UP" ? "bg-green-900 text-green-400" : "bg-red-900 text-red-400"
              }`}>
                {m.status}
              </span>
            </div>
            <p className="text-gray-400 text-sm mb-4 truncate italic">{m.url}</p>
            
            <div className="bg-gray-900 p-3 rounded-lg flex justify-between items-center">
              <span className="text-gray-500 text-sm">Latency:</span>
              <span className="font-mono text-blue-400 font-bold">
                {m.heartbeats?.[0]?.latency || 0}ms
              </span>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}