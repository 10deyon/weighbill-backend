import { Controller, Get, HttpException, HttpStatus, Param, Request, Response, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/core';
import { RolesGuard } from 'src/core/guards/roles.guard';
import { Roles } from 'src/shared/decorators/roles.decorator';
import { AdminsService } from 'src/shared/services/admins/admin.service';
import { Role } from 'src/repository';
import { UtiliHelpers } from 'src/shared';

@ApiTags('Admin')
@Controller('admins')
export class AdminController {
    constructor(
        private adminService: AdminsService,
    ) { }

    @Roles(Role.ADMIN)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @ApiOkResponse()
    @ApiBearerAuth()
    @Get()
    async findAll(@Request() req, @Response() res) {
        try {
            await this.adminService.getAllAdmins('ADMIN');

            return UtiliHelpers.sendJsonResponse(
                res,
                {},
                'Password updated successfully.',
            );
        } catch (error) {
            if (error instanceof HttpException) {
                return UtiliHelpers.sendErrorResponse(
                    {},
                    error.message,
                    error.getStatus(),
                    error.getStatus(),
                );
            } else {
                return UtiliHelpers.sendErrorResponse(
                    {},
                    'Oops! an error occured. Try again.',
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    500,
                );
            }
        }
    }

    @Roles(Role.ADMIN)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @ApiOkResponse()
    @ApiBearerAuth()
    @Get(':id')
    async findById(@Request() req, @Response() res, @Param('id') id: string) {
        try {
            await this.adminService.getAllAdmins('ADMIN');

            return UtiliHelpers.sendJsonResponse(
                res,
                {},
                'Password updated successfully.',
            );
        } catch (error) {
            if (error instanceof HttpException) {
                return UtiliHelpers.sendErrorResponse(
                    {},
                    error.message,
                    error.getStatus(),
                    error.getStatus(),
                );
            } else {
                return UtiliHelpers.sendErrorResponse(
                    {},
                    'Oops! an error occured. Try again.',
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    500,
                );
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
            await this.adminService.getAllAdmins('ADMIN');

            return UtiliHelpers.sendJsonResponse(
                res,
                {},
                'Password updated successfully.',
            );
        } catch (error) {
            if (error instanceof HttpException) {
                return UtiliHelpers.sendErrorResponse(
                    {},
                    error.message,
                    error.getStatus(),
                    error.getStatus(),
                );
            } else {
                return UtiliHelpers.sendErrorResponse(
                    {},
                    'Oops! an error occured. Try again.',
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    500,
                );
            }
        }
    }
}
