import { Body, Controller, Get, HttpException, HttpStatus, Post, Query, Request, Response, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiQuery, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "src/core";
import { UtiliHelpers, WalletService } from "src/shared";
import { VerifyPaymentDto, WalletDto } from "src/shared/dtos/wallet.dto";

@ApiTags('Wallet')
@Controller()
export class WalletController {
    constructor(
        private walletService: WalletService,
    ) { }

    // @ApiCreatedResponse({ type: Wallet })
    // @ApiOkResponse({ type: Wallet, isArray: true }) //click on the Api properties to see more Properties
    // @ApiQuery({ name: 'nameOfQueryParam', required: true })
    // @ApiNotFoundResponse()
    // @ApiBadRequestResponse()
    // @Get()
    // findAll(@Query('nameOfQueryParam') nameOfQueryParam: type, @Param('id', ParseIntPipe) id: number): string {
    //   return 'This action returns all cats';
    // }

    @ApiOkResponse()
    @ApiNotFoundResponse()
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Post('initiate-payment')
    async create(@Request() req, @Response() res, @Body() payload: WalletDto) {
        try {
            const result = await this.walletService.initiatePayment(req.user, payload)

            return UtiliHelpers.sendJsonResponse(
                res,
                result,
                'Payment initiation was successful',
            );
        } catch (error) {
            if (error instanceof HttpException) {
                return UtiliHelpers.sendErrorResponse({}, error.message, error.getStatus(), error.getStatus());
            } else {
                return UtiliHelpers.sendErrorResponse({}, 'Oops! an error occured. Try again.', HttpStatus.INTERNAL_SERVER_ERROR, 500);
            }
        }
    }

    @ApiOkResponse()
    @ApiNotFoundResponse()
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Get('verify-payment')
    async verifyPayment(@Request() req, @Response() res, @Query() param: VerifyPaymentDto) {
        try {
            const result = await this.walletService.verify(req.user, param)

            return UtiliHelpers.sendJsonResponse(
                res,
                result,
                'Payment verified successfully',
            );
        } catch (error) {
            if (error instanceof HttpException) {
                return UtiliHelpers.sendErrorResponse({}, error.message, error.getStatus(), error.getStatus());
            } else {
                return UtiliHelpers.sendErrorResponse({}, 'Oops! an error occured. Try again.', HttpStatus.INTERNAL_SERVER_ERROR, 500);
            }
        }
    }

    @ApiOkResponse()
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Get('payment-history')
    async getAllUserPayments(@Request() req, @Response() res) {
        try {
            const result = await this.walletService.getUserPaymentHistory(req.user)

            return UtiliHelpers.sendJsonResponse(
                res,
                result,
                'Payment history fetched',
            );
        } catch (error) {
            if (error instanceof HttpException) {
                return UtiliHelpers.sendErrorResponse({}, error.message, error.getStatus(), error.getStatus());
            } else {
                return UtiliHelpers.sendErrorResponse({}, 'Oops! an error occured. Try again.', HttpStatus.INTERNAL_SERVER_ERROR, 500);
            }
        }
    }
}