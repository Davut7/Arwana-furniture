import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { BaseEntity } from '../../../helpers/baseEntity.entity';
import { TokenEntity } from '../../token/entities/token.entity';

@Entity({ name: 'users' })
export class UserEntity extends BaseEntity {
  @Column({ type: 'text', nullable: false })
  name: string;

  @Column({ type: 'varchar', nullable: false })
  password: string;

  @OneToOne(() => TokenEntity, (token) => token.user)
  @JoinColumn()
  token: TokenEntity;
}
