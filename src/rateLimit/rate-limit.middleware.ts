import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { IRateLimit } from './rate-limit.interface';
import { RateLimitService } from './rate-limit.service';

@Injectable()
export class RateLimitMiddleware implements NestMiddleware {
  private requestsCounter: { count: number; resetTime: number };
  private currentLimit: IRateLimit;

  constructor(private readonly rateLimitService: RateLimitService) {
    this.updateLimit();
    setInterval(() => this.updateLimit(), 1000);
  }

  async updateLimit() {
    this.currentLimit = await this.rateLimitService.rateLimit();
  }

  use(req: Request, res: Response, next: NextFunction) {
    const now = Date.now();
    let requestInfo = this.requestsCounter;

    if (!requestInfo || now > requestInfo.resetTime) {
      this.requestsCounter = { count: 1, resetTime: now + this.currentLimit.windowsMs };
      return next();
    }

    if (requestInfo.count < this.currentLimit.max) {
      requestInfo.count++;
      return next();
    }

    res.status(429).send(this.currentLimit.message);
  }
}
