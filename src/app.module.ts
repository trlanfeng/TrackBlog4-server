import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { AdminsModule } from './admins/admins.module';
import { Admin } from './admins/admin.entity';
import { ArticlesModule } from './articles/articles.module';
import { Article } from './articles/article.entity';
import { CategoriesModule } from './categories/categories.module';
import { Category } from './categories/category.entity';
import { Series } from './series/series.entity';
import { Tag } from './tags/tag.entity';
import { SeriesModule } from './series/series.module';
import { TagsModule } from './tags/tags.module';

const databaseConfig = {
  type: process.env.DB_TYPE as any,
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: [Admin, Article, Category, Series, Tag],
  synchronize: true,
};

@Module({
  imports: [
    TypeOrmModule.forRoot(databaseConfig),
    AuthModule,
    AdminsModule,
    ArticlesModule,
    CategoriesModule,
    SeriesModule,
    TagsModule,
  ],
  providers: [],
  controllers: [],
})
export class AppModule {}
