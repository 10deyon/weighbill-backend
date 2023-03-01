import { Document, Schema, Types } from 'mongoose';

export enum Category {
    DOCUMENT = 'DOCUMENT',
    NON_DOCUMENT = 'NON_DOCUMENT',
    OTHERS = 'OTHERS'
};

export interface OrderItems extends Document {
    orderId: Types.ObjectId;
    itemName: string,
    quantity: number,
    weight: number
    category: Category
    picture: string
}

export const OrderItemsSchema = new Schema({
    orderId: {
        type: Types.ObjectId,
        required: true,
        index: true,
    },

    itemName: {
        type: Number,
        index: true,
        required: true,
    },

    quantity: {
        type: String,
        index: true,
        required: true,
    },

    weight: {
        type: String,
        index: true,
        required: false,
    },

    category: {
        enum: [
            Category.DOCUMENT,
            Category.NON_DOCUMENT,
            Category.OTHERS
        ],
        type: String,
        index: true,
        required: false,
    },

    picture: {
        type: String,
        index: true,
        required: false,
    },

    deletedAt: {
        type: String,
        index: true,
        required: false,
    },
},
{ timestamps: true }
);
