import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { IRateLimit } from './rate-limit.interface';
import { RateLimitService } from './rate-limit.service';

@Injectable()
export class RateLimitMiddleware implements NestMiddleware {
  private requestsCounter = new Map<string, { count: number; resetTime: number }>();
  private currentLimit: IRateLimit;

  constructor(private readonly rateLimitService: RateLimitService) {
    this.updateLimit();
    setInterval(() => this.updateLimit(), 1000);
  }

  async updateLimit() {
    this.currentLimit = await this.rateLimitService.rateLimit();
  }

  use(req: Request, res: Response, next: NextFunction) {
    const key = req.url;
    const now = Date.now();
    const requestInfo = this.requestsCounter.get(key);

    if (!requestInfo || now > requestInfo.resetTime) {
      this.requestsCounter.set(key, { count: 1, resetTime: now + this.currentLimit.windowsMs });
      return next();
    }

    if (requestInfo.count < this.currentLimit.max) {
      requestInfo.count++;
      return next();
    }

    res.status(429).send(this.currentLimit.message);
  }
}
