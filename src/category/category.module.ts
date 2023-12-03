import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryRepository } from './category.repository';
import { categoryController } from './category.controller';

@Module({
  providers: [CategoryService, CategoryRepository],
  exports: [CategoryService, CategoryRepository],
  controllers: [categoryController]
})
export class CategoryModule {}
