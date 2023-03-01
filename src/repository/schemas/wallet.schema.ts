import { Document, Schema, Types } from 'mongoose';

export interface WalletTransaction extends Document {
    balanceBefore: number
    balanceAfter: number;
    amount: number;
    narration: string;
    type: string; 
    date: Date;
    transactionId: string;
    status: string;
    walletId: Types.ObjectId;
    payment_reference: string;
    apiResponse: string
}

export interface Wallet extends Document {
    userId: Types.ObjectId,
    ledgerBalance: number;
    balance: number;
    currency: string;
}

export const WalletTransactionSchema = new Schema({
    balanceBefore: {
        type: Number,
        required: true
    },
    balanceAfter: {
        type: Number,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    narration: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['CREDIT', 'DEBIT'],
        required: true
    },
    date: {
        type: Date,
        default: Date.now()
    },
    transactionId: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true, default: "PENDING",
        enum: ['SUCCESSFUL', 'PENDING', 'FAILED']
    },
    walletId: {
        type: Types.ObjectId,
        required: true,
        index: true,
    },
    payment_reference: {
        type: String,
        required: true
    },

    apiResponse: String
}, 
// This is used when a virtual method is created on the model
// Virtuals cannot be used to run a query
// {
//     toObject: { virtuals: true },
//     toJSON: { virtuals: true },
// }
);

// WalletTransactionSchema.virtual('virtual_name').get(function(params:type) {
//     // call the property name on the model and perform your operation
//     return this.modelName 
// })

export const WalletSchema = new Schema({
    ledgerBalance: {
        type: Number,
        required: false,
        default: 0.0
    },

    balance: {
        type: Number,
        required: true,
        default: 0.0
    },

    currency: {
        type: String,
        required: true,
        default: 'NGN',
        enum: ['NGN']
    },
    
    userId: {
        type: Types.ObjectId,
        required: true,
        index: true,
    },
})

