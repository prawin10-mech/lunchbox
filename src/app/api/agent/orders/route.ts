import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import Order from "@/models/Order";

export async function GET(req: Request) {
    try {
        await dbConnect();
        const { searchParams } = new URL(req.url);
        const agentId = searchParams.get("agentId");

        if (!agentId) {
            return NextResponse.json({ success: false, error: "Missing agentId parameter" }, { status: 400 });
        }

        const agentOrders = await Order.find({ agentId: agentId }).sort({ createdAt: -1 }).lean();

        return NextResponse.json({ success: true, count: agentOrders.length, data: agentOrders }, { status: 200 });

    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
