const config = require('config').mailer;
const sgMail = require('@sendgrid/mail');
const { generateToken } = require('../shared/token');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendVerificationEmail = (user) => {
  const payload = { id: user._id, email: user.email };
  const tempAccessToken = generateToken(payload, process.env.JWT_TEMP_DURATION);
  const msg = {
    to: user.email,
    from: config.get('verification.sender'),
    subject: config.get('verification.subject'),
    text: `${config.get('verification.endpoint') + tempAccessToken}`,
  };
  sgMail.send(msg);
  // Notify user that the verification mail is on it's way
};

module.exports = {
  sendVerificationEmail
};
