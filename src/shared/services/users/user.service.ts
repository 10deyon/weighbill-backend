import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User, UserError, Role } from 'src/repository/schemas/user.schema';
import { ResponseData, USER_TYPE, UtiliHelpers } from 'src/shared/classes';
import { RegistrationDTO } from 'src/shared/dtos/registration.dto';
import { GenericMatch } from 'src/shared/interfaces/genericMatch';
import { Agent, Dispatcher } from 'src/repository';

@Injectable()
export class UserService {
    constructor(
        @InjectModel('User') private userModel: Model<User>,
        @InjectModel('Dispatcher') private dispatcherModel: Model<Dispatcher>,
        @InjectModel('Agent') private agentModel: Model<Agent>,
    ) { }

    async createUser(data: RegistrationDTO) {
        const user: User = await this.userModel.create({
            fullName: data.fullName,
            email: data.email,
            mobile: data.mobile,
            roles: data.roles,
            password: data.password,
        });

        let userProfiles = {
            userId: user.id,
            agentId: data.agentId,
            bvn: data.bvn,
            nin: data.nin,
            id_type: data.id_type,
            state: data.state,
            approved_by: data.approved_by,
            admin_id: data.agentId,
            type: data.dispatcherType
        }

        let profile;
        switch (data.roles) {
            case USER_TYPE.AGENT:
                profile = await this.agentModel.create(userProfiles)
                break;
            case USER_TYPE.DISPATCHER:
                profile = await this.dispatcherModel.create(userProfiles)
                break;
            default:
                break;
        }

        user.password = undefined;

        return { user, profile };
    }

    async findByMobileOrEmail(data: string, roles: string) {
        return await this.userModel.findOne({ $or: [{ email: data }, { mobile: this.normalizeMobile(data) }], roles }).select('+password')
    }

    async findOneById(id: string) {
        const user = await this.userModel.findById(id).select('+password');

        if (!user) {
            throw new HttpException("Oops!, User record not found", HttpStatus.NOT_FOUND);
        }

        return user;
    }

    async findUserById(id: string) {
        const user = await this.userModel.findById(id);

        if (!user) {
            throw new HttpException("Oops!, Record not found", HttpStatus.NOT_FOUND);
        }

        if(user.roles.includes(USER_TYPE.DISPATCHER)) {
            return await this.userModel.aggregate([
                { $match: { _id: user._id } },
                {
                    $lookup: {
                        from: 'dispatchers',
                        localField: '_id',
                        foreignField: 'userId',
                        as: 'profiles'
                    }
                },
                {
                    $lookup: {
                        from: 'wallets',
                        localField: '_id',
                        foreignField: 'userId',
                        as: 'wallet'
                    }
                },
                { $unwind: { path: '$profiles', preserveNullAndEmptyArrays: true } },
                { $unwind: { path: '$wallet', preserveNullAndEmptyArrays: true } },
            ]).exec()
        }

        if(user.roles.includes(USER_TYPE.AGENT)) {
            return await this.userModel.aggregate([
                { $match: { _id: user._id } },
                {
                    $lookup: {
                        from: 'agents',
                        localField: '_id',
                        foreignField: 'userId',
                        as: 'profiles'
                    }
                },
                {
                    $lookup: {
                        from: 'wallets',
                        localField: '_id',
                        foreignField: 'userId',
                        as: 'wallet'
                    }
                },
                { $unwind: { path: '$profiles', preserveNullAndEmptyArrays: true } },
                { $unwind: { path: '$wallet', preserveNullAndEmptyArrays: true } },
            ]).exec()
        }

        return user;
    }

    async updateUser(id: string, update) {
        await this.findOneById(id);

        const result = await this.userModel.updateOne({ _id: id }, update, { new: true }).exec()

        return result;
    }

    async findUser(data: GenericMatch) {
        return await this.userModel.findOne(data);
    }

    async findUserByEmailWithPassword(data: GenericMatch) {
        const user = await this.userModel.findOne({ email: data.email, Role: data.Role }).select('+password');

        if (!user || !(await user.correctPassword(data.password, user.password))) {
            throw new HttpException("Oops!, Invalid user credentials", HttpStatus.NOT_FOUND);
        }

        user.password = undefined
        return user;
    }

    async findOneByPhone(mobile: string): Promise<User> {
        const user = await this.userModel.findOne({ mobile: this.normalizeMobile(mobile), deletedAt: null });

        if (!user) {
            throw new HttpException("Oops!, User record not found", HttpStatus.NOT_FOUND);
        }
        return user;
    }

    findOneByIdAndRole(id: string, roles: string): Promise<User | null> {
        return this.userModel.findById(id, { roles }).exec();
    }

    async findAllByRole(roles: string, limit: number = 10, toSkip: number) {
        return await this.userModel.find({ roles }).limit(limit).skip(toSkip).sort({ _id: -1 }).exec();
    }

    findManyUsersByField(match: GenericMatch): Promise<User[]> {
        return this.userModel.find({ ...match, deletedAt: null }).exec()
    }

    findUsersByIds(ids: Types.ObjectId[]): Promise<User[]> {
        return this.userModel.find({ _id: { $in: ids }, deletedAt: null }).exec();
    }

    deleteOneUser(id: Types.ObjectId | string) {
        return this.userModel.deleteOne({ _id: id }).exec();
    }

    normalizeMobile(mobile: string): string {
        if (!mobile.startsWith('+')) {
            return `+${UtiliHelpers.normalizePhoneNumber(mobile)}`;
        }

        return mobile;
    }
    
    async validUser(data: GenericMatch): Promise<User | ResponseData> {
        const user = await this.userModel.findOne(
            {
                $or: [
                    { email: data.email },
                    { mobile: this.normalizeMobile(data.mobile), },
                ],
                deletedAt: null
            },
        ).exec();
        
        if (user) {
            return UtiliHelpers.sendErrorResponse({}, 'User with email or mobile already exists', HttpStatus.BAD_REQUEST, 103);
        }

        return user;
    }
}
