import { Model } from 'objection';

export class Message extends Model {
  static get tableName(): string {
    return 'messages';
  }

  id!: number;
  to!: string;
  from!: string;
  content!: string;
  type!: string;
  resolvedAt?: string;

  static get idColumn() {
    return 'id';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['to', 'from', 'content'],

      properties: {
        id: { type: 'integer' },
        to: { type: 'string' },
        from: { type: 'string' },
        content: { type: 'string' },
        type: { type: 'string', enum: ['pending', 'success', 'failed'], default: 'pending' },
        resolvedAt: { type: 'string', format: 'date-time' }
      }
    };
  }
}