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
const userByProviderId = config.get('couch.views.usersByProviderId');
const tokensDb = config.get('couch.databases.tokens');

const saveUser = (user) => {
  return new Promise(function (resolve, reject) {
    couch.get(usersDb, usersByEmailView, {key: user.email})
    .then(({data, headers, status}) => {
      if (!data.rows.length) {
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
      } else {
        reject(`Email ${user.email} already exists`);
      }
    }, err => {
      reject(err);
    });
  });
};

const saveFacebookUser = (user) => {
  return new Promise(function (resolve, reject) {
    couch.get(usersDb, userByProviderId, {key: user.providerUserId})
    .then(({data, headers, status}) => {
      if (!data.rows.length) {
        couch.insert(usersDb, {
          _id: Date.now().toString(),
          userName: user.userName,
          email: user.email,
          active: user.active,
          provider: user.provider,
          providerUserId: user.providerUserId
          }).then(({data, headers, status}) => {
            resolve(data);
          }, err => {
            reject(err);
        });
      } else {
        reject(`Facebook user id ${user.providerUserId} already exists`);
      }
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

module.exports = {
  saveUser,
  saveFacebookUser,
  saveToken
}
