import { Injectable } from '@nestjs/common';
import { UserService } from '../../../shared';
import config from 'src/core/config/config';
import { JwtService } from '@nestjs/jwt';

const CONFIG = config();

@Injectable()
export class AuthService {
    constructor(
        private userCoreSvc: UserService,
        private jwtService: JwtService
    ) { }

    async validateUser(data: string, password: string, role: string): Promise<any> {
        const user = await this.userCoreSvc.findByMobileOrEmail(data, role);
        
        if(user && await user.correctPassword(password, user.password)) {
            user.password = undefined;
            return user;
        }

        return null
    }

    login(user: any) {
        return {
            expiresIn: CONFIG.JWT_EXPIRES_IN,
            type: 'Bearer',
            accessToken: this.jwtService.sign(user)
        }
    }
}
