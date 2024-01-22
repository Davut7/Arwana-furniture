import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { UserEntity } from '../../user/entities/user.entity';
import { BaseEntity } from '../../../helpers/baseEntity.entity';

@Entity({ name: 'tokens' })
export class TokenEntity extends BaseEntity {
  @Column({ type: 'text', nullable: false })
  refreshToken: string;

  @OneToOne(() => UserEntity, (user) => user.token, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user: UserEntity;
}
