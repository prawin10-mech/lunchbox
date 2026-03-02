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

        const { searchParams } = new URL(req.url);
        const status = searchParams.get("status");
        const date = searchParams.get("date"); // YYYY-MM-DD
        const hubName = searchParams.get("hubName");
        const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
        const limit = Math.min(100, parseInt(searchParams.get("limit") || "50"));
        const skip = (page - 1) * limit;

        let filter: any = {};

        if (status && status !== "All") filter.status = status;
        if (hubName && hubName !== "All") filter.hubName = hubName;

        if (date) {
            const startOfDay = new Date(date);
            startOfDay.setHours(0, 0, 0, 0);
            const endOfDay = new Date(date);
            endOfDay.setHours(23, 59, 59, 999);
            filter.createdAt = { $gte: startOfDay, $lte: endOfDay };
        }

        const [orders, total] = await Promise.all([
            Order.find(filter)
                .populate("agentId", "name phone")
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),
            Order.countDocuments(filter)
        ]);

        return NextResponse.json({
            success: true,
            count: orders.length,
            total,
            page,
            pages: Math.ceil(total / limit),
            data: orders
        });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
