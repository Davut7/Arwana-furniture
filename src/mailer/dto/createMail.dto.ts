import {
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from 'class-validator';

export class CreateMailDto {
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  lastName: string;

  @IsNotEmpty()
  @IsString()
  @IsPhoneNumber('TM')
  phoneNumber: string;

  @IsOptional()
  @IsString()
  email: string;

  @IsOptional()
  @IsString()
  message: string;
}
