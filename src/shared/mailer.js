const config = require('config').mailer;
const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendVerificationEmail = (email, tempToken) => {
  const msg = {
    to: email,
    from: config.get('verification.sender'),
    subject: config.get('verification.subject'),
    text: `${config.get('verification.endpoint') + tempToken}`,
  };
  sgMail.send(msg);
  // Notify user that the verification mail is on it's way
};

module.exports = {
  sendVerificationEmail
};
