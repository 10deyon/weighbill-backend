import { Document, Schema, Types } from 'mongoose';

export enum VehicleType {
    BIKE = 'BIKE',
    CAR = 'CAR',
    MINI_VAN = 'MINI_VAN',
    TRUCK = 'TRUCK'
}

export class VehicleError extends Error { }

export interface Vehicle extends Document {
    type: VehicleType
    regNumber: string;
    make?: string;
    series?: string;
    year?: number;
    model: number;
    vin: string;
    managerId: Types.ObjectId,
    country: string;
    name: string;
    image: string;
    status: string;
    locationState?: string;
    total: number
}

export const VehicleSchema = new Schema({
    managerId: {
        type: Types.ObjectId,
        required: true,
        index: true,
    },
    
    regNumber: {
        type: String,
        required: true,
        index: true,
        get: (v: Schema.Types.String) => String(v).replace(/ /g, '').toUpperCase(),
    },

    name: {
        type: String,
        required: true,
        index: true
    },

    type: {
        enum: [
            VehicleType.BIKE,
            VehicleType.CAR,
            VehicleType.MINI_VAN,
            VehicleType.TRUCK,
        ],
        type: String,
        required: true,
        index: true
    },

    image: {
        type: String,
        required: true,
    },

    country: {
        type: String,
        required: true,
    },

    status: {
        type: String,
        enum: ['Available', 'On Service', 'Not Available'],
        default: 'Available',
        required: true
    },

    locationState: {
        type: String,
        required: true,
        uppercase: true,
        default: 'NIGERIA'
    },

    model: {
        type: Number,
        required: true,
        default: 2021,
        get: (v: Schema.Types.Number) => v ?? (new Date()).getFullYear(),
    },

    vin: {
        type: String,
        required: true,
        index: true
    },

    make: {
        type: String,
        required: false,
        index: true
    },

    series: {
        type: String,
        required: false,
    },
    
    year: {
        type: Number,
        required: false,
        get: (v: Schema.Types.Number) => v ?? (new Date()).getFullYear(),
    },
}, 
// { timestamps: true },
{ toJSON: { getters: true },
})

VehicleSchema.index({ regNumber: 1, deletedAt: 1 }, { unique: true })
VehicleSchema.index({ name: 'text', regNumber: 'text' });
