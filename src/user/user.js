/* eslint-disable consistent-return */
const config = require('config').mongo;
const getCollection = require('../shared/collectionClient');

const User = {};

(async () => {
  this.collection = await getCollection(config.get('collections.users'));
})();

/**
 * Return user objects
 * @param {Object} params
 * @return {Array} users
 */
User.get = async (params) => {
  try {
    const usersCursor = await this.collection.find(params);
    // iterate instead of transforming to array
    const users = await usersCursor.toArray();
    // eslint-disable-next-line no-throw-literal
    if (!users.length) throw { status: 404, message: 'no users found' };
    return users;
  } catch (err) {
    return Promise.reject(err);
  }
};

User.getById = async (id) => {
  try {
    return await this.collection.findOne({ _id: id });
  } catch (err) {
    return Promise.reject(err);
  }
};

User.getByEmail = async (email) => {
  try {
    const user = await this.collection.findOne({ email });
    if (!user) throw new Error('user does not exist');
    return user;
  } catch (err) {
    return Promise.reject(err);
  }
};

User.getByFacebookId = async (facebookId) => {
  try {
    const user = await this.collection.findOne({ facebookId });
    if (!user) throw new Error('user does not exist');
    return user;
  } catch (err) {
    return Promise.reject(err);
  }
};

User.save = async (userObject) => {
  try {
    await this.collection.insertOne(userObject);
    return userObject;
  } catch (err) {
    return Promise.reject(err);
  }
};

User.update = async (docIdentifier, property, value) => {
  try {
    this.collection.updateOne({ docIdentifier }, { $set: { [property]: value } });
  } catch (err) {
    return Promise.reject(err);
  }
};

User.isFacebookUser = userObject => userObject.facebookId;

module.exports = User;
