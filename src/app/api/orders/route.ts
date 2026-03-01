import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import Order from "@/models/Order";

export async function POST(req: Request) {
    try {
        await dbConnect();
        const body = await req.json();

        // Basic Validation
        if (!body.userPhone || !body.userAddress || !body.hubName || !body.quantity) {
            return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
        }

        // Server-side price calculation to prevent tampering
        const basePrice = 40;
        let extraCosts = 0;
        if (body.upsells && Array.isArray(body.upsells)) {
            if (body.upsells.includes("egg")) extraCosts += 15;
            if (body.upsells.includes("sweet")) extraCosts += 10;
        }

        const calculatedTotal = (basePrice * Number(body.quantity)) + extraCosts;

        // Create Order
        const newOrder = await Order.create({
            userPhone: body.userPhone,
            userAddress: body.userAddress,
            hubName: body.hubName,
            quantity: Number(body.quantity),
            upsells: body.upsells || [],
            totalAmount: calculatedTotal,
            status: "Pending",
        });

        return NextResponse.json({ success: true, data: newOrder }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}
