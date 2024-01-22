import { Module } from '@nestjs/common';
import { MailsService } from './mails.service';
import { MailsController } from './mails.controller';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com',
        auth: {
          user: '20031212dawut@gmail.com',
          pass: 'ejxn kxuc cqbp rulj',
        },
      },
    }),
  ],
  controllers: [MailsController],
  providers: [MailsService],
})
export class MailsModule {}
