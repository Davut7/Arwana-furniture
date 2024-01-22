import { ApiProperty } from '@nestjs/swagger';
import { BrandsEntity } from 'src/brands/entities/brands.entity';
import { CategoryEntity } from 'src/category/entities/category.entity';
import { BaseEntity } from 'src/helpers/baseEntity.entity';
import { ProductEntity } from 'src/products/entities/product.entity';
import { Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

@Entity({ name: 'brand_categories' })
export class CategoryBrandEntity extends BaseEntity {
  @ApiProperty({ type: CategoryEntity, description: 'Category id' })
  @ManyToOne(() => CategoryEntity, (category) => category.categoryBrands, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'categoryId' })
  category: CategoryEntity;

  @ApiProperty({ type: CategoryEntity, description: 'Brand id' })
  @ManyToOne(() => BrandsEntity, (brand) => brand.brandCategories, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'brandId' })
  brand: BrandsEntity;

  @OneToMany(() => ProductEntity, (product) => product.categoryBrand, {
    onDelete: 'SET NULL',
  })
  products: ProductEntity[];
}
