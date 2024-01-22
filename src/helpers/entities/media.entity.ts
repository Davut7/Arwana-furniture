import { BrandsEntity } from 'src/brands/entities/brands.entity';
import { CategoryEntity } from 'src/category/entities/category.entity';
import { BaseEntity } from 'src/helpers/baseEntity.entity';
import { ProductEntity } from 'src/products/entities/product.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

export enum FileTypeEnum {
  image = 'image',
  video = 'video',
  catalog = 'catalog',
}

@Entity({ name: 'medias' })
export class MediaEntity extends BaseEntity {
  @Column({ type: 'varchar', nullable: false })
  fileName: string;

  @Column({ type: 'varchar', nullable: false })
  filePath: string;

  @Column({ type: 'enum', enum: FileTypeEnum })
  fileType: FileTypeEnum;

  @ManyToOne(() => CategoryEntity, (category) => category.medias, {
    onDelete:'CASCADE'
  })
  category: CategoryEntity;

  @ManyToOne(() => BrandsEntity, (brand) => brand.medias, {
    onDelete: 'CASCADE',
  })
  brand: BrandsEntity;

  @ManyToOne(() => ProductEntity, (product) => product.medias, {
    onDelete: 'CASCADE',
  })
  product: ProductEntity;
}
