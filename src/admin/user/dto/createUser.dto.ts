import { OmitType } from '@nestjs/swagger';
import { UserEntity } from '../entities/user.entity';

export class CreateUserDto extends OmitType(UserEntity, ['token'] as const) {}
