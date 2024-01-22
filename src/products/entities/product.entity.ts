import { MinLength } from 'class-validator';
import { CategoryBrandEntity } from 'src/brand-category/entities/brandCategory.entity';
import { BaseEntity } from 'src/helpers/baseEntity.entity';
import { MediaEntity } from 'src/helpers/entities/media.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

@Entity({ name: 'products' })
export class ProductEntity extends BaseEntity {
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

  @ManyToOne(
    () => CategoryBrandEntity,
    (categoryBrand) => categoryBrand.products,
    { onDelete: 'CASCADE' },
  )
  @JoinColumn({ name: 'categoryBrandId' })
  categoryBrand: CategoryBrandEntity;

  @OneToMany(() => MediaEntity, (media) => media.product)
  medias: MediaEntity[];
}
