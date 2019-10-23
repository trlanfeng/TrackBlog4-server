import { Injectable, HttpException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Series } from './series.entity';

@Injectable()
export class SeriesService {
  constructor(
    @InjectRepository(Series) private readonly seriesRepo: Repository<Series>,
  ) {}

  async findOneById(id: number): Promise<Series> {
    const series = await this.seriesRepo.findOne(id);
    if (!series) throw new HttpException('指定系列不存在', 404);
    return series;
  }

  async findByTitle(title: string): Promise<Series> {
    return await this.seriesRepo.findOne({
      where: {
        title,
      },
    });
  }

  async findAll(where: any = {}): Promise<[Series[], number]> {
    return await this.seriesRepo.findAndCount({ where });
  }

  async findByIds(ids: number[]): Promise<Series[]> {
    return await this.seriesRepo.findByIds(ids);
  }

  async create(series: Series): Promise<Series> {
    const series_finded = await this.findByTitle(series.title);
    if (series_finded) return series_finded;
    delete series.id;
    return await this.seriesRepo.save(series);
  }

  async update(id: number, series: Series): Promise<void> {
    await this.findOneById(id);
    delete series.id;
    await this.seriesRepo.update(id, series);
  }

  async delete(id: number): Promise<void> {
    await this.findOneById(id);
    await this.seriesRepo.delete(id);
  }
}
