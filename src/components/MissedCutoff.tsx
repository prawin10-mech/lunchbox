import { Clock, AlertTriangle, CalendarDays } from "lucide-react";

export default function MissedCutoff({ onPreOrder }: { onPreOrder: () => void }) {
    return (
        <div className="h-full min-h-screen bg-neutral-950 text-white flex flex-col p-6 animate-in slide-in-from-bottom-10 duration-500">

            <div className="flex-1 flex flex-col items-center justify-center text-center">
                <div className="relative mb-8 group cursor-not-allowed">
                    <div className="absolute inset-0 bg-red-500/20 rounded-full blur-2xl group-hover:blur-3xl transition-all duration-700"></div>
                    <div className="bg-neutral-900 border border-neutral-800 p-8 rounded-full relative z-10 shadow-2xl">
                        <Clock className="w-20 h-20 text-neutral-500" />
                        <AlertTriangle className="w-8 h-8 text-red-500 absolute bottom-4 right-4 bg-neutral-900 rounded-full border-2 border-neutral-900" />
                    </div>
                </div>

                <h1 className="text-4xl font-black mb-3 text-white tracking-tight leading-tight">Oh Snap!<br />It's past 10 AM</h1>
                <p className="text-neutral-400 text-base max-w-[280px] mx-auto leading-relaxed">
                    To ensure <span className="text-green-500 font-bold">zero waste</span>, our kitchen only cooks the exact number of boxes ordered before 10:00 AM.
                </p>

                <div className="bg-neutral-900/50 border border-neutral-800 p-4 rounded-2xl w-full max-w-[300px] mt-8 text-left">
                    <p className="text-xs text-neutral-500 uppercase tracking-wider font-semibold mb-1">Tomorrow's Menu Preview</p>
                    <p className="text-white text-sm font-medium">Jeera Rice & Paneer Butter Masala</p>
                </div>
            </div>

            <div className="mb-8">
                <button
                    onClick={onPreOrder}
                    className="w-full bg-orange-500 text-white font-bold py-5 rounded-2xl shadow-[0_4px_14px_0_rgba(255,87,34,0.39)] hover:shadow-[0_6px_20px_rgba(255,87,34,0.23)] active:scale-95 transition-all flex items-center justify-center gap-2 text-lg"
                >
                    <CalendarDays className="w-5 h-5" /> Pre-order for Tomorrow - ₹40
                </button>
            </div>

        </div>
    );
}
