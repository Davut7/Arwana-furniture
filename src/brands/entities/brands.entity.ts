import { MinLength } from 'class-validator';
import { MediaEntity } from 'src/helpers/entities/media.entity';
import { BaseEntity } from 'src/helpers/entities/baseEntity.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { CategoryBrandEntity } from 'src/brand-category/entities/brandCategory.entity';

@Entity({ name: 'brands' })
export class BrandsEntity extends BaseEntity {
  @MinLength(1, { message: 'Title in english not provided' })
  @Column({ type: 'varchar', nullable: false })
  enTitle: string;

  @MinLength(1, { message: 'Title in russian not provided' })
  @Column({ type: 'varchar', nullable: false })
  ruTitle: string;

  @MinLength(1, { message: 'Title in turkmen not provided' })
  @Column({ type: 'varchar', nullable: false })
  tkmTitle: string;

  @MinLength(1, { message: 'Description in english not provided' })
  @Column({ type: 'varchar', nullable: false })
  enDescription: string;

  @MinLength(1, { message: 'Description in turkmen not provided' })
  @Column({ type: 'varchar', nullable: false })
  tkmDescription: string;

  @MinLength(1, { message: 'Description in russian not provided' })
  @Column({ type: 'varchar', nullable: false })
  ruDescription: string;

  @Column({ type: 'uuid', nullable: true })
  logoId: string;

  @OneToMany(() => CategoryBrandEntity, (categoryBrand) => categoryBrand.brand)
  brandCategories: CategoryBrandEntity[];

  @OneToMany(() => MediaEntity, (media) => media.brand)
  medias: MediaEntity[];
}
