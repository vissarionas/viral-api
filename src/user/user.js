/* eslint-disable consistent-return */
const getCollection = require('../shared/dbCollection');

let collection;

class User {
  static async setCollection() {
    const something = await getCollection('users');
    console.log(something);
  }

  static async getById(id) {
    try {
      await collection.findOne({ _id: id });
    } catch (err) {
      return Promise.reject(err);
    }
  }

  static async getByEmail(email) {
    try {
      const user = await collection.findOne({ email });
      if (!user) throw new Error('user does not exist');
      return user;
    } catch (err) {
      return Promise.reject(err);
    }
  }

  static async getByFacebookId(facebookId) {
    try {
      await collection.findOne({ facebookId });
    } catch (err) {
      return Promise.reject(err);
    }
  }

  static async save(userObject) {
    try {
      await collection.insertOne(userObject);
      return userObject;
    } catch (err) {
      return Promise.reject(err);
    }
  }

  static isFacebookUser(userObject) { return userObject.facebookId; }
}

module.exports = User;
