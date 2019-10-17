import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  UseGuards,
  ValidationPipe,
  UsePipes,
  Inject,
  Headers,
  Put,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { Result } from '../common/result.interface';
import { Category } from './category.entity';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { UserRole } from '../common/enums';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';

@Controller('categories')
export class CategoriesController {
  constructor(
    private readonly categoriesService: CategoriesService,
    private readonly jwtService: JwtService,
  ) {}

  @Post()
  @Roles(UserRole.ADMIN_NORMAL, UserRole.ADMIN_SUPER)
  @UseGuards(AuthGuard(), RolesGuard)
  @UsePipes(ValidationPipe)
  async create(@Headers() headers, @Body() category: Category) {
    await this.categoriesService.create(category);
    return { message: '创建成功' };
  }

  @Get()
  @Roles(UserRole.ADMIN_NORMAL, UserRole.ADMIN_SUPER, UserRole.USER)
  @UseGuards(AuthGuard(), RolesGuard)
  async findAll(): Promise<Result> {
    const [list, total] = await this.categoriesService.findAll();
    return { list, total };
  }

  @Get(':id')
  @Roles(UserRole.ADMIN_NORMAL, UserRole.ADMIN_SUPER, UserRole.USER)
  @UseGuards(AuthGuard(), RolesGuard)
  async findById(@Param('id') id) {
    return await this.categoriesService.findOneById(id);
  }

  @Put(':id')
  @Roles(UserRole.ADMIN_NORMAL, UserRole.ADMIN_SUPER)
  @UseGuards(AuthGuard(), RolesGuard)
  async update(@Param('id') id, @Body() category: Category) {
    await this.categoriesService.update(id, category);
  }
}
