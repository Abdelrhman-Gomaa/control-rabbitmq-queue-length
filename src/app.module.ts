import { Module, NestModule, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { RabbitmqModule } from './_common/rabbitmq-config/rabbitmq.module';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './_common/database/database.module';
import { MessageModule } from './send-message/send-message.module';
import { ConsumersModule } from './consuming-message/consumers.module';
import { NestBullModule } from './_common/bull/bull.module';
import { TrackMessageModule } from './track-message/track-message.module';
import getConfigSchema from './_common/config/config.schema';
import { CategoryModule } from './category/category.module';
import { RateLimitModule } from './rateLimit/rate-limit.module';
import { RateLimitMiddleware } from './rateLimit/rate-limit.middleware';

@Module({
  imports: [
    RateLimitModule,
    CategoryModule,
    ConsumersModule,
    MessageModule,
    TrackMessageModule,
    DatabaseModule,
    RabbitmqModule,
    NestBullModule,
    ConfigModule.forRoot({
      envFilePath: '.env',
      validationSchema: getConfigSchema(),
      validationOptions: {
        allowUnknown: true,
        abortEarly: true
      }
    })
  ]
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // const limiter = rateLimit({
    //   windowMs: 10000, // 10 second
    //   max: 2,
    //   message: 'Exceeded max request rate'
    // });
    consumer
      .apply(RateLimitMiddleware)
      .forRoutes({ path: 'message', method: RequestMethod.POST });
  }
}
