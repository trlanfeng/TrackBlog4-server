import {
  Injectable,
  Inject,
  forwardRef,
  HttpService,
  Scope,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt-payload.interface';
import { Admin } from '../admins/admin.entity';
import { AdminsService } from '../admins/admins.service';
import { REQUEST } from '@nestjs/core';

@Injectable()
export class AuthService {
  constructor(
    private readonly adminsService: AdminsService,
    private readonly jwtService: JwtService,
    private readonly httpService: HttpService,
  ) {}

  async signAdmin(admin: any): Promise<string> {
    const { id, username, role }: JwtPayload = admin as Admin;
    console.log(`管理员 ${id} | ${username} | ${role} 签名`);
    return this.jwtService.sign({ id, username, role });
  }

  async validateByJwt(payload: JwtPayload): Promise<any> {
    if (payload.role) {
      return await this.adminsService.findOneById(payload.id);
    }
  }

  async validateByPassword(admin: Admin, password: string): Promise<boolean> {
    if (admin.password === password) return true;
    throw new Error('验证失败');
  }

  async validateByUserPass(
    username: string,
    password: string,
  ): Promise<boolean> {
    if (username === 'admin' && password === '123456') return true;
    return false;
  }
}
