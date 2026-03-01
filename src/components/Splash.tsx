import { PackageOpen } from "lucide-react";

export default function Splash() {
    return (
        <div className="flex flex-col items-center justify-center h-full min-h-screen bg-gradient-to-br from-orange-600 to-orange-500 animate-in fade-in duration-700">
            <div className="glass p-6 rounded-3xl animate-bounce">
                <PackageOpen size={80} className="text-white" />
            </div>
            <h1 className="text-4xl font-extrabold text-white mt-6 tracking-tight">Lunch Box</h1>
            <p className="text-orange-100 mt-2 font-medium tracking-wide">The ₹40 Revolution</p>
        </div>
    );
}
