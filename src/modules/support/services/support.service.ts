import { Support } from 'src/modules/support/schema/support.schema';
import { Model, Schema as MongooseSchema } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { EmailService } from './EmailServer.service';

export class SupportService {
  constructor(
    @InjectModel(Support.name) private readonly supportModel: Model<Support>,
    private readonly emailService: EmailService
  ) { }

  async post(body: any) {

    console.log('body', body);

    let real: any = {}

    real.fullName = body.fullName
    real.mail = body.mail
    real.phone = body.phone
    real.type = body.type
    real.subject = body.subject
    real.checked = false
    real.question = [{
      query: body.content,
      who: false,
      supportedDate: new Date().toISOString().replace('T', ' ').replace(/\..+/, '')
    }]

    let newSupportModel = new this.supportModel(real)

    return await newSupportModel
      .save()
      .then((result: any) => {

        var mailOptions = {
          from: 'UncappedTheory@gmail.com',
          to: body.mail,
          subject: 'Support Ticket From UncappedTheory.com',
          html: `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
            </head>
            <body>
              <p>Image: <img src="https://cldup.com/P0b1bUmEet.png" width="16" height="16"/></p>
              <p>GIF: <img src="https://cldup.com/D72zpdwI-i.gif" width="500" height="350"/></p>
              <p>Your ticket number is ${result._id}. There will be an answer soon from the support team!</p>
            </body>
          </html>
                 `
        };

        this.emailService.sendEmail(mailOptions)

        return { isOk: true }
      })
      .catch((err: any) => {
        return { isOk: false }
      })
  }

  async sendEmail(mail: any, ticketId: any) {

    var mailOptions = {
      from: 'uncappedtheory@gmail.com',
      to: mail,
      subject: 'Support Ticket From UncappedTheory.com',
      text: `Your ticket number is ${ticketId}. will answer soon from the supprt team!`,
      template: 'FAQ',
      context: { name: 'John Doe' }
    };

    this.emailService.sendEmail(mailOptions);


    var mailOptions = {
      from: 'uncappedtheory@gmail.com',
      to: mail,
      subject: 'Support Ticket From UncappedTheory.com',
      text: `Your ticket number is ${ticketId}. will answer soon from the supprt team!`,
      template: 'FAQ',
      context: { name: 'John Doe' }
    };

    this.emailService.sendEmail(mailOptions)

    return 'Email sent successfully';
  }


  async verifyMail(body: any) {

  }
}
