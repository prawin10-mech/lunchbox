"use client";

import { useState, useEffect } from "react";
import { Lock, LogOut, Package, Phone, MapPin, Users, Utensils, RefreshCw, Star } from "lucide-react";

export default function AdminDashboard() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loginError, setLoginError] = useState("");

    const [orders, setOrders] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

    useEffect(() => {
        // Check local storage for session
        if (localStorage.getItem("adminAuth") === "true") {
            setIsAuthenticated(true);
        }
    }, []);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isAuthenticated) {
            fetchOrders();
            // Polling every 10 seconds
            interval = setInterval(fetchOrders, 10000);
        }
        return () => clearInterval(interval);
    }, [isAuthenticated]);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (username === "admin" && password === "Admin@123") {
            setIsAuthenticated(true);
            localStorage.setItem("adminAuth", "true");
            setLoginError("");
        } else {
            setLoginError("Invalid credentials");
        }
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
        localStorage.removeItem("adminAuth");
        setUsername("");
        setPassword("");
    };

    const fetchOrders = async () => {
        setIsLoading(true);
        try {
            const res = await fetch('/api/admin/orders', {
                headers: { 'Authorization': 'Bearer AdminSecureKey123' }
            });
            const data = await res.json();

            if (data.success) {
                // Check if there are new orders or new champions to trigger notifications
                if (orders.length > 0) {
                    const latestOldOrder = orders[0];
                    const newOrders = data.data.filter((o: any) => new Date(o.createdAt) > new Date(latestOldOrder.createdAt));

                    if (newOrders.length > 0) {
                        playNotificationSound();
                        if (Notification.permission === "granted") {
                            new Notification("New Lunchbox Order!", {
                                body: `${newOrders.length} new order(s) just arrived.`,
                            });
                        }
                    }

                    // Check for newly accepted champions
                    const oldChampions = orders.filter(o => o.isHubChampion).map(o => o._id);
                    const newChampions = data.data.filter((o: any) => o.isHubChampion && !oldChampions.includes(o._id));

                    if (newChampions.length > 0) {
                        playNotificationSound();
                        if (Notification.permission === "granted") {
                            new Notification("New Hub Champion!", {
                                body: `Someone just accepted the volunteer challenge!`,
                            });
                        }
                    }
                } else if (Notification.permission === "default") {
                    Notification.requestPermission();
                }

                setOrders(data.data);
                setLastUpdated(new Date());
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const playNotificationSound = () => {
        try {
            const audio = new Audio('/notification.mp3'); // Assuming standard notification sound exists or browser fallback
            audio.play().catch(e => console.log('Audio play prevented by browser', e));
        } catch (e) {
            console.error(e);
        }
    };

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center p-6 w-full text-white">
                <div className="w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-3xl p-8 shadow-2xl">
                    <div className="flex justify-center mb-8">
                        <div className="bg-orange-500/10 p-4 rounded-full">
                            <Lock className="w-12 h-12 text-orange-500" />
                        </div>
                    </div>
                    <h1 className="text-2xl font-bold text-center mb-8">Admin Portal</h1>

                    {loginError && (
                        <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-3 rounded-lg mb-6 text-sm text-center">
                            {loginError}
                        </div>
                    )}

                    <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                            <label className="block text-sm text-neutral-400 mb-1">Username</label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-neutral-400 mb-1">Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-xl mt-4 transition-colors"
                        >
                            Sign In
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
    const totalBoxes = orders.reduce((sum, order) => sum + order.quantity, 0);
    const championCount = orders.filter(o => o.isHubChampion).length;

    return (
        <div className="min-h-screen bg-neutral-950 text-white p-6 w-full">
            <div className="max-w-7xl mx-auto space-y-6">

                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-neutral-900 border border-neutral-800 p-6 rounded-3xl">
                    <div>
                        <h1 className="text-2xl font-bold flex items-center gap-2">
                            <Utensils className="w-6 h-6 text-orange-500" /> Lunchbox HQ
                        </h1>
                        <p className="text-neutral-400 text-sm mt-1 flex items-center gap-2">
                            Live orders monitoring
                            {isLoading ? <RefreshCw className="w-3 h-3 animate-spin text-orange-500" /> : <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>}
                            {lastUpdated && <span className="text-neutral-500">• Last synced: {lastUpdated.toLocaleTimeString()}</span>}
                        </p>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 px-4 py-2 bg-neutral-800 hover:bg-red-500/20 text-neutral-300 hover:text-red-500 rounded-xl transition-colors text-sm font-medium"
                    >
                        <LogOut className="w-4 h-4" /> Sign Out
                    </button>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-3xl flex items-center gap-4">
                        <div className="bg-orange-500/10 p-3 rounded-2xl text-orange-500"><Package className="w-6 h-6" /></div>
                        <div>
                            <p className="text-neutral-400 text-sm">Total Orders</p>
                            <p className="text-2xl font-bold">{orders.length}</p>
                        </div>
                    </div>
                    <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-3xl flex items-center gap-4">
                        <div className="bg-amber-500/10 p-3 rounded-2xl text-amber-500"><Utensils className="w-6 h-6" /></div>
                        <div>
                            <p className="text-neutral-400 text-sm">Boxes Reserved</p>
                            <p className="text-2xl font-bold">{totalBoxes}</p>
                        </div>
                    </div>
                    <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-3xl flex items-center gap-4">
                        <div className="bg-green-500/10 p-3 rounded-2xl text-green-500"><svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg></div>
                        <div>
                            <p className="text-neutral-400 text-sm">Revenue</p>
                            <p className="text-2xl font-bold">₹{totalRevenue}</p>
                        </div>
                    </div>
                    <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-3xl flex items-center gap-4 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-2 opacity-5"><Star className="w-24 h-24" /></div>
                        <div className="bg-yellow-500/10 p-3 rounded-2xl text-yellow-500"><Users className="w-6 h-6" /></div>
                        <div className="z-10">
                            <p className="text-neutral-400 text-sm">Hub Champions</p>
                            <p className="text-2xl font-bold text-yellow-500">{championCount}</p>
                        </div>
                    </div>
                </div>

                {/* Orders Table */}
                <div className="bg-neutral-900 border border-neutral-800 rounded-3xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-neutral-950/50 border-b border-neutral-800 text-neutral-400 text-sm">
                                    <th className="p-4 font-medium pl-6">Time</th>
                                    <th className="p-4 font-medium">Customer</th>
                                    <th className="p-4 font-medium">Hub Location</th>
                                    <th className="p-4 font-medium text-center">Items</th>
                                    <th className="p-4 font-medium">Total</th>
                                    <th className="p-4 font-medium">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-800/50 text-sm">
                                {orders.map((order) => (
                                    <tr key={order._id} className="hover:bg-neutral-800/20 transition-colors">
                                        <td className="p-4 pl-6 text-neutral-300">
                                            {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </td>
                                        <td className="p-4">
                                            <div className="flex flex-col gap-1">
                                                <span className="font-medium flex items-center gap-1.5"><Phone className="w-3 h-3 text-neutral-500" /> {order.userPhone}</span>
                                                <span className="text-neutral-500 text-xs truncate max-w-[200px]">{order.userAddress}</span>
                                            </div>
                                        </td>
                                        <td className="p-4 font-medium flex items-center gap-2">
                                            <MapPin className="w-4 h-4 text-orange-500" /> {order.hubName}
                                        </td>
                                        <td className="p-4 text-center">
                                            <span className="bg-neutral-800 px-3 py-1 rounded-full text-xs font-bold border border-neutral-700">
                                                {order.quantity}x Box
                                            </span>
                                            {order.upsells?.length > 0 && (
                                                <div className="mt-2 flex justify-center gap-1">
                                                    {order.upsells.map((u: string) => (
                                                        <span key={u} className="bg-orange-500/10 text-orange-400 text-[10px] px-1.5 py-0.5 rounded uppercase tracking-wider">+{u}</span>
                                                    ))}
                                                </div>
                                            )}
                                        </td>
                                        <td className="p-4 font-bold text-green-400">
                                            ₹{order.totalAmount}
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-2">
                                                <span className="bg-amber-500/10 text-amber-500 px-2.5 py-1 rounded-full text-xs font-bold border border-amber-500/20">
                                                    {order.status}
                                                </span>
                                                {order.isHubChampion && (
                                                    <span className="bg-yellow-500 text-black px-2.5 py-1 rounded-full text-xs font-extrabold shadow-[0_0_10px_rgba(234,179,8,0.3)] animate-pulse flex items-center gap-1">
                                                        <Star className="w-3 h-3" /> Champion
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {orders.length === 0 && !isLoading && (
                                    <tr>
                                        <td colSpan={6} className="p-8 text-center text-neutral-500">
                                            No orders have been received yet.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </div>
    );
}
