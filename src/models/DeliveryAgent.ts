import mongoose, { Schema, Document, model } from "mongoose";

export interface IDeliveryAgent extends Document {
    name: string;
    phone: string;
    passwordHash: string;
    isActive: boolean;
    deliveriesToday: number;
    lastDeliveryDate: Date | null;
}

const DeliveryAgentSchema = new Schema<IDeliveryAgent>({
    name: { type: String, required: true },
    phone: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    isActive: { type: Boolean, default: true },
    deliveriesToday: { type: Number, default: 0 },
    lastDeliveryDate: { type: Date, default: null }
});

export default mongoose.models.DeliveryAgent || model<IDeliveryAgent>("DeliveryAgent", DeliveryAgentSchema);
