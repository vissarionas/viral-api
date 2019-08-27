/* eslint-disable consistent-return */
const config = require('config').mongo;
const { MongoClient } = require('mongodb');

const CONNECTION_OPTIONS = {
  useNewUrlParser: true,
  auth: {
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD
  }
};
const client = new MongoClient(process.env.DB_URL, CONNECTION_OPTIONS);

class DbAdapter {
  constructor(collectionName) {
    client.connect(() => {
      this.collection = client.db(config.database).collection(collectionName);
    });
  }

  async create(document) {
    const result = await this.collection.insertOne(document);
    if (result.insertedCount) return result.ops[0];
    throw (new Error('nothing was created'));
  }

  async get(filter) {
    const user = await this.collection.findOne(filter);
    if (user) return user;
    throw (new Error('user not found'));
  }

  async update(filter, key, value) {
    const queryFilter = { filter };
    const updateResult = await this.collection.updateOne(queryFilter, key, value);
    if (updateResult.modifiedCount) return updateResult;
    throw (new Error('nothing to update'));
  }

  async delete(filter) {
    const result = await this.collection.findOneAndDelete(filter);
    if (result.value) return result;
    throw (new Error('nothing to delete'));
  }
}

module.exports = DbAdapter;
