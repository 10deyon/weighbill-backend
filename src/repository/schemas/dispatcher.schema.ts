import { Document, Schema, Types } from 'mongoose';
import { IdType } from './agent.schema';

export enum DispatcherType {
    RIDER = 'RIDER',
    DRIVER = 'DRIVER',
};

export interface Dispatcher extends Document {
    userId: Types.ObjectId;
    agentId: Types.ObjectId;
    bvn: string;
    nin: string;
    approved_by: string;
    state: string;
    id_type: IdType;
    // id_file: string; 
}

export const DispatcherSchema = new Schema({
    userId: {
        type: Types.ObjectId,
        required: true,
        index: true,
    },

    agentId: {
        type: Types.ObjectId,
        required: true,
        index: true,
    },

    bvn: {
        type: String,
        index: true,
        required: true,
        unique: true
    },

    nin: {
        type: String,
        index: true,
        required: true,
        unique: true
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

    // id_file: {
    //     type: String,
    //     index: true,
    //     required: true,
    // },

    type: {
        enum: [
            DispatcherType.DRIVER,
            DispatcherType.RIDER
        ],
        type: String,
        index: true,
        required: true
    },

    createdAt: Date,
});
