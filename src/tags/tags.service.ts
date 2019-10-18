import { Injectable, HttpException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Tag } from './tag.entity';

@Injectable()
export class TagsService {
  constructor(
    @InjectRepository(Tag) private readonly tagRepo: Repository<Tag>,
  ) {}

  async findOneById(id: number): Promise<Tag> {
    const tag = await this.tagRepo.findOne(id);
    if (!tag) {
      throw new HttpException('指定栏目不存在', 404);
    }
    return tag;
  }

  async findAll(where: any = {}): Promise<[Tag[], number]> {
    return await this.tagRepo.findAndCount({ where });
  }

  async create(tag: Tag): Promise<Tag> {
    delete tag.id;
    return await this.tagRepo.save(tag);
  }

  async update(id: number, tag: Tag): Promise<void> {
    await this.findOneById(id);
    delete tag.id;
    await this.tagRepo.update(id, tag);
  }
  
  async delete(id: number): Promise<void> {
    await this.findOneById(id);
    await this.tagRepo.delete(id);
  }
}
