/* eslint-disable consistent-return */
const config = require('config').mongo;
const { MongoClient } = require('mongodb');

const connectionOptions = {
  useNewUrlParser: true,
  auth: {
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD
  }
};

const getClient = async (collectionName) => {
  try {
    const mongoClient = await MongoClient.connect(process.env.DB_URL, connectionOptions);
    const db = mongoClient.db(config.database);
    const collection = db.collection(collectionName);
    console.log(`DB collection '${collectionName}' connected`);
    return collection;
  } catch (err) {
    console.log(err);
  }
};

module.exports = getClient;
