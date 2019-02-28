/* eslint-disable consistent-return */
const config = require('config').mongo;
const getCollection = require('../shared/collectionClient');

const User = {};

(async () => {
  this.collection = await getCollection(config.get('collections.users'));
})();

User.getById = async (id) => {
  try {
    await this.collection.findOne({ _id: id });
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
