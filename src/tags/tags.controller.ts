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
import { TagsService } from './tags.service';
import { Result } from '../common/result.interface';
import { Tag } from './tag.entity';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { UserRole } from '../common/enums';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';

@Controller('tags')
export class TagsController {
  constructor(
    private readonly tagsService: TagsService,
    private readonly jwtService: JwtService,
  ) {}

  @Post()
  @Roles(UserRole.ADMIN_NORMAL, UserRole.ADMIN_SUPER)
  @UseGuards(AuthGuard(), RolesGuard)
  @UsePipes(ValidationPipe)
  async create(@Headers() headers, @Body() tag: Tag) {
    await this.tagsService.create(tag);
    return { message: '创建成功' };
  }

  @Get()
  @Roles(UserRole.ADMIN_NORMAL, UserRole.ADMIN_SUPER, UserRole.USER)
  @UseGuards(AuthGuard(), RolesGuard)
  async findAll(): Promise<Result> {
    const [list, total] = await this.tagsService.findAll();
    return { list, total };
  }

  @Get(':id')
  @Roles(UserRole.ADMIN_NORMAL, UserRole.ADMIN_SUPER, UserRole.USER)
  @UseGuards(AuthGuard(), RolesGuard)
  async findById(@Param('id') id) {
    return await this.tagsService.findOneById(id);
  }

  @Put(':id')
  @Roles(UserRole.ADMIN_NORMAL, UserRole.ADMIN_SUPER)
  @UseGuards(AuthGuard(), RolesGuard)
  async update(@Param('id') id, @Body() tag: Tag) {
    await this.tagsService.update(id, tag);
  }
}
