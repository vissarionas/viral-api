const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const createAndSendVerificationEmail = (req, res, email) => {
  const msg = {
    to: email,
    from: 'vissarion@viralapp.com',
    subject: 'Email verification ;)',
    text: 'Please, bla bla bla',
    html: '<strong>Please, bla bla bla</strong>',
  };
  sgMail.send(msg);
};

module.exports = {
  createAndSendVerificationEmail
};