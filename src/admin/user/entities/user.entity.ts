import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { BaseEntity } from '../../../helpers/entities/baseEntity.entity';
import { TokenEntity } from '../../token/entities/token.entity';
import { IsNotEmpty, IsString } from 'class-validator';

@Entity({ name: 'users' })
export class UserEntity extends BaseEntity {
  @IsNotEmpty()
  @IsString()
  @Column({ type: 'text', nullable: false })
  name: string;

  @IsNotEmpty()
  @IsString()
  @Column({ type: 'varchar', nullable: false })
  password: string;

  @OneToOne(() => TokenEntity, (token) => token.user)
  @JoinColumn()
  token: TokenEntity;
}
