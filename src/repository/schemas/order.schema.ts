import { Document, Schema, Types } from 'mongoose';
import { VehicleType } from './vehicle.schema';

export enum ShippingType {
    INTERNATIONAL = 'INTERNATIONAL',
    INTRASTATE = 'INTRASTATE',
    INTERSTATE = 'INTERSTATE'
};

export enum OrderStatus {
    PENDING = 'PENDING',
    IN_PROGRESS = 'IN_PROGRESS',
    TO_BE_DELIVERED = 'TO_BE_DELIVERED',
    TO_BE_TRANSFERRED = 'TO_BE_TRANSFERRED',
    COMPLETED = 'COMPLETED',
    CANCELED = 'CANCELED'
}

export interface Order extends Document {
    value: number,
    userId: Types.ObjectId;
    reference: string,
    description: string, // optional
    status: OrderStatus
    mode_of_delivery: VehicleType
    shipping_type: ShippingType
}

export const OrderSchema = new Schema({
    userId: {
        type: Types.ObjectId,
        required: true,
        index: true,
    },

    value: {
        type: Number,
        index: true,
        required: true,
    },

    reference: {
        type: String,
        index: true,
        required: true,
    },

    description: {
        type: String,
        index: true,
        required: false,
    },

    status: {
        enum: [
            OrderStatus.PENDING,
            OrderStatus.IN_PROGRESS,
            OrderStatus.TO_BE_DELIVERED,
            OrderStatus.TO_BE_TRANSFERRED,
            OrderStatus.COMPLETED,
            OrderStatus.CANCELED,
        ],
        type: String,
        index: true,
        required: true,
    },

    mode_of_delivery: {
        enum: [
            VehicleType.BIKE,
            VehicleType.CAR,
            VehicleType.MINI_VAN,
            VehicleType.TRUCK,
        ],
        type: String,
        index: true,
        required: true,
    },

    shipping_type: {
        enum: [
            ShippingType.INTERNATIONAL,
            ShippingType.INTERSTATE,
            ShippingType.INTRASTATE
        ],
        type: String,
        index: true,
        required: true,
    },

    pickup_location: [
        {
            type: {
                type: String,
                default: 'Point',
                enum: ['Point']
            },
            coordinates: [Number],
            address: String,
            description: String,
            day: Number
        }
    ],

    delivery_location: [
        {
            // GeoJSON
            type: {
                type: String,
                default: 'Point',
                enum: ['Point']
            },
            coordinates: [Number],
            address: String,
            description: String,
            day: Number
        }
    ],
},
{ timestamps: true }
);
