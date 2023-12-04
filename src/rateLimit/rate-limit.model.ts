import { Model } from 'objection';

export default class RateLimitModel extends Model {
  static get tableName(): string {
    return 'ratelimit';
  }
}
