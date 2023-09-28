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
import { Length, IsInt, Matches } from "class-validator";
import { SubCategory } from "./SubCategory";
import { Tag } from "./Tag";
import { User } from "./User";

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

  @Column()
  @IsInt()
  price!: number;

  @Column()
  @Length(8, 10, { message: "Entre 8 et 10 caractères" })
  createdDate!: string;

  @Column()
  @Length(8, 10, { message: "Entre 8 et 10 caractères" })
  updateDate!: string;

  @Column({ length: 500 })
  picture!: string;

  @Column({ length: 100 })
  @Matches(/^[a-zA-Z]+$/, {
    message: "La ville ne doit contenir que des lettres",
  })
  location!: string;

  @ManyToOne(() => SubCategory, (subCategory) => subCategory.ads)
  @JoinColumn({ name: "subCategory" })
  subCategory!: SubCategory;

  @ManyToOne(() => User, (user) => user.ads)
  @JoinColumn({ name: "user" })
  user!: User;

  @ManyToMany(() => Tag, (tag) => tag.ads)
  @JoinTable()
  tags!: Tag[];
}
