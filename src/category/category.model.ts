import { Model } from 'objection';

export default class CategoryModel extends Model {
  static get tableName(): string {
    return 'category';
  }
}
