import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import Hub from "@/models/Hub";

// Seed Tanuku Hubs if empty
const seedHubs = async () => {
    const defaultHubs = [
        { name: "Sasi Institute of Technology", type: "College" },
        { name: "Mullapudi Hospital Area", type: "Hospital" },
        { name: "Tanuku Railway Station Area", type: "Transit" },
        { name: "Nannayya University Campus", type: "College" },
        { name: "SKSD Mahila Kalasala", type: "College" },
        { name: "Old Bus Stand Area", type: "Transit" },
        { name: "New Bus Stand Area", type: "Transit" },
        { name: "NTR Statue Center", type: "Commercial" },
        { name: "Sajja Hospital Area", type: "Hospital" },
        { name: "Venkataramana Theatre Area", type: "Commercial" },
        { name: "Akula Sriramulu College", type: "College" },
        { name: "Government Hospital Area", type: "Hospital" },
        { name: "Balusumudi", type: "Residential" },
        { name: "Velpur Road Area", type: "Commercial" },
        { name: "The Andhra Sugars Limited", type: "Industry" },
        { name: "Gowthami Solvent Oils", type: "Industry" },
        { name: "Sri Venkata Raya Ayurveda Kalasala", type: "College" },
        { name: "SMVM Polytechnic", type: "College" },
        { name: "Paidiparru", type: "Surrounding" },
        { name: "Tetali", type: "Surrounding" },
        { name: "Mandapaka", type: "Surrounding" },
        { name: "Undrajavaram Road", type: "Surrounding" }
    ];

    for (const hub of defaultHubs) {
        await Hub.findOneAndUpdate(
            { name: hub.name },
            { $setOnInsert: { ...hub, isActive: true } },
            { upsert: true, new: true }
        );
    }
};

let cachedHubs: any = null;
let lastCacheTime: number = 0;
const CACHE_TTL = 1000 * 60 * 60; // 1 hour 

export async function GET() {
    try {
        const now = Date.now();
        if (cachedHubs && (now - lastCacheTime) < CACHE_TTL) {
            return NextResponse.json({ success: true, count: cachedHubs.length, data: cachedHubs, cached: true });
        }

        await dbConnect();
        await seedHubs();

        // Fetch active hubs
        const hubs = await Hub.find({ isActive: true }).sort({ name: 1 }).lean();

        cachedHubs = hubs;
        lastCacheTime = now;

        return NextResponse.json({ success: true, count: hubs.length, data: hubs, cached: false });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}
