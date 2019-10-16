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
import { ArticlesService } from './articles.service';
import { Result } from '../common/result.interface';
import { Article } from './article.entity';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { UserRole } from '../common/enums';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';

@Controller('articles')
export class ArticlesController {
  constructor(
    private readonly articlesService: ArticlesService,
    private readonly jwtService: JwtService,
  ) {}

  @Post()
  @Roles(UserRole.ADMIN_NORMAL, UserRole.ADMIN_SUPER)
  @UseGuards(AuthGuard(), RolesGuard)
  @UsePipes(ValidationPipe)
  async create(@Headers() headers, @Body() article: Article) {
    await this.articlesService.create(article);
    return { message: '创建成功' };
  }

  @Get()
  @Roles(UserRole.ADMIN_NORMAL, UserRole.ADMIN_SUPER, UserRole.USER)
  @UseGuards(AuthGuard(), RolesGuard)
  async findAll(): Promise<Result> {
    const [list, total] = await this.articlesService.findAll();
    return { list, total };
  }

  @Get(':id')
  @Roles(UserRole.ADMIN_NORMAL, UserRole.ADMIN_SUPER, UserRole.USER)
  @UseGuards(AuthGuard(), RolesGuard)
  async findById(@Param('id') id) {
    return await this.articlesService.findOneById(id);
  }

  @Put(':id')
  @Roles(UserRole.ADMIN_NORMAL, UserRole.ADMIN_SUPER)
  @UseGuards(AuthGuard(), RolesGuard)
  async update(@Param('id') id, @Body() article: Article) {
    await this.articlesService.update(id, article);
  }
}
