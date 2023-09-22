import {
  BaseEntity,
  ManyToOne,
  JoinColumn,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  Index,
  ManyToMany,
  JoinTable,
} from "typeorm";
import { Length, IsEmail } from "class-validator";
import { Category } from "./Category";
import { Tag } from "./Tag";

@Entity()
export class Ad extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 100 })
  @Length(10, 100, { message: "Entre 10 et 100 caractères" })
  @Index()
  title!: string;

  @Column()
  description!: string;

  @Column({ length: 100 })
  @IsEmail()
  owner!: string;

  @Column()
  price!: number;

  @Column()
  @Length(8, 10, { message: "Entre 8 et 10 caractères" })
  createdDate!: string;

  @Column({ length: 500 })
  picture!: string;

  @Column({ length: 100 })
  location!: string;

  @ManyToOne(() => Category, (category) => category.ads)
  @JoinColumn({ name: "category" })
  @Column({ type: "int" })
  category!: Category;

  @ManyToMany(() => Tag, (tag) => tag.ads)
  @JoinTable()
  // @Column({ nullable: true })
  tags!: Tag;
}
