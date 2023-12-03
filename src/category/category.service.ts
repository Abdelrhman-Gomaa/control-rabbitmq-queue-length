import { Injectable } from '@nestjs/common';
import { CategoryRepository } from './category.repository';
import { Knex } from 'knex';
import * as R from 'ramda';

@Injectable()
export class CategoryService {
  constructor(private categoryRepository: CategoryRepository) {}

  async createCategory(categoryDate: any) {
    if (R.isNil(categoryDate.isPublished)) categoryDate.isPublished = false;
    return await this.categoryRepository.create(categoryDate);
    // await this.categoryRepository.knex().transaction(async (trx: Knex.Transaction) => {
    //   if (R.isNil(categoryDate.isPublished)) categoryDate.isPublished = false;
    //   category = await this.categoryRepository.create(categoryDate, { trx });
    // });
  }

  async updateCategory(id: number, categoryDate: any) {
    await this.categoryRepository.categoryOrError({ id });
    await this.categoryRepository.update({ id }, { ...categoryDate });
    return await this.categoryRepository.categoryOrError({ id });
  }

  async category(id: number) {
    return await this.categoryRepository.categoryOrError({ id });
  }

  async categories(filter: any) {
    const result: any = { categories: [] };
    const categoriesResult: any = await this.categoryRepository.categories(filter);
    if (!R.isNil(categoriesResult.results)) {
      result.users = categoriesResult.results;
      result.pages = {
        total_items: categoriesResult.total,
        total_pages: Math.ceil(categoriesResult.total / (filter?.pageSize || 10))
      };
    } else {
      result.users = categoriesResult;
    }
    return result;
  }

  async deleteCategory(id: number) {
    return !!(await this.categoryRepository.delete({ id }));
  }
}
