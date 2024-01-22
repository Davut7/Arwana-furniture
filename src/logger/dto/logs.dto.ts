import { IsNumber, IsOptional, IsPositive, IsEnum } from 'class-validator';
import { Transform } from 'class-transformer';
import { PartialType } from '@nestjs/mapped-types';
import { LogsEntity } from '../entity/log.entity';
import { ApiProperty } from '@nestjs/swagger';

export class CreateLogDto extends PartialType(LogsEntity) {}

export enum LogMethodEnum {
  GET = 'GET',
  POST = 'POST',
  PATCH = 'PATCH',
  DELETE = 'DELETE',
  PUT = 'PUT',
}

export enum LogLevelEnum {
  LOG = 'log',
  WARN = 'warn',
  ERROR = 'error',
  VERBOSE = 'verbose',
  DEBUG = 'debug',
}

export enum LogsSortEnum {
  createdAt_ASC = 'createdAt_ASC',
  createdAt_DESC = 'createdAt_DESC',
  id_ASC = 'id_ASC',
  id_DESC = 'id_DESC',
}

export class FindLogsFilter {
  @ApiProperty({
    title: 'Take',
    description: 'Limits returned logs',
    type: Number,
    minimum: 10,
    default: 10,
    nullable: true,
    example: '10, 20, 50, 100',
    required: false,
  })
  @IsNumber()
  @IsOptional()
  @IsPositive()
  @Transform(({ value }) => parseInt(value))
  take: number;

  @ApiProperty({
    title: 'Page',
    description: 'Returning next part of logs',
    type: Number,
    minimum: 1,
    default: 1,
    nullable: true,
    example: '1, 2, 3, 4...',
    required: false,
  })
  @IsNumber()
  @IsOptional()
  @IsPositive()
  @Transform(({ value }) => parseInt(value))
  page: number;

  @ApiProperty({
    title: 'Filter by HTTP methods',
    description: 'Filtering logs by methods, [POST, GET, PUT, DELETE]',
    type: LogMethodEnum,
    nullable: true,
    example: 'POST',
    enum: LogMethodEnum,
    enumName: 'HTTP methods',
    required: false,
  })
  @IsOptional()
  @IsEnum(LogMethodEnum)
  method: LogMethodEnum;

  @ApiProperty({
    title: 'Filter by Log levels',
    description: 'Filtering by logs levels, [log, error, verbose, debug, warn]',
    type: LogLevelEnum,
    nullable: true,
    example: 'log',
    enum: LogLevelEnum,
    enumName: 'Log levels',
    required: false,
  })
  @IsOptional()
  @IsEnum(LogLevelEnum)
  level: LogLevelEnum;

  // @IsOptional()
  // @IsNumber()
  // status: LogStatusEnum;

  @ApiProperty({
    title: 'Sort logs',
    description: 'Sort by logs levels [createdAt, id]',
    type: LogsSortEnum,
    nullable: true,
    example: 'id',
    enum: LogsSortEnum,
    enumName: 'Log sort',
    required: false,
  })
  @IsOptional()
  @IsEnum(LogsSortEnum)
  sort: LogsSortEnum;
}
