import { Body, Controller, Post } from '@nestjs/common';
import { MailsService } from './mails.service';
import { CreateMailDto } from './dto/createMail.dto';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('mails')
@Controller('mails')
export class MailsController {
  constructor(private readonly mailsService: MailsService) {}

  @ApiResponse({ description: 'Mail sended successfully!' })
  @ApiBody({ type: CreateMailDto, description: 'Mail sended successfully!' })
  @Post()
  sendMail(@Body() dto: CreateMailDto) {
    return this.mailsService.sendMail(dto);
  }
}
