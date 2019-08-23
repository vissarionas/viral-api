/* eslint-disable consistent-return */
const bcrypt = require('bcryptjs');
const uniqid = require('uniqid');
const User = require('./user');
const { sendVerificationEmail } = require('../shared/mailer');
const { generateToken } = require('../shared/token');

const userObjectConstructor = (email, password) => ({
  _id: uniqid(),
  username: email.split('@')[0],
  email,
  password: bcrypt.hashSync(password, 10),
  provider: '',
  facebookId: '',
  verified: false
});

const facebookUserObjectConstructor = profile => ({
  _id: uniqid(),
  username: profile.name.givenName + profile.name.familyName,
  email: profile.emails[0].value,
  password: '',
  provider: 'facebook',
  facebookId: profile.id,
  verified: true
});

const verify = async (req, res) => {
  const { email } = req.user;
  try {
    await User.update(email, 'verified', true);
    // redirect user to the verification success page
  } catch (err) {
    console.log(err);
  }
};

const deleteUser = async (req, res) => {
  const { email } = req.body;
  try {
    await User.delete({ email });
    res.status(200).send({ message: 'user deleted' });
  } catch (err) {
    console.log(err);
  }
};

const createEmailUser = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.get({ email });
  if (user) {
    res.status(409).send({ message: 'user exists' });
  } else {
    // user does not exist. Create user!
    const newUser = await User.create(userObjectConstructor(email, password));
    const payload = { id: newUser._id, email: newUser.email, facebookid: newUser.facebookId };
    const accessToken = generateToken(payload, process.env.JWT_DURATION);
    res.send(accessToken);
    // sendVerificationEmail(newUser);
  }
};

const createOrUpdateFacebookUser = async (req, res) => {
  const profile = req.user;
  try {
    const user = await User.get({ facebookId: profile.id });
    const payload = { id: user._id, email: user.email, facebookid: user.facebookId };
    const accessToken = generateToken(payload, process.env.JWT_DURATION);
    res.send(accessToken);
  } catch (err) {
    // user does not exist. Create user!
    const user = await User.save(facebookUserObjectConstructor(profile));
    const payload = { id: user._id, email: user.email, facebookid: user.facebookId };
    const accessToken = generateToken(payload, process.env.JWT_DURATION);
    res.send(accessToken);
  }
};

module.exports = {
  createEmailUser,
  createOrUpdateFacebookUser,
  verify,
  deleteUser,
};
