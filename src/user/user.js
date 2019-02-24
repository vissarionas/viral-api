/* eslint-disable consistent-return */
const config = require('config').mongo;
const dbName = config.get('database');
const collectionName = config.get('collections.users');
const mongoClient = require('../dbClient');

class User {
  static async getById(id) {
    const db = mongoClient.db(dbName);
    const userCollection = db.collection(collectionName);
    try {
      await userCollection.findOne({ _id: id });
    } catch (err) {
      return Promise.reject(err);
    }
  }

  static async getByEmail(email) {
    const db = mongoClient.db(dbName);
    const userCollection = db.collection(collectionName);
    try {
      const user = await userCollection.findOne({ email });
      if (!user) throw new Error('user does not exist');
      return user;
    } catch (err) {
      return Promise.reject(err);
    }
  }

  static async getByFacebookId(facebookId) {
    const db = mongoClient.db(dbName);
    const userCollection = db.collection(collectionName);
    try {
      await userCollection.findOne({ facebookId });
    } catch (err) {
      return Promise.reject(err);
    }
  }

  static async save(userObject) {
    const db = mongoClient.db(dbName);
    const userCollection = db.collection(collectionName);
    try {
      await userCollection.insertOne(userObject);
      return userObject;
    } catch (err) {
      return Promise.reject(err);
    }
  }

  static isFacebookUser(userObject) {
    return userObject.facebookId;
  }
}

module.exports = User;
