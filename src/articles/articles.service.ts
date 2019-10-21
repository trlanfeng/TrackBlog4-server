import { Injectable, HttpException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Article } from './article.entity';
import { Category } from '../categories/category.entity';

@Injectable()
export class ArticlesService {
  constructor(
    @InjectRepository(Article)
    private readonly articleRepo: Repository<Article>,
  ) {}

  async findOneById(id: number): Promise<Article> {
    const article = await this.articleRepo.findOne(id, {
      relations: ['category', 'series', 'tags'],
    });
    if (!article) {
      throw new HttpException('指定文章不存在', 404);
    }
    return article;
  }

  async findAll(where: any = {}): Promise<[Article[], number]> {
    return await this.articleRepo.findAndCount({
      where,
      relations: ['category', 'series', 'tags'],
    });
  }

  async create(article: Article): Promise<Article> {
    return await this.articleRepo.save(article);
  }

  async update(id: number, article: Article): Promise<void> {
    await this.findOneById(id);
    delete article.id;
    await this.articleRepo.update(id, article);
  }

  async delete(id: number): Promise<void> {
    await this.findOneById(id);
    await this.articleRepo.delete(id);
  }
}
