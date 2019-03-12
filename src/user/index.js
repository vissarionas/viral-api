/* eslint-disable consistent-return */
const bcrypt = require('bcryptjs');
const uniqid = require('uniqid');
const User = require('./user');
const Utils = require('../shared/utils');
const { sendVerificationEmail } = require('../shared/mailer');
const { generateToken } = require('../shared/token');

const USER_SEARCH_FIELDS = ['_id', 'email', 'verified'];

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

const getUsers = async (req, res) => {
  const query = {};
  USER_SEARCH_FIELDS.forEach((field) => {
    let value = req.headers[field];
    if (field === 'verified') value = Utils.stringToBoolean(value);
    if (value !== undefined) query[field] = value;
  });
  try {
    const user = await User.get(query);
    res.status(200).send(user);
  } catch (err) {
    res.status(err.status).send(err.message);
    return Promise.reject(err);
  }
};

const createEmailUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    await User.get(email);
    res.status(409).send({ message: 'user exists' });
  } catch (err) {
    // user does not exist. Create user!
    const user = await User.save(userObjectConstructor(email, password));
    const payload = { id: user._id, email: user.email, facebookid: user.facebookId };
    const accessToken = generateToken(payload, process.env.JWT_DURATION);
    res.send(accessToken);
    sendVerificationEmail(user);
  }
};

const createOrUpdateFacebookUser = async (req, res) => {
  const profile = req.user;
  try {
    const user = await User.getByFacebookId(profile.id);
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
  getUsers,
  createEmailUser,
  createOrUpdateFacebookUser,
  verify,
};
