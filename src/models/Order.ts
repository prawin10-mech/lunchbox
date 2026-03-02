import mongoose, { Schema, Document, model } from "mongoose";

export interface IOrder extends Document {
    userPhone: string;
    userAddress: string;
    deliveryArea: string;
    deliveryLocation: {
        lat: number;
        lng: number;
    };
    hubName: string;
    quantity: number;
    upsells: string[];
    totalAmount: number;
    status: string;
    agentId: mongoose.Types.ObjectId | null;
    isHubChampion: boolean;
    forTomorrow: boolean;
    createdAt: Date;
}

const OrderSchema = new Schema<IOrder>({
    userPhone: { type: String, required: true },
    userAddress: { type: String, required: true },
    deliveryArea: { type: String, required: true },
    deliveryLocation: {
        lat: { type: Number, required: true },
        lng: { type: Number, required: true },
    },
    hubName: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
    upsells: { type: [String], default: [] },
    totalAmount: { type: Number, required: true },
    status: { type: String, default: "Pending" }, // Pending, Assigned, Out for Delivery, Delivered
    agentId: { type: Schema.Types.ObjectId, ref: 'DeliveryAgent', default: null },
    isHubChampion: { type: Boolean, default: false },
    forTomorrow: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
}, { timestamps: false });

// Indexes for frequent query patterns
OrderSchema.index({ userPhone: 1, createdAt: -1 });
OrderSchema.index({ status: 1, deliveryArea: 1 });
OrderSchema.index({ createdAt: -1 });


export default mongoose.models.Order || model<IOrder>("Order", OrderSchema);
