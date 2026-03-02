import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import Order from "@/models/Order";

export async function GET(req: Request) {
    try {
        await dbConnect();
        const { searchParams } = new URL(req.url);
        const phone = searchParams.get("phone");

        if (!phone || phone.length < 10) {
            return NextResponse.json({ success: false, error: "Valid 10-digit phone number is required" }, { status: 400 });
        }

        const orders = await Order.find({ userPhone: phone })
            .populate("agentId", "name phone")
            .select("status quantity totalAmount deliveryArea userAddress createdAt forTomorrow agentId")
            .sort({ createdAt: -1 })
            .limit(20)
            .lean();

        return NextResponse.json({ success: true, count: orders.length, data: orders }, { status: 200 });

    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
