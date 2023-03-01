import { Module, CacheModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CoreModule } from 'src/core';
import { SharedModule } from 'src/shared';
import config from '../core/config/config';
import { UserController } from './users/user.controller';
import { WalletController } from './wallet/wallet.controller';
import { AdminController } from './admin/admin.controller';
import { LocationManagerController } from './location-manager/location-manager.controller';
import { DispatcherController } from './dispatcher/dispatcher.controller';
import { VehicleController } from './vehicle/vehicle.controller';
import { OrderCoreController } from './orders/core/order-core.controller';
import { OrdersController } from './orders/orders.controller';

@Module({
  imports: [
    CacheModule.register(),
    ConfigModule.forFeature(config),
    CoreModule,
    SharedModule,
  ],
  
  controllers: [
    UserController,
    WalletController,
    AdminController,
    LocationManagerController,
    DispatcherController,
    AdminController,
    VehicleController,
    OrderCoreController,
    OrdersController
  ],
})

export class ApiModule {}
