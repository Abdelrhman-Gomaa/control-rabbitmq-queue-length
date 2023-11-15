import { Module } from '@nestjs/common';
import { RabbitmqModule } from './_common/rabbitmq-config/rabbitmq.module';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './_common/database/database.module';
import { MessageModule } from './send-message/send-message.module';
import { ConsumersModule } from './consuming-message/consumers.module';

@Module({
  imports: [
    ConsumersModule,
    MessageModule,
    DatabaseModule,
    RabbitmqModule,
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
  ]
})
export class AppModule { }
