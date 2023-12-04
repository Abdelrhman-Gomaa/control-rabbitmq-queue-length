import { Injectable } from '@nestjs/common';
import { RateLimitRepository } from './rate-limit.repository';

@Injectable()
export class RateLimitService {
  constructor(private readonly rateLimitRepo: RateLimitRepository) {}

  async rateLimit() {
    return await this.rateLimitRepo.rateLimitOrError({ id: 1 });
  }

  async updateRateLimit(data: any) {
    return await this.rateLimitRepo.update({ id: 1 }, { ...data });
  }

  async createRateLimit() {
    return await this.rateLimitRepo.create({
      windowsMs: 10000,
      max: 2,
      message: 'Exceeded max request rate'
    });
  }
}
