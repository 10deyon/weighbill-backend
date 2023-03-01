import { ArgumentMetadata, HttpStatus, Injectable, PipeTransform } from '@nestjs/common';
import { isValidObjectId } from 'mongoose';
import { UserService, UtiliHelpers } from 'src/shared';

export enum metaDataType {
    PARAM='param',
}

@Injectable()
export class ValidateUserExistPipe implements PipeTransform {
    constructor(private userService: UserService) { }

    async transform(value: any, metadata: ArgumentMetadata) {
        if (isValidObjectId(value) && metadata.type == metaDataType.PARAM) {
            const requestObj = await this.userService.findOneById(value);
            if (requestObj) {
                return value;
            }
            return UtiliHelpers.sendErrorResponse({}, `User not found`, HttpStatus.NOT_FOUND, 404);
        }
        return UtiliHelpers.sendErrorResponse({}, `Expected a user id as a param`, HttpStatus.BAD_REQUEST, 400);
    }
}
