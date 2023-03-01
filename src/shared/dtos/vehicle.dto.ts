import { ApiProperty, IntersectionType, OmitType, PickType } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsOptional, IsString, IsUppercase, IsMongoId, IsISO8601, IsAlphanumeric, Length, IsIn } from "class-validator";
import { Pagination } from "./pagination.dto";
import { VehicleType } from "src/repository/schemas/vehicle.schema";

export class VehicleDTO {
    @IsString()
    @ApiProperty({
        description: 'Vehicle Registration Number',
        example: 'KJA109XZ',
        required: true,
        title: 'regNumber',
    })
    regNumber: string;

    @IsString() @IsOptional()
    @ApiProperty({
        description: 'Vehicle make',
        example: 'Corolla',
        required: true,
        title: 'make',
    })
    make: string;

    @IsString() @IsOptional()
    @ApiProperty({
        description: 'Vehicle series',
        example: 'series',
        required: true,
        title: 'series',
    })
    series: string;

    @IsNumber() @IsOptional()
    @ApiProperty({
        description: 'Vehicle Year',
        example: 2020,
        required: true,
        title: 'year',
    })
    year: number;

    @IsNumber()
    @ApiProperty({
        description: 'Vehicle model',
        example: 2020,
        required: true,
        title: 'vehicleModel',
    })
    model: number;

    @IsString() @Length(11, 17) @IsAlphanumeric()
    @ApiProperty({
        description: 'Vehicle Indentification number',
        example: '923930323443353',
        required: false,
        title: 'vin',
    })
    vin: string;

    @IsString()
    @ApiProperty({
        description: 'Customer Id',
        example: '123243242243',
        required: true,
        title: 'customerId',
    })
    managerId: string;

    @IsString()
    @ApiProperty({
        description: 'Country',
        example: 'Nigeria',
        required: true,
        title: 'Country',
    })
    country: string;

    @IsString()
    @ApiProperty({
        description: 'Car Name',
        example: 'Toyota Camry',
        required: true,
        title: 'Name',
    })
    name: string;

    @IsString() @IsOptional()
    @ApiProperty({
        description: 'Image url',
        example: 'image',
        required: false,
        title: 'image',
    })
    image: string;

    @IsString()
    @ApiProperty({
        description: 'Location state',
        example: 'Lagos',
        required: true,
        title: 'location State',
    })
    locationState: string;

    @IsString()
    @IsIn([
        VehicleType.BIKE,
        VehicleType.CAR,
        VehicleType.MINI_VAN,
        VehicleType.TRUCK,
    ])
    @ApiProperty({
        description: 'Use BIKE, CAR, MINI_VAN or TRUCK',
        example: 'TRUCK',
        required: true,
        title: 'type',
    })
    type: string;
}

export class NewLooseVehicleDTO {
    @IsString() regNumber: string;
    @IsString() @Length(11, 17) @IsAlphanumeric() @IsOptional() vin: string;
    @IsString() @IsOptional() type: string;
    @IsNumber() latitude: number;
    @IsNumber() longitude: number;
    @IsString() locationAddress: string;
    @IsString() @IsOptional() locationState: string;
    @IsString() @IsOptional() @IsUppercase() country: string;
    @IsString() customerId: string;
    @IsString() customerName: string;
    @IsString() @IsUppercase() @IsOptional() supplier?: string;
}

export class UpdateVehicleDTO {
    @IsString()
    @IsNotEmpty({ message: "regNumber is required." })
    @ApiProperty({
        description: 'Registration number',
        example: '12324243232',
        required: true,
        title: 'regNumber',
    })
    regNumber: string;

    @IsString()
    @IsNotEmpty({ message: "make is required." })
    @ApiProperty({
        description: 'Vehicle make',
        example: 'Corolla',
        required: true,
        title: 'make',
    })
    make: string;

    @IsString()
    @IsNotEmpty({ message: "series is required." })
    @ApiProperty({
        description: 'Vehicle series',
        example: 'series',
        required: true,
        title: 'series',
    })
    series: string;


    @IsNumber()
    @IsNotEmpty({ message: "vehicleModel is required." })
    @ApiProperty({
        description: 'Vehicle model',
        example: 2020,
        required: true,
        title: 'vehicleModel',
    })
    vehicleModel: number;

    @IsString()
    @Length(11, 17) @IsAlphanumeric()
    @IsOptional()
    @ApiProperty({
        description: 'Vehicle Indentification number',
        example: '9239303234435435353535353',
        required: false,
        title: 'vin',
    })
    vin: string;

    @IsString()
    @IsNotEmpty({ message: "customerId is required." })
    @ApiProperty({
        description: 'Customer Id',
        example: '123243242243',
        required: true,
        title: 'customerId',
    })
    customerId: string;

    @IsString()
    @IsNotEmpty({ message: "customerName is required." })
    @ApiProperty({
        description: 'Customer Name',
        example: 'John Doe',
        required: true,
        title: 'customerName',
    })
    customerName: string;

    @IsString()
    @IsUppercase()
    @IsOptional()
    @ApiProperty({
        description: 'Country',
        example: 'Nigeria',
        required: false,
        title: 'customerId',
    })
    country: string;

    @IsString()
    @IsOptional()
    @IsOptional()
    @ApiProperty({
        description: 'Image url',
        example: 'image',
        required: false,
        title: 'image',
    })
    image: string;


    @IsString()
    @IsNotEmpty({ message: "locationAddress is required." })
    @ApiProperty({
        description: 'locationAddress',
        example: '12, Fanala Island ',
        required: false,
        title: 'locationAddress',
    })
    locationAddress: string;

    @IsString()
    @IsNotEmpty({ message: "locationState is required." })
    @ApiProperty({
        description: 'Location state',
        example: 'Lagos',
        required: true,
        title: 'locationState',
    })
    locationState: string;

    @IsString()
    @IsOptional()
    @IsOptional()
    @ApiProperty({
        description: 'Transmission Type',
        example: 'transmissionType',
        required: false,
        title: 'transmissionType',
    })
    transmissionType: string;

    @IsString()
    @IsOptional()
    @IsOptional()
    @ApiProperty({
        description: 'Engine Type',
        example: 'V8',
        required: false,
        title: 'engineType',
    })
    engineType: string;

    @IsString()
    @IsNotEmpty({ message: "type is required." })
    @ApiProperty({
        description: 'Vehicle Type',
        example: 'Car',
        required: true,
        title: 'type',
    })
    type: string;

    @IsNumber()
    @IsNotEmpty({ message: "latitude is required." })
    @ApiProperty({
        description: 'Latitude',
        example: 89,
        required: true,
        title: 'latitude',
    })
    latitude: number;

    @IsNumber()
    @IsNotEmpty({ message: "longitude is required." })
    @ApiProperty({
        description: 'Longitude',
        example: 89,
        required: true,
        title: 'longitude',
    })
    longitude: number;

    @IsNumber()
    @IsOptional()
    @ApiProperty({
        description: 'Number of cylinders',
        example: 5,
        required: false,
        title: 'latitude',
    })
    cylinders: number;

    @IsString()
    @IsOptional()
    @ApiProperty({
        description: 'Number of Fleets',
        example: 5,
        required: false,
        title: 'fleetNumber',
    })
    fleetNumber: string;

    @IsString()
    @IsUppercase()
    @IsOptional()
    @ApiProperty({
        description: 'Supplier',
        example: 'supplier',
        required: false,
        title: 'supplier',
    })
    supplier?: string;
}

export class UpdateVehicleByVinNumberDTO extends OmitType(UpdateVehicleDTO, ['vin', 'customerId']) { }

export class UpdateVehicleByRegNumberDTO extends OmitType(UpdateVehicleDTO, ['regNumber']) { }

export class VehiclesGetParamDTO {
    @IsString()
    @IsMongoId()
    id: string;
}

export class UpdateVehiclesParamsDTO {
    @IsString()
    @IsMongoId()
    vehicleId: string;
}

export class VehicleQueryDTO extends Pagination {
    @IsISO8601()
    @IsOptional()
    @ApiProperty({
        description: 'start date',
        example: '2019-09-26T07:58:30.996+0200',
        required: false,
        title: 'startDate',
    })
    startDate?: string;

    @IsISO8601()
    @IsOptional()
    @ApiProperty({
        description: 'end date',
        example: '2019-09-26T07:58:30.996+0200',
        required: false,
        title: 'endDate',
    })
    endDate?: string;

    @IsString()
    @IsOptional()
    @ApiProperty({
        description: 'Vehicle Registration Number',
        example: 'KJA123ZA',
        required: false,
        title: 'regNumber',
    })
    regNumber?: string;

    @IsMongoId()
    @IsOptional()
    @ApiProperty({
        description: 'Location manager ID',
        example: '63ef2fd908844db1a690083f',
        required: false,
        title: 'Location Manager',
    })
    managerId?: string;
}
