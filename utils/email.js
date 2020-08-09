const nodemailer = require('nodemailer');
const pug = require('pug');
const htmlToText = require('html-to-text');
// var SibApiV3Sdk = require('sib-api-v3-sdk');
// var defaultClient = SibApiV3Sdk.ApiClient.instance;

// new Email(user , url).sendWelcome();    this format is best just like appError this will take care of rest of the stuff

module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.name.split(' ')[0];
    this.url = url;
    this.form = `Shammi Kumar <${process.env.EMAIL_FROM}>`;
  }

  newTransport() {
    //   THIS FEATURE IS NOT WORKING BECAUSE SENDGRID IS NOT WORKING
    if (process.env.NODE_ENV === 'production') {
      return 1;
    }
    // if (process.env.NODE_ENV === 'production') {
    //   // Sendgrid
    //   return nodemailer.createTransport({
    //     service: 'SendGrid',
    //     auth: {
    //       user: process.env.SENDGRID_USERNAME,
    //       pass: process.env.SENDGRID_PASSWORD
    //     }
    //   });
    // }

    // THIS IS NOT WORKING BECAUSE SENDINBLUE IS NOT WORKING FOR NOW EITHER
    // if (process.env.NODE_ENV === 'production') {
    //   return nodemailer.createTransport({
    //     host: process.env.EMAIL_PROD_HOST,
    //     port: process.env.EMAIL_PROD_PORT,
    //     secure: false,
    //     auth: {
    //       user: process.env.EMAIL_PROD_FROM,
    //       pass: process.env.EMAIL_PROD_MASTER_PASSWORD,
    //     },
    //   });
    // }

    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  async send(template, subject) {
    // here we will send the actual email when in production

    // 1) Render HTML based on pug template
    const html = pug.renderFile(`${__dirname}/../views/email/${template}.pug`, {
      firstName: this.firstName,
      url: this.url,
      subject,
    });

    // 2) Define the email options
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: htmlToText.fromString(html),
    };

    // 3) create a transport and send email
    await this.newTransport().sendMail(mailOptions);
  }
  async sendWelcome() {
    await this.send('welcome', 'Welcome to the TRIPPER Family');
  }

  async sendPasswordReset() {
    await this.send(
      'passwordReset',
      'Your password reset token (Valid for only 10 minutes)'
    );
  }
};

// Configure API key authorization: api-key
// var apiKey = defaultClient.authentications['api-key'];
// apiKey.apiKey =
//   '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';

//   var apiInstance = new SibApiV3Sdk.ContactsApi();

// var createContact = new SibApiV3Sdk.CreateContact(); // CreateContact | Values to create a contact
// createContact = { 'email' : "john@doe.com" };

// apiInstance.createContact(createContact).then(function(data) {
//   console.log('API called successfully. Returned data: ' + data);
// }, function(error) {
//   console.error(error);
// });

// const sendEmail = async (options) => {
// // 1) Create a transporter
// const transporter = nodemailer.createTransport({
//   host: process.env.EMAIL_HOST,
//   port: process.env.EMAIL_PORT,
//   auth: {
//     user: process.env.EMAIL_USERNAME,
//     pass: process.env.EMAIL_PASSWORD,
//   },
// });

// // 2) Define the email options
// const mailOptions = {
//   from: 'Shammi Kumar <kumarshammi357@gmail.com>',
//   to: options.email,
//   subject: options.subject,
//   text: options.message,
//   // html:
// };

//   // 3) Actually send the email
//   await transporter.sendMail(mailOptions);
// };

// module.exports = sendEmail;
