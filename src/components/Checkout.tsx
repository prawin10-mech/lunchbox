"use client";

import { useState } from "react";
import { ChevronLeft, Check, Plus, Phone, MapPin } from "lucide-react";
import { TANUKU_AREAS } from "@/lib/locations";

export default function Checkout({ quantity, onBack, onPay, forTomorrow = false, hubName = "" }: any) {
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [deliveryArea, setDeliveryArea] = useState(TANUKU_AREAS[0].name);
    const [upsells, setUpsells] = useState<string[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const toggleUpsell = (item: string) => {
        if (upsells.includes(item)) {
            setUpsells(upsells.filter((i: string) => i !== item));
        } else {
            setUpsells([...upsells, item]);
        }
    };

    const hasItem = (item: string) => upsells.includes(item);

    return (
        <div className="h-full min-h-screen bg-neutral-950 text-white flex flex-col p-6 animate-in slide-in-from-right-10 duration-300">

            <div className="flex items-center gap-4 mb-8 pt-4">
                <button onClick={onBack} className="w-10 h-10 bg-neutral-900 rounded-full flex items-center justify-center text-white hover:bg-neutral-800">
                    <ChevronLeft className="w-6 h-6" />
                </button>
                <div>
                    <h2 className="text-2xl font-bold">Finalize Order</h2>
                    {forTomorrow && <p className="text-indigo-400 text-xs font-semibold mt-0.5">🌙 Reserving for Tomorrow</p>}
                </div>
            </div>

            <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-5 mb-8 shadow-xl">
                <h3 className="font-bold text-lg mb-4 text-neutral-300 border-b border-neutral-800 pb-2">Order Summary</h3>
                <div className="flex justify-between items-center mb-3">
                    <span className="text-white font-medium">{quantity}x Standard Box</span>
                    <span className="font-bold">₹{40 * quantity}</span>
                </div>
                <p className="text-sm text-neutral-500">Rice, Pappucharu, Potato Fry, Curd.</p>
            </div>

            <div className="mb-10">
                <h3 className="font-bold text-lg mb-4 text-white">Add to your box</h3>
                <div className="flex overflow-x-auto gap-4 pb-4 snap-x no-scrollbar" style={{ scrollbarWidth: 'none' }}>

                    <div
                        onClick={() => toggleUpsell('egg')}
                        className={`flex-none w-40 p-4 rounded-3xl border ${hasItem('egg') ? 'border-orange-500 bg-orange-500/10' : 'border-neutral-800 bg-neutral-900'} cursor-pointer transition-all active:scale-95 relative snap-start`}
                    >
                        {hasItem('egg') && <div className="absolute top-3 right-3 bg-orange-500 rounded-full p-1"><Check className="w-3 h-3 text-white" /></div>}
                        <div className="w-16 h-16 bg-gradient-to-br from-yellow-100 to-yellow-300 rounded-full mb-3 shadow-inner"></div>
                        <p className="font-bold text-sm">Boiled Egg</p>
                        <p className="text-orange-500 font-bold mt-1 flex items-center"><Plus className="w-3 h-3 mr-0.5" />₹15</p>
                    </div>

                    <div
                        onClick={() => toggleUpsell('sweet')}
                        className={`flex-none w-40 p-4 rounded-3xl border ${hasItem('sweet') ? 'border-orange-500 bg-orange-500/10' : 'border-neutral-800 bg-neutral-900'} cursor-pointer transition-all active:scale-95 relative snap-start`}
                    >
                        {hasItem('sweet') && <div className="absolute top-3 right-3 bg-orange-500 rounded-full p-1"><Check className="w-3 h-3 text-white" /></div>}
                        <div className="w-16 h-16 bg-gradient-to-br from-amber-700 to-amber-900 rounded-full mb-3 shadow-inner"></div>
                        <p className="font-bold text-sm">Gulab Jamun</p>
                        <p className="text-orange-500 font-bold mt-1 flex items-center"><Plus className="w-3 h-3 mr-0.5" />₹10</p>
                    </div>

                </div>
            </div>

            <div className="mb-8">
                <h3 className="font-bold text-lg mb-4 text-white">Delivery Details</h3>
                {hubName && (
                    <div className="flex items-center gap-2 mb-3 px-1">
                        <span className="text-neutral-500 text-xs">Hub:</span>
                        <span className="text-orange-400 text-xs font-bold bg-orange-500/10 border border-orange-500/20 px-2.5 py-1 rounded-full">{hubName}</span>
                    </div>
                )}
                <div className="space-y-3">
                    {/* Delivery Area Selector */}
                    <div className="relative">
                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-500 w-5 h-5 z-10 pointer-events-none" />
                        <select
                            className="w-full bg-neutral-900 border border-neutral-800 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all font-medium appearance-none"
                            value={deliveryArea}
                            onChange={(e) => setDeliveryArea(e.target.value)}
                        >
                            {TANUKU_AREAS.map(area => (
                                <option key={area.name} value={area.name} className="bg-neutral-900">{area.name}</option>
                            ))}
                        </select>
                    </div>
                    {/* Phone */}
                    <div className="relative">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500 w-5 h-5" />
                        <input
                            type="tel"
                            placeholder="10-digit Mobile Number"
                            className="w-full bg-neutral-900 border border-neutral-800 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-neutral-600 focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all font-medium"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            required
                        />
                    </div>
                    {/* Specific address / landmark */}
                    <div className="relative">
                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Flat / landmark / building name"
                            className="w-full bg-neutral-900 border border-neutral-800 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-neutral-600 focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all font-medium"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            required
                        />
                    </div>
                </div>
            </div>

            <div className="mt-auto space-y-4">
                <div className="p-4 bg-orange-500/10 border border-orange-500/20 rounded-2xl">
                    <p className="text-xs text-orange-400 font-medium text-center">Payment Method</p>
                    <p className="text-center font-bold text-white mt-1">Pay at Hub (Cash / UPI)</p>
                </div>

                <button
                    onClick={async () => {
                        if (isSubmitting) return;
                        setIsSubmitting(true);
                        try {
                            await onPay({ userPhone: phone, userAddress: address, deliveryArea, forTomorrow, upsells });
                        } finally {
                            setIsSubmitting(false);
                        }
                    }}
                    disabled={!phone || !address || phone.length < 10 || isSubmitting}
                    className="w-full bg-orange-500 hover:bg-orange-400 disabled:bg-neutral-800 disabled:text-neutral-500 text-white font-bold text-lg rounded-2xl py-5 transition-all shadow-[0_4px_14px_0_rgba(255,87,34,0.39)] hover:shadow-[0_6px_20px_rgba(255,87,34,0.23)] disabled:shadow-none active:scale-95"
                >
                    {isSubmitting ? "Placing Order..." : "Confirm Order"}
                </button>
            </div>

        </div>
    );
}
