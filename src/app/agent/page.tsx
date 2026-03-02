"use client";

import { useState, useEffect } from "react";
import { Package, MapPin, CheckCircle, LogOut, Navigation, Clock, Loader2, IndianRupee } from "lucide-react";
import { TANUKU_AREAS } from "@/lib/locations";

export default function AgentPortal() {
    const [agent, setAgent] = useState<any>(null);
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [activeTab, setActiveTab] = useState("available"); // available, my_orders
    const [fixedLocation, setFixedLocation] = useState(TANUKU_AREAS[0].name);

    const [availableOrders, setAvailableOrders] = useState<any[]>([]);
    const [myOrders, setMyOrders] = useState<any[]>([]);

    useEffect(() => {
        const storedAgent = localStorage.getItem("deliveryAgent");
        if (storedAgent) {
            setAgent(JSON.parse(storedAgent));
        }
    }, []);

    useEffect(() => {
        if (agent) {
            if (activeTab === "available") fetchAvailableOrders();
            if (activeTab === "my_orders") fetchMyOrders();
        }
    }, [agent, activeTab, fixedLocation]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            const res = await fetch("/api/agent/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ phone, password })
            });
            const result = await res.json();
            if (result.success) {
                setAgent(result.data);
                localStorage.setItem("deliveryAgent", JSON.stringify(result.data));
            } else {
                setError(result.error);
            }
        } catch (err) {
            setError("Login failed. Check connection.");
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("deliveryAgent");
        setAgent(null);
    };

    const fetchAvailableOrders = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/agent/orders/available?area=${fixedLocation}`);
            const result = await res.json();
            if (result.success) {
                setAvailableOrders(result.data);
            }
        } catch (err) {
            console.error("Failed to fetch available orders");
        } finally {
            setLoading(false);
        }
    };

    const fetchMyOrders = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/agent/orders?agentId=${agent.id}`);
            const result = await res.json();
            if (result.success) {
                setMyOrders(result.data);
            }
        } catch (err) {
            console.error("Failed to fetch my orders");
        } finally {
            setLoading(false);
        }
    };

    const acceptOrder = async (orderId: string) => {
        try {
            const res = await fetch("/api/agent/orders/accept", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ orderId, agentId: agent.id })
            });
            const result = await res.json();
            if (result.success) {
                alert("Order Assigned to You!");
                fetchAvailableOrders();
            } else {
                alert(result.error);
            }
        } catch (err) {
            alert("Failed to accept order");
        }
    };

    const markDelivered = async (orderId: string) => {
        try {
            const res = await fetch("/api/agent/orders/complete", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ orderId, agentId: agent.id })
            });
            const result = await res.json();
            if (result.success) {
                alert("Order Marked as Delivered!");
                fetchMyOrders();
            } else {
                alert(result.error);
            }
        } catch (err) {
            alert("Failed to complete order");
        }
    };

    if (!agent) {
        return (
            <div className="min-h-screen bg-neutral-950 flex items-center justify-center p-6 text-white font-sans">
                <div className="w-full max-w-sm bg-neutral-900 border border-neutral-800 p-8 rounded-3xl shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-500"></div>
                    <div className="flex justify-center mb-6">
                        <div className="bg-blue-500/10 p-4 rounded-full border border-blue-500/20">
                            <Package className="w-8 h-8 text-blue-400" />
                        </div>
                    </div>
                    <h1 className="text-2xl font-bold text-center mb-2">Delivery Partner</h1>
                    <p className="text-neutral-500 text-center text-sm mb-8">Sign in to your account</p>

                    {error && <div className="bg-red-500/10 text-red-400 p-3 rounded-xl text-sm mb-4 border border-red-500/20 text-center">{error}</div>}

                    <form onSubmit={handleLogin} className="space-y-4">
                        <input
                            type="tel"
                            placeholder="Phone Number"
                            className="w-full bg-neutral-950 border border-neutral-800 rounded-xl py-4 px-4 text-white focus:outline-none focus:border-blue-500 transition-colors"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            required
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            className="w-full bg-neutral-950 border border-neutral-800 rounded-xl py-4 px-4 text-white focus:outline-none focus:border-blue-500 transition-colors"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl transition-colors disabled:opacity-50 mt-4 shadow-lg shadow-blue-500/20"
                        >
                            {loading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : "Sign In"}
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-neutral-950 text-white pb-24 font-sans">
            {/* Header */}
            <div className="bg-neutral-900 border-b border-neutral-800 p-4 pt-8 sticky top-0 z-10 backdrop-blur-lg bg-neutral-900/80">
                <div className="flex justify-between items-center mb-4">
                    <div>
                        <h1 className="text-xl font-bold">Hi, {agent.name}</h1>
                        <p className="text-blue-400 text-sm font-medium flex items-center"><CheckCircle className="w-4 h-4 mr-1" /> Active Partner</p>
                    </div>
                    <button onClick={handleLogout} className="w-10 h-10 bg-neutral-800 rounded-full flex items-center justify-center hover:bg-neutral-700 transition-colors">
                        <LogOut className="w-5 h-5 text-neutral-400" />
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex bg-neutral-950 rounded-xl p-1 border border-neutral-800">
                    <button
                        onClick={() => setActiveTab("available")}
                        className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${activeTab === 'available' ? 'bg-blue-600 text-white shadow-md' : 'text-neutral-500'}`}
                    >
                        Pull Orders
                    </button>
                    <button
                        onClick={() => setActiveTab("my_orders")}
                        className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${activeTab === 'my_orders' ? 'bg-blue-600 text-white shadow-md' : 'text-neutral-500'}`}
                    >
                        My Deliveries
                    </button>
                </div>
            </div>

            <div className="p-4">
                {activeTab === "available" && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
                        <div className="bg-neutral-900 border border-neutral-800 p-4 rounded-2xl mb-6">
                            <p className="text-sm text-neutral-400 mb-2 font-medium">Your Current Location</p>
                            <div className="flex items-center">
                                <MapPin className="text-blue-500 w-5 h-5 mr-3" />
                                <select
                                    className="bg-transparent text-white font-bold text-lg focus:outline-none w-full appearance-none"
                                    value={fixedLocation}
                                    onChange={(e) => setFixedLocation(e.target.value)}
                                >
                                    {TANUKU_AREAS.map(area => (
                                        <option key={area.name} className="bg-neutral-900 text-base" value={area.name}>{area.name}</option>
                                    ))}
                                </select>
                            </div>
                            <p className="text-xs text-neutral-500 mt-3 pt-3 border-t border-neutral-800">Showing unassigned orders within 500m radius of {fixedLocation}.</p>
                        </div>

                        <div className="flex justify-between items-center mb-4 px-1">
                            <h2 className="font-bold text-lg">Available Now</h2>
                            <button onClick={fetchAvailableOrders} className="text-blue-400 text-sm font-bold flex items-center"><Loader2 className={`w-4 h-4 mr-1 ${loading ? 'animate-spin' : ''}`} /> Refresh</button>
                        </div>

                        {loading && availableOrders.length === 0 ? (
                            <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-blue-500" /></div>
                        ) : availableOrders.length === 0 ? (
                            <div className="bg-neutral-900 border border-neutral-800 border-dashed rounded-3xl p-8 text-center">
                                <Package className="w-12 h-12 text-neutral-700 mx-auto mb-3" />
                                <p className="text-neutral-400 font-medium">No orders nearby right now.</p>
                                <p className="text-neutral-600 text-sm mt-1">Try refreshing or changing location.</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {availableOrders.map((order: any) => (
                                    <div key={order._id} className="bg-neutral-900 border border-neutral-800 rounded-3xl p-5 relative overflow-hidden shadow-xl">
                                        <div className="flex justify-between items-start mb-3">
                                            <div>
                                                <span className="text-xs font-bold px-2 py-1 bg-neutral-800 rounded-lg text-neutral-300 inline-block mb-2">#{order._id.slice(-6).toUpperCase()}</span>
                                                <h3 className="font-bold text-lg">{order.quantity}x Box</h3>
                                                <p className="text-neutral-400 text-sm mt-1 flex items-start"><MapPin className="w-4 h-4 mr-1 mt-0.5" />{order.userAddress}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-blue-400 font-bold text-lg flex items-center justify-end"><IndianRupee className="w-4 h-4" />{order.totalAmount}</p>
                                                <p className="text-neutral-500 text-xs mt-1 bg-neutral-800 px-2 py-1 rounded-lg inline-block text-center mt-2">Cash/UPI</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => acceptOrder(order._id)}
                                            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl mt-4 transition-colors"
                                        >
                                            Accept Delivery
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {activeTab === "my_orders" && (
                    <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                        <div className="flex justify-between items-center mb-6 px-1">
                            <h2 className="font-bold text-lg">Your Deliveries</h2>
                            <button onClick={fetchMyOrders} className="text-blue-400 text-sm font-bold flex items-center"><Loader2 className={`w-4 h-4 mr-1 ${loading ? 'animate-spin' : ''}`} /> Refresh</button>
                        </div>

                        {loading && myOrders.length === 0 ? (
                            <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-blue-500" /></div>
                        ) : myOrders.length === 0 ? (
                            <div className="bg-neutral-900 border border-neutral-800 border-dashed rounded-3xl p-8 text-center">
                                <CheckCircle className="w-12 h-12 text-neutral-700 mx-auto mb-3" />
                                <p className="text-neutral-400 font-medium">You haven't accepted any orders.</p>
                                <p className="text-neutral-600 text-sm mt-1">Go to Pull Orders to find deliveries.</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {myOrders.map((order: any) => (
                                    <div key={order._id} className="bg-neutral-900 border border-neutral-800 rounded-3xl p-5 relative overflow-hidden shadow-xl">

                                        {order.status === "Delivered" && <div className="absolute top-0 right-0 w-16 h-16 overflow-hidden">
                                            <div className="bg-green-500 text-white text-[10px] font-bold py-1 w-[100px] text-center rotate-45 translate-x-[20px] translate-y-[10px]">DONE</div>
                                        </div>}

                                        <div className="mb-4">
                                            <span className="text-xs font-bold px-2 py-1 bg-neutral-800 rounded-lg text-neutral-300 inline-block mb-2">#{order._id.slice(-6).toUpperCase()}</span>
                                            <div className="flex justify-between items-center">
                                                <h3 className="font-bold text-lg">{order.quantity}x Box</h3>
                                                <p className="font-bold text-lg flex items-center"><IndianRupee className="w-5 h-5" />{order.totalAmount}</p>
                                            </div>
                                        </div>

                                        <div className="space-y-3 bg-neutral-950 p-4 rounded-2xl mb-4 border border-neutral-800">
                                            <div className="flex items-center text-sm">
                                                <Package className="w-4 h-4 text-neutral-500 mr-3 flex-none" />
                                                <span className="text-neutral-300">Hub: <span className="font-bold text-white">{order.hubName}</span> &rarr; User</span>
                                            </div>
                                            <div className="flex items-start text-sm">
                                                <MapPin className="w-4 h-4 text-neutral-500 mr-3 mt-1 flex-none" />
                                                <div>
                                                    <p className="font-bold text-white">{order.deliveryArea}</p>
                                                    <p className="text-neutral-400 mt-0.5">{order.userAddress}</p>
                                                </div>
                                            </div>
                                            {(order.status === "Assigned" || order.status === "Out for Delivery") && (
                                                <a
                                                    href={`tel:${order.userPhone}`}
                                                    className="inline-block mt-2 bg-neutral-800 hover:bg-neutral-700 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
                                                >
                                                    📞 {order.userPhone}
                                                </a>
                                            )}
                                        </div>

                                        <div className="flex gap-2">
                                            {(order.status === "Assigned" || order.status === "Out for Delivery") && (
                                                <>
                                                    <a
                                                        href={`https://maps.google.com/?q=${order.deliveryLocation.lat},${order.deliveryLocation.lng}`}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="flex-1 bg-neutral-800 hover:bg-neutral-700 text-white text-sm font-bold py-3 rounded-xl transition-colors flex items-center justify-center border border-neutral-700"
                                                    >
                                                        <Navigation className="w-4 h-4 mr-2 text-blue-400" /> Map
                                                    </a>
                                                    <button
                                                        onClick={() => markDelivered(order._id)}
                                                        className="flex-[2] bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold py-3 rounded-xl transition-colors shadow-lg shadow-emerald-500/20"
                                                    >
                                                        Mark Delivered
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
