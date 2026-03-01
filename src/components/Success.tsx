import { useState } from "react";
import { CheckCircle2, Users, Package, Loader2 } from "lucide-react";

export default function Success({ onReset, orderDetails }: { onReset: () => void, orderDetails: { _id: string, quantity: number, hub: string } | null }) {
    const [challengeAccepted, setChallengeAccepted] = useState(false);
    const [isAccepting, setIsAccepting] = useState(false);

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
            if (data.success) {
                setChallengeAccepted(true);
            }
        } catch (error) {
            console.error("Failed to accept challenge", error);
        } finally {
            setIsAccepting(false);
        }
    };

    return (
        <div className="h-full min-h-screen bg-green-500 text-white flex flex-col p-6 items-center justify-center animate-in zoom-in-95 duration-500">

            <div className="bg-white/20 p-6 rounded-full mb-8 mt-12 animate-bounce shadow-[0_0_60px_rgba(255,255,255,0.4)]">
                <CheckCircle2 className="w-24 h-24 text-white" />
            </div>

            <h1 className="text-4xl font-extrabold text-center mb-2 drop-shadow-md">Secured!</h1>
            <p className="text-xl font-medium text-green-100 text-center mb-12">
                Your {orderDetails?.quantity || 1} {orderDetails?.quantity === 1 ? 'box is' : 'boxes are'} reserved for delivery at {orderDetails?.hub || 'your hub'}.
            </p>

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
                            Volunteer to receive tomorrow's batch of 20 boxes at your office gate at 12:00 PM and hand them out to your colleagues. Your lunch will be <span className="text-orange-600 font-bold">100% Free</span>.
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
                        <p className="text-neutral-600 font-medium leading-relaxed mb-4">
                            You're officially a Hub Champion. Our team will contact you shortly with the delivery details for your free lunch tomorrow!
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
