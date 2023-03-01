import { Body, Controller, Get, HttpException, HttpStatus, Param, Post, Request, Response, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/core';
import { RolesGuard } from 'src/core/guards/roles.guard';
import { Role } from 'src/repository';
import { UtiliHelpers } from 'src/shared';
import { Roles } from 'src/shared/decorators/roles.decorator';
import { RegistrationDTO } from 'src/shared/dtos/registration.dto';
import { DispatcherService } from 'src/shared/services/dispatcher/dispatcher.service';

@ApiTags('Dispatcher')
@Controller('dispatchers')
export class DispatcherController {
    constructor(
        private dispatcherService: DispatcherService,
    ) { }

    @Roles(Role.ADMIN, Role.LOCATION_MANAGER)
    @ApiOkResponse()
    @ApiCreatedResponse()
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Post()
    async create(@Request() req, @Response() res, @Body() body: RegistrationDTO) {
        try {
            const dispatcher = await this.dispatcherService.create(body)
    
            return UtiliHelpers.sendJsonResponse(
                res,
                dispatcher,
                'Dispatcher record created successfully',
            );
        } catch (error) {
            if (error instanceof HttpException) {
                return UtiliHelpers.sendErrorResponse({}, error.message, error.getStatus(), error.getStatus());
            } else {
                return UtiliHelpers.sendErrorResponse({}, 'Oops! an error occured. Try again.', HttpStatus.INTERNAL_SERVER_ERROR, 500);
            }
        }
    }

    @Roles(Role.ADMIN, Role.LOCATION_MANAGER)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @ApiOkResponse()
    @ApiBearerAuth()
    @Get()
    async findAll(@Request() req, @Response() res) {
        try {
            await this.dispatcherService.getAll(req.user.roles);

            return UtiliHelpers.sendJsonResponse(
                res,
                {},
                'Successful',
            );
        } catch (error) {
            if (error instanceof HttpException) {
                return UtiliHelpers.sendErrorResponse({}, error.message, error.getStatus(), error.getStatus());
            } else {
                return UtiliHelpers.sendErrorResponse({}, 'Oops! an error occured. Try again.', HttpStatus.INTERNAL_SERVER_ERROR, 500);
            }
        }
    }

    @Roles(Role.ADMIN, Role.LOCATION_MANAGER)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @ApiOkResponse()
    @ApiBearerAuth()
    @Get(':id')
    async findById(@Request() req, @Response() res, @Param('id') id: string) {
        try {
            await this.dispatcherService.getOne(id, req.user.roles);

            return UtiliHelpers.sendJsonResponse(
                res,
                {},
                'Successful',
            );
        } catch (error) {
            if (error instanceof HttpException) {
                return UtiliHelpers.sendErrorResponse({}, error.message, error.getStatus(), error.getStatus());
            } else {
                return UtiliHelpers.sendErrorResponse({}, 'Oops! an error occured. Try again.', HttpStatus.INTERNAL_SERVER_ERROR, 500);
            }
        }
    }

    @Roles(Role.ADMIN)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @ApiOkResponse()
    @ApiBearerAuth()
    @Get(':id/toggle-status')
    async toggleAdminStatus(@Request() req, @Response() res, @Param('id') id: string) {
        try {
            await this.dispatcherService.getAll(req.user.roles);

            return UtiliHelpers.sendJsonResponse(
                res,
                {},
                'Status updated successfully',
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
