import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { Otps } from "src/repository";
import { GenericMatch } from "src/shared/classes";
import { OtpDTO } from "src/shared/dtos/otp.dto";

@Injectable()
export class OtpService {
    constructor(
        @InjectModel('Otp') private otpModel: Model<Otps>,
    ) { }

    async create(data: OtpDTO) {
        return await this.otpModel.create({
            code: data.code,
            userId: data.userId,
            createdAt: Date.now() + 10 * 60 * 1000
        });
    }

    async delete(id: Types.ObjectId) {
        return await this.otpModel.deleteOne({ _id: id });
    }

    async findOne(data) {
        const otp = await this.otpModel.findOne(data).exec();

        if (!otp) {
            throw new HttpException("Oops!, Token is invalid or expired, resend", HttpStatus.BAD_REQUEST);
        }

        return otp;
    }

    async updateOne(filter: GenericMatch) {
        let otp = await this.otpModel.findOneAndUpdate({ userId: filter.userId }, { code: filter.code, createdAt: Date.now() + 10 * 60 * 1000 });

        if (!otp) {
            otp = await this.create({ code: filter.code, userId: filter.userId })
            // throw new HttpException("Oops!, User record not found", HttpStatus.NOT_FOUND);
        }

        return otp;
    }
}