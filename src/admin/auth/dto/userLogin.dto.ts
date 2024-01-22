import { OmitType } from '@nestjs/swagger';
import { UserEntity } from 'src/admin/user/entities/user.entity';

export class LoginDto extends OmitType(UserEntity, ['token'] as const) {}
