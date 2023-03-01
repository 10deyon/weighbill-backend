import { Document, Schema, Types } from 'mongoose';

export interface Otps extends Document {
    userId: Types.ObjectId,
    code: string,
    createdAt: Date,
    deletedAt?: Date
}

export const OtpSchema = new Schema({
    userId: {
        type: Types.ObjectId,
        required: true,
        index: true,
    },

    code: {
        type: String,
        required: true,
        default: '123456'
    },

    deletedAt: {
        type: Date,
        default: null,
    },

    createdAt: {
        type: Date,
        default: Date.now(),
    },
});
