const MongoClient = require('mongodb').MongoClient;
const config = require('config').mongo;

const dbName = config.get('databases.viral');
const client = new MongoClient(config.get('url'), {useNewUrlParser: true});

// Resolves if user is found, and rejects if user is not found
const getUserByEmail = (email) => {
  return new Promise(function (resolve, reject) {
    client.connect()
    .then(() => {
      const db = client.db(dbName);
      db.collection('users').findOne({
        email: email
      })
      .then((userObject) => {
        resolve(userObject);
      }, err => {
        reject(err);
      });
    });
  });
};

const saveUser = (user) => {
  return new Promise(function (resolve, reject) {
    client.connect()
    .then(() => {
      const db = client.db(dbName);
      db.collection('users').insertOne(user)
      .then((data) => {
        resolve(data);
      }, err => {
        reject(err);
      });
    });
  });
};

module.exports = {
  getUserByEmail,
  saveUser
};
