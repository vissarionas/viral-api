const config = require('config').mailer;
const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const createAndSendVerificationEmail = (req, res, token) => {
  const msg = {
    to: req.user.email,
    from: config.get('verification.sender'),
    subject: config.get('verification.subject'),
    text: `${config.get('verification.endpoint')+token}`,
  };
  sgMail.send(msg);
  // Notify user that the verification mail is on it's way
  res.send(`Verification email sent to ${req.user.email}`);
};

module.exports = {
  createAndSendVerificationEmail
};