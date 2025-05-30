import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepo: Repository<Category>,
  ) {}

  async createCategory(categoryData: Partial<Category>): Promise<Category> {
    const category = this.categoryRepo.create(categoryData);
    return this.categoryRepo.save(category);
  }

  async findCategoryById(id: number): Promise<Category> {
    const category = await this.categoryRepo.findOne({ where: { id } });
    if (!category) throw new NotFoundException('Category not found');
    return category;
  }

  async findAllCategories(): Promise<Category[]> {
    return this.categoryRepo.find();
  }

  async updateCategory(
    id: number,
    categoryData: Partial<Category>,
  ): Promise<Category> {
    const category = await this.findCategoryById(id);
    Object.assign(category, categoryData);
    return this.categoryRepo.save(category);
  }

  async deleteCategory(id: number): Promise<void> {
    const category = await this.findCategoryById(id);
    await this.categoryRepo.remove(category);
  }
}
