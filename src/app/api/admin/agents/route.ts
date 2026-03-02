import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import DeliveryAgent from "@/models/DeliveryAgent";

// GET all agents
export async function GET(req: Request) {
    try {
        const authHeader = req.headers.get("Authorization");
        if (authHeader !== "Bearer AdminSecureKey123") {
            return NextResponse.json({ success: false, error: "Unauthorized access" }, { status: 401 });
        }
        await dbConnect();
        const agents = await DeliveryAgent.find({}).sort({ name: 1 }).lean();
        return NextResponse.json({ success: true, data: agents });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

// POST Create new agent
export async function POST(req: Request) {
    try {
        const authHeader = req.headers.get("Authorization");
        if (authHeader !== "Bearer AdminSecureKey123") {
            return NextResponse.json({ success: false, error: "Unauthorized access" }, { status: 401 });
        }
        await dbConnect();
        const body = await req.json();

        if (!body.name || !body.phone || !body.password) {
            return NextResponse.json({ success: false, error: "Missing fields" }, { status: 400 });
        }

        const agent = await DeliveryAgent.create({
            name: body.name,
            phone: body.phone,
            passwordHash: body.password // Simple cleartext for demo, usually hashed
        });

        return NextResponse.json({ success: true, data: agent }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
