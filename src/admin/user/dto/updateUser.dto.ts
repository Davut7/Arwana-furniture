import { PartialType } from '@nestjs/swagger';
import { UserEntity } from '../entities/user.entity';

export class UserUpdateDto extends PartialType(UserEntity) {}
