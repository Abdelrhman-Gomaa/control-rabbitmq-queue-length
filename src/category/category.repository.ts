import { Inject, Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import CategoryModel from './category.model';
import { BaseRepository } from 'objectionjs-repository';
import { ICategory } from './category.interface';
import * as R from 'ramda';
import { NotFoundException } from 'expressjs-errors-handler';

@Injectable()
export class CategoryRepository extends BaseRepository<ICategory> {
  constructor(@Inject('KnexConnection') knexInstance: Knex) {
    super(CategoryModel, knexInstance);
  }

  async categoryOrError(conditions: Partial<ICategory>, options?: any): Promise<ICategory> {
    const category: ICategory | undefined = await this.getOne(conditions, options);

    if (R.isNil(category)) {
      throw new NotFoundException([{ message: 'category not found' }]);
    }
    return category;
  }

  async categories(filter: any): Promise<ICategory[]> {
    let query = this.model.query().select('*');
    if (filter.page > -1) {
      query = query.page(filter.page - 1, filter?.pageSize || 10);
    }

    if (!R.isNil(filter.filterByIsPublished)) {
      query = query.where('isPublished', filter.filterByIsPublished);
    }

    if (!R.isNil(filter.categories)) {
      query = query.whereIn('category.id', filter.categories);
    }

    if (!R.isNil(filter.q)) {
      query = query.andWhere((builder: any) => {
        builder.whereRaw('"enTitle" ilike ?', [`%${filter.q}%`]);
        builder.orWhereRaw('"arTitle" ilike ?', [`%${filter.q}%`]);
        builder.orWhereRaw('"enDescription" ilike ?', [`%${filter.q}%`]);
        builder.orWhereRaw('"arDescription" ilike ?', [`%${filter.q}%`]);
      });
    }

    if (!R.isNil(filter.order)) {
      filter.order.forEach(item => {
        query = query.orderBy(item.field, item.orderType);
      });
    }
    query = query.groupBy('category.id');
    return query;
  }
}
