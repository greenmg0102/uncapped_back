import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

const nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'UncappedTheory@gmail.com',
    pass: 'mqza rxgl tnur yuwj'
  }
});

@Injectable()
export class EmailService {
  constructor(private readonly mailerService: MailerService) { }

  sendEmail(real: any) {

    transporter.sendMail(real, function (error: any, info: any) {
      if (error) {
        console.log('error', error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });

  }
}
