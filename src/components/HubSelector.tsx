"use client";

import { useState } from "react";
import { Search, MapPin, Building2, ChevronRight } from "lucide-react";

export default function HubSelector({ onSelect, hubs = [] }: { onSelect: (hub: string) => void, hubs?: any[] }) {
    const [search, setSearch] = useState("");

    // Fallback just in case the API call hasn't finished loading yet
    const displayHubs = hubs.length > 0 ? hubs : [
        { _id: "loading", name: "Loading Hubs...", type: "System", demand: "Medium" }
    ];

    const filtered = displayHubs.filter(h => h.name.toLowerCase().includes(search.toLowerCase()));

    return (
        <div className="h-full min-h-screen bg-neutral-950 p-6 animate-in slide-in-from-bottom-10 fade-in duration-500">
            <div className="mt-8 mb-6">
                <h2 className="text-3xl font-bold text-white leading-tight">Where are you <br /><span className="text-orange-500">eating today?</span></h2>
                <p className="text-neutral-400 mt-2 text-sm">Select your hub to see today's menu.</p>
            </div>

            <div className="relative mb-8">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500 w-5 h-5" />
                <input
                    type="text"
                    placeholder="Search Office, Tech Park, College..."
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-neutral-600 focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all font-medium"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            <div className="space-y-3 pb-24">
                {filtered.map(hub => (
                    <button
                        key={hub._id || hub.id}
                        onClick={() => onSelect(hub.name)}
                        className="w-full bg-neutral-900/50 border border-neutral-800 hover:border-orange-500/30 p-4 rounded-2xl flex items-center justify-between group transition-all"
                    >
                        <div className="flex items-center gap-4">
                            <div className="bg-orange-500/10 p-3 rounded-xl">
                                {hub.type === "College" ? <Building2 className="text-orange-500 w-5 h-5" /> : <MapPin className="text-orange-500 w-5 h-5" />}
                            </div>
                            <div className="text-left">
                                <h3 className="font-semibold text-white text-base">{hub.name}</h3>
                                <p className="text-xs text-neutral-500 mt-1">{hub.type}</p>
                            </div>
                        </div>
                        <ChevronRight className="text-neutral-600 group-hover:text-orange-500 group-hover:translate-x-1 transition-all w-5 h-5" />
                    </button>
                ))}
            </div>

            <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-neutral-950 via-neutral-950 to-transparent">
                <div className="max-w-md mx-auto">
                    <button className="w-full bg-neutral-900 border border-neutral-800 py-4 rounded-2xl text-neutral-400 font-medium text-sm hover:text-white transition-colors">
                        Don't see your building? Request a Hub
                    </button>
                </div>
            </div>
        </div>
    );
}
