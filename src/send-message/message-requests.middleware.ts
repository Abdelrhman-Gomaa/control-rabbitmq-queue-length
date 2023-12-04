import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class CountMiddleware implements NestMiddleware {
  private static requestCount = 0;

  use(req: Request, res: Response, next: NextFunction) {
    CountMiddleware.requestCount++;
    console.log(`Number of requests to the endpoint: ${CountMiddleware.requestCount}`);
    next();
  }

  public static resetCount() {
    CountMiddleware.requestCount = 0;
  }
}
