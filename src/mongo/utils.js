const MongoClient = require('mongodb').MongoClient;
const bcrypt = require('bcryptjs');
const uniqid = require('uniqid');
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
        if (userObject) {
          resolve(userObject);
        } else {
          reject(null);
        }
      }, err => {
        reject(err);
      });
    });
  });
};

const saveUser = (req, res) => {
  const email = req.body.email;
  getUserByEmail(email)
  .then((userObject) => {
    res.status(409).send(userObject);
  },() => {
    client.connect()
    .then(() => {
      const db = client.db(dbName);
      db.collection('users').insertOne({
        _id: uniqid(),
        userName: email.split('@')[0],
        email: email,
        password: bcrypt.hashSync(req.body.password, 10),
        verified: false
      })
      .then((data) => {
        client.close();
        res.status(200).send(data);
      });
    });
  });
};

module.exports = {
  saveUser
};
