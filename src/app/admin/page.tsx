"use client";

import { useState, useEffect } from "react";
import { Lock, LogOut, Package, Phone, MapPin, Users, Utensils, RefreshCw, Star, Filter, Plus, CheckCircle, Clock } from "lucide-react";
import { TANUKU_AREAS } from "@/lib/locations";

export default function AdminDashboard() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loginError, setLoginError] = useState("");

    const [activeTab, setActiveTab] = useState("orders");
    const [orders, setOrders] = useState<any[]>([]);
    const [agents, setAgents] = useState<any[]>([]);

    // Filters
    const [filterStatus, setFilterStatus] = useState("All");
    const [filterDate, setFilterDate] = useState("");

    // New Agent Form
    const [newAgentName, setNewAgentName] = useState("");
    const [newAgentPhone, setNewAgentPhone] = useState("");
    const [newAgentPassword, setNewAgentPassword] = useState("");

    const [isLoading, setIsLoading] = useState(false);
    const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

    useEffect(() => {
        if (localStorage.getItem("adminAuth") === "true") {
            setIsAuthenticated(true);
        }
    }, []);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isAuthenticated) {
            fetchData();
            interval = setInterval(fetchData, 10000);
        }
        return () => clearInterval(interval);
    }, [isAuthenticated, filterStatus, filterDate, activeTab]);

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

    const fetchData = async () => {
        if (activeTab === "orders") {
            fetchOrders();
        } else if (activeTab === "agents") {
            fetchAgents();
        }
    };

    const fetchOrders = async () => {
        setIsLoading(true);
        try {
            const queryParams = new URLSearchParams();
            if (filterStatus !== "All") queryParams.append("status", filterStatus);
            if (filterDate) queryParams.append("date", filterDate);

            const res = await fetch(`/api/admin/orders?${queryParams.toString()}`, {
                headers: { 'Authorization': 'Bearer AdminSecureKey123' }
            });
            const data = await res.json();
            if (data.success) {
                setOrders(data.data);
                setLastUpdated(new Date());
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchAgents = async () => {
        setIsLoading(true);
        try {
            const res = await fetch('/api/admin/agents', {
                headers: { 'Authorization': 'Bearer AdminSecureKey123' }
            });
            const data = await res.json();
            if (data.success) {
                setAgents(data.data);
                setLastUpdated(new Date());
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddAgent = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch('/api/admin/agents', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer AdminSecureKey123'
                },
                body: JSON.stringify({
                    name: newAgentName,
                    phone: newAgentPhone,
                    password: newAgentPassword
                })
            });
            const data = await res.json();
            if (data.success) {
                alert("Agent added successfully!");
                setNewAgentName("");
                setNewAgentPhone("");
                setNewAgentPassword("");
                fetchAgents();
            } else {
                alert(data.error);
            }
        } catch (error) {
            alert("Failed to add agent.");
        }
    };

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center p-6 w-full text-white font-sans">
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

    return (
        <div className="min-h-screen bg-neutral-950 text-white p-6 w-full font-sans pb-24">
            <div className="max-w-7xl mx-auto space-y-6">

                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-neutral-900 border border-neutral-800 p-6 rounded-3xl sticky top-4 z-20 backdrop-blur-md bg-opacity-90">
                    <div>
                        <h1 className="text-2xl font-bold flex items-center gap-2">
                            <Lock className="w-6 h-6 text-orange-500" /> CRM Dashboard
                        </h1>
                        <p className="text-neutral-400 text-sm mt-1 flex items-center gap-2">
                            {isLoading ? <RefreshCw className="w-3 h-3 animate-spin text-orange-500" /> : <span className="w-2 h-2 rounded-full bg-green-500"></span>}
                            {lastUpdated && <span>Last synced: {lastUpdated.toLocaleTimeString()}</span>}
                        </p>
                    </div>

                    <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
                        <button onClick={() => setActiveTab('orders')} className={`px-4 py-2 rounded-xl text-sm font-bold flex gap-2 items-center transition-all flex-none ${activeTab === 'orders' ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20' : 'bg-neutral-800 text-neutral-400 hover:text-white'}`}>
                            <Package className="w-4 h-4" /> Orders
                        </button>
                        <button onClick={() => setActiveTab('agents')} className={`px-4 py-2 rounded-xl text-sm font-bold flex gap-2 items-center transition-all flex-none ${activeTab === 'agents' ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20' : 'bg-neutral-800 text-neutral-400 hover:text-white'}`}>
                            <Users className="w-4 h-4" /> Delivery Agents
                        </button>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 px-4 py-2 bg-neutral-800 hover:bg-red-500/20 text-neutral-300 hover:text-red-500 rounded-xl transition-colors text-sm font-bold ml-auto"
                        >
                            <LogOut className="w-4 h-4" /> Sign Out
                        </button>
                    </div>
                </div>

                {activeTab === 'orders' && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-300 space-y-6">

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-3xl flex items-center gap-4">
                                <div className="bg-orange-500/10 p-3 rounded-2xl text-orange-500"><Package className="w-6 h-6" /></div>
                                <div>
                                    <p className="text-neutral-400 text-sm font-medium">Filtered Orders</p>
                                    <p className="text-2xl font-bold">{orders.length}</p>
                                </div>
                            </div>
                            <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-3xl flex items-center gap-4">
                                <div className="bg-amber-500/10 p-3 rounded-2xl text-amber-500"><Utensils className="w-6 h-6" /></div>
                                <div>
                                    <p className="text-neutral-400 text-sm font-medium">Boxes Count</p>
                                    <p className="text-2xl font-bold">{totalBoxes}</p>
                                </div>
                            </div>
                            <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-3xl flex items-center gap-4">
                                <div className="bg-green-500/10 p-3 rounded-2xl text-green-500"><span className="font-bold text-lg px-2">₹</span></div>
                                <div>
                                    <p className="text-neutral-400 text-sm font-medium">Filtered Revenue</p>
                                    <p className="text-2xl font-bold">₹{totalRevenue}</p>
                                </div>
                            </div>
                        </div>

                        {/* Filters */}
                        <div className="bg-neutral-900 p-4 border border-neutral-800 rounded-2xl flex flex-wrap gap-4 items-center">
                            <span className="text-sm font-bold text-neutral-400 flex items-center gap-2"><Filter className="w-4 h-4" /> Filters</span>

                            <select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                className="bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-orange-500"
                            >
                                <option value="All">All Statuses</option>
                                <option value="Pending">Pending (Unassigned)</option>
                                <option value="Assigned">Assigned / Picking Up</option>
                                <option value="Delivered">Delivered</option>
                            </select>

                            <input
                                type="date"
                                value={filterDate}
                                onChange={(e) => setFilterDate(e.target.value)}
                                className="bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-orange-500"
                            />

                            {(filterStatus !== 'All' || filterDate !== '') && (
                                <button onClick={() => { setFilterStatus('All'); setFilterDate(''); }} className="text-xs text-orange-400 hover:text-orange-300 ml-auto font-medium">
                                    Clear Filters
                                </button>
                            )}
                        </div>

                        {/* Table */}
                        <div className="bg-neutral-900 border border-neutral-800 rounded-3xl overflow-hidden shadow-2xl">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse whitespace-nowrap">
                                    <thead>
                                        <tr className="bg-neutral-950 text-neutral-400 text-sm">
                                            <th className="p-5 font-bold pl-6 rounded-tl-3xl">Time / ID</th>
                                            <th className="p-5 font-bold">Delivery Area & Address</th>
                                            <th className="p-5 font-bold">Hub</th>
                                            <th className="p-5 font-bold">Agent</th>
                                            <th className="p-5 font-bold">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-neutral-800/50 text-sm">
                                        {orders.map((order) => (
                                            <tr key={order._id} className="hover:bg-neutral-800/30 transition-colors">
                                                <td className="p-5 pl-6">
                                                    <p className="text-neutral-300 font-medium">{new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                                    <p className="text-neutral-500 text-[10px] mt-1 uppercase font-mono">{order._id.slice(-8)}</p>
                                                </td>
                                                <td className="p-5">
                                                    <div className="flex flex-col gap-1">
                                                        <span className="font-bold flex items-center gap-1.5"><MapPin className="w-3 h-3 text-orange-500" /> {order.deliveryArea}</span>
                                                        <span className="text-neutral-400 text-xs truncate max-w-[250px]">{order.userAddress} <br /> <a href={`tel:${order.userPhone}`} className="text-blue-400 hover:underline">📞 {order.userPhone}</a></span>
                                                    </div>
                                                </td>
                                                <td className="p-5 font-medium text-neutral-300">
                                                    {order.hubName}
                                                </td>
                                                <td className="p-5">
                                                    {order.agentId ? (
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 font-bold border border-blue-500/30">
                                                                {order.agentId.name.charAt(0)}
                                                            </div>
                                                            <div>
                                                                <p className="font-bold text-sm text-neutral-200">{order.agentId.name}</p>
                                                                <p className="text-[10px] text-neutral-500">{order.agentId.phone}</p>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <span className="text-neutral-500 italic text-xs">Unassigned</span>
                                                    )}
                                                </td>
                                                <td className="p-5">
                                                    <div className="flex items-center gap-2">
                                                        <span className={`px-3 py-1.5 rounded-full text-xs font-bold border ${order.status === 'Delivered' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                                                                order.status === 'Assigned' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                                                                    'bg-amber-500/10 text-amber-500 border-amber-500/20' // Pending
                                                            }`}>
                                                            {order.status === 'Pending' && <Clock className="w-3 h-3 inline mr-1 -mt-0.5" />}
                                                            {order.status === 'Delivered' && <CheckCircle className="w-3 h-3 inline mr-1 -mt-0.5" />}
                                                            {order.status}
                                                        </span>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                        {orders.length === 0 && !isLoading && (
                                            <tr>
                                                <td colSpan={5} className="p-12 text-center text-neutral-500 border-none bg-neutral-900">
                                                    <div className="flex flex-col items-center justify-center">
                                                        <Package className="w-12 h-12 text-neutral-800 mb-3" />
                                                        No orders fit the current filters.
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                    </div>
                )}

                {activeTab === 'agents' && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-300 grid grid-cols-1 lg:grid-cols-3 gap-6">

                        <div className="lg:col-span-2 bg-neutral-900 border border-neutral-800 rounded-3xl overflow-hidden shadow-2xl">
                            <div className="p-6 border-b border-neutral-800 flex justify-between items-center bg-neutral-950 text-white">
                                <h2 className="font-bold text-lg flex items-center gap-2"><Users className="w-5 h-5 text-orange-500" /> Managing Delivery Partners</h2>
                                <span className="text-xs bg-orange-500/20 text-orange-400 px-3 py-1 rounded-full">{agents.length} Total</span>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-neutral-900 text-neutral-400 text-sm border-b border-neutral-800">
                                            <th className="p-5 font-bold pl-6">Name</th>
                                            <th className="p-5 font-bold">Contact</th>
                                            <th className="p-5 font-bold text-center">Deliveries Today</th>
                                            <th className="p-5 font-bold text-center">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-neutral-800/50 text-sm">
                                        {agents.map((agent) => (
                                            <tr key={agent._id} className="hover:bg-neutral-800/30 transition-colors">
                                                <td className="p-5 pl-6 font-bold text-neutral-200">{agent.name}</td>
                                                <td className="p-5 text-neutral-400">{agent.phone}</td>
                                                <td className="p-5 text-center">
                                                    <div className="inline-flex items-center justify-center bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-lg px-3 py-1.5 font-bold font-mono">
                                                        {agent.deliveriesToday} / 100
                                                    </div>
                                                </td>
                                                <td className="p-5 text-center">
                                                    {agent.isActive ? (
                                                        <span className="text-green-400 text-xs font-bold uppercase tracking-wider bg-green-500/10 px-2 py-1 rounded border border-green-500/20 flex items-center justify-center gap-1 w-fit mx-auto"><div className="w-1.5 h-1.5 rounded-full bg-green-500"></div> Active</span>
                                                    ) : (
                                                        <span className="text-red-400 text-xs font-bold uppercase tracking-wider bg-red-500/10 px-2 py-1 rounded border border-red-500/20">Inactive</span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                        {agents.length === 0 && !isLoading && (
                                            <tr>
                                                <td colSpan={4} className="p-8 text-center text-neutral-500">
                                                    No delivery agents found. Add one from the panel.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 shadow-2xl h-fit sticky top-24">
                            <h3 className="font-bold text-xl mb-6 flex items-center gap-2"><Plus className="w-5 h-5 text-orange-500" /> Add New Partner</h3>
                            <form onSubmit={handleAddAgent} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2">Full Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={newAgentName}
                                        onChange={(e) => setNewAgentName(e.target.value)}
                                        className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange-500 transition-colors text-white"
                                        placeholder="e.g. Ramesh K"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2">Phone Number</label>
                                    <input
                                        type="tel"
                                        required
                                        value={newAgentPhone}
                                        onChange={(e) => setNewAgentPhone(e.target.value)}
                                        className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange-500 transition-colors text-white"
                                        placeholder="10-digit mobile"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2">Portal Password</label>
                                    <input
                                        type="password"
                                        required
                                        value={newAgentPassword}
                                        onChange={(e) => setNewAgentPassword(e.target.value)}
                                        className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange-500 transition-colors text-white"
                                        placeholder="Create a password"
                                    />
                                </div>
                                <button type="submit" className="w-full bg-orange-500 hover:bg-orange-400 text-white font-bold py-3 pt-3 mt-4 rounded-xl transition-colors shadow-lg shadow-orange-500/20 active:scale-95">
                                    Create Agent Account
                                </button>
                                <p className="text-xs text-neutral-500 mt-4 leading-relaxed bg-neutral-950 p-3 rounded-xl border border-neutral-800">
                                    Agents can login at <strong>/agent</strong> using their phone number and the password you set here.
                                </p>
                            </form>
                        </div>

                    </div>
                )}

            </div>
        </div>
    );
}
