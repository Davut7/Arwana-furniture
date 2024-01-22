import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { TokenModule } from '../token/token.module';
import { TokenEntity } from '../token/entities/token.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, TokenEntity]), TokenModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
