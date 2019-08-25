const bcrypt = require('bcryptjs');
const uniqid = require('uniqid');
const { sendVerificationEmail } = require('./shared/mailer');
const { generateToken } = require('./shared/token');

const DbAdapter = require('./shared/dbAdapter');
const usersDb = new DbAdapter('users');
usersDb.connect();

const getUser = async (filter) => {
  try {
    return await usersDb.get(filter);
  } catch (err) {
    return err;
  }
};

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
    await usersDb.update(email, 'verified', true);
    res.status(200).send({ message: 'user verified' });
    // redirect user to the verification success page
  } catch ({ message }) {
    res.status(304).send({ message });
  }
};

const deleteUser = async (req, res) => {
  const { email } = req.body;
  try {
    await usersDb.delete({ email });
    res.status(200).send({ message: 'user deleted' });
  } catch ({ message }) {
    res.status(404).send({ message });
  }
};

const registerEmailUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    await usersDb.get({ email });
    res.status(409).send({ message: 'user exists' });
  } catch (err) {
    const newUser = await usersDb.create(createUserDocument(email, password));
    const payload = { id: newUser._id, email: newUser.email, facebookid: newUser.facebookId };
    const accessToken = generateToken(payload, process.env.JWT_DURATION);
    res.status(201).send({ accessToken });
    sendVerificationEmail(newUser);
  }
};

const registerFacebookUser = async (req, res) => {
  const profile = req.user;
  try {
    const user = await usersDb.get({ facebookId: profile.id });
    const payload = { id: user._id, email: user.email, facebookid: user.facebookId };
    const accessToken = generateToken(payload, process.env.JWT_DURATION);
    res.send(accessToken);
  } catch (err) {
    const newUser = await usersDb.create(createFacebookUserDocument(profile));
    const payload = { id: newUser._id, email: newUser.email, facebookid: newUser.facebookId };
    const accessToken = generateToken(payload, process.env.JWT_DURATION);
    res.send(accessToken);
  }
};

const logUserIn = (req, res) => {
  const payload = { id: req.user._id, email: req.user.email };
  const accessToken = generateToken(payload, process.env.JWT_DURATION);
  res.status(200).send({ accessToken });
  if (!req.user.verified) {
    // Send verification email
  }
};

module.exports = {
  getUser,
  registerEmailUser,
  registerFacebookUser,
  updateUserAsVerified,
  deleteUser,
  logUserIn,
};
