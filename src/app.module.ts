import { MiddlewareConsumer, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import databaseConfig from './core/config/database.config';
import { RepositoryModule } from './repository/repository.module';
import { ApiModule } from './api';
import { SharedModule } from './shared';
import { ConfigModule } from '@nestjs/config';
import { LoggerMiddleware } from './shared/utils/logger.middleware';

@Module({
  imports: [
    MongooseModule.forRoot(databaseConfig().dbUrl),
    ConfigModule.forRoot({
      isGlobal: true, // no need to import into other modules
    }),
    RepositoryModule,
    ApiModule,
    SharedModule
  ],

  controllers: [AppController],
})

export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
