import mongoose, { Schema, Document, model } from "mongoose";

export interface IOrder extends Document {
    userPhone: string;
    userAddress: string;
    hubName: string;
    quantity: number;
    upsells: string[];
    totalAmount: number;
    status: string;
    isHubChampion: boolean;
    createdAt: Date;
}

const OrderSchema = new Schema<IOrder>({
    userPhone: { type: String, required: true },
    userAddress: { type: String, required: true },
    hubName: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
    upsells: { type: [String], default: [] },
    totalAmount: { type: Number, required: true },
    status: { type: String, default: "Pending" },
    isHubChampion: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Order || model<IOrder>("Order", OrderSchema);
