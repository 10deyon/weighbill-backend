import { ApiProperty } from "@nestjs/swagger";
import { IsString, MinLength, MaxLength, IsMobilePhone, IsUppercase, IsIn, IsEmail, IsOptional } from "class-validator"
import { Match } from "../helpers/match-password";
import { Role } from "src/repository";

export class UserResetPassword {
    @IsString() 
    @MinLength(6) 
    @MaxLength(20) 
    @ApiProperty({
        description: 'New Password',
        example: 'Password',
        required: true,
        title: 'newPassword',
    })
    newPassword: string;

    @IsString()
    @ApiProperty({
        description: 'Confirm New Password',
        example: 'Password',
        required: true,
        title: 'confirmNewPassword',
    })
    @Match(UserResetPassword, (s) => s.newPassword)
    confirmNewPassword: string;
}

export class ChangePasswordDTO {
    @IsString()
    @MinLength(6)
    @MaxLength(20)
    @ApiProperty({
        description: 'New Password',
        example: 'Password',
        required: true,
        title: 'newPassword',
    })
    newPassword: string;

    @IsString()
    @MinLength(6)
    @MaxLength(20)
    @ApiProperty({
        description: 'Confirm Password',
        example: 'Password',
        required: true,
        title: 'confirm password',
    })
    @Match(ChangePasswordDTO, (s) => s.newPassword)
    confirm_password: string;
}

export class updateDTO {
    @IsString()
    @IsOptional()
    @ApiProperty({
        description: 'Full Name',
        example: 'Aniekan Akpakpan',
        required: true,
        title: 'Full Name',
    })
    fullName: string;

    @IsString()
    @IsOptional()
    @IsEmail()
    @ApiProperty({
        description: 'Email',
        example: 'user@sample.com',
        required: true,
        title: 'email',
    })
    email: string;

    @IsMobilePhone('en-NG', undefined)
    @IsOptional()
    @ApiProperty({
        description: 'Phone number',
        example: '+2347030000000',
        required: true,
        title: 'mobile',
    })
    mobile: string;
}

export class resetPasswordDTO {
    @IsString()
    @IsEmail()
    @ApiProperty({
        description: 'Email',
        example: 'user@sample.com',
        required: true,
        title: 'email',
    })
    email: string;
}
