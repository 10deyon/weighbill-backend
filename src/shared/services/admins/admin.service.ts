import { Injectable } from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { User } from 'src/repository';
import { UserService } from '../users/user.service';

@Injectable()
export class AdminsService {
    constructor(
        private userService: UserService
    ) { }

    async getAllAdmins(roles: string): Promise<User[]> {
        return await this.userService.findAllByRole(roles, 10, 10);
    }

    // getAdminsById(id: Types.ObjectId): Promise<Admins> {
    //     return this.AdminsModel.findOne({ _id: id }).exec();
    // }

    // getAdminsByAdminId(adminId: string): Promise<Admins> {
    //     return this.AdminsModel.findOne({ adminId }).exec();
    // }

    // async getAdminsByRole(role: AdminRoles): Promise<Admins[]> {
    //     return this.AdminsModel.find({ role }).exec();
    // }

    // async getAdminUsersByRoles(roles: AdminRoles[]): Promise<(Admins & { user: User })[]> {
    //     return this.AdminsModel.aggregate([
    //         { $match: { role: { $in: roles } } },
    //         { $lookup: { from: 'users', localField: 'adminId', foreignField: '_id', as: 'user' } },
    //         { $unwind: '$user' },
    //         { $project: { "hash": 0, "salt": 0 } },
    //     ]).exec();
    // }

    // // async getAdminEmailsByRole(roles: AdminRoles[]): Promise<string[]> {
    // //     return (await this.getAdminUsersByRoles(roles)).map((adminUser: (Admins & { user: User })) => adminUser.user.email);
    // // }



    // updateAdmins(objKey: any, body: any) {
    //     return this.AdminsModel.updateOne(objKey, { ...body, dateUpdated: new Date }, { new: true }).exec();
    // }
}
