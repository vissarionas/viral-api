/* eslint-disable consistent-return */
const config = require('config').mongo;
const dbName = config.get('database');
const collectionName = config.get('collections.users');
const mongoClient = require('../dbClient');

const db = mongoClient.db(dbName);
const userCollection = db.collection(collectionName);

class User {
  static async getById(id) {
    try {
      await userCollection.findOne({ _id: id });
    } catch (err) {
      return Promise.reject(err);
    }
  }

  static async getByEmail(email) {
    try {
      await userCollection.findOne({ email });
    } catch (err) {
      return Promise.reject(err);
    }
  }

  static async getByFacebookId(facebookId) {
    try {
      await userCollection.findOne({ facebookId });
    } catch (err) {
      return Promise.reject(err);
    }
  }

  static async save(userObject) {
    try {
      await userCollection.insertOne(userObject);
    } catch (err) {
      return Promise.reject(err);
    }
  }

  static isFacebookUser(userObject) {
    return userObject.facebookId;
  }
}

module.export = User;
