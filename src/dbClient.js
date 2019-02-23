require('dotenv').config();

const MongoDb = require('mongodb');

const client = new MongoDb.MongoClient(process.env.DB_URL, {
  useNewUrlParser: true,
  auth: {
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD
  }
});

client.connect()
  .then(() => {
    console.log('MongoDb connection opened');
  }, err => console.log(err));

module.exports = client;
