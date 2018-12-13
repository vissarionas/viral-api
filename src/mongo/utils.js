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
      .then(userObject => {
        client.close();
        resolve(userObject);
      }, err => {
        client.close();
        reject(err);
      });
    });
  });
};

const getUserByFacebookId = (fbId) => {
  return new Promise(function (resolve, reject) {
    client.connect()
    .then(() => {
      const db = client.db(dbName);
      db.collection('users').findOne({
        facebookId: fbId
      })
      .then(userObject => {
        client.close();
        resolve(userObject);
      }, err => {
        client.close();
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
        client.close();
        resolve(data);
      }, err => {
        client.close();
        reject(err);
      });
    });
  });
};

module.exports = {
  getUserByEmail,
  getUserByFacebookId,
  saveUser
};
