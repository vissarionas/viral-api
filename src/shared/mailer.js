const config = require('config').mailer;
const sgMail = require('@sendgrid/mail');
const { generateToken } = require('../shared/token');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendVerificationEmail = ({ _id, email }) => {
  const payload = { id: _id, email };
  const verificationToken = generateToken(payload, process.env.JWT_TEMP_DURATION);
  const msg = {
    to: email,
    from: config.get('verification.sender'),
    subject: config.get('verification.subject'),
    text: `${config.get('verification.endpoint') + verificationToken}`,
  };
  sgMail.send(msg);
  // Notify user that the verification mail is on it's way
};

module.exports = {
  sendVerificationEmail
};
