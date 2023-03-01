import { USER_TYPE } from '../classes/constants';
import { ApiProperty, PickType } from "@nestjs/swagger";
import {
    IsOptional,
    IsMobilePhone,
    IsString,
    IsUppercase,
    IsEmail,
    MinLength,
    MaxLength,
    IsIn,
    IsMongoId,
} from "class-validator";
import { DispatcherType, IdType, Role } from "src/repository";
import { Pagination } from "./pagination.dto";
import { Match } from '../helpers/match-password';

export class userProfileDTO{
    @IsString()
    @IsOptional()
    @ApiProperty({
        description: 'BVN',
        example: '088909208400',
        title: 'BVN',
    })
    bvn: string;

    @IsString()
    @IsOptional()
    @ApiProperty({
        description: 'NIN',
        example: '088909208400',
        title: 'NIN',
    })
    nin: string;

    @IsIn([
        IdType.DRIVERS_LICENCE,
        IdType.INTL_PASSPORT,
    ])
    @IsString()
    @IsOptional()
    @ApiProperty({
        description: 'Use DRIVERS_LICENCE or INTL_PASSPORT',
        example: 'INTL_PASSPORT',
        title: 'ID Type',
    })
    id_type: string;

    @IsIn([
        DispatcherType.DRIVER,
        DispatcherType.RIDER,
    ])
    @IsString()
    @IsOptional()
    @ApiProperty({
        description: 'Use DRIVER or RIDER',
        example: 'RIDER',
        title: 'Dispatcher Type',
    })
    dispatcherType: string;

    @IsString()
    @IsOptional()
    @ApiProperty({
        description: 'State',
        example: 'Abuja',
        title: 'State',
    })
    state: string;

    @IsString()
    @IsMongoId()
    @IsOptional()
    @ApiProperty({
        description: 'ID of admin or manager',
        example: '63ea6d55024413e5a3322a74',
        title: 'Approved By',
    })
    approved_by: string;

    @IsString()
    @IsOptional()
    @ApiProperty({
        description: 'Email',
        example: '63ea6d55024413e5a3322a74',
        title: 'email',
    })
    agentId: string;
}

export class RegistrationDTO extends userProfileDTO{
    @IsString()
    @ApiProperty({
        description: 'Full Name',
        example: 'Aniekan Akpakpan',
        required: true,
        title: 'Full Name',
    })
    fullName: string;

    @IsString()
    @IsEmail()
    @ApiProperty({
        description: 'Email',
        example: 'user@sample.com',
        required: true,
        title: 'email',
    })
    email: string;

    @IsMobilePhone('en-NG', undefined)
    @ApiProperty({
        description: 'Phone number',
        example: '+2347030000000',
        required: true,
        title: 'mobile',
    })
    mobile: string;

    @IsString()
    @MinLength(6)
    @MaxLength(20)
    @ApiProperty({
        description: 'Password',
        example: 'Password',
        required: true,
        title: 'password',
    })
    password: string;

    @IsString()
    @MinLength(6)
    @MaxLength(20)
    @ApiProperty({
        description: 'Confirm Password',
        example: 'Password',
        required: true,
        title: 'confirm password',
    })
    @Match(RegistrationDTO, (s) => s.password)
    confirm_password: string;

    @IsIn([
        Role.ADMIN,
        Role.CUSTOMER,
        Role.AGENT,
        Role.DISPATCHER,
        Role.LOCATION_MANAGER,
    ])
    @IsUppercase()
    @IsString({each: true})
    @ApiProperty({
        description: 'User Types: use CUSTOMER, AGENT, DISPATCHER, LOCATION_MANAGER',
        example: Role.CUSTOMER ,
        required: true,
        title: 'Role',
        enum: Role
    })
    roles: Role;
}

export class sendCodeDTO {
    // @IsPhoneNumber('NG')
    @IsString()
    @ApiProperty({
        description: 'Mobile number',
        example: '+2347030000000',
        required: true,
        title: 'mobile',
    })
    mobile: string;

    @IsString()
    @IsOptional()
    @ApiProperty({
        description: 'Email',
        example: 'user@sample.com',
        required: true,
        title: 'email',
    })
    email: string;
}

export class UserQueryDTO extends Pagination {
    @IsString()
    @IsOptional()
    @ApiProperty({
        description: 'First or Lastname',
        example: 'Joe',
        required: false,
        title: 'firstOrLastName',
    })
    firstOrLastName?: string;

    @IsString()
    @IsOptional()
    @ApiProperty({
        description: 'User type',
        example: USER_TYPE.CUSTOMER,
        required: false,
        title: 'roles',
    })
    roles?: string;
}

export class LoginDto extends PickType(RegistrationDTO, ['email', 'roles', 'password'] as const) { }

export class VerifyEmailDto {
    @IsString()
    @ApiProperty({
        description: 'Token to verify email',
        example: '3204294-4242-4242942942-4242-4224edrr',
        required: true,
        title: 'verifyToken',
    })
    verifyToken: string;
}

export class resendTokenDTO {
    @IsString()
    @ApiProperty({
        description: 'Phone Number to receive OTP',
        example: '08030903090',
        required: true,
        title: 'Verify OTP',
    })
    phone: string;
}

export class verifyTokenDTO extends resendTokenDTO {
    @IsString()
    @ApiProperty({
        description: 'Token to verify OTP',
        example: '320429',
        required: true,
        title: 'Verify OTP',
    })
    otp_code: string;
}
