"use client";

import { useState } from "react";
import { CheckCircle2, Users, Package, Loader2, Copy, Check } from "lucide-react";

export default function Success({ onReset, orderDetails }: {
    onReset: () => void,
    orderDetails: { _id: string, quantity: number, hub: string } | null
}) {
    const [challengeAccepted, setChallengeAccepted] = useState(false);
    const [isAccepting, setIsAccepting] = useState(false);
    const [copied, setCopied] = useState(false);

    const shortId = orderDetails?._id?.slice(-6).toUpperCase() ?? "------";
    const total = (orderDetails?.quantity ?? 1) * 40;

    const copyOrderId = () => {
        if (!orderDetails?._id) return;
        navigator.clipboard.writeText(orderDetails._id).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    const handleAcceptChallenge = async () => {
        if (!orderDetails?._id) return;
        setIsAccepting(true);
        try {
            const res = await fetch('/api/orders/challenge', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ orderId: orderDetails._id })
            });
            const data = await res.json();
            if (data.success) setChallengeAccepted(true);
        } catch (error) {
            console.error("Failed to accept challenge", error);
        } finally {
            setIsAccepting(false);
        }
    };

    return (
        <div className="h-full min-h-screen bg-gradient-to-b from-green-500 to-emerald-600 text-white flex flex-col p-6 items-center justify-center animate-in zoom-in-95 duration-500">

            <div className="bg-white/20 p-6 rounded-full mb-6 mt-12 animate-bounce shadow-[0_0_60px_rgba(255,255,255,0.4)]">
                <CheckCircle2 className="w-20 h-20 text-white" />
            </div>

            <h1 className="text-4xl font-extrabold text-center mb-1 drop-shadow-md">Secured! 🎉</h1>
            <p className="text-green-100 text-center mb-6 text-sm font-medium">
                {orderDetails?.quantity || 1} {(orderDetails?.quantity ?? 1) === 1 ? 'box is' : 'boxes are'} reserved at {orderDetails?.hub || 'your hub'}.
            </p>

            {/* Order Receipt */}
            <div className="bg-white/10 border border-white/20 backdrop-blur-sm rounded-2xl p-4 w-full mb-4 space-y-2">
                <div className="flex justify-between items-center">
                    <span className="text-green-100 text-xs uppercase tracking-widest font-semibold">Order Ref</span>
                    <button onClick={copyOrderId} className="flex items-center gap-1.5 font-mono font-bold text-sm bg-white/20 rounded-lg px-2.5 py-1 hover:bg-white/30 transition-colors">
                        #{shortId}
                        {copied ? <Check className="w-3.5 h-3.5 text-green-200" /> : <Copy className="w-3.5 h-3.5 text-white/60" />}
                    </button>
                </div>
                <div className="flex justify-between text-sm">
                    <span className="text-green-100">Boxes</span>
                    <span className="font-bold">{orderDetails?.quantity ?? 1}×</span>
                </div>
                <div className="flex justify-between text-sm border-t border-white/20 pt-2 mt-2">
                    <span className="text-green-100">Total (Cash / UPI at hub)</span>
                    <span className="font-black text-lg">₹{total}</span>
                </div>
            </div>

            {/* Hub Champion card */}
            <div className="bg-white w-full rounded-[2rem] p-6 text-black shadow-2xl relative transform hover:-translate-y-1 transition-transform">
                {!challengeAccepted ? (
                    <>
                        <div className="absolute -top-4 -right-4 bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold rotate-12 shadow-lg">
                            FREE LUNCH
                        </div>
                        <div className="bg-orange-100 p-3 rounded-2xl w-14 h-14 flex items-center justify-center mb-4 text-orange-600">
                            <Users className="w-8 h-8" />
                        </div>
                        <h3 className="font-extrabold text-2xl mb-2 text-neutral-900 leading-tight">Become a Hub Champion</h3>
                        <p className="text-neutral-600 text-sm mb-6 font-medium leading-relaxed">
                            Volunteer to receive tomorrow's batch of 20 boxes at your office gate at 12:00 PM and hand them out. Your lunch will be <span className="text-orange-600 font-bold">100% Free</span>.
                        </p>
                        <button
                            onClick={handleAcceptChallenge}
                            disabled={isAccepting}
                            className={`w-full bg-neutral-900 text-white font-bold py-4 rounded-xl shadow-lg transition-transform flex items-center justify-center gap-2 text-sm ${isAccepting ? 'opacity-70 cursor-not-allowed' : 'active:scale-95 hover:bg-neutral-800'}`}
                        >
                            {isAccepting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Package className="w-4 h-4" />}
                            {isAccepting ? "Accepting..." : "Accept Challenge"}
                        </button>
                    </>
                ) : (
                    <div className="text-center py-6 animate-in fade-in zoom-in duration-300">
                        <div className="bg-green-100 p-3 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 text-green-600">
                            <CheckCircle2 className="w-8 h-8" />
                        </div>
                        <h3 className="font-extrabold text-2xl mb-2 text-green-700 leading-tight">Challenge Accepted!</h3>
                        <p className="text-neutral-600 font-medium leading-relaxed">
                            You're officially a Hub Champion. We'll contact you shortly with delivery details for your free lunch!
                        </p>
                    </div>
                )}
            </div>

            <button
                onClick={onReset}
                className="mt-auto pt-10 pb-6 text-white/80 font-medium hover:text-white transition-colors border-b border-transparent hover:border-white/50"
            >
                Return Home
            </button>
        </div>
    );
}
