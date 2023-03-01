import { Document, Schema, Types } from 'mongoose';

export enum IdType {
    DRIVERS_LICENCE = 'DRIVERS_LICENCE',
    INTL_PASSPORT = 'INTL_PASSPORT'
};

export interface Agent extends Document {
    userId: Types.ObjectId;
    bvn: string;
    nin: string;
    approved_by: string;
    state: string;
    id_type: IdType;
    id_file: string;
}

export const AgentSchema = new Schema({
    userId: {
        type: Types.ObjectId,
        required: true,
        index: true,
    },

    bvn: {
        type: String,
        index: true,
        required: true,
    },

    nin: {
        type: String,
        index: true,
        required: true,
    },

    approved_by: {
        type: Types.ObjectId,
        required: true,
        index: true,
    },

    state: {
        type: String,
        index: true,
        required: true,
    },

    id_type: {
        enum: [
            IdType.DRIVERS_LICENCE,
            IdType.INTL_PASSPORT,
        ],
        type: String,
        index: true,
        required: true,
    },

    id_file: {
        type: String,
        index: true,
        required: false,
    },

    createdAt: Date,
});
