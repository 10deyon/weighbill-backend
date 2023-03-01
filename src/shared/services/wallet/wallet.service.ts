import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import config from "src/core/config/config";
import { Wallet, WalletTransaction } from "src/repository";
import { JWTPayload } from "src/shared/classes";
import { VerifyPaymentDto, WalletDto } from "src/shared/dtos/wallet.dto";
import { Helpers } from 'src/shared/helpers/utitlity.helpers';
import { GenericMatch } from "src/shared/interfaces/genericMatch";

const CONFIG = config();

@Injectable()
export class WalletService {
    constructor(
        @InjectModel('Wallet') private walletModel: Model<Wallet>,
        @InjectModel('WalletTransaction') private walletTxnModel: Model<WalletTransaction>,
    ) { }
    
    async initiatePayment(user, data: WalletDto) {
        const wallet = await this.getUserWallet(user._id);

        if (!wallet) {
            throw new HttpException("Oops!, record not found", HttpStatus.NOT_FOUND);
        }

        const walletTransaction = await this.walletTxnModel.create({
            payment_reference: `iRef-${Helpers.randomString()}${new Date().getTime()}${Helpers.randomString()}`,
            balanceBefore: wallet.balance,
            balanceAfter: wallet.balance,
            amount: data.amount * 1000,  //amount is in KOBO
            narration: data.narration ?? `${wallet.userId}`,
            type: 'CREDIT',
            transactionId: new Date().getTime(),
            userId: user._id,
            walletId: wallet._id,
        });

        // const payload = {
        //     "email": "customer@email.com",
        //     "amount": walletTransaction.amount * 1000
        // }

        // const path = "/transaction/initialize";
        // const result = await Helpers.sendPostRequest('paystack', path, payload, CONFIG.PAYSTACK_SECRET_KEY)

        return walletTransaction;
    }

    async verify(user, data: VerifyPaymentDto) {
        const SWAGGER_ENVS = ['development', 'staging'];

        // TODO:: Checking if user has wallet might not be neccessary
        const wallet = await this.getUserWallet(user._id);
        if (!wallet) {
            throw new HttpException("Oops!, record not found", HttpStatus.NOT_FOUND);
        }
        
        const walletTransaction = await this.walletTxnModel.findOne({
            payment_reference: data.reference,
            walletId: wallet._id
        });
        if (!walletTransaction) {
            throw new HttpException("Oops!, Payment record not found", HttpStatus.NOT_FOUND);
        }

        const completedWalletTxn = await this.walletTxnModel.findOne({ status: 'COMPLETE'});
        if (!!completedWalletTxn) {
            throw new HttpException("Oops!, Payment payment already verified", HttpStatus.BAD_REQUEST);
        }

        let path: string;
        // if (SWAGGER_ENVS.includes(CONFIG.APP_ENV)) {
        //     path = `/transaction/verify/l86gt15pxt`;
        // } else {
            path = `/transaction/verify/${walletTransaction.payment_reference}`;
        // }

        const result = await Helpers.sendGetRequest('paystack', path, CONFIG.PAYSTACK_SECRET_KEY)
        
        if (!!result.status && result.data.status === 'abandoned') {
            if (walletTransaction.amount > result.data.amount) {
                throw new HttpException("Oops!, Incomplete payment, contact our customer care support", HttpStatus.NOT_FOUND);
            }
            
            const response = await this.walletTxnModel.findOneAndUpdate({ _id: walletTransaction._id }, {
                amount: result.data.amount > walletTransaction.amount ? result.data.amount : walletTransaction.amount,
                status: "COMPLETE",
                balanceBefore: wallet.balance,
                balanceAfter: wallet.balance + result.data.amount,
                apiResponse: JSON.stringify(result)
            }, { new: true }).select('-__v -apiResponse');
            
            await this.walletModel.updateOne({ _id: wallet._id }, { balance: wallet.balance + (walletTransaction.amount/1000) })

            return response;
        } 
        
        return walletTransaction;
    }

    async getUserPaymentHistory(user) {
        const wallet = await this.getUserWallet(user._id);

        if (!wallet) {
            throw new HttpException("Oops!, record not found", HttpStatus.NOT_FOUND);
        }

        return await this.walletTxnModel.find({ walletId: wallet._id}).select('-__v -apiResponse');
    }

    async create(data) {
        return await this.walletModel.create(data);
    }

    async debit(data) {
        return await this.walletModel.create(data);
    }

    async getWallet(data) {
        return await this.walletModel.findById(data);
    }

    async getUserWallet(data) {
        return await this.walletModel.findOne({ userId: data }).select('-__v -currency'); 
    }
}