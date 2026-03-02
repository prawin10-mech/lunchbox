"use client";

import { useState, useEffect } from "react";
import { Clock, Minus, Plus, Utensils, MapPin, Search } from "lucide-react";

const WEEKLY_MENU = [
    { day: "Sunday", items: ["Veg Biryani", "Mirchi Ka Salan", "Raita"], description: "Special Sunday Veg Biryani served with spicy Mirchi Ka Salan and cooling Raita." },
    { day: "Monday", items: ["Sona Masoori Rice", "Pappucharu", "Potato Fry"], description: "Premium Sona Masoori Rice, comforting home-style Pappucharu, spicy Andhra Potato Fry, and fresh Curd." },
    { day: "Tuesday", items: ["Bagara Rice", "Dal Makhani", "Mixed Veg Curry"], description: "Flavorful Bagara Rice paired with creamy Dal Makhani and Mixed Vegetable Curry." },
    { day: "Wednesday", items: ["White Rice", "Sambar", "Bendakaya Fry"], description: "Classic White Rice with rich South Indian Sambar and crispy Okra (Bendakaya) Fry." },
    { day: "Thursday", items: ["Lemon Rice", "Tomato Dal", "Cabbage Poriyal"], description: "Zesty Lemon Rice served alongside comforting Tomato Dal and fresh Cabbage Poriyal." },
    { day: "Friday", items: ["Jeera Rice", "Palak Paneer", "Gobi Manchurian"], description: "Aromatic Jeera Rice accompanied by rich Palak Paneer and slightly spicy Gobi Manchurian dry." },
    { day: "Saturday", items: ["Pulihora", "Mudda Pappu", "Avakaya Pickle"], description: "Traditional Tamarind Rice (Pulihora) served with thick Dal (Mudda Pappu) and spicy Mango Pickle." }
];

export default function HomeMenu({ onCheckout, hubName }: { onCheckout: (q: number, forTomorrow?: boolean) => void, hubName: string }) {
    const [quantity, setQuantity] = useState(1);
    const [qtyAtMax, setQtyAtMax] = useState(false);

    // All timer-derived values in a single state object — only 1 re-render per tick
    const todayIndex = new Date().getDay();
    type TimerState = { timeLeft: { h: number, m: number, s: number }, isPastCutoff: boolean, isBefore4PM: boolean, displayIndex: number };
    const buildTimerState = (): TimerState => {
        const now = new Date();
        const h = now.getHours();
        const pastCutoff = h >= 10;
        const before4PM = h >= 10 && h < 16;
        const displayIndex = pastCutoff ? (todayIndex + 1) % 7 : todayIndex;
        const target = new Date();
        if (pastCutoff) { target.setDate(target.getDate() + 1); }
        target.setHours(10, 0, 0, 0);
        const diff = target.getTime() - now.getTime();
        return {
            timeLeft: diff > 0 ? { h: Math.floor(diff / 3600000), m: Math.floor((diff / 60000) % 60), s: Math.floor((diff / 1000) % 60) } : { h: 0, m: 0, s: 0 },
            isPastCutoff: pastCutoff,
            isBefore4PM: before4PM,
            displayIndex,
        };
    };
    const [timerState, setTimerState] = useState<TimerState>(buildTimerState);
    const { timeLeft, isPastCutoff, isBefore4PM, displayIndex } = timerState;

    const [showWeeklyMenu, setShowWeeklyMenu] = useState(false);

    // Tracking State
    const [showTracking, setShowTracking] = useState(false);
    const [trackPhone, setTrackPhone] = useState("");
    const [trackedOrders, setTrackedOrders] = useState<any[]>([]);
    const [isTracking, setIsTracking] = useState(false);
    const [trackError, setTrackError] = useState("");

    useEffect(() => {
        const tick = () => setTimerState(buildTimerState());
        tick(); // run immediately on mount
        const timer = setInterval(tick, 1000);
        return () => clearInterval(timer);
    }, [todayIndex]);

    const handleTrackOrder = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsTracking(true);
        setTrackError("");
        setTrackedOrders([]);

        try {
            const res = await fetch(`/api/track?phone=${encodeURIComponent(trackPhone)}`);
            const data = await res.json();

            if (data.success) {
                setTrackedOrders(data.data);
                if (data.data.length === 0) {
                    setTrackError("No orders found for this number.");
                }
            } else {
                setTrackError(data.error || "Failed to find orders.");
            }
        } catch (error) {
            setTrackError("Something went wrong.");
        } finally {
            setIsTracking(false);
        }
    };

    const targetMenu = WEEKLY_MENU[displayIndex];

    return (
        <div className="h-full min-h-screen bg-neutral-950 text-white relative flex flex-col pt-6 pb-32 animate-in fade-in duration-500">

            {/* Header */}
            <div className="px-6 flex justify-between items-start mb-6 w-full">
                <div>
                    <p className="text-neutral-500 text-xs font-semibold uppercase tracking-widest mb-1">Delivering to</p>
                    <div className="flex items-center gap-1.5 text-white">
                        <MapPin className="w-4 h-4 text-orange-500" />
                        <h2 className="font-bold text-base truncate max-w-[200px]">{hubName || "Select Hub"}</h2>
                    </div>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => setShowTracking(true)}
                        className="bg-neutral-900 border border-neutral-800 rounded-full p-2.5 hover:bg-neutral-800 transition-colors"
                        title="Track Order"
                    >
                        <Search className="w-5 h-5 text-neutral-400" />
                    </button>
                    <div className="bg-neutral-900 border border-neutral-800 rounded-full p-2.5">
                        <Utensils className="w-5 h-5 text-orange-500" />
                    </div>
                </div>
            </div>

            {/* Countdown Hero */}
            <div className="px-6 mb-8 w-full flex flex-col items-center">
                {isBefore4PM ? (
                    <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 w-full text-center relative overflow-hidden backdrop-blur-md shadow-2xl">
                        <div className="absolute top-0 right-0 p-4 opacity-5">
                            <Clock className="w-24 h-24" />
                        </div>
                        <p className="text-neutral-400 font-bold mb-3 uppercase text-xs tracking-widest z-10 relative">Today's Orders</p>
                        <h3 className="text-2xl font-black text-white z-10 relative mb-2">Closed until 4 PM</h3>
                        <p className="text-sm text-neutral-500 z-10 relative">You can reserve tomorrow's box now, or check back after 4 PM.</p>
                    </div>
                ) : (
                    <div className={`border rounded-3xl p-6 w-full text-center relative overflow-hidden backdrop-blur-md shadow-2xl transition-colors ${isPastCutoff ? 'bg-indigo-500/10 border-indigo-500/20' : 'bg-orange-500/10 border-orange-500/20'}`}>
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <Clock className="w-24 h-24" />
                        </div>
                        <p className={`font-bold mb-2 uppercase text-xs tracking-widest z-10 relative ${isPastCutoff ? 'text-indigo-400' : 'text-orange-400'}`}>
                            {isPastCutoff ? "Tomorrow's order closes in" : "Today's order closes in"}
                        </p>
                        <div className="flex justify-center items-end gap-2 text-white font-black z-10 relative drop-shadow-lg">
                            <span className="text-5xl tabular-nums">{String(timeLeft.h).padStart(2, '0')}</span><span className={`text-xl mb-1 font-bold ${isPastCutoff ? 'text-indigo-500' : 'text-orange-500'}`}>h</span>
                            <span className="text-5xl tabular-nums">{String(timeLeft.m).padStart(2, '0')}</span><span className={`text-xl mb-1 font-bold ${isPastCutoff ? 'text-indigo-500' : 'text-orange-500'}`}>m</span>
                            <span className="text-5xl tabular-nums">{String(timeLeft.s).padStart(2, '0')}</span><span className={`text-xl mb-1 font-bold ${isPastCutoff ? 'text-indigo-500' : 'text-orange-500'}`}>s</span>
                        </div>
                    </div>
                )}
            </div>

            {/* Target Menu */}
            <div className="px-6 mb-8 w-full">
                <div className="flex justify-between items-end mb-4">
                    <h3 className="text-xl font-bold flex items-center gap-2">
                        {isPastCutoff ? "Tomorrow's Box" : "Today's Box"}
                        {isPastCutoff && <span className="bg-indigo-500/20 text-indigo-400 text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider">Early Bird</span>}
                    </h3>
                    <button
                        onClick={() => setShowWeeklyMenu(true)}
                        className={`${isPastCutoff ? 'text-indigo-400' : 'text-orange-500'} font-semibold text-sm hover:underline`}
                    >
                        See whole week
                    </button>
                </div>
                <div className="bg-neutral-900 border border-neutral-800 rounded-3xl overflow-hidden shadow-2xl relative">
                    <div className={`h-48 w-full relative bg-gradient-to-r ${isPastCutoff ? 'from-indigo-500 to-purple-600' : 'from-orange-400 to-amber-500'}`}>
                        {/* Visual representation of food */}
                        <div className="absolute inset-0 bg-black/20" />
                        <div className="absolute inset-0 flex items-center justify-center p-6 gap-2">
                            <div className="w-1/2 h-full bg-white/90 rounded-2xl shadow-inner flex items-center justify-center -rotate-2 transform hover:rotate-0 transition-transform">
                                <span className="text-black/30 font-bold text-center leading-tight">
                                    {targetMenu.items[0].split(' ').map((word: string, i: number) => <span key={i}>{word}<br /></span>)}
                                </span>
                            </div>
                            <div className="w-1/2 flex flex-col gap-2 h-full">
                                <div className="h-1/2 bg-yellow-200/90 rounded-2xl shadow-inner flex items-center justify-center rotate-1 transform hover:rotate-0 transition-transform">
                                    <span className="text-black/30 font-bold text-[10px] text-center px-1">{targetMenu.items[1]}</span>
                                </div>
                                <div className="h-1/2 bg-orange-200/90 rounded-2xl shadow-inner border border-white/50 flex items-center justify-center -rotate-1 transform hover:rotate-0 transition-transform">
                                    <span className="text-black/30 font-bold text-[10px] text-center px-1">{targetMenu.items[2]}</span>
                                </div>
                            </div>
                        </div>
                        <div className="absolute bottom-3 left-3 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-white shadow-sm border border-white/30 truncate max-w-[80%]">
                            {targetMenu.day} Special
                        </div>
                    </div>
                    <div className="p-5">
                        <p className="text-neutral-400 text-sm leading-relaxed mb-4">
                            {targetMenu.description} No customizations. Just hot, perfect food.
                        </p>
                    </div>
                </div>
            </div>

            {/* Weekly Menu Modal */}
            {showWeeklyMenu && (
                <div className="fixed inset-0 bg-black/80 z-[100] flex flex-col p-6 overflow-y-auto animate-in fade-in zoom-in-95 duration-200 backdrop-blur-sm">
                    <div className="bg-neutral-900 rounded-3xl p-6 mb-24 w-full max-w-md mx-auto relative border border-neutral-800 shadow-2xl">
                        <button
                            onClick={() => setShowWeeklyMenu(false)}
                            className="absolute top-4 right-4 w-8 h-8 bg-neutral-800 rounded-full flex items-center justify-center text-neutral-400 hover:text-white transition-colors"
                        >
                            ✕
                        </button>
                        <h2 className="text-2xl font-bold mb-6 text-white border-b border-neutral-800 pb-4">7-Day Menu</h2>

                        <div className="space-y-6">
                            {WEEKLY_MENU.map((dayMenu, i) => {
                                const isTarget = i === displayIndex;
                                return (
                                    <div key={dayMenu.day} className={`p-4 rounded-2xl border ${isTarget ? (isPastCutoff ? 'bg-indigo-500/10 border-indigo-500/30' : 'bg-orange-500/10 border-orange-500/30') : 'bg-neutral-950 border-neutral-800'}`}>
                                        <div className="flex justify-between items-center mb-2">
                                            <h4 className={`font-bold ${isTarget ? (isPastCutoff ? 'text-indigo-400' : 'text-orange-500') : 'text-neutral-300'}`}>
                                                {dayMenu.day} {isTarget && (isPastCutoff ? "(Tomorrow)" : "(Today)")}
                                            </h4>
                                        </div>
                                        <div className="flex flex-wrap gap-2 mb-3">
                                            {dayMenu.items.map((item, j) => (
                                                <span key={j} className="text-xs bg-neutral-800 text-neutral-300 px-2.5 py-1 rounded-full border border-neutral-700">
                                                    {item}
                                                </span>
                                            ))}
                                        </div>
                                        <p className="text-xs text-neutral-500 leading-relaxed">
                                            {dayMenu.description}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}

            {/* Tracking Modal */}
            {showTracking && (
                <div className="fixed inset-0 bg-black/80 z-[100] flex flex-col p-6 overflow-y-auto animate-in fade-in zoom-in-95 duration-200 backdrop-blur-sm">
                    <div className="bg-neutral-900 rounded-3xl p-6 mb-24 w-full max-w-md mx-auto relative border border-neutral-800 shadow-2xl mt-12">
                        <button
                            onClick={() => { setShowTracking(false); setTrackedOrders([]); setTrackPhone(""); setTrackError(""); }}
                            className="absolute top-4 right-4 w-8 h-8 bg-neutral-800 rounded-full flex items-center justify-center text-neutral-400 hover:text-white transition-colors"
                        >
                            ✕
                        </button>
                        <h2 className="text-2xl font-bold mb-2 text-white flex items-center gap-2"><Search className="w-5 h-5 text-orange-500" /> Track Order</h2>
                        <p className="text-neutral-400 text-sm mb-6">Enter your phone number to see your recent lunchbox orders.</p>

                        <form onSubmit={handleTrackOrder} className="mb-6 flex gap-2">
                            <input
                                type="tel"
                                placeholder="10-digit mobile"
                                className="flex-1 bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-orange-500"
                                value={trackPhone}
                                onChange={(e) => setTrackPhone(e.target.value)}
                                required
                                pattern="[0-9]{10}"
                            />
                            <button
                                type="submit"
                                disabled={isTracking}
                                className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-3 rounded-xl font-bold text-sm transition-colors flex flex-none items-center gap-2 disabled:opacity-50"
                            >
                                {isTracking ? "..." : "Find"}
                            </button>
                        </form>
                        {trackError && <p className="text-red-400 text-xs mb-4 text-center bg-red-500/10 py-2 rounded-lg border border-red-500/20">{trackError}</p>}

                        <div className="space-y-4">
                            {trackedOrders.map((order) => (
                                <div key={order._id} className="bg-neutral-950 border border-neutral-800 rounded-2xl p-4 shadow-lg">
                                    <div className="flex justify-between items-start mb-3 border-b border-neutral-800/50 pb-3">
                                        <div>
                                            <p className="text-neutral-400 text-[10px] uppercase tracking-widest text-[#23C9FF]">{order.forTomorrow ? "TOMORROW'S ORDER" : "TODAY'S ORDER"}</p>
                                            <p className="text-neutral-400 text-[10px] uppercase tracking-widest">{new Date(order.createdAt).toLocaleDateString()} • {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                            <p className="font-bold mt-1 text-sm text-neutral-200">{order.quantity}x Box • ₹{order.totalAmount}</p>
                                        </div>
                                        <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${order.status === 'Delivered' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
                                                order.status === 'Assigned' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                                                    order.status === 'Out for Delivery' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' :
                                                        'bg-amber-500/10 text-amber-500 border border-amber-500/20' // Pending
                                            }`}>
                                            {order.status}
                                        </span>
                                    </div>
                                    <div className="text-neutral-500 text-xs">
                                        <p className="flex items-center gap-1.5 mb-1"><MapPin className="w-3 h-3 text-neutral-600" /> {order.deliveryArea} - <span className="truncate">{order.userAddress}</span></p>
                                        {order.agentId && (
                                            <div className="flex items-center gap-3 text-blue-400 mt-3 bg-blue-500/10 p-3 rounded-xl border border-blue-500/20">
                                                <div className="w-8 h-8 rounded-full bg-blue-500/20 flex flex-none items-center justify-center text-blue-400 font-bold border border-blue-500/30">
                                                    {order.agentId.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="text-neutral-300 font-bold text-sm">Agent {order.agentId.name}</p>
                                                    <a href={`tel:${order.agentId.phone}`} className="underline text-[10px] mt-0.5 inline-block">Call: {order.agentId.phone}</a>
                                                </div>
                                            </div>
                                        )}
                                        {order.status === "Pending" && !order.agentId && (
                                            <div className="flex items-center gap-2 mt-3 bg-amber-500/10 text-amber-500 p-2 rounded-lg border border-amber-500/20 text-[10px]">
                                                <Clock className="w-3 h-3" /> Waiting for agent assignment...
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Sticky Bottom Actions */}
            <div className="fixed bottom-0 left-0 right-0 bg-neutral-950/90 backdrop-blur-xl border-t border-white/10 p-4 sm:p-6 w-full max-w-md mx-auto z-50">
                <div className="flex gap-4">
                    <div className="bg-neutral-900 border border-neutral-800 rounded-2xl flex items-center justify-between px-2 sm:px-4 w-1/3">
                        <button
                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                            className="w-10 h-10 flex items-center justify-center text-neutral-400 hover:text-white transition-colors"
                        >
                            <Minus className="w-5 h-5" />
                        </button>
                        <span className={`font-bold text-lg w-8 text-center transition-all ${qtyAtMax ? 'text-orange-500 scale-110' : ''}`}>{quantity}</span>
                        <button
                            onClick={() => {
                                if (quantity >= 10) { setQtyAtMax(true); setTimeout(() => setQtyAtMax(false), 800); return; }
                                setQuantity(quantity + 1);
                            }}
                            className="w-10 h-10 flex items-center justify-center text-orange-500 hover:text-orange-400 transition-colors"
                        >
                            <Plus className="w-5 h-5" />
                        </button>
                    </div>

                    <button
                        onClick={() => onCheckout(quantity, isPastCutoff)}
                        className={`flex-1 font-bold rounded-2xl py-4 transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2 text-white ${isPastCutoff ? 'bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-indigo-500 shadow-indigo-500/20' : 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 shadow-orange-500/20'}`}
                    >
                        {isPastCutoff ? 'Reserve Tmrrw' : 'Reserve'} • ₹{40 * quantity}
                    </button>
                </div>
            </div>
        </div>
    );
}
