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
          from: 'uncappedtheory@gmail.com',
          to: body.mail,
          subject: 'Support Ticket From UncappedTheory.com',
          text: `Your ticket number is ${result._id}. There will be answer soon from the supprt team!`,
          html: '<p>For clients that do not support AMP4EMAIL or amp content is not valid</p>',
          amp: `<!doctype html>
                <html ⚡4email>
                  <head>
                    <meta charset="utf-8">
                    <style amp4email-boilerplate>body{visibility:hidden}</style>
                    <script async src="https://cdn.ampproject.org/v0.js"></script>
                    <script async custom-element="amp-anim" src="https://cdn.ampproject.org/v0/amp-anim-0.1.js"></script>
                  </head>
                  <body>
                    <p>Image: <amp-img src="https://cldup.com/P0b1bUmEet.png" width="16" height="16"/></p>
                    <p>GIF (requires "amp-anim" script in header):<br/>
                      <amp-anim src="https://cldup.com/D72zpdwI-i.gif" width="500" height="350"/></p>
                  </body>
                 </html>`
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
