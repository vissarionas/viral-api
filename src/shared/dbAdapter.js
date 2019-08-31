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

class DbAdapter {
  constructor(collectionName) {
    const client = new MongoClient(process.env.DB_URL, CONNECTION_OPTIONS);
    if (client.isConnected()) {
      this.collection = client.db(config.database).collection(collectionName);
    } else {
      client.connect(() => {
        this.collection = client.db(config.database).collection(collectionName);
      });
    }
  }

  async get(filter) {
    const user = await this.collection.findOne(filter);
    if (user) return user;
    throw Error;
  }

  async getMany(filter) {
    const cursor = await this.collection.find(filter);
    if (cursor.hasNext()) return cursor.toArray();
    throw Error;
  }

  async create(document) {
    const result = await this.collection.insertOne(document);
    if (result.insertedCount) return result.ops[0];
    throw (new Error(result.insertedCount));
  }

  async update(filter, key, value) {
    const queryFilter = { filter };
    const updateResult = await this.collection.updateOne(queryFilter, key, value);
    if (updateResult.modifiedCount) return updateResult;
    throw (new Error(updateResult.modifiedCount));
  }

  async delete(filter) {
    const result = await this.collection.findOneAndDelete(filter);
    if (result.value) return result;
    throw (new Error('deletion error'));
  }
}

module.exports = DbAdapter;
