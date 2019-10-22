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
  JoinTable,
} from 'typeorm';
import { IsString, IsInt, Max, Min, IsBoolean } from 'class-validator';
import { Category } from '../categories/category.entity';
import { Series } from '../series/series.entity';
import { Tag } from '../tags/tag.entity';

@Entity()
export class Article {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  @IsString()
  title: string;

  @Column({ default: '' })
  @IsString()
  description: string;

  @Column()
  @IsString()
  content: string;

  // @Column({ nullable: true })
  // categoryId: number;

  @Column({ default: false })
  @IsBoolean()
  isDraft: boolean;

  @ManyToOne(type => Category, { nullable: true })
  category: Category;

  @ManyToMany(type => Series, { nullable: true })
  @JoinTable()
  series: Series[];

  @ManyToMany(type => Tag, { nullable: true })
  @JoinTable()
  tags: Tag[];

  @CreateDateColumn()
  createAt: Date;

  @UpdateDateColumn()
  updateAt: Date;
}
