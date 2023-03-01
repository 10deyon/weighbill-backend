import { Document, Schema, Types } from 'mongoose';

export interface OrderParties extends Document {
    senderId: Types.ObjectId;
    orderId: Types.ObjectId;
    receiverName: string,
    receiverMobile1: string,
    receiverMobile2?: string,
    receiverEmail?: string,
}

export const OrderPartiesSchema = new Schema({
    orderId: {
        type: Types.ObjectId,
        required: true,
        index: true,
    },

    senderId: {
        type: Types.ObjectId,
        required: true,
        index: true,
    },

    receiverName: {
        type: String,
        index: true,
        required: true,
    },

    receiverMobile1: {
        type: String,
        index: true,
        required: true,
    },

    receiverMobile2: {
        type: String,
        index: true,
        required: false,
    },

    receiverEmail: {
        type: String,
        index: true,
        required: false,
    }
},
{ timestamps: true }
);
