const bcrypt = require('bcryptjs');
const uniqid = require('uniqid');
const User = require('./user');
const { sendVerificationEmail } = require('../shared/mailer');
const { generateToken } = require('../shared/token');

const createUserDocument = (email, password) => ({
  _id: uniqid(),
  username: email.split('@')[0],
  email,
  password: bcrypt.hashSync(password, 10),
  provider: '',
  facebookId: '',
  verified: false
});

const createFacebookUserDocument = profile => ({
  _id: uniqid(),
  username: profile.name.givenName + profile.name.familyName,
  email: profile.emails[0].value,
  password: '',
  provider: 'facebook',
  facebookId: profile.id,
  verified: true
});

const updateUserAsVerified = async (req, res) => {
  const { email } = req.user;
  try {
    await User.update(email, 'verified', true);
    res.status(200).send({ message: 'user verified' });
    // redirect user to the verification success page
  } catch ({ message }) {
    res.status(304).send({ message });
  }
};

const deleteUser = async (req, res) => {
  const { email } = req.body;
  try {
    await User.delete({ email });
    res.status(200).send({ message: 'user deleted' });
  } catch ({ message }) {
    res.status(404).send({ message });
  }
};

const registerEmailUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    await User.get({ email });
    res.status(409).send({ message: 'user exists' });
  } catch (err) {
    const newUser = await User.create(createUserDocument(email, password));
    const payload = { id: newUser._id, email: newUser.email, facebookid: newUser.facebookId };
    const accessToken = generateToken(payload, process.env.JWT_DURATION);
    res.status(201).send({ accessToken });
    sendVerificationEmail(newUser);
  }
};

const registerFacebookUser = async (req, res) => {
  const profile = req.user;
  try {
    const user = await User.get({ facebookId: profile.id });
    const payload = { id: user._id, email: user.email, facebookid: user.facebookId };
    const accessToken = generateToken(payload, process.env.JWT_DURATION);
    res.send(accessToken);
  } catch (err) {
    const newUser = await User.create(createFacebookUserDocument(profile));
    const payload = { id: newUser._id, email: newUser.email, facebookid: newUser.facebookId };
    const accessToken = generateToken(payload, process.env.JWT_DURATION);
    res.send(accessToken);
  }
};

module.exports = {
  registerEmailUser,
  registerFacebookUser,
  updateUserAsVerified,
  deleteUser,
};
