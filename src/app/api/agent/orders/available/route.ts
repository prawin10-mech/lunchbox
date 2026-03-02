import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import Order from "@/models/Order";
import { getDistance, TANUKU_AREAS } from "@/lib/locations";

export async function GET(req: Request) {
    try {
        await dbConnect();
        const { searchParams } = new URL(req.url);
        const areaName = searchParams.get("area");

        if (!areaName) {
            return NextResponse.json({ success: false, error: "Missing area parameter" }, { status: 400 });
        }

        const agentLocation = TANUKU_AREAS.find(a => a.name === areaName);
        if (!agentLocation) {
            return NextResponse.json({ success: false, error: "Invalid area" }, { status: 400 });
        }

        // Pre-compute which area names are within 500m of the agent's area
        // This lets MongoDB filter by deliveryArea field instead of loading all Pending orders
        const nearbyAreaNames = TANUKU_AREAS
            .filter(area => getDistance(agentLocation.lat, agentLocation.lng, area.lat, area.lng) <= 500)
            .map(area => area.name);

        // Query only Pending orders in nearby areas — far fewer records than all Pending
        const availableOrders = await Order
            .find({ status: "Pending", deliveryArea: { $in: nearbyAreaNames } })
            .select("_id userPhone userAddress deliveryArea deliveryLocation quantity totalAmount upsells status createdAt forTomorrow")
            .sort({ createdAt: 1 }) // oldest first — FIFO fairness
            .lean();

        return NextResponse.json({ success: true, count: availableOrders.length, data: availableOrders }, { status: 200 });

    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
