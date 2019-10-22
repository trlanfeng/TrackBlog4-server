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
    if (!tag) throw new HttpException('指定标签不存在', 404);
    return tag;
  }

  async findAll(where: any = {}): Promise<[Tag[], number]> {
    return await this.tagRepo.findAndCount({ where });
  }

  async findByTitle(title: string): Promise<Tag> {
    return await this.tagRepo.findOne({
      where: {
        title,
      },
    });
  }

  async findByIds(ids: number[]): Promise<Tag[]> {
    return await this.tagRepo.findByIds(ids);
  }

  async combineTags(tags: any[]): Promise<number[]> {
    let tags_numbers: number[] = [],
      tags_strings: string[] = [];
    tags.forEach(item => {
      if (typeof item === 'number') {
        tags_numbers.push(item);
      } else if (typeof item === 'string') {
        tags_strings.push(item);
      }
    });
    const tags_promises = tags_strings.map(item =>
      this.create({ title: item } as Tag),
    );
    const tags_promises_result = await Promise.all(tags_promises);
    tags_promises_result.forEach(item => tags_numbers.push(item.id));
    return tags_numbers;
  }

  async create(tag: Tag): Promise<Tag> {
    const tag_finded = await this.findByTitle(tag.title);
    if (tag_finded) return tag_finded;
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
