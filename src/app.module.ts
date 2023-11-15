import { Module } from '@nestjs/common';
import { RabbitmqModule } from './_common/rabbitmq-config/rabbitmq.module';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './_common/database/database.module';
import { MessageModule } from './send-message/send-message.module';
import { ConsumersModule } from './consuming-message/consumers.module';
import { NestBullModule } from './_common/bull/bull.module';
import { TrackMessageModule } from './track-message/track-message.module';

@Module({
  imports: [
    ConsumersModule,
    MessageModule,
    TrackMessageModule,
    DatabaseModule,
    RabbitmqModule,
    NestBullModule,
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
  ]
})
export class AppModule { }
