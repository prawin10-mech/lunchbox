import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import Order from "@/models/Order";

export async function PATCH(req: Request) {
    try {
        await dbConnect();
        const body = await req.json();

        if (!body.orderId) {
            return NextResponse.json({ success: false, error: "Missing order ID" }, { status: 400 });
        }

        const updatedOrder = await Order.findByIdAndUpdate(
            body.orderId,
            { $set: { isHubChampion: true } },
            { new: true }
        );

        if (!updatedOrder) {
            return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: updatedOrder }, { status: 200 });

    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
