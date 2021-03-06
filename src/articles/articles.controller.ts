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
import { CategoriesService } from '../categories/categories.service';
import { SeriesService } from '../series/series.service';
import { TagsService } from '../tags/tags.service';
import { Tag } from '../tags/tag.entity';
import { Category } from '../categories/category.entity';
import { Series } from '../series/series.entity';

@Controller('articles')
export class ArticlesController {
  constructor(
    private readonly articlesService: ArticlesService,
    private readonly jwtService: JwtService,
    private readonly categoriesService: CategoriesService,
    private readonly seriesService: SeriesService,
    private readonly tagsService: TagsService,
  ) {}

  @Post()
  @Roles(UserRole.ADMIN_NORMAL, UserRole.ADMIN_SUPER)
  @UseGuards(AuthGuard(), RolesGuard)
  @UsePipes(ValidationPipe)
  async create(@Headers() headers, @Body() article) {
    delete article.id;
    article = await this.handleAdditionalInfo(article);
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
  async update(@Param('id') id, @Body() article) {
    article = await this.handleAdditionalInfo(article);
    await this.articlesService.update(article);
  }

  async handleAdditionalInfo(article) {
    if (article.category) {
      const category = await this.categoriesService.findOneById(
        article.category,
      );
      article.category = category;
    }
    if (article.series) {
      const series = await this.seriesService.findByIds(article.series);
      article.series = series;
    }
    if (article.tags) {
      const tagsIds = await this.tagsService.combineTags(article.tags);
      const tags = await this.tagsService.findByIds(tagsIds);
      article.tags = tags;
    }
    return article;
  }

  @Post('import')
  async importArticle(@Body() article) {
    if (article.category) {
      const category = await this.categoriesService.create({
        title: article.category,
      } as Category);
      article.category = category;
    }
    if (article.series) {
      const series = await this.seriesService.create({
        title: article.series,
      } as Series);
      article.series = series;
    }
    if (article.tags) {
      const tagsIds = await this.tagsService.combineTags(article.tags);
      const tags = await this.tagsService.findByIds(tagsIds);
      article.tags = tags;
    }
    await this.articlesService.create(article);
    return { message: `导入成功：${article.id} : ${article.title}` };
  }
}
