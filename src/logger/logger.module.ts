import { Module } from '@nestjs/common';
import { LoggerService } from './logger.service';
import { LoggerController } from './logger.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import CustomLogger from './helpers/customLogger';
import { LogsEntity } from './entity/log.entity';
import { UserModule } from 'src/admin/user/user.module';
import { TokenModule } from 'src/admin/token/token.module';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([LogsEntity]),
    UserModule,
    TokenModule,
  ],
  controllers: [LoggerController],
  providers: [LoggerService, CustomLogger],
  exports: [CustomLogger],
})
export class LoggerModule {}
