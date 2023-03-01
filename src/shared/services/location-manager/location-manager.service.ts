import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { User } from 'src/repository';
import { UserService } from '../users/user.service';
import { RegistrationDTO } from 'src/shared/dtos/registration.dto';

@Injectable()
export class LocationManagerService {
    constructor(
        private userService: UserService
    ) { }
    
    async create(data: RegistrationDTO) {
        return await this.userService.createUser(data);
    }

    async getAll(roles: string): Promise<User[]> {
        return await this.userService.findAllByRole(roles, 10, 2);
    }

    async getOne(id: string, roles: string): Promise<User> {
        const manager = await this.userService.findUser({ _id: id, roles});

        if (!manager) {
            throw new HttpException("Oops!, Location manager record not found", HttpStatus.NOT_FOUND);
        }

        return manager;
    }
}
