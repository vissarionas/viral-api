require('../src/passport-strategies');

const express = require('express');
const passport = require('passport');
const bcrypt = require('bcryptjs');
const uniqid = require('uniqid');
const usersRouter = express.Router();
const { sendVerificationEmail } = require('../src/shared/mailer');
const { generateToken } = require('../src/shared/token');
const User = require('../src/user');

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


usersRouter.post('/register', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.get({ email });
    res.status(200).send({ message: 'user already exists', user });
  } catch (error) {
    const newUser = await User.create(createUserDocument(email, password));
    const payload = { id: newUser._id, email: newUser.email };
    const accessToken = generateToken(payload, process.env.JWT_DURATION);
    res.status(201).send({ accessToken });
    sendVerificationEmail(newUser);
  }
});

usersRouter.post('/auth/facebook', passport.authenticate('facebook-token', { session: false }), async (req, res) => {
  const profile = req.user;
  try {
    const user = await User.get({ facebookId: profile.id });
    const payload = { id: user._id, email: user.email, facebookid: user.facebookId };
    const accessToken = generateToken(payload, process.env.JWT_DURATION);
    res.send({ accessToken });
  } catch (error) {
    const newUser = await User.create(createFacebookUserDocument(profile));
    const payload = { id: newUser._id, email: newUser.email, facebookid: newUser.facebookId };
    const accessToken = generateToken(payload, process.env.JWT_DURATION);
    res.status(201).send({ accessToken });
  }
});

usersRouter.get('/verify', passport.authenticate('jwt', { session: false }), async (req, res) => {
  const { email } = req.user;
  try {
    await User.update({ email }, { verified: true });
    res.status(200).send({ message: 'verified' });
  } catch (error) {
    res.status(304).send();
  }
});

usersRouter.post('/login', passport.authenticate('local', { session: false }), (req, res) => {
  if (!req.user.verified) {
    // Send verification email
  }
  const payload = { id: req.user._id, email: req.user.email };
  const accessToken = generateToken(payload, process.env.JWT_DURATION);
  res.status(200).send({ accessToken });
});

usersRouter.post('/delete', passport.authenticate('jwt', { session: false }), async (req, res) => {
  const { email } = req.body;
  try {
    await User.delete({ email });
    res.status(200).send({ message: 'deleted' });
  } catch (error) {
    res.status(404).send({ message: error.message });
  }
});

module.exports = usersRouter;
