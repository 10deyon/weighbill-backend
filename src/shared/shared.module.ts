import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserService } from './services/users/user.service';
import { RepositoryModule } from 'src/repository/repository.module';
import { OtpService } from './services/otp/otp.service';
import { WalletService } from './services/wallet/wallet.service';
import { MailService } from './services/mail/mail.service';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { MailerModule } from '@nestjs-modules/mailer';
import { join } from 'path';
import config from 'src/core/config/config';
import { AdminsService } from './services';
import { DispatcherService } from './services/dispatcher/dispatcher.service';
import { LocationManagerService } from './services/location-manager/location-manager.service';
import { VehicleService } from './services/vehicle/vehicle.service';

const CONFIG = config();

@Module({
  imports: [
    ConfigModule,
    RepositoryModule,
    MailerModule.forRootAsync({
      imports: [ConfigModule], // import module if not enabled globally
      useFactory: async (config: ConfigService) => ({
        transport: {
          host: "sandbox.smtp.mailtrap.io",
          secure: false,
          auth: {
            user: "17e543a3e5f525",
            pass: "5f2793befbd972",
          },
        },
        defaults: {
          from: `"No Reply" <${CONFIG.MAIL_FROM}>`,
        },
        template: {
          dir: join(__dirname, '../templates'),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
      inject: [ConfigService],
    }),
  ],

  exports: [
    UserService,
    OtpService,
    WalletService,
    MailService,
    AdminsService,
    DispatcherService,
    LocationManagerService,
    VehicleService
  ],

  providers: [
    UserService,
    OtpService,
    WalletService,
    MailService,
    AdminsService,
    DispatcherService,
    LocationManagerService,
    VehicleService
  ],
})

export class SharedModule { }
