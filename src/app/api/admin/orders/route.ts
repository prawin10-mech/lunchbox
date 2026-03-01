import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import Order from "@/models/Order";

export async function GET(req: Request) {
    try {
        const authHeader = req.headers.get("Authorization");
        if (authHeader !== "Bearer AdminSecureKey123") {
            return NextResponse.json({ success: false, error: "Unauthorized access" }, { status: 401 });
        }

        await dbConnect();

        const orders = await Order.find({})
            .sort({ createdAt: -1 })
            .lean();

        return NextResponse.json({ success: true, count: orders.length, data: orders });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
