import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { CategoryService } from './category.service';
import { JoiValidationPipe, UseValue } from 'src/_common/pipes/joi-validation.pipe';
import schema from './category.schema';
import { ICategory, IUpdateCategory } from './category.interface';

@Controller({
  version: '1',
  path: 'category'
})
export class categoryController {
  constructor(private categoryService: CategoryService) {}

  @Get('/:id')
  async category(@Param('id') id: number) {
    const result = await this.categoryService.category(id);
    return {
      data: { ...result },
      statusCode: 200
    };
  }

  @Post()
  async categories(@Body(new JoiValidationPipe(schema.listCategories)) body: any) {
    const result = await this.categoryService.categories(body);
    return {
      data: { ...result },
      statusCode: 200
    };
  }

  @Post('/create')
  async createCategory(
    @Body(new JoiValidationPipe(schema.addCategory, {}, UseValue.UPDATED))
    body: ICategory
  ) {
    const category = await this.categoryService.createCategory(body);
    return {
      data: {
        ...category
      },
      message: 'Created successfully',
      statusCode: 201
    };
  }

  @Put('/:id')
  async updateCategory(
    @Param('id') id: number,
    @Body(new JoiValidationPipe(schema.editCategory, {}, UseValue.UPDATED))
    body: IUpdateCategory
  ) {
    const category = await this.categoryService.updateCategory(id, body);
    return {
      data: {
        ...category
      },
      message: 'Updated successfully',
      statusCode: 201
    };
  }

  @Delete('/:id')
  async DeleteCategory(@Param('id') id: number) {
    const category = await this.categoryService.deleteCategory(id);
    return {
      data: category,
      message: 'Deleted successfully',
      statusCode: 201
    };
  }
}
