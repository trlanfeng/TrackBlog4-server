import { Injectable, HttpException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Admin } from './admin.entity';

@Injectable()
export class AdminsService {
  constructor(
    @InjectRepository(Admin) private readonly adminRepo: Repository<Admin>,
  ) {}

  async findOneByUsername(username: string): Promise<Admin> {
    const admin = await this.adminRepo
      .createQueryBuilder('admin')
      .addSelect(['admin.password'])
      .where('admin.username = :username', { username })
      .getOne();
    if (!admin) {
      throw new HttpException('指定管理员不存在', 404);
    }
    return admin;
  }

  async findOneById(id: number): Promise<Admin> {
    const admin = await this.adminRepo.findOne(id);
    if (!admin) {
      throw new HttpException('指定管理员不存在', 404);
    }
    return admin;
  }

  async findAll(): Promise<[Admin[], number]> {
    return await this.adminRepo.findAndCount();
  }

  async create(admin: Admin): Promise<Admin> {
    delete admin.id;
    return await this.adminRepo.save(admin);
  }

  async update(id: number, admin: Admin): Promise<void> {
    await this.findOneById(id);
    delete admin.id;
    await this.adminRepo.update(id, admin);
  }
  
  async delete(id: number): Promise<void> {
    await this.findOneById(id);
    await this.adminRepo.delete(id);
  }
}
