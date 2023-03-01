import { Document, Schema, Types } from 'mongoose';

export interface OrderPersonnel extends Document {
    orderId: string,
    agentId: Types.ObjectId;
    dispatcherId: string,
    adminId: string,
}

export const OrderPersonnelSchema = new Schema({
    orderId: {
        type: Types.ObjectId,
        required: true,
        index: true,
    },

    agentId: {
        type: Types.ObjectId,
        required: true,
        index: true,
    },

    dispatcherId: {
        type: Types.ObjectId,
        required: true,
        index: true,
    },

    adminId: {
        type: Types.ObjectId,
        required: true,
        index: true,
    },
},
{ timestamps: true }
);
