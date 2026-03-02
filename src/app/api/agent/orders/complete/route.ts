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

        const order = await Order.findOneAndUpdate(
            { _id: body.orderId, agentId: agent._id, status: { $in: ["Assigned", "Out for Delivery"] } },
            { status: "Delivered" },
            { new: true }
        );

        if (!order) {
            return NextResponse.json({ success: false, error: "Order not found or not assigned to this agent" }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: order }, { status: 200 });

    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
