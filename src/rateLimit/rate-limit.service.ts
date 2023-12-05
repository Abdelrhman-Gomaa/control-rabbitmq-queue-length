import { Injectable, Inject } from '@nestjs/common';
import { RateLimitRepository } from './rate-limit.repository';
import * as Redis from 'ioredis';

@Injectable()
export class RateLimitService {
  constructor(
    private readonly rateLimitRepo: RateLimitRepository,
    @Inject('REDIS_CLIENT') private readonly redisClient: Redis.Redis
  ) {}

  async rateLimit() {
    const rateLimit = await this.rateLimitRepo.rateLimitOrError({ id: 1 });
    const payload = JSON.stringify({ rateLimit });
    await this.redisClient.set('rateLimit', payload);
    return rateLimit;
  }

  async rateLimitFromRedis() {
    const existingRateLimit = await this.redisClient.exists('rateLimit');
    if (!existingRateLimit) await this.rateLimit();
    const rateLimit = await this.redisClient.get('rateLimit');
    return JSON.parse(rateLimit);
  }

  async updateRateLimit(data: any) {
    await this.rateLimitRepo.update({ id: 1 }, { ...data });
    const rateLimit = await this.rateLimitRepo.getOne({ id: 1 });
    const payload = JSON.stringify({ rateLimit });
    await this.redisClient.set('rateLimit', payload);
    return rateLimit;
  }

  async createRateLimit() {
    return await this.rateLimitRepo.create({
      windowsMs: 10000,
      max: 2,
      message: 'Exceeded max request rate'
    });
  }
}
