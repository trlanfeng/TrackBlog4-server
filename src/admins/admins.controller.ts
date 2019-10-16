import {
  Controller,
  Inject,
  Get,
  Param,
  UseGuards,
  Post,
  Body,
  ValidationPipe,
  UsePipes,
  HttpCode,
  HttpException,
  Headers,
} from '@nestjs/common';
import { AdminsService } from './admins.service';
import { Admin } from './admin.entity';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { UserRole } from '../common/enums';
import { Result } from '../common/result.interface';
import { AuthService } from '../auth/auth.service';
import { JwtService } from '@nestjs/jwt';

@Controller('admins')
export class AdminsController {
  constructor(
    private readonly adminsService: AdminsService,
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
  ) {}

  @Post('login')
  @HttpCode(200)
  @UsePipes(ValidationPipe)
  async login(@Body() admin: Admin): Promise<string> {
    try {
      const result = await this.adminsService.findOneByUsername(admin.username);
      await this.authService.validateByPassword(admin, result.password);
      const token = await this.authService.signAdmin(result);
      if (token) return token;
      throw new HttpException('token签发失败', 500);
    } catch (e) {
      throw new HttpException('用户名或密码错误', 200);
    }
  }

  @Post()
  @Roles(UserRole.ADMIN_SUPER)
  @UseGuards(AuthGuard(), RolesGuard)
  @UsePipes(ValidationPipe)
  async create(@Body() admin: Admin): Promise<string> {
    await this.adminsService.create(admin);
    return '创建成功';
  }

  @Get()
  @Roles(UserRole.ADMIN_NORMAL, UserRole.ADMIN_SUPER)
  @UseGuards(AuthGuard(), RolesGuard)
  async findAll(): Promise<Result> {
    const [list, total] = await this.adminsService.findAll();
    return { list, total };
  }

  @Get(':id')
  @Roles(UserRole.ADMIN_NORMAL, UserRole.ADMIN_SUPER)
  @UseGuards(AuthGuard(), RolesGuard)
  async findOneById(@Param('id') id): Promise<Admin> {
    const admin = await this.adminsService.findOneById(id);
    return admin;
  }
}
