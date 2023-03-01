import { Body, Controller, Get, HttpException, HttpStatus, Param, Post, Query, Request, Response, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/core';
import { RolesGuard } from 'src/core/guards/roles.guard';
import { Role } from 'src/repository';
import { Vehicle } from 'src/repository/schemas/vehicle.schema';
import { UtiliHelpers, VehicleService } from 'src/shared';
import { Roles } from 'src/shared/decorators/roles.decorator';
import { VehicleDTO, VehicleQueryDTO } from 'src/shared/dtos/vehicle.dto';
import { LocationManagerService } from 'src/shared/services/location-manager/location-manager.service';
import { datesFilterQuery, handleFilterExact, handleOrQuery, handlePagination, paginate } from 'src/shared/utils/filter';

@ApiTags('Vehicle')
@Controller('vehicles')
export class VehicleController {
    constructor(
        private vehicleService: VehicleService,
        private locationMgrService: LocationManagerService,
    ) { }

    @Roles(Role.ADMIN, Role.LOCATION_MANAGER, Role.DISPATCHER)
    @ApiResponse({
        status: 200,
        description: 'Successful created',
    })
    @ApiBody({ type: VehicleDTO })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Post()
    async create(@Request() req, @Response() res, @Body() body: VehicleDTO) {
        try {
            await this.locationMgrService.getOne(body.managerId, req.user.roles.toString());

            const vehicle: Vehicle = await this.vehicleService.create(body);

            return UtiliHelpers.sendJsonResponse(res, vehicle, 'Vehicle successfully created');
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
        description: 'Vehicles found ',
    })
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Get()
    async getAllVehicles(@Response() res, @Request() req, @Query() filter: VehicleQueryDTO) {
        try {
            const { page, limit } = handlePagination(filter.page, filter.limit);

            const { ...query } = {
                ...datesFilterQuery(filter.startDate, filter.endDate, 'dateCreated'),
                ...handleOrQuery(filter.regNumber, 'regNumber'),
                ...handleFilterExact(filter.managerId, 'managerId'),
                deletedAt: null
            }

            const vehicles = await this.vehicleService.getAllVehicles(req, query, limit, page);

            return UtiliHelpers.sendJsonResponse(
                res,
                vehicles,
                'Successful'
            );
        } catch (error) {
            console.error(error)
            if (error instanceof HttpException) {
                return UtiliHelpers.sendErrorResponse({}, error.message, error.getStatus(), error.getStatus());
            } else {
                return UtiliHelpers.sendErrorResponse({}, 'Oops! an error occured. Try again.', HttpStatus.INTERNAL_SERVER_ERROR, 500);
            }
        }
    }

    @ApiResponse({
        status: 200,
        description: 'Vehicle found ',
    })
    @ApiParam({
        name: 'uniqueId',
        required: true,
        description: `Should be a Vehicle's Registeration Number or vehicleId`,
        type: String
    })
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Get(':uniqueId')
    async getVehicleByRegNumber(@Request() req, @Response() res, @Param('uniqueId') uniqueId: string) {
        try {
            const vehicle = await this.vehicleService.getOne({ $or: [{regNumber: uniqueId, _id: uniqueId }]});

            if (!vehicle) {
                return UtiliHelpers.sendErrorResponse({}, "Vehicle recor not foundr", HttpStatus.NOT_FOUND, 404);
            }

            return UtiliHelpers.sendJsonResponse(res, vehicle, 'Vehicle found');
        } catch (error) {
            if (error instanceof HttpException) {
                return UtiliHelpers.sendErrorResponse({}, error.message, error.getStatus(), error.getStatus());
            } else {
                return UtiliHelpers.sendErrorResponse({}, 'Oops! an error occured. Try again.', HttpStatus.INTERNAL_SERVER_ERROR, 500);
            }
        }
    }
}
