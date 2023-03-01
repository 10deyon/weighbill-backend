import mongoose, { Document, Schema, Types } from 'mongoose';
import { JWTPayload } from 'src/shared';
import * as bcrypt from 'bcrypt';
import { createHash, randomBytes } from 'crypto';

export enum Role {
    CUSTOMER = 'CUSTOMER',
    AGENT = 'AGENT',
    DISPATCHER = 'DISPATCHER',
    LOCATION_MANAGER = 'LOCATION_MANAGER',
    ADMIN = 'ADMIN'
}

export class UserError extends Error { }

export interface User extends Document {
    [x: string]: any,

    fullName: string,
    email: string,
    mobile: string,
    verified: boolean,
    deletedAt: Date,
    roles: Role[],
    wallet: Types.ObjectId,
    password: string,
    passwordResetToken: string,
    profile: object,
    
    lastName?: string,
    address?: string,
    state?: string,
    city?: string,

    createPasswordResetToken(): string,
    correctPassword(userPassword: string, password: string),
    JWTPayload(): string,
}

export const UserSchema: Schema<User> = new Schema({
    fullName: {
        type: String,
        index: true,
    },

    email: {
        type: String,
        required: [true, 'enter a valid email'],
        index: true,
        unique: true,
        lowercase: true
    },

    mobile: {
        type: String,
        index: true,
        required: true,
    },

    verified: {
        type: Boolean,
        required: true,
        default: false
    },

    enabled: {
        type: Boolean,
        required: true,
        default: false
    },

    roles: {
        type: [String],
        required: true,
        enum: [
            Role.CUSTOMER,
            Role.ADMIN,
            Role.AGENT,
            Role.DISPATCHER,
            Role.LOCATION_MANAGER,
        ],
        index: true,
    },

    deletedAt: {
        type: Date,
        index: true,
        default: null,
    },

    wallet: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Wallet"
    },

    password: {
        type: String,
        required: [true, 'Password field is required'],
        minLength: 8,
        select: false
    },

    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,

    // state: {
    //     type: String,
    //     required: false
    // },

    // city: {
    //     type: String,
    //     required: false
    // },

    // address: {
    //     type: String,
    //     required: false
    // }
}, {
    toJSON: { getters: true },
});

UserSchema.index({ email: 1, mobile: 1, deletedAt: 1 }, { unique: true })

UserSchema.methods.JWTPayload = function (): JWTPayload {
    return {
        _id: this._id,
        fullName: this.fullName,
        roles: this.roles,
        mobile: this.mobile,
        email: this.email
    };
};

UserSchema.pre('save', async function (next) {
    // Run this if password was actually modified
    if (!this.isModified('password')) return next();

    // Hash password with the cost of 12
    const salt = await bcrypt.genSalt(10);
    
    this.password = await bcrypt.hash(this.password, salt);

    // Delete passwordConfirm with the cost of 12 
    this.confirm_password = undefined;
    next();
});

UserSchema.pre('save', function (next) {
    if (!this.isModified('password') || this.isNew) return next();

    this.passwordChangedAt = Date.now() - 1000;
    next();
});

UserSchema.methods.correctPassword = async function (candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword);
};

// UserSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
//     if (this.passwordChangedAt) {
//         const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);

//         return JWTTimestamp < changedTimestamp;
//     }
//     return false;
// }

UserSchema.methods.createPasswordResetToken = function () {
    const resetToken = randomBytes(32).toString('hex');

    this.passwordResetToken = createHash('sha256').update(resetToken).digest('hex');
    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

    return resetToken;
}

UserSchema.pre(/^find/, function (next) {
    this.populate({
        path: 'wallet',
        select: '-passwordChangedAt -__v -passwordResetExpires -passwordResetToken'
    });
    next();
});
