import { IsNotEmpty, IsString } from 'class-validator';
import { MediaEntity } from 'src/helpers/entities/media.entity';
import { BaseEntity } from 'src/helpers/baseEntity.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { CategoryBrandEntity } from 'src/brand-category/entities/brandCategory.entity';

@Entity({ name: 'categories' })
export class CategoryEntity extends BaseEntity {
  @IsNotEmpty()
  @IsString()
  @Column({ type: 'varchar', nullable: false })
  ruTitle: string;

  @IsNotEmpty()
  @IsString()
  @Column({ type: 'varchar', nullable: false })
  enTitle: string;

  @IsNotEmpty()
  @IsString()
  @Column({ type: 'varchar', nullable: false })
  tkmTitle: string;

  @OneToMany(() => MediaEntity, (medias) => medias.category)
  medias: MediaEntity[];

  @OneToMany(() => CategoryBrandEntity, (categoryBrand) => categoryBrand.category)
  categoryBrands: CategoryBrandEntity[];
}
