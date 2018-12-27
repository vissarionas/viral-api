const register = require('./register');
const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const createAndSendVerificationEmail = (req, res, email, token) => {
  const msg = {
    to: email,
    from: 'vissarion@viralapp.com',
    subject: 'Email verification ;)',
    text: `http://127.0.0.1:3000/verify?token=${token}`,
  };
  sgMail.send(msg);
};

module.exports = {
  createAndSendVerificationEmail
};