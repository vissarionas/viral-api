const config = require('config').mailer;
const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const createAndSendVerificationEmail = (req, res, email, token) => {
  const msg = {
    to: email,
    from: config.get('verification.sender'),
    subject: config.get('verification.subject'),
    text: `${config.get('verification.endpoint')+token}`,
  };
  sgMail.send(msg);
  // Notify user that the verification mail is on it's way
  res.send(`Verification email sent to ${email}`);
};

module.exports = {
  createAndSendVerificationEmail
};