import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import config from './config/config';
import { SharedModule } from '../shared';
import { AuthService } from './services';
import { JwtAuthGuard, LocalAuthGuard } from './guards';
import { ConfigModule } from '@nestjs/config';
import { AppLogger } from './logger';
import { JwtStrategy, LocalStrategy } from './providers';

const CONFIG = config();

@Module({
    imports: [
        ConfigModule.forFeature(config),
        // PassportModule.register({ defaultStrategy: 'jwt' }),
        PassportModule,

        JwtModule.register({
            // secretOrPrivateKey: CONFIG.JWT_KEY,
            secret: CONFIG.JWT_KEY,
            signOptions: {
                expiresIn: CONFIG.JWT_EXPIRES_IN
            },
        }),

        SharedModule,
    ],

    exports: [AuthService, AppLogger],

    providers: [
        AuthService,
        JwtStrategy,
        LocalAuthGuard,
        JwtAuthGuard,
        AppLogger,
        LocalStrategy,
    ],
})
export class CoreModule { }
