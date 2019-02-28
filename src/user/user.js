/* eslint-disable consistent-return */
const config = require('config').mongo;
const getClient = require('../shared/database');

class User {
  constructor() {
    (async () => {
      this.collection = await getClient(config.get('collections.users'));
    })();
  }

  async getById(id) {
    try {
      await this.collection.findOne({ _id: id });
    } catch (err) {
      return Promise.reject(err);
    }
  }

  async getByEmail(email) {
    try {
      const user = await this.collection.findOne({ email });
      if (!user) throw new Error('user does not exist');
      return user;
    } catch (err) {
      return Promise.reject(err);
    }
  }

  async getByFacebookId(facebookId) {
    try {
      const user = await this.collection.findOne({ facebookId });
      if (!user) throw new Error('user does not exist');
      return user;
    } catch (err) {
      return Promise.reject(err);
    }
  }

  async save(userObject) {
    try {
      await this.collection.insertOne(userObject);
      return userObject;
    } catch (err) {
      return Promise.reject(err);
    }
  }

  async update(docIdentifier, property, value) {
    try {
      this.collection.updateOne({ docIdentifier }, { $set: { [property]: value } });
    } catch (err) {
      return Promise.reject(err);
    }
  }

  isFacebookUser(userObject){
    return userObject.facebookId;
  }
}

module.exports = User;
