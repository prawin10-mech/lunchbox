import mongoose, { Schema, Document, model } from "mongoose";

export interface IHub extends Document {
    name: string;
    type: string;
    isActive: boolean;
}

const HubSchema = new Schema<IHub>({
    name: { type: String, required: true },
    type: { type: String, required: true },
    isActive: { type: Boolean, default: true },
});

export default mongoose.models.Hub || model<IHub>("Hub", HubSchema);
