import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

const nodemailer = require('nodemailer');

// let transporter = nodemailer.createTransport({
//   host: 'smtp.server.com', // <= your smtp server here
//   port: 2525, // <= connection port
//   // secure: true, // use SSL or not
//   auth: {
//     user: 'userId', // <= smtp login user
//     pass: 'E73oiuoiC34lkjlkjlkjlkjA6Bok7DAD' // <= smtp login pass
//   }
// });

// let mailOptions = {
//   from: 'comantivirus250@gmail.com', // <= should be verified and accepted by service provider. ex. 'youremail@gmail.com'
//   to: 'greenmg0102@proton.me', // <= recepient email address. ex. 'friendemail@gmail.com'
//   subject: 'Test email', // <= email subject ex. 'Test email'
//   text: "Plaintext version of the message",
//   html: "<p>HTML version of the message</p>",


//   // from: 'Nodemailer <example@nodemailer.com>',
//   // to: 'Nodemailer <example@nodemailer.com>',
//   // subject: 'AMP4EMAIL message',
//   // text: 'For clients with plaintext support only',
//   // html: '<p>For clients that do not support AMP4EMAIL or amp content is not valid</p>',
//   // amp: `<!doctype html>
//   //   <html ⚡4email>
//   //     <head>
//   //       <meta charset="utf-8">
//   //       <style amp4email-boilerplate>body{visibility:hidden}</style>
//   //       <script async src="https://cdn.ampproject.org/v0.js"></script>
//   //       <script async custom-element="amp-anim" src="https://cdn.ampproject.org/v0/amp-anim-0.1.js"></script>
//   //     </head>
//   //     <body>
//   //       <p>Image: <amp-img src="https://cldup.com/P0b1bUmEet.png" width="16" height="16"/></p>
//   //       <p>GIF (requires "amp-anim" script in header):<br/>
//   //         <amp-anim src="https://cldup.com/D72zpdwI-i.gif" width="500" height="350"/></p>
//   //     </body>
//   //   </html>`

// };

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'UncappedTheory@gmail.com',
    pass: 'mqza rxgl tnur yuwj'
  }
});

// Define mail options
var mailOptions = {
  from: 'UncappedTheory@gmail.com',
  to: 'thesethreebowles@gmail.com',
  subject: 'Sending Email using uncappedtheory company',
  text: 'Hi, Galen, am a developer of uncappedtheory company, what is your misunderstanding in your poker, i can teach you, lol!'
};

@Injectable()
export class EmailService {
  constructor(private readonly mailerService: MailerService) { }

  sendEmail(to: string, subject: string, template: string, context: any) {

    console.log("sendEmail 11");

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log('error', error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });

    // this.mailerService
    //   .sendMail({
    //     to: 'comanti250@gmail.com', // list of receivers
    //     from: 'noreply@nestjs.com', // sender address
    //     subject: 'Testing Nest MailerModule ✔', // Subject line
    //     text: 'welcome', // plaintext body
    //     html: '<b>welcome</b>', // HTML body content
    //   })
    //   .then(() => console.log("sendEmail 22"))
    //   .catch((err) => console.log("sendEmail 33", err));

  }
}
