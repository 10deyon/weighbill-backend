import {
    Controller,
    Post,
    UseGuards,
    Request,
    Get,
    Body,
    Response,
    HttpStatus,
    Param,
    Put,
    Query,
    HttpException,
    Patch,
} from '@nestjs/common';
import {
    UserService,
    UtiliHelpers,
    WalletService,
} from 'src/shared';
import {
    LoginDto,
    RegistrationDTO,
    resendTokenDTO,
    sendCodeDTO,
    UserQueryDTO,
    VerifyEmailDto,
    verifyTokenDTO,
} from 'src/shared/dtos/registration.dto';
import {
    UserResetPassword,
    ChangePasswordDTO,
    updateDTO,
    resetPasswordDTO,
} from 'src/shared/dtos/user.dto';
import { Otps, User, Role } from 'src/repository';
import config from 'src/core/config/config';
import { ApiBearerAuth, ApiBody, ApiCreatedResponse, ApiHeader, ApiOkResponse, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService, JwtAuthGuard, LocalAuthGuard } from 'src/core';
import { Helpers } from 'src/shared/helpers/utitlity.helpers';
import { OtpService } from 'src/shared/services/otp/otp.service';
import { MailerService } from '@nestjs-modules/mailer';
import { Roles } from 'src/shared/decorators/roles.decorator';
import { RolesGuard } from 'src/core/guards/roles.guard';
import { Twilio } from 'twilio';
import { createHash } from 'crypto';
import { UserNotFoundException } from 'src/shared/exceptions/UserNotFound.exception';

const CONFIG = config();

const TWILIO = new Twilio(CONFIG.TWILIO_ACCOUNT_SID, CONFIG.TWILIO_AUTH_TOKEN)

@ApiTags('User')
@Controller('users')
export class UserController {
    constructor(
        private userService: UserService,
        private authService: AuthService,
        private otpService: OtpService,
        private walletService: WalletService,
        private mailerService: MailerService
    ) { }

    @ApiResponse({
        status: 200,
        description: 'Succesfully registered',
    })
    @ApiCreatedResponse()
    @ApiBody({ type: RegistrationDTO })
    @Post('register')
    async register(@Response() res, @Body() body: RegistrationDTO) {
        try {
            await this.userService.validUser(body);
    
            const code: string = CONFIG.APP_ENV === 'production' ? Helpers.randomNumber(6) : '123456';
    
            const regUser = await this.userService.createUser(body);
    
            const [otp, wallet] = await Promise.all([
                this.otpService.create({ code, userId: regUser.user._id }),
    
                this.walletService.create({ userId: regUser.user._id, balance: 0 })
            ]);
    
            if (CONFIG.APP_ENV === 'production') {
                const textContent = {
                    body: `Your OTP is ${otp.code}. Hurry, OTP expires in 10 minutes`,
                    // from: '+15017122661',
                    to: '+2348037683537'
                }
    
                TWILIO.messages.create(textContent)
                    .then((message) => console.log(message.to))
    
                const url = "https://example.com/register";

                await this.mailerService.sendMail({
                    to: regUser.user.email,
                    from: '"Support Team" <support@mywaybillafrica.com>',
                    subject: 'Welcome to My WayBill Africa! Confirm your Email',
                    template: './confirmation',
                    context: {
                        name: "user name",
                        url,
                    },
                });
            }
    
            await this.userService.updateUser(regUser.user._id, { wallet: wallet._id })
    
            return UtiliHelpers.sendJsonResponse(res, regUser, 'Successfully registered');
        } catch (error) {
            if (error instanceof HttpException) {
                return UtiliHelpers.sendErrorResponse({}, error.message, error.getStatus(), error.getStatus());
            } else {
                return UtiliHelpers.sendErrorResponse({}, 'Oops! an error occured. Try again.', HttpStatus.INTERNAL_SERVER_ERROR, 500);
            }
        }
    }

    @ApiResponse({
        status: 200,
        description: 'Logged in successfully'
    })
    @ApiOkResponse()
    @UseGuards(LocalAuthGuard)
    @Post('login')
    async login(@Request() req, @Response() res, @Body() body: LoginDto) {
        try {
            const user = await this.userService.findUserByEmailWithPassword(body);

            if (!user.verified) {
                return UtiliHelpers.sendErrorResponse({}, "Account not yet verified", HttpStatus.BAD_REQUEST, 400);
            }
    
            const payload: any = user.JWTPayload();
            const accessToken = this.authService.login({ ...payload });
    
            return UtiliHelpers.sendJsonResponse(
                res,
                {
                    user: req.user,
                    accessToken
                },
                'Logged in successfully'
            );
        } catch (error) {
            if (error instanceof HttpException) {
                return UtiliHelpers.sendErrorResponse({}, error.message, error.getStatus(), error.getStatus());
            } else {
                return UtiliHelpers.sendErrorResponse({}, 'Oops! an error occured. Try again.', HttpStatus.INTERNAL_SERVER_ERROR, 500);
            }
        }
    }

    @ApiResponse({
        status: 200,
        description: 'Account verified successfully',
    })
    @ApiOkResponse()
    @Get('verify-otp')
    async verifyOtp(@Response() res, @Query() params: verifyTokenDTO) {
        try {
            const user = await this.userService.findOneByPhone(params.phone);
    
            if (!!user.verified) {
                return UtiliHelpers.sendJsonResponse(
                    res,
                    "",
                    'User account already verified',
                );
            }
    
            const otp = await this.otpService.findOne({
                code: params.otp_code,
                userId: user._id,
                createdAt: { $gt: Date.now() }
            });
    
            await Promise.all([
                this.otpService.delete(otp._id),
                this.userService.updateUser(user._id, { verified: true, enabled: true }),
            ]);
    
            return UtiliHelpers.sendJsonResponse(res, "", 'Account verified successfully');            
        } catch (error) {
            if (error instanceof HttpException) {
                return UtiliHelpers.sendErrorResponse({}, error.message, error.getStatus(), error.getStatus());
            } else {
                return UtiliHelpers.sendErrorResponse({}, 'Oops! an error occured. Try again.', HttpStatus.INTERNAL_SERVER_ERROR, 500);
            }
        }
    }

    @ApiResponse({
        status: 200,
        description: 'Account verified successfully',
    })
    @ApiOkResponse()
    @Get('resend-otp')
    async resendOtp(@Response() res, @Query() params: resendTokenDTO) {
        try {
            const user = await this.userService.findOneByPhone(params.phone);
            
            if (!!user.verified) {
                return UtiliHelpers.sendErrorResponse(
                    {},
                    'User already verified',
                    HttpStatus.BAD_REQUEST,
                    103,
                );
            }
    
            const code: string = CONFIG.APP_ENV === 'production' ? Helpers.randomNumber(6) : '123456';
    
            await this.otpService.updateOne({
                code,
                userId: user._id.toString(),
            });
    
            return UtiliHelpers.sendJsonResponse(res, "", 'An OTP has been sent to your mobile. Hurry, OTP expires in 10 minutes');
        } catch (error) {
            if (error instanceof HttpException) {
                return UtiliHelpers.sendErrorResponse({}, error.message, error.getStatus(), error.getStatus());
            } else {
                return UtiliHelpers.sendErrorResponse({}, 'Oops! an error occured. Try again.', HttpStatus.INTERNAL_SERVER_ERROR, 500);
            }
        }
    }

    @Get('profile')
    @ApiBearerAuth()
    @ApiOkResponse()
    @UseGuards(JwtAuthGuard)
    async getProfile(@Request() req, @Response() res) {
        try {
            const user = await this.userService.findUserById(req.user._id);

            return UtiliHelpers.sendJsonResponse(res, user, 'User profile gottten.');
        } catch (error) {
            if (error instanceof HttpException) {
                return UtiliHelpers.sendErrorResponse({}, error.message, error.getStatus(), error.getStatus());
            } else {
                return UtiliHelpers.sendErrorResponse({}, 'Oops! an error occured. Try again.', HttpStatus.INTERNAL_SERVER_ERROR, 500);
            }
        }
    }

    @ApiResponse({
        status: 200,
        description: 'Password updated succesfully',
    })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @ApiBody({ type: ChangePasswordDTO })
    @Put('update-password')
    async updatePassword(@Request() req, @Response() res, @Body() body: ChangePasswordDTO,) {
        try {
            await this.userService.updateUser(req.user._id, body);

            return UtiliHelpers.sendJsonResponse(res, {}, 'Password updated successfully.');
        } catch (error) {
            if (error instanceof HttpException) {
                return UtiliHelpers.sendErrorResponse({}, error.message, error.getStatus(), error.getStatus());
            } else {
                return UtiliHelpers.sendErrorResponse({}, 'Oops! an error occured. Try again.', HttpStatus.INTERNAL_SERVER_ERROR, 500);
            }
        }
    };

    @ApiResponse({
        status: 200,
        description: 'Record updated succesfully',
    })
    @ApiBody({ type: updateDTO })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Put('update-profile')
    async updateDetails(@Request() req, @Response() res, @Body() body: updateDTO) {
        try {
            await this.userService.updateUser(req.user._id, body);

            return UtiliHelpers.sendJsonResponse(
                res,
                {},
                'Record updated successfully.',
            );
        } catch (error) {
            if (error instanceof HttpException) {
                return UtiliHelpers.sendErrorResponse({}, error.message, error.getStatus(), error.getStatus());
            } else {
                return UtiliHelpers.sendErrorResponse({}, 'Oops! an error occured. Try again.', HttpStatus.INTERNAL_SERVER_ERROR, 500);
            }
        }
    };

    @ApiResponse({
        status: 200,
        description: 'Record updated succesfully',
    })
    @ApiBody({ type: resetPasswordDTO })
    @Post('forgot-password')
    async forgotPassword(@Request() req, @Response() res, @Body() body: resetPasswordDTO) {
        const user = await this.userService.findUser({ email: body.email });
        if (!user) {
            throw new HttpException("Oops!, Record not found", HttpStatus.NOT_FOUND);
        }

        const resetToken = user.createPasswordResetToken();
        await user.save({ validateBeforeSave: false });

        try {
            const resetURL = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`;

            const message = `Forgot your password? Submit a patch request with your new Password and passwordConfirm to: ${resetURL}. \n Ignore, if you did not request for a new password`;

            // await this.mailerService.sendMail({
            //     to: user.email,
            //     from: '"Support Team" <support@mywaybillafrica.com>',
            //     subject: 'Reset Your Password',
            //     template: './confirmation',
            //     context: {
            //         name: "user name",
            //         url: resetURL,
            //     },
            // });

            return UtiliHelpers.sendJsonResponse(
                res,
                {},
                'A reset password link have been sent to your mail',
            );
        } catch (error) {
            user.passwordResetToken = undefined;
            user.passwordResetExpires = undefined;
            await user.save({ validateBeforeSave: false });
            if (error instanceof HttpException) {
                return UtiliHelpers.sendErrorResponse({}, error.message, error.getStatus(), error.getStatus());
            } else {
                return UtiliHelpers.sendErrorResponse({}, 'Oops! an error occured. Try again.', HttpStatus.INTERNAL_SERVER_ERROR, 500);
            }
        }
    };

    @ApiResponse({
        status: 200,
        description: 'Record updated succesfully',
    })
    @ApiBody({ type: UserResetPassword })
    @Patch('reset-password/:token')
    async resetPassword(@Request() req, @Response() res, @Param('token') token: string, @Body() body: UserResetPassword) {
        try {
            const hashedToken = createHash('sha256').update(token).digest('hex'); 

            const user = await this.userService.findUser({ passwordResetToken: hashedToken, passwordResetExpires: { $gt: Date.now() } });
            if (!user) {
                throw new HttpException("Oops!, Token is invalid or expired", HttpStatus.BAD_REQUEST);
            }

            user.password = body.newPassword;
            user.passwordResetToken = undefined;
            user.passwordResetExpires = undefined;
            await user.save();

            return UtiliHelpers.sendJsonResponse(res, {}, 'Record updated successfully.');
        } catch (error) {
            if (error instanceof HttpException) {
                return UtiliHelpers.sendErrorResponse({}, error.message, error.getStatus(), error.getStatus());
            } else {
                return UtiliHelpers.sendErrorResponse({}, 'Oops! an error occured. Try again.', HttpStatus.INTERNAL_SERVER_ERROR, 500);
            }
        }
    };
}
