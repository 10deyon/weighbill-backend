import { HttpException, HttpStatus } from "@nestjs/common";
import { Response } from "express";
import { ResponseData } from '../interfaces/response-formats';

export class ResponseFormat {
    /**
     * Sends default JSON resonse to client
     * @param {*} code
     * @param {*} data
     * @param {*} message
     * @param {*} code
     */
    static sendSuccessResponse(res: Response, data: any, message: string, code: number = 200) {
        const resData = {
            success: true,
            code,
            message,
            data
        };

        // resData['data'] = !!data ? data : ''
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
            data
        }

        throw new HttpException(resData, status)
    }
}
