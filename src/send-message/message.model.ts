import { Model } from 'objection';

export default class MessageModel extends Model {
  static get tableName(): string {
    return 'message';
  }
}
