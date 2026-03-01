"use client";

import { useState, useEffect } from "react";
import { Clock, Minus, Plus, Utensils, MapPin } from "lucide-react";

const WEEKLY_MENU = [
    { day: "Sunday", items: ["Veg Biryani", "Mirchi Ka Salan", "Raita"], description: "Special Sunday Veg Biryani served with spicy Mirchi Ka Salan and cooling Raita." },
    { day: "Monday", items: ["Sona Masoori Rice", "Pappucharu", "Potato Fry"], description: "Premium Sona Masoori Rice, comforting home-style Pappucharu, spicy Andhra Potato Fry, and fresh Curd." },
    { day: "Tuesday", items: ["Bagara Rice", "Dal Makhani", "Mixed Veg Curry"], description: "Flavorful Bagara Rice paired with creamy Dal Makhani and Mixed Vegetable Curry." },
    { day: "Wednesday", items: ["White Rice", "Sambar", "Bendakaya Fry"], description: "Classic White Rice with rich South Indian Sambar and crispy Okra (Bendakaya) Fry." },
    { day: "Thursday", items: ["Lemon Rice", "Tomato Dal", "Cabbage Poriyal"], description: "Zesty Lemon Rice served alongside comforting Tomato Dal and fresh Cabbage Poriyal." },
    { day: "Friday", items: ["Jeera Rice", "Palak Paneer", "Gobi Manchurian"], description: "Aromatic Jeera Rice accompanied by rich Palak Paneer and slightly spicy Gobi Manchurian dry." },
    { day: "Saturday", items: ["Pulihora", "Mudda Pappu", "Avakaya Pickle"], description: "Traditional Tamarind Rice (Pulihora) served with thick Dal (Mudda Pappu) and spicy Mango Pickle." }
];

export default function HomeMenu({ onCheckout, hubName }: { onCheckout: (q: number) => void, hubName: string }) {
    const [timeLeft, setTimeLeft] = useState({ h: 0, m: 0, s: 0 });
    const [quantity, setQuantity] = useState(1);

    // Get today's menu (0 is Sunday, 6 is Saturday)
    const todayIndex = new Date().getDay();
    const todayMenu = WEEKLY_MENU[todayIndex];

    const [showWeeklyMenu, setShowWeeklyMenu] = useState(false);

    useEffect(() => {
        const calculateTimeLeft = () => {
            const now = new Date();
            const target = new Date();
            target.setHours(10, 0, 0, 0);

            if (now > target) {
                target.setDate(target.getDate() + 1);
            }

            const difference = target.getTime() - now.getTime();

            if (difference > 0) {
                return {
                    h: Math.floor((difference / (1000 * 60 * 60))),
                    m: Math.floor((difference / 1000 / 60) % 60),
                    s: Math.floor((difference / 1000) % 60)
                };
            }
            return { h: 0, m: 0, s: 0 };
        };

        // Initialize state
        setTimeLeft(calculateTimeLeft());

        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

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
                <div className="bg-neutral-900 border border-neutral-800 rounded-full p-2.5">
                    <Utensils className="w-5 h-5 text-orange-500" />
                </div>
            </div>

            {/* Countdown Hero */}
            <div className="px-6 mb-8 w-full flex flex-col items-center">
                <div className="bg-orange-500/10 border border-orange-500/20 rounded-3xl p-6 w-full text-center relative overflow-hidden backdrop-blur-md">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <Clock className="w-24 h-24" />
                    </div>
                    <p className="text-orange-400 font-bold mb-2 uppercase text-xs tracking-widest z-10 relative">Order closes in</p>
                    <div className="flex justify-center items-end gap-2 text-white font-black z-10 relative drop-shadow-lg">
                        <span className="text-5xl tabular-nums">{String(timeLeft.h).padStart(2, '0')}</span><span className="text-xl mb-1 text-orange-500 font-bold">h</span>
                        <span className="text-5xl tabular-nums">{String(timeLeft.m).padStart(2, '0')}</span><span className="text-xl mb-1 text-orange-500 font-bold">m</span>
                        <span className="text-5xl tabular-nums">{String(timeLeft.s).padStart(2, '0')}</span><span className="text-xl mb-1 text-orange-500 font-bold">s</span>
                    </div>
                </div>
            </div>

            {/* Today's Fixed Menu */}
            <div className="px-6 mb-8 w-full">
                <div className="flex justify-between items-end mb-4">
                    <h3 className="text-xl font-bold">Today's Box</h3>
                    <button
                        onClick={() => setShowWeeklyMenu(true)}
                        className="text-orange-500 font-semibold text-sm hover:underline"
                    >
                        See whole week menu
                    </button>
                </div>
                <div className="bg-neutral-900 border border-neutral-800 rounded-3xl overflow-hidden shadow-2xl relative">
                    <div className="h-48 bg-gradient-to-r from-orange-400 to-amber-500 w-full relative">
                        {/* Visual representation of food */}
                        <div className="absolute inset-0 bg-black/20" />
                        <div className="absolute inset-0 flex items-center justify-center p-6 gap-2">
                            <div className="w-1/2 h-full bg-white/90 rounded-2xl shadow-inner flex items-center justify-center -rotate-2 transform hover:rotate-0 transition-transform">
                                <span className="text-black/30 font-bold text-center leading-tight">
                                    {todayMenu.items[0].split(' ').map((word: string, i: number) => <span key={i}>{word}<br /></span>)}
                                </span>
                            </div>
                            <div className="w-1/2 flex flex-col gap-2 h-full">
                                <div className="h-1/2 bg-yellow-200/90 rounded-2xl shadow-inner flex items-center justify-center rotate-1 transform hover:rotate-0 transition-transform">
                                    <span className="text-black/30 font-bold text-[10px] text-center px-1">{todayMenu.items[1]}</span>
                                </div>
                                <div className="h-1/2 bg-orange-200/90 rounded-2xl shadow-inner border border-white/50 flex items-center justify-center -rotate-1 transform hover:rotate-0 transition-transform">
                                    <span className="text-black/30 font-bold text-[10px] text-center px-1">{todayMenu.items[2]}</span>
                                </div>
                            </div>
                        </div>
                        <div className="absolute bottom-3 left-3 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-white shadow-sm border border-white/30 truncate max-w-[80%]">
                            {todayMenu.day} Special
                        </div>
                    </div>
                    <div className="p-5">
                        <p className="text-neutral-400 text-sm leading-relaxed mb-4">
                            {todayMenu.description} No customizations. Just hot, perfect food.
                        </p>
                    </div>
                </div>
            </div>

            {/* Weekly Menu Modal */}
            {showWeeklyMenu && (
                <div className="fixed inset-0 bg-black/80 z-50 flex flex-col p-6 overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
                    <div className="bg-neutral-900 rounded-3xl p-6 mb-24 w-full max-w-md mx-auto relative border border-neutral-800">
                        <button
                            onClick={() => setShowWeeklyMenu(false)}
                            className="absolute top-4 right-4 w-8 h-8 bg-neutral-800 rounded-full flex items-center justify-center text-neutral-400 hover:text-white"
                        >
                            ✕
                        </button>
                        <h2 className="text-2xl font-bold mb-6 text-white border-b border-neutral-800 pb-4">7-Day Menu</h2>

                        <div className="space-y-6">
                            {WEEKLY_MENU.map((dayMenu, i) => {
                                const isToday = i === todayIndex;
                                return (
                                    <div key={dayMenu.day} className={`p-4 rounded-2xl border ${isToday ? 'bg-orange-500/10 border-orange-500/30' : 'bg-neutral-950 border-neutral-800'}`}>
                                        <div className="flex justify-between items-center mb-2">
                                            <h4 className={`font-bold ${isToday ? 'text-orange-500' : 'text-neutral-300'}`}>
                                                {dayMenu.day} {isToday && "(Today)"}
                                            </h4>
                                        </div>
                                        <div className="flex flex-wrap gap-2 mb-3">
                                            {dayMenu.items.map((item, j) => (
                                                <span key={j} className="text-xs bg-neutral-800 text-neutral-300 px-2.5 py-1 rounded-full">
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
                        <span className="font-bold text-lg w-8 text-center">{quantity}</span>
                        <button
                            onClick={() => setQuantity(quantity + 1)}
                            className="w-10 h-10 flex items-center justify-center text-orange-500 hover:text-orange-400 transition-colors"
                        >
                            <Plus className="w-5 h-5" />
                        </button>
                    </div>

                    <button
                        onClick={() => onCheckout(quantity)}
                        className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 text-white font-bold rounded-2xl py-4 transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2"
                    >
                        Reserve • ₹{40 * quantity}
                    </button>
                </div>
            </div>
        </div>
    );
}
