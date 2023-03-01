import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Dispatcher, User } from 'src/repository';
import { UserService } from '../users/user.service';
import { RegistrationDTO } from 'src/shared/dtos/registration.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserNotFoundException } from 'src/shared/exceptions/UserNotFound.exception';

@Injectable()
export class DispatcherService {
    constructor(
        @InjectModel('Dispatcher') private dispatcherModel: Model<Dispatcher>,
        private userService: UserService
    ) { }

    async create(data: RegistrationDTO) {
        return await this.userService.createUser(data);
    }

    async getAll(roles: string): Promise<User[]> {
        return await this.userService.findAllByRole(roles, 10, 10);
    }

    async getOne(id: string, roles: string): Promise<User> {
        const dispatcher = await this.userService.findUser({ _id: id, roles});

        if (!dispatcher) {
            throw new HttpException("Oops!, Dispatcher record not found", HttpStatus.NOT_FOUND);
        }

        return dispatcher;
    }
}
