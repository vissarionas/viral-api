/* eslint-disable consistent-return */
const config = require('config').mongo;
const getClient = require('../shared/database');

class User {
  static async getClient() {
    this.collection = await getClient(config.get('collections.users'));
  }

  static async getById(id) {
    try {
      await this.collection.findOne({ _id: id });
    } catch (err) {
      return Promise.reject(err);
    }
  }

  static async getByEmail(email) {
    try {
      const user = await this.collection.findOne({ email });
      if (!user) throw new Error('user does not exist');
      return user;
    } catch (err) {
      return Promise.reject(err);
    }
  }

  static async getByFacebookId(facebookId) {
    try {
      const user = await this.collection.findOne({ facebookId });
      if (!user) throw new Error('user does not exist');
      return user;
    } catch (err) {
      return Promise.reject(err);
    }
  }

  static async save(userObject) {
    try {
      await this.collection.insertOne(userObject);
      return userObject;
    } catch (err) {
      return Promise.reject(err);
    }
  }

  static isFacebookUser(userObject) { return userObject.facebookId; }
}

module.exports = User;
