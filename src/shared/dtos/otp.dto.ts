import { ApiProperty } from "@nestjs/swagger";
import { IsMongoId, IsString, ValidateIf } from "class-validator";

export class OtpDTO {
    @ValidateIf(o => typeof o.id === 'string')
    @IsMongoId()
    @ApiProperty({
        description: 'User ID that exists on the DB',
        required: true,
        title: 'userID',
    })
    userId: string;

    @IsString()
    @ApiProperty({
        description: 'OTP generated code',
        example: '123456',
        required: true,
        title: 'code',
    })
    code: string;
}
