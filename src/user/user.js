/* eslint-disable consistent-return */
const config = require('config').mongo;
const dbClient = require('../shared/dbClient');

const User = {};

(async () => {
  this.collection = await dbClient(config.get('collections.users'));
})();

/**
 * @param {Object} params
 * @return {Promise}
 */
User.get = params => this.collection.findOne(params);

User.create = params => this.collection.insertOne(params);

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
