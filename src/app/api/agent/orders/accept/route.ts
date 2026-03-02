import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import Order from "@/models/Order";
import DeliveryAgent from "@/models/DeliveryAgent";

export async function POST(req: Request) {
    try {
        await dbConnect();
        const body = await req.json();

        if (!body.orderId || !body.agentId) {
            return NextResponse.json({ success: false, error: "Missing orderId or agentId" }, { status: 400 });
        }

        const agent = await DeliveryAgent.findById(body.agentId);
        if (!agent || !agent.isActive) {
            return NextResponse.json({ success: false, error: "Invalid or inactive agent" }, { status: 400 });
        }

        // Reset deliveries today if it's a new day
        const today = new Date().toDateString();
        const lastDeliveryDay = agent.lastDeliveryDate ? new Date(agent.lastDeliveryDate).toDateString() : null;

        if (today !== lastDeliveryDay) {
            agent.deliveriesToday = 0;
            agent.lastDeliveryDate = new Date();
        }

        if (agent.deliveriesToday >= 100) {
            return NextResponse.json({ success: false, error: "Daily limit of 100 orders reached" }, { status: 403 });
        }

        const order = await Order.findOneAndUpdate(
            { _id: body.orderId, status: "Pending" },
            { status: "Assigned", agentId: agent._id },
            { new: true }
        );

        if (!order) {
            return NextResponse.json({ success: false, error: "Order no longer available or not found" }, { status: 404 });
        }

        agent.deliveriesToday += 1;
        await agent.save();

        return NextResponse.json({ success: true, data: order }, { status: 200 });

    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
