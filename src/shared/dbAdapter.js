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
    this.client = new MongoClient(process.env.DB_URL, CONNECTION_OPTIONS);
    this.collectionName = collectionName;
  }

  connect() {
    this.client.connect(async () => {
      this.collection = this.client.db(config.database).collection(this.collectionName);
      console.log(`${this.collectionName} client connected.`);
    });
  }

  create(document) {
    return this.collection.insertOne(document);
  }

  get(filter) {
    return this.collection.findOne(filter);
  }

  update(docIdentifier, key, value) {
    return this.collection.updateOne({ docIdentifier }, { $set: { [key]: value } });
  }

  delete(filter) {
    return this.collection.findOneAndDelete(filter);
  }
}

module.exports = DbAdapter;
