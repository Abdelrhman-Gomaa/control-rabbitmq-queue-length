import IORedis from 'ioredis';
import { BullModule } from '@nestjs/bull';
import { Global, MiddlewareConsumer, Module } from '@nestjs/common';
import { Response } from 'express';
import { QueueUIProvider } from './bull-board.provider';

export enum CreateClientTypeEnum {
  client = 'client',
  subscriber = 'subscriber'
}

const connectionOptions = {
    host: '127.0.0.1', //process.env.REDIS_HOST,
    port: 6379, //+process.env.REDIS_PORT,
    // password: process.env.REDIS_PASS,
    ...(process.env.REDIS_DATABASE_INEDX !== undefined && {
      db: +process.env.REDIS_DATABASE_INEDX
    }),
    maxRetriesPerRequest: null,
    enableReadyCheck: false
  },
  client = new IORedis(connectionOptions),
  subscriber = new IORedis(connectionOptions);

const queues = [BullModule.registerQueue({ name: 'track-message' })];

@Global()
@Module({
  imports: [
    BullModule.forRootAsync({
      useFactory: async () => ({
        createClient(type: CreateClientTypeEnum) {
          switch (type) {
            case CreateClientTypeEnum.client:
              return client;
            case CreateClientTypeEnum.subscriber:
              return subscriber;
            default:
              return new IORedis(connectionOptions);
          }
        },
        defaultJobOptions: { removeOnComplete: false, removeOnFail: false }
      })
    }),
    ...queues
  ],
  providers: [QueueUIProvider],
  exports: [...queues]
})
export class NestBullModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer
      .apply((_, res: Response, next: any) => {
        if (process.env.NODE_ENV === 'production') return res.sendStatus(401);
        next();
      }, QueueUIProvider.router)
      .forRoutes('/admin/queues');
  }
}
