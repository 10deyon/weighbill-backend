import { HttpException, HttpStatus } from "@nestjs/common";
import { Response } from "express";
import { ResponseData } from './interfaces';

export class UtiliHelpers {


    /**
     * Sends default JSON resonse to client
     * @param {*} code
     * @param {*} data
     * @param {*} message
     * @param {*} code
     */
    static sendJsonResponse(res: Response, data: any, message: string, code = 200) {
        const resData = {
            success: true,
            code,
            message,
            data: data
        };
        return res.status(HttpStatus.OK).json(resData);
    }

    /**
     * Sends error resonse to client
     * @param {*} data
     * @param {*} message
     * @param {*} status
     * @param {*} code
     */
    static sendErrorResponse(data: any, message: string, status: number, code: number): ResponseData {
        const resData = {
            success: false,
            code,
            message,
            data: data
        }

        throw new HttpException(resData, status)
    }

    static normalizePhoneNumber(phoneNumber: string): string {
        let phone: string = String(phoneNumber).trim().replace(/ /g, '');

        if (phone.substring(0, 1) === '+') {
            phone = phone.substring(1);
        } else if (phone.length < 12) {
            phone = `234${phone.substring(1)}`;
        }

        return phone;
    }

    /**
     * This practice is discouraged and deprecated
     * @deprecated
     */
    static getISODateWithZeroedTime(timestampOrdateOrDateString: string | number | Date): string {
        const date: Date = new Date(timestampOrdateOrDateString);
        const padZeros = (num: number) => String(num).padStart(2, '0');

        return date.getFullYear() + '-' + padZeros(date.getMonth() + 1) + '-' + padZeros(date.getDate()) + 'T00:00:00+00:00';
    }
}
