import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Vehicle } from 'src/repository/schemas/vehicle.schema';
import { GenericMatch } from 'src/shared/classes';
import { paginate } from 'src/shared/utils/filter';

@Injectable()
export class VehicleService {
    constructor(
        @InjectModel('Vehicle') private vehicleModel: Model<Vehicle>,
    ) { }

    async getOne(data: GenericMatch) {
        console.log(data)
        return await this.vehicleModel.findOne({ ...data }).exec();
    }

    getVehiclesById(vehicleIds: (Types.ObjectId | string)[]): Promise<Vehicle[]> {
        return this.vehicleModel.find({ _id: { $in: vehicleIds }, deletedAt: null }).exec();
    }

    async create(data: GenericMatch): Promise<Vehicle> {
        data.regNumber = String(data.regNumber).replace(/ /g, '').toUpperCase();
        
        const vehicleExist = await this.getOne({ $or: [{regNumber: data.regNumber, vin: data.vin}], deletedAt: null });

        if (vehicleExist) {
            throw new HttpException(`Vehicle with registration number: ${data.regNumber} or vin: ${data.vin} already exists`, HttpStatus.BAD_REQUEST);
        }

        const vehicle = new this.vehicleModel(data);
        vehicle.status = 'Available';
        vehicle.country = data.country ? data.country : 'NIGERIA';

        return vehicle.save();
    }

    async getAllVehicles(req, match: GenericMatch, limit = 10, page = 1) {
        const skipExp: number = page > 1 ? page - 1 : 0;
        const toSkip: number = limit * skipExp;
        const route: string = `${req.protocol}://${req.get('host')}/api/v1/vehicles`;

        const result = await this.vehicleModel.aggregate([
            { $match: match },
            {
                $facet: {
                    "total": [
                        { $count: 'count' }
                    ],
                    "vehicles": [
                        { $sort: { createdAt: -1 } },
                        { $skip: toSkip },
                        { $limit: limit },
                    ]
                }
            },
            {
                $unwind: "$total"
            }
        ]).exec()
        
        return paginate(limit, page, route, [ ...result ]);
    }

    getByRegNumber(regNumber: string): Promise<Vehicle | null> {
        return this.vehicleModel.findOne({ regNumber: String(regNumber).toUpperCase(), deletedAt: null }).exec();
    }

    async getVehicles(query: GenericMatch = {}, limit = 10, page = 1): Promise<{ vehicles: Vehicle[], total: number }> {
        const skipExp: number = page > 1 ? page - 1 : 0;
        const toSkip = limit * skipExp;
        return {
            vehicles: await this.vehicleModel.find({ ...query, deletedAt: null }).limit(limit).skip(toSkip).sort({ _id: -1 }).exec(),
            total: await this.vehicleModel.find(query).countDocuments(),
        }
    }

    public updateVehicle(match: GenericMatch, body: { [key: string]: string | number | Date }) {
        return this.vehicleModel.updateOne(match, { ...body, dateUpdated: new Date }, { new: true }).exec();
    }

    public getAllVehiclesByField(field: GenericMatch, limit = 10, page = 1, sortByField: string = '_id'): Promise<Vehicle[]> {
        const skipExp: number = page > 1 ? page - 1 : 0;
        const toSkip: number = limit * skipExp;

        return this.vehicleModel.find({ ...field, deletedAt: null }).limit(limit).skip(toSkip).sort({ [sortByField]: -1 }).exec();
    }

    deleteVehicleById(_id: string) {
        return this.vehicleModel.findByIdAndDelete({ _id }).exec()
    }

    public updateVehicles(match: GenericMatch, body: GenericMatch) {
        return this.vehicleModel.updateMany(match, { ...body, dateUpdated: new Date }, { new: true }).exec();
    }

    // getVehiclesByRegNumbers(regNumber: string[]): Promise<Vehicle[]> {
    //     return this.vehicleModel.find({ regNumber: { $in: regNumber }, deletedAt: null }).exec();
    // }
}
