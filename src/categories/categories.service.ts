import { Injectable, HttpException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Category } from './category.entity';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepo: Repository<Category>,
  ) {}

  async findOneById(id: number): Promise<Category> {
    const category = await this.categoryRepo.findOne(id);
    if (!category) throw new HttpException('指定栏目不存在', 404);
    return category;
  }

  async findAll(where: any = {}): Promise<[Category[], number]> {
    return await this.categoryRepo.findAndCount({ where });
  }

  async create(category: Category): Promise<Category> {
    delete category.id;
    return await this.categoryRepo.save(category);
  }

  async update(id: number, category: Category): Promise<void> {
    await this.findOneById(id);
    delete category.id;
    await this.categoryRepo.update(id, category);
  }

  async delete(id: number): Promise<void> {
    await this.findOneById(id);
    await this.categoryRepo.delete(id);
  }
}
