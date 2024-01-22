import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { CreateMailDto } from './dto/createMail.dto';

@Injectable()
export class MailsService {
  constructor(private readonly mailerService: MailerService) {}

  async sendMail(dto: CreateMailDto) {
    await this.mailerService.sendMail({
      to: process.env.SMTP_USER,
      from: dto.email,
      subject: 'Request information',
      html: `hi there`,
    });

    return { message: 'Mail send successfully!' };
  }
}
