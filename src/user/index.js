/* eslint-disable consistent-return */
const bcrypt = require('bcryptjs');
const uniqid = require('uniqid');
const User = require('./user');
const token = require('../token');

User.setCollection();

const userObjectConstructor = (email, password) => ({
  _id: uniqid(),
  username: email.split('@')[0],
  email,
  password: bcrypt.hashSync(password, 10),
  provider: '',
  facebookId: '',
  verified: false
});

const sendVerificationEmail = async (user) => {
  const payload = { id: user._id, email: user.email };
  const tempToken = token.generateTemp(payload);
  try {
    // send verification email
    console.log(tempToken);
  } catch (err) {
    return Promise.reject(err);
  }
};

const create = async (req, res) => {
  const { email, password } = req.body;
  try {
    await User.getByEmail(email, password);
    res.status(409).send({ message: 'user exists' });
  } catch (err) {
    // user does not exist. Create user!
    const user = await User.save(userObjectConstructor(email, password));
    await sendVerificationEmail(user);
  }
};

module.exports = {
  create,
};
