import { BaseEntity } from 'src/helpers/entities/baseEntity.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { ProductEntity } from '../../products/entities/product.entity';
import { MediaEntity } from 'src/helpers/entities/media.entity';
import { IsNotEmpty, IsString } from 'class-validator';

@Entity({ name: 'product_options' })
export class ProductOptionsEntity extends BaseEntity {
  @IsNotEmpty()
  @IsString()
  @Column({ type: 'varchar', nullable: false })
  enTitle: string;

  @IsNotEmpty()
  @IsString()
  @Column({ type: 'varchar', nullable: false })
  ruTitle: string;

  @IsNotEmpty()
  @IsString()
  @Column({ type: 'varchar', nullable: false })
  tkmTitle: string;

  @ManyToOne(() => ProductEntity, (product) => product.productOptions)
  product: ProductEntity;

  @OneToMany(() => MediaEntity, (medias) => medias.productOption)
  medias: MediaEntity[];
}
