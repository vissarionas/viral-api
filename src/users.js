const jwt = require('jsonwebtoken');
const config = require('config').mongo;
const dbName = config.get('database');
const client = require('./dbConnection');

const getUserById = (req, res, id) => {
  const db = client.db(dbName);
  db.collection(config.get('collections.users')).findOne({_id: id})
  .then(profile => res.status(200).send(profile));
};

const getUserByFacebookId = (facebookId) => {
  return new Promise(function (resolve, reject) {
    const db = client.db(dbName);
    db.collection(config.get('collections.users')).findOne({facebookId: facebookId})
    .then(userObject => {
      resolve(userObject);
    }, err => {
      reject(err);
    });
  });
};

const getUserByEmail = (email) => {
  return new Promise(function (resolve, reject) {
    const db = client.db(dbName);
    db.collection('users').findOne({email: email
    })
    .then(userObject => {
      if (userObject) {
        resolve(userObject);
      } else {
        reject(null);
      };
    }, err => {
      reject(err);
    });
  });
};

const saveEmailUser = (user) => {
  return new Promise(function (resolve, reject) {
    const db = client.db(dbName);
    db.collection('users').findOne({email: user.email})
    .then(userObject => {
      if (!userObject) {
        db.collection('users').insertOne(user)
        .then((data) => {
          resolve(data);
        }, err => {
          reject(err);
        });
      } else {
        reject('user exists');
      }
    }, err => {
      reject(err);
    });
  });
};

const saveFacebookUser = (user) => {
  return new Promise(function (resolve, reject) {
    const db = client.db(dbName);
    db.collection('users').findOne({facebookId: user.facebookId})
    .then(userObject => {
      if (!userObject) {
        db.collection('users').insertOne(user)
        .then(() => {
          resolve(user);
        }, err => {
          reject(err);
        });
      } else {
        resolve(userObject);
      }
    }, err => {
      reject(err);
    });
  });
};

const verifyUser = (req, res) => {
  return new Promise(function (resolve, reject) {
    const db = client.db(dbName);
    db.collection('users').updateOne(
      { email: req.user.email }, { $set: { verified: true } })
      .then(() => res.send('USER VERIFIED')
      ,err => console.log(err));
  });
};

module.exports = {
  getUserById,
  getUserByEmail,
  getUserByFacebookId,
  saveEmailUser,
  saveFacebookUser,
  verifyUser
};
