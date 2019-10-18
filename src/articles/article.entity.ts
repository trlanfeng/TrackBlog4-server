import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  OneToMany,
  ManyToMany,
} from 'typeorm';
import { IsString, IsInt, Max, Min } from 'class-validator';
import { Category } from '../categories/category.entity';
import { Series } from '../series/series.entity';
import { Tag } from '../tags/tag.entity';

@Entity()
export class Article {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsString()
  title: string;

  @Column()
  @IsString()
  content: string;

  // @Column({ nullable: true })
  // categoryId: number;

  @ManyToOne(type => Category, { nullable: true })
  category: Category;

  @ManyToMany(type => Series, { nullable: true })
  series: Series[];

  @ManyToMany(type => Tag, { nullable: true })
  tags: Tag[];

  @CreateDateColumn()
  createAt: Date;

  @UpdateDateColumn()
  updateAt: Date;
}
