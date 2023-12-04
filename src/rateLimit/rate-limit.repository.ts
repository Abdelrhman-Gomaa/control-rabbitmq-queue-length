import { Inject, Injectable } from '@nestjs/common';
import { BaseRepository } from 'objectionjs-repository';
import { Knex } from 'knex';
import * as R from 'ramda';
import { NotFoundException } from 'expressjs-errors-handler';
import { IRateLimit } from './rate-limit.interface';
import RateLimitModel from './rate-limit.model';

@Injectable()
export class RateLimitRepository extends BaseRepository<IRateLimit> {
  constructor(@Inject('KnexConnection') knexInstance: Knex) {
    super(RateLimitModel, knexInstance);
  }

  async rateLimitOrError(conditions: Partial<IRateLimit>, options?: any) {
    const rateLimit: IRateLimit | undefined = await this.getOne(conditions, options);
    if (R.isNil(rateLimit)) {
      throw new NotFoundException([{ message: 'rateLimit not found' }]);
    }
    return rateLimit;
  }
}
