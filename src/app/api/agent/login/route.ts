import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import DeliveryAgent from "@/models/DeliveryAgent";

export async function POST(req: Request) {
    try {
        await dbConnect();
        const body = await req.json();

        if (!body.phone || !body.password) {
            return NextResponse.json({ success: false, error: "Missing phone or password" }, { status: 400 });
        }

        const agent = await DeliveryAgent.findOne({ phone: body.phone, isActive: true });

        if (!agent || agent.passwordHash !== body.password) {
            return NextResponse.json({ success: false, error: "Invalid credentials or inactive agent" }, { status: 401 });
        }

        return NextResponse.json({
            success: true,
            data: { id: agent._id, name: agent.name, phone: agent.phone }
        }, { status: 200 });

    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
