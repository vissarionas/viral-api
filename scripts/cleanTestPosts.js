require('dotenv').config();

const { MongoClient } = require('mongodb');
const { createCoordinatesBox } = require('../src/coordinates');

const url = process.env.DB_URL;

const dbName = 'viral';

const connectionOptions = {
  useNewUrlParser: true,
  auth: {
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD
  }
};

const client = new MongoClient(url, connectionOptions);

client.connect(() => {
  const db = client.db(dbName);
  const collection = db.collection('posts');

  collection.deleteMany({ type: 'random-post' }, (err) => {
    console.log(err || 'Script finished');
  });

  client.close();
});
