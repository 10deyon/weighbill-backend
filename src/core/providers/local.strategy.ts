import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AuthService } from '../services';
import { ContextIdFactory, ModuleRef } from '@nestjs/core';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private moduleRef: ModuleRef) {
        super({ passReqToCallback: true, usernameField: 'email' || 'mobile', passwordField: 'password' });
    }

    async validate(request: Request | any, email: string, password: string): Promise<any> {
        const contextId = ContextIdFactory.getByRequest(request);
        const userRole = request.body.roles;
        
        const authService = await this.moduleRef.resolve(AuthService, contextId);
        const user = await authService.validateUser(email, password, userRole);
        
        if (!user) {
            throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
        }
        
        return user;
    }
}
