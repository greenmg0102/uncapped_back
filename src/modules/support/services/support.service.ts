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

    this.sendEmail()
    return { isOk: true }


    // console.log("post", body);

    // let real: any = {}

    // real.fullName = body.fullName
    // real.mail = body.mail
    // real.phone = body.phone
    // real.type = body.type
    // real.subject = body.subject
    // real.checked = false
    // real.question = [{
    //   query: body.content,
    //   who: false,
    //   supportedDate: new Date().toISOString().replace('T', ' ').replace(/\..+/, '')
    // }]

    // let newSupportModel = new this.supportModel(real)

    // return await newSupportModel
    //   .save()
    //   .then((result: any) => {
    //     // this.sendEmail()
    //     return { isOk: true }
    //   })
    //   .catch((err: any) => {
    //     return { isOk: false }
    //   })
  }

  async sendEmail() {
    const to = 'comantivirus250@gmail.com';
    const subject = 'Test Email';
    const template = 'welcome';
    const context = { name: 'John Doe' };

    this.emailService.sendEmail(to, subject, template, context);

    return 'Email sent successfully';
  }


  async verifyMail(body: any) {

  }
}
