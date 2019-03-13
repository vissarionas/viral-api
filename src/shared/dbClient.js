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

module.exports = async (collectionName) => {
  try {
    const mongoClient = await MongoClient.connect(process.env.DB_URL, connectionOptions);
    console.log(`DB collection '${collectionName}' connected`);
    return mongoClient.db(config.database).collection(collectionName);
  } catch (err) {
    console.log(err);
  }
};
