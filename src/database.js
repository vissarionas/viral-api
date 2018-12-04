require('dotenv').config();
const NodeCouchDb = require('node-couchdb');
const config = require('config');

const couch = new NodeCouchDb({
  host: config.get('couch.dbConfig.host'),
  protocol: config.get('couch.dbConfig.protocol'),
  port: config.get('couch.dbConfig.port'),
  auth: {
    user: process.env.DB_USERNAME,
    pass: process.env.DB_PASSWORD
  },
});

const usersDb = config.get('couch.databases.users');
const usersByEmailView = config.get('couch.views.usersByEmail');
const userByFacebookId = config.get('couch.views.usersByFacebookId');
const tokensDb = config.get('couch.databases.tokens');

const saveUser = (user) => {
  return new Promise(function (resolve, reject) {
    couch.insert(usersDb, {
      _id: Date.now().toString(),
      userName: user.userName,
      email: user.email,
      password: user.password,
      active: user.active
      }).then(({data, headers, status}) => {
        resolve(data);
      }, err => {
        reject(err);
    });
  });
};

const saveFacebookUser = (user) => {
  return new Promise(function (resolve, reject) {
    couch.insert(usersDb, {
      _id: Date.now().toString(),
      userName: user.userName,
      email: user.email,
      active: user.active,
      provider: user.provider,
      facebookId: user.facebookId
      }).then(({data, headers, status}) => {
        resolve(data);
      }, err => {
        reject(err);
    });
  });
};

const saveToken = (urerId, token) => {
  return new Promise(function (resolve, reject) {
    couch.insert(tokensDb, {
      _id: urerId,
      token: token
    }).then(({data, headers, status}) => {
      resolve(token);
    }, err => {
      reject(err);
    });
  });
};

const getUserByEmail = (email) => {
  return new Promise(function (resolve, reject) {
    couch.get(usersDb, usersByEmailView, {key: email})
      .then(({data, headers, status}) => {
        resolve(data.rows[0]);
      }, err => {
        reject(err);
      })
  });
}

const getUserByFacebookId = (facebookId) => {
  return new Promise(function (resolve, reject) {
    couch.get(usersDb, userByFacebookId, {key: facebookId})
      .then(({data, headers, status}) => {
        resolve(data.rows[0]);
      }, err => {
        reject(err);
      })
  });
}

module.exports = {
  saveUser,
  saveFacebookUser,
  saveToken,
  getUserByEmail,
  getUserByFacebookId
}
