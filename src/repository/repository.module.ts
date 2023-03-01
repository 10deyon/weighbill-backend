import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AgentSchema } from './schemas/agent.schema';
import { DispatcherSchema } from './schemas/dispatcher.schema';
import { OtpSchema } from './schemas/otp.schema';
import { UserSchema } from './schemas/user.schema';
import { WalletSchema, WalletTransactionSchema } from './schemas/wallet.schema';
import { VehicleSchema } from './schemas/vehicle.schema';
import { OrderSchema } from './schemas/order.schema';
import { OrderItemsSchema } from './schemas/order-items.schema';
import { OrderPartiesSchema } from './schemas/order-parties.schema';
import { OrderPersonnelSchema } from './schemas/order-personnel.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'User', schema: UserSchema },
      { name: 'Dispatcher', schema: DispatcherSchema },
      { name: 'Agent', schema: AgentSchema },
      { name: 'Otp', schema: OtpSchema },
      { name: 'Wallet', schema: WalletSchema },
      { name: 'WalletTransaction', schema: WalletTransactionSchema },
      { name: 'Vehicle', schema: VehicleSchema },
      { name: 'Order', schema: OrderSchema },
      { name: 'OrderItems', schema: OrderItemsSchema },
      { name: 'OrderParties', schema: OrderPartiesSchema },
      { name: 'OrderPersonnel', schema: OrderPersonnelSchema },
    ]),
  ],
  exports: [MongooseModule],
})

export class RepositoryModule { }
