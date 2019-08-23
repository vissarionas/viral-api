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
    this.collectionName = collectionName;
  }

  async connectClient() {
    try {
      const mongoClient = await MongoClient.connect(process.env.DB_URL, CONNECTION_OPTIONS);
      console.log(`DB collection '${this.collectionName}' connected`);
      this.collection = mongoClient.db(config.database).collection(this.collectionName);
    } catch (err) {
      console.log(err);
    }
  }

  get(params) {
    this.collection.findOne(params);
  }
}

export default DbAdapter;
