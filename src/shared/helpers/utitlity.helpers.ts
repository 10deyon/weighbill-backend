import { HttpException, HttpStatus } from '@nestjs/common';
import axios, { AxiosResponse } from 'axios';
import { createHash, generateKeyPairSync } from 'crypto';
import { ResponseData } from '../classes';
import config from '../../core/config/config';

const CONFIG = config();

export class Helpers {
    /**
     * Sends default JSON resonse to client
     * @param {*} res
     * @param {*} content
     * @param {*} message
     */
    static sendJsonResponse(content: Record<string, unknown>, message: string): ResponseData {
        return {
            success: true,
            message,
            data: content
        };
    }

    /**
     * Sends error resonse to client
     * @param {*} content
     * @param {*} message
     * @param {*} status
     */
    static sendErrorResponse(content: Record<string, unknown>, message: string, status: string): ResponseData {
        const data: { success: boolean, message: string, data: any } = {
            success: false,
            message,
            data: content
        }

        throw new HttpException(data, HttpStatus[status])
    }

    /**
     * Capitalize a string
     * @param  {string} string
     * @returns string
     */
    static capitalize(string: string): string {
        return string.charAt(0).toUpperCase() + string.substring(1).toLowerCase()
    }

    /**
     * Prettify a request type string
     * @param  {string} string
     * @returns string
     */
    static prettifyRequestType(type: string): string {
        return Helpers.capitalize(type.split('_').join(' '));
    }

    /**
     * helps send a post request with the help of axios
     * @param  {} type = 'core'|'paystack'
     * @param  {string} path
     * @param  {any} data
     * @param  {string} token
     */
    static async sendPostRequest(type: 'core' | 'paystack', path: string, data: any, token: string): Promise<any> {
        let baseUrl: string;

        switch (type) {
            case 'core':
                baseUrl = CONFIG['AUTH_URL'];
                break;
            case 'paystack':
                baseUrl = CONFIG['PAYSTACK_URL'];
                break;
            default: throw Error(`Unknown type: ${type}`);
        }

        const response = await axios.post(
            `${baseUrl}${path}`,
            data,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                }
            });

        if (!response.data.status) {
            console.error(response.data.message);
            
            return null;
        }
        
        return response.data;
    }

    /**
     * help send a get request with the help of axios
     * @param  {} type = 'core'|'paystack'
     * @param  {string} path
     * @param  {} token
     */
    static async sendGetRequest(type: 'core' | 'paystack', path: string, token: string): Promise<any> {
        let baseUrl: string;

        switch (type) {
            case 'core':
                baseUrl = CONFIG['AUTH_URL'];
                break;
            case 'paystack':
                baseUrl = CONFIG['PAYSTACK_URL'];
                break;
            default: throw Error(`Unknown type: ${type}`);
        }

        const response: AxiosResponse
            = await axios.get(
                `${baseUrl}${path}`,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    }
                }
            );
            
        if (!response.data.status) {
            console.error(response.data.message);
            return null;
        }

        return response.data
    }

    /**
     * Get token from bearer header data
     * @param bearerHeader string
     */
    static extractToken(bearerHeader: string): string | null {
        if (bearerHeader) {
            return bearerHeader.split(' ')[1];
        }

        return null;
    }

    static monthDiff(dateFrom: Date, dateTo: Date): number {
        return dateTo.getMonth()
            - dateFrom.getMonth()
            + (
                12 * (
                    dateTo.getFullYear() - dateFrom.getFullYear()
                )
            )
    }

    static randomString(length = 5): string {
        const chars: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0987654321';
        let str: string = '';

        for (let counter: number = 0, charsLength: number = chars.length; counter < length; counter += 1) {
            str += chars.charAt(Math.floor(Math.random() * charsLength));
        }

        return str;
    };

    static generateSerialString(serialNumber: number, outputLength: number, charset: string[] = ['2', '3', '4', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'H', 'K', 'L', 'M', 'N', 'P', 'Q', 'R', 'T', 'V', 'W', 'X', 'Y']): string {
        const charsetLength: number = charset.length;
        const output: string[] = [];

        for (let outputPosition: number = 1, runningRemindand: number = serialNumber, outputPositionWeight: number; outputPosition <= outputLength; outputPosition += 1) {
            outputPositionWeight = runningRemindand % charsetLength;
            runningRemindand = Math.floor(runningRemindand / charsetLength);

            output.unshift(charset[outputPositionWeight]);
        }

        return output.join('');
    }

    static getFirstNameLastNameFromFullName(fullName: string): { firstName: string, lastName: string } {
        const [firstName, ...lastNameArray] = String(fullName).split(' ').filter(name => String(name).trim());
        const lastName = lastNameArray.join(' ').trim();

        return { firstName, lastName };
    }

    static randomNumber(length: number): string {
        const chars = '0987654321';
        let str: string = '';

        for (let counter: number = 0, charsLength: number = chars.length; counter < length; counter += 1) {
            str += chars.charAt(Math.floor(Math.random() * charsLength));
        }

        return str;
    };

    static roundOff2dp(number: number): number {
        return Math.round((number + Number.EPSILON) * 100) / 100;
    }

    // Notice: This function is one level deep
    static isSameObj(update: Object, original: Object): boolean {
        for (const prop in update) {
            if (update.hasOwnProperty(prop) /*&& original[prop]*/ && original[prop] !== update[prop]) {
                return false;
            }
        }

        return true;
    };

    private static padStart(number: number): string {
        return String(number).padStart(2, '0');
    }

    static dateFormat(date: Date | string): string {
        const newDate: Date = new Date(date);
        // const padStart: (num: number) => string = (num: number) => String(num).padStart(2, '0');

        return `${newDate.getFullYear()}-${Helpers.padStart(newDate.getMonth() + 1)}-${Helpers.padStart(newDate.getDate())}`;
    };

    static addSubtractDays(date: Date, noOfDays: number, add: boolean = true): string {
        const convertDate: number = add
            ? new Date().setDate(date.getDate() + noOfDays)
            : new Date().setDate(date.getDate() - noOfDays);

        const newDate: Date = new Date(convertDate);
        // const padStart: (num: number) => string = (num: number) => String(num).padStart(2, '0');

        return `${newDate.getFullYear()}-${Helpers.padStart(newDate.getMonth() + 1)}-${Helpers.padStart(newDate.getDate())}`;
    };

    static getWATDateTime(date: Date | string | number): string {
        return new Date(date)
            .toLocaleString(
                'en-GB',
                {
                    timeZone: "Africa/Lagos"
                }
            );
    }

    static getWATDate(date: Date | string | number): string {
        return new Date(date)
            .toLocaleDateString(
                'en-GB',
                {
                    timeZone: "Africa/Lagos"
                }
            );
    }

    // Accepts a dateString in this format YYYY-MM-DD
    // And converts it to this format DD/MM/YYYY
    static dateFormatToDateformatWAT(dateString: string): string {
        const dateStringToks: string[] = dateString.split('-');

        return `${dateStringToks[2]}/${dateStringToks[1]}/${dateStringToks[0]}`;
    }

    static isEmpty(value: any): boolean {
        if (value === null) {
            return true;
        } else if (typeof value !== 'number' && value === '') {
            return true;
        } else if (value === 'undefined' || value === undefined) {
            return true;
        } else if (value !== null && typeof value === 'object' && !Object.keys(value).length) {
            return true;
        } else {
            return false;
        }
    };

    static addYearsToDate(years: number, date: Date = new Date()): Date {
        const newDate: Date = new Date(date);

        return new Date(newDate.setFullYear(newDate.getFullYear() + years));
    }

    static addMonthsToDate(months: number, date: Date = new Date()): Date {
        const newDate: Date = new Date(date);

        return new Date(newDate.setMonth(newDate.getMonth() + months));
    }

    static addDaysToDate(days: number, date: Date = new Date()): Date {
        const newDate: Date = new Date(date);

        return new Date(newDate.setDate(newDate.getDate() + days));
    }

    static subtractDaysFromDate(days: number, date: Date = new Date()): Date {
        const newDate: Date = new Date(date);

        return new Date(newDate.setDate(newDate.getDate() - days));
    }
    
    static addHoursToDate(hours: number, date: Date = new Date()): Date {
        const newDate: Date = new Date(date);

        return new Date(newDate.setHours(newDate.getHours() + hours));
    }

    // to deduct, just pass a negetive minutes value
    static addMinutesToDate(minutes: number, date: Date = new Date()): Date {
        const newDate: Date = new Date(date);

        return new Date(newDate.setMinutes(newDate.getMinutes() + minutes));
    }

    static addSecondsToDate(seconds: number, date: Date = new Date()): Date {
        const newDate: Date = new Date(date);

        return new Date(newDate.setSeconds(newDate.getSeconds() + seconds));
    }

    static generateReference(value: string, algorithm: string) {
        return createHash(algorithm).update(value).digest('hex');
    }

    static removeObjectKeys<T>(keys: string[], object: T): T {
        const newObject = { ...object };

        keys.forEach(key => {
            delete newObject[key]
        });

        return newObject;
    }

    static formatUppercaseString(oldString: string): string {
        const newString: string = String(oldString).replace(/_/g, ' ').toLowerCase();

        return this.capitalize(newString);
    }

    static getFalsyElements = object => {
        const newObject = {};
        Object.keys(object).forEach(key => {
            if (!object[key]) {
                newObject[key] = object[key];
            }
        });
        return newObject;
    };
}
