const nodemailer = require('nodemailer');
const pug = require('pug');
const sgMail = require('@sendgrid/mail');
const htmlToText = require('html-to-text');

module.exports = class Email {
  constructor(user, url) {
    this.url = url;
    this.firstName = user.name.split(' ')[0];
    this.to = user.email;
    this.from = 'zahedulshifat15@gmail.com';
  }

  newTransport() {
    if (process.env.NODE_ENV === 'production') {
      return 1;
    }

    //1) Create a transporter
    return nodemailer.createTransport({
      host: 'smtp.mailtrap.io',
      port: 2525,
      auth: {
        user: '006de43dd05c21',
        pass: 'a40d3716cd9192',
      },
    });
  }

  async send(template, subject) {
    // render HTML based on a pug template
    const html = pug.renderFile(`${__dirname}/../views/email/${template}.pug`, {
      firstName: this.firstName,
      url: this.url,
      subject,
    });
    // create the mail options
    const mailOptions = {
      from: this.form,
      to: this.to,
      subject,
      html,
      text: htmlToText.convert(html),
    };

    await this.newTransport().sendMail(mailOptions);
  }
  async sendProd(template, subject) {
    try {
      sgMail.setApiKey(process.env.SENDGRID_APIKEY);
      // render HTML based on a pug template
      const html = pug.renderFile(
        `${__dirname}/../views/email/${template}.pug`,
        {
          firstName: this.firstName,
          url: this.url,
          subject,
        }
      );
      // create the mail options
      const mailOptions = {
        from: this.from,
        to: this.to,
        subject,
        html,
        text: htmlToText.convert(html),
      };

      await sgMail.send(mailOptions);
    } catch (error) {
      console.log(error.message);
    }
  }

  async sendWelcome() {
    if (process.env.NODE_ENV === 'production') {
      return await this.sendProd('welcome', 'welcome to natours family');
    }
    await this.send('welcome', 'welcome to the natours family');
  }
  async sendPasswordReset() {
    await this.send(
      'passwordReset',
      'Your password reset token (valid for 10 minutes)'
    );
  }
};
