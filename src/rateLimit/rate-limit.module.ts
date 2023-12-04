import { Module, NestModule, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { DatabaseModule } from 'src/_common/database/database.module';
import { RateLimitController } from './rate-limit.controller';
import { RateLimitService } from './rate-limit.service';
import { RateLimitRepository } from './rate-limit.repository';

@Module({
  imports: [DatabaseModule],
  controllers: [RateLimitController],
  providers: [RateLimitService, RateLimitRepository],
  exports: [RateLimitService, RateLimitRepository]
})
export class RateLimitModule {}
