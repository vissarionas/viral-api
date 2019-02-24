/* eslint-disable consistent-return */
const { MongoClient } = require('mongodb');

const connectionOptions = {
  useNewUrlParser: true,
  auth: {
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD
  }
};

const getCollection = async (collection) => {
  try {
    const client = await MongoClient.connect(process.env.DB_URL, connectionOptions);
    const db = client.db('viral');
    return db.collection(collection);
  } catch (err) {
    console.log(err);
  }
  console.log(`DB collection '${collection}' connected`);
};

module.exports = getCollection;
